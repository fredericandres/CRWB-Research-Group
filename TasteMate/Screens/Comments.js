import React from 'react';
import {Animated, FlatList, Keyboard, View} from "react-native";
import strings from "../strings";
import styles from "../styles";
import {CommentComponent} from "../Components/CommentComponent";
import {WriteCommentComponent} from "../Components/WriteCommentComponent";
import {_sortArrayByTimestamp, brandBackground, pathComments} from "../constants/Constants";
import firebase from 'react-native-firebase';

const CMT_LOAD_DEPTH = 10;

export class CommentsScreen extends React.Component {
    static navigationOptions = ()=> ({
        title: strings.allComments,
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
        };
        this.keyboardHeight = new Animated.Value(0);
        this.observation = this.props.navigation.getParam('observation');
        this._loadComments(true, false);
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        if (this.keyboardDidShowListener) {
            this.keyboardDidShowListener.remove();
        }
        if (this.keyboardDidHideListener) {
            this.keyboardDidHideListener.remove();
        }

    }

    _keyboardDidShow(e) {
        // TODO: Bug of height including bottom navigation things and makes it too large
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: e.duration,
                toValue: e.endCoordinates.height,
            }),
        ]).start();
    }

    _keyboardDidHide(e) {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: e.duration,
                toValue: 0,
            }),
        ]).start();
    }

    _addCommentToState(comment) {
        const commentArray = [comment];
        this.setState(prevState => ({comments: commentArray.concat(prevState.comments)}));
    }

    _loadComments(onStartup, isRefreshing) {
        const ntfSize = this.state.comments.length;
        if (ntfSize === 0 || ntfSize % CMT_LOAD_DEPTH === 0 || isRefreshing || onStartup) {
            const currentState = this.state;
            const index = (isRefreshing ? 0 : ntfSize) + CMT_LOAD_DEPTH;

            console.log('Loading comments...');
            const refComments = firebase.database().ref(pathComments + '/' + this.observation.userid + '/' + this.observation.observationid).orderByChild('timestamp').limitToLast(index);
            refComments.once(
                'value',
                (dataSnapshot) => {
                    console.log('Comments successfully retrieved');
                    let comments = dataSnapshot.toJSON() ? Object.values(dataSnapshot.toJSON()) : [];
                    this._addToCommentState(comments);

                    let iteratedUsers = [];
                    dataSnapshot.forEach(function (childSnapshot) {
                        const comment = childSnapshot.toJSON();

                        // Load username of comment sender
                        if (!iteratedUsers[comment.senderid] && (!currentState.users[comment.senderid])) {
                            // TODO: load user pic
                        }
                    });
                },
                (error) => {
                    console.error('Error while retrieving comments');
                    console.error(error);
                }
            );
        }
    }

    _addToCommentState(comments) {
        if (comments && comments.length > 0) {
            _sortArrayByTimestamp(comments);

            this.setState({comments: comments});
        }
        this.setState({isRefreshing: false});
    }

    _onRefresh() {
        console.log('Refreshing...');
        this.setState({isRefreshing: true});
        this._loadComments(false, true);
    }

    _onEndReached() {
        console.log('Loading more comments...');
        this._loadComments(false, false);
    }

    _keyExtractor = (item, index) => item.timestamp + item.senderid;

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:7, flexShrink:1}}>
                    <FlatList name={'comments'}
                              style={{flex: 1, flexDirection:'column'}}
                              data={this.state.comments}
                              keyExtractor={this._keyExtractor}
                              renderItem={({item}) => <CommentComponent comment={item} {...this.props}/>}
                              onEndReached={this._onEndReached}
                              onRefresh={this._onRefresh}
                              refreshing={this.state.isRefreshing}
                              ListFooterComponent={() => <View style={styles.containerPadding}><WriteCommentComponent hidden={true}/></View>}
                    />
                </View>
                <View style={{position:'absolute', bottom:0, left:0, right:0, backgroundColor: brandBackground}}>
                    <View style={[styles.containerPadding, {flex:1}]}>
                        <WriteCommentComponent observation={this.observation} onCommentAddedAction={this._addCommentToState}/>
                        <Animated.View style={{height: this.keyboardHeight}}/>
                    </View>
                </View>
            </View>
        );
    }
}
