import React from "react";
import styles from "../styles";
import {Platform, TextInput, TouchableOpacity, View} from "react-native";
import {
    colorContrast,
    colorLight,
    colorMain,
    iconSend,
    iconSizeSmall,
    pathComments
} from "../constants/Constants";
import strings from "../strings";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {_checkInternetConnection, currentUser} from "../App";
import firebase from 'react-native-firebase';
import {UserImageThumbnailComponent} from "./UserImageThumbnailComponent";

export class WriteCommentComponent extends React.Component {
    constructor(props) {
        super(props);

        this._onPressSendButton = this._onPressSendButton.bind(this);
        this._sendComment = this._sendComment.bind(this);
        this._inputFocused = this._inputFocused.bind(this);

        this.state = {
            newComment: ''
        };
        this.observation = this.props.observation;
    }

    _onPressSendButton() {
        if (this.state.newComment.length > 0) {
            _checkInternetConnection(this._sendComment, null);
        }
    }

    _sendComment() {
        let comment = {};
        comment.senderid = currentUser.uid;
        comment.message = this.state.newComment.trim();
        comment.timestamp = firebase.database().getServerTime();
        const ref = firebase.database().ref(pathComments).child(this.observation.userid).child(this.observation.observationid);
        const id = ref.push().key;

        ref.child(id).set(
            comment,
            (error) => {
                if (error) {
                    console.error('Error during comment transmission.');
                    console.error(error);
                    // TODO: display error message
                } else {
                    console.log('Successfully added comment.');
                    this.setState({newComment: ''});
                    comment.id = id;
                    this.props.onCommentAddedAction(comment);
                }
            }
        );
    }

    focus() {
        this.textInput.focus();
    }

    _inputFocused() {
        if (Platform.OS === 'ios' && this.props.onWriteCommentPressed) {
            this.props.onWriteCommentPressed();
        }
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection:'row', alignItems: 'center', opacity:this.props.hidden ? 0 : 100}}>
                <View style={styles.containerPadding}>
                    <UserImageThumbnailComponent size={styles.roundProfileSmall} user={currentUser}/>
                </View>
                <TextInput
                    ref={input => this.textInput = input}
                    style={[styles.textStandardDark, styles.containerPadding, {flex: 1}]}
                    value={this.state.newComment}
                    onChangeText={(text) => this.setState({newComment: text})}
                    placeholder={strings.writeComment}
                    placeholderTextColor={colorLight}
                    returnKeyType={'send'}
                    keyboardType={'default'}
                    underlineColorAndroid={colorContrast}
                    selectionColor={colorMain}
                    onSubmitEditing={this._onPressSendButton}
                    onFocus={this._inputFocused}
                />
                <TouchableOpacity onPress={this._onPressSendButton} style={styles.containerPadding}>
                    <FontAwesome name={iconSend} size={iconSizeSmall} color={colorContrast}/>
                </TouchableOpacity>
            </View>
        );
    }
}