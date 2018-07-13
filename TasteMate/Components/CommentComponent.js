import React from "react";
import styles from "../styles";
import {Text, TouchableOpacity, View} from "react-native";
import {
    _navigateToScreen,
    brandContrast,
    iconClose,
    iconSizeSmall,
    pathComments,
    pathUsers
} from "../constants/Constants";
import TimeAgo from "react-native-timeago";
import firebase from 'react-native-firebase';
import {UserImageThumbnailComponent} from "./UserImageThumbnailComponent";
import {currentUser} from "../App";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export class CommentComponent extends React.Component {
    constructor(props) {
        super(props);
        this._onPressProfile = this._onPressProfile.bind(this);
        this._onPressDeleteButton = this._onPressDeleteButton.bind(this);
        this.comment = this.props.comment;
        this.state = {
            user: {},
        };

        console.log('Loading comment writer info...');
        const refCreator = firebase.database().ref(pathUsers).child(this.comment.senderid);
        refCreator.once(
            'value',
            (dataSnapshot) => {
                console.log('Received comment writer.');
                const creator = dataSnapshot.toJSON();
                this.setState({user: creator});
            },
            (error) => {
                console.error('Error while retrieving creator info');
                console.error(error);
            }
        );
    }

    _onPressProfile() {
        let params = {};
        params.user = this.state.user || this.comment.senderid;
        _navigateToScreen('Profile', this.props.navigation, params);
    }

    _onPressDeleteButton() {
        const userid = this.props.observation.userid;
        const obsid = this.props.observation.observationid;
        const commentid = this.comment.id;

        console.log('Removing comment...');
        const ref = firebase.database().ref(pathComments).child(userid).child(obsid).child(commentid);
        ref.remove(
            (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Successfully removed comment');
                    this.props.onDelete(this.state.observation);
                }
            }
        );
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
                <UserImageThumbnailComponent size={styles.roundProfileSmall} onPress={this._onPressProfile} user={this.state.user}/>
                <View style={[{flexDirection: 'column', flex: 1}, styles.containerPadding]}>
                    <Text style={[styles.textStandardDark, {flex: 1}]}>{this.comment.message}</Text>
                    <TimeAgo name={'time'} style={styles.textSmall} time={this.comment.timestamp}/>
                </View>
                {
                    currentUser && this.comment.senderid === currentUser.uid &&
                    <TouchableOpacity onPress={this._onPressDeleteButton}>
                        <FontAwesome name={iconClose} size={iconSizeSmall} color={brandContrast} style={styles.containerPadding}/>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}