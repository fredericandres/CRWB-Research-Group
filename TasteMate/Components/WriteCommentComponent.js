import React from "react";
import styles from "../styles";
import {TextInput, TouchableOpacity, View} from "react-native";
import {brandContrast, brandLight, brandMain, iconSizeSmall, pathComments} from "../constants/Constants";
import strings from "../strings";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {currentUser, currentUserInformation} from "../App";
import firebase from 'react-native-firebase';
import {UserImageThumbnailComponent} from "./UserImageThumbnailComponent";

export class WriteCommentComponent extends React.Component {
    constructor(props) {
        super(props);

        this._onPressSendButton = this._onPressSendButton.bind(this);

        this.state = {
            newComment: ''
        };
        this.observation = this.props.observation;
    }

    _onPressSendButton() {
        if (this.state.newComment.length > 0) {
            let comment = {};
            comment.senderid = currentUser.uid;
            comment.message = this.state.newComment;
            comment.timestamp = firebase.database().getServerTime();
            firebase.database().ref(pathComments + '/' + this.observation.userid + '/' + this.observation.observationid).push(
                comment,
                (error) => {
                    if (error) {
                        console.error('Error during comment transmission.');
                        console.error(error);
                        // TODO: display error message
                    } else {
                        console.log('Successfully added comment.');
                        this.setState({newComment: ''});
                        this.props.onCommentAddedAction(comment);
                    }
                }
            );
        }
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection:'row', alignItems: 'center', opacity:this.props.hidden ? 0 : 100}}>
                <UserImageThumbnailComponent size={styles.roundProfileSmall} source={currentUserInformation && currentUserInformation.imageUrl && {uri: currentUserInformation.imageUrl}}/>
                <TextInput style={[styles.textStandardDark, styles.containerPadding, {flex: 1}]} value={this.state.newComment} onChangeText={(text) => this.setState({newComment: text})} placeholder={strings.writeComment} placeholderTextColor={brandLight} returnKeyType={'send'} keyboardType={'default'} underlineColorAndroid={brandContrast} selectionColor={brandMain} onSubmitEditing={this._onPressSendButton}/>
                <TouchableOpacity onPress={this._onPressSendButton}>
                    <FontAwesome name={'send'} size={iconSizeSmall} color={brandContrast}/>
                </TouchableOpacity>
            </View>
        );
    }
}