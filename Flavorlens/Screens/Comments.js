import React from 'react';
import {Animated, FlatList, Keyboard, Platform, TouchableWithoutFeedback, View} from 'react-native';
import strings from '../strings';
import {CommentComponent} from '../Components/CommentComponent';
import {WriteCommentComponent} from '../Components/WriteCommentComponent';
import {colorBackground, ReactNavigationTabBarHeight} from '../Constants/Constants';
import {currentUser} from '../App';
import RNSafeAreaGetter from 'react-native-safe-area-getter';
import {getXMostRecentComments, sortArrayByTimestamp} from '../Helpers/FirebaseHelper';

const CMT_LOAD_DEPTH = 10;

export class CommentsScreen extends React.Component {
    _isMounted = false;
    static navigationOptions = () => ({
        title: strings.allComments + ' ',
    });

    constructor(props) {
        super(props);

        this._loadComments = this._loadComments.bind(this);
        this._addToCommentState = this._addToCommentState.bind(this);
        this._addCommentToState = this._addCommentToState.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._onEndReached = this._onEndReached.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);

        this.state = {
            comments:[],
            users: [],
            isRefreshing: false,
            keyboardHeight: 0,
        };
        this.keyboardHeight = new Animated.Value(0);
        this.observation = this.props.navigation.getParam('observation');
        this._loadComments(true, false);
    }

    componentWillMount() {
        this._isMounted = true;
        if (Platform.OS === 'ios') {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        if (this.keyboardDidShowListener) {
            this.keyboardDidShowListener.remove();
        }
        if (this.keyboardDidHideListener) {
            this.keyboardDidHideListener.remove();
        }
    }

    _keyboardDidShow(e) {
        RNSafeAreaGetter.getBottomPadding((error, bottomPadding) => {
            if (error) {
                console.log(error);
            } else {
                const keyboardHeight = e.endCoordinates.height - ReactNavigationTabBarHeight - bottomPadding;
                if(this._isMounted){
                    this.setState({keyboardHeight: keyboardHeight});
                }
            }
        });
    }

    _keyboardDidHide(e) {
        if(this._isMounted){
            this.setState({keyboardHeight: 0});
        }
    }

    _addCommentToState(comment) {
        const commentArray = [comment];
        if(this._isMounted){
            this.setState(prevState => ({comments: commentArray.concat(prevState.comments)}));
        }
    }

    _loadComments(onStartup, isRefreshing) {
        const ntfSize = this.state.comments.length;
        if (ntfSize === 0 || ntfSize % CMT_LOAD_DEPTH === 0 || isRefreshing || onStartup) {
            const index = (isRefreshing ? 0 : ntfSize) + CMT_LOAD_DEPTH;

            getXMostRecentComments(this.observation.userid, this.observation.observationid, index)
                .then((comments) => {
                    this._addToCommentState(comments);
                }).catch((error) => {
                    console.log(error);
                }
            );
        }
    }

    _addToCommentState(comments) {
        if (comments && comments.length > 0) {
            sortArrayByTimestamp(comments);
            if(this._isMounted){
                this.setState({comments: comments});
            }
        }
        if(this._isMounted){
            this.setState({isRefreshing: false});
        }
    }

    _onRefresh() {
        console.log('Refreshing...');
        if(this._isMounted){
            this.setState({isRefreshing: true});
        }
        this._loadComments(false, true);
    }

    _onEndReached() {
        console.log('Loading more comments...');
        this._loadComments(false, false);
    }

    _onCommentDelete(comment, index) {
        let comments = this.state.comments;
        if (index > -1) {
            comments.splice(index, 1);
        }
        if(this._isMounted){
            this.setState({comments:comments});
        }
    }

    _keyExtractor = (item,) => item.timestamp + item.senderid;

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:7, flexShrink:1}}>
                    <FlatList
                        name={'comments'}
                        style={{flex: 1, flexDirection:'column'}}
                        data={this.state.comments}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item, index}) => <CommentComponent comment={item} {...this.props} observation={this.observation} onDelete={() => this._onCommentDelete(item, index)}/>}
                        onEndReached={this._onEndReached}
                        onRefresh={this._onRefresh}
                        refreshing={this.state.isRefreshing}
                        removeClippedSubviews={true}
                    />
                </View>
                {
                    currentUser && !currentUser.isAnonymous &&
                    <View style={[Platform.OS === 'android' ? {position:'absolute', bottom:0, left:0, right:0} : {height:(49 + this.state.keyboardHeight)}, {backgroundColor: colorBackground}]}>
                        <TouchableWithoutFeedback onPress={() => this.writeCommentField.focus()}>
                            <View style={[{flex:1, flexDirection:'column'}]}>
                                <WriteCommentComponent ref={ input => {this.writeCommentField = input;}} observation={this.observation} onCommentAddedAction={this._addCommentToState}/>
                                <View style={{height: this.state.keyboardHeight}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
            </View>
        );
    }
}
