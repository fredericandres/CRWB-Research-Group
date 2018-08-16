import React from 'react';
import styles from '../styles';
import {Platform, TextInput, TouchableOpacity, View} from 'react-native';
import {colorContrast, colorLight, colorMain, iconSend, iconSizeSmall} from '../Constants/Constants';
import strings from '../strings';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {_checkInternetConnection, currentUser} from '../App';
import {UserImageThumbnailComponent} from './UserImageThumbnailComponent';
import {addComment} from '../Helpers/FirebaseHelper';

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
        addComment(this.observation.userid, this.observation.observationid, comment)
            .then((id) => {
                this.setState({newComment: ''});
                comment.id = id;
                this.props.onCommentAddedAction && this.props.onCommentAddedAction(comment);
            }).catch((error) => {
                console.log(error);
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