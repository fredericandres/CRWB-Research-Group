import React from 'react';
import {FlatList, KeyboardAvoidingView, ScrollView, View} from "react-native";
import strings from "../strings";
import styles from "../styles";
import {CommentComponent} from "../Components/CommentComponent";
import {WriteCommentComponent} from "../Components/WriteCommentComponent";
import {_sortArrayByTimestamp, pathComments} from "../constants/Constants";
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

        this.state = {
            comments: this.props.navigation.getParam('comments'),
            users: [],
            isRefreshing: false
        };
        this.observation = this.props.navigation.getParam('observation');
        this._loadComments(true, false);
    }

    _addCommentToState(comment) {
        const commentArray = [comment];
        this.setState(prevState => ({comments: commentArray.concat(prevState.comments)}));
    }

    _loadComments(onStartup, isRefreshing) {
        console.log('AAA');
        const ntfSize = this.state.comments.length;
        if (ntfSize === 0 || ntfSize % CMT_LOAD_DEPTH === 0 || isRefreshing || onStartup) {
            const currentState = this.state;
            const index = (isRefreshing ? 0 : ntfSize) + CMT_LOAD_DEPTH;

            console.log(pathComments + '/' + this.observation.userid + '/' + this.observation.observationid);

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
            <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
                <View style={{flex: 9}}>
                    <FlatList name={'comments'} style={[styles.containerPadding, {flex: 1, backgroundColor: 'red', flexDirection:'column'}]}
                              data={this.state.comments}
                              keyExtractor={this._keyExtractor}
                              renderItem={({item}) => <CommentComponent comment={item} {...this.props}/>}
                              onEndReached={this._onEndReached}
                              onRefresh={this._onRefresh}
                              refreshing={this.state.isRefreshing}
                    />
                </View>
                <WriteCommentComponent style={{alignSelf:'flex-end', backgroundColor: 'blue', flex: 1}} observation={this.observation} onCommentAddedAction={this._addCommentToState}/>
            </KeyboardAvoidingView>
        );
    }
}

