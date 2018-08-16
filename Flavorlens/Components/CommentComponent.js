import React from 'react';
import styles from '../styles';
import {Text, TouchableOpacity, View} from 'react-native';
import {colorContrast, iconClose, iconSizeSmall, navigateToScreen} from '../Constants/Constants';
import TimeAgo from 'react-native-timeago';
import {UserImageThumbnailComponent} from './UserImageThumbnailComponent';
import {currentUser} from '../App';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getUser, removeComment} from '../Helpers/FirebaseHelper';

export class CommentComponent extends React.Component {
    constructor(props) {
        super(props);
        this._onPressProfile = this._onPressProfile.bind(this);
        this._onPressDeleteButton = this._onPressDeleteButton.bind(this);
        this.comment = this.props.comment;
        this.state = {
            user: {},
        };

        getUser(this.comment.senderid)
            .then((user) => {
                this.setState({user: user});
            }).catch((error) => {
                console.log(error);
            }
        );
    }

    _onPressProfile() {
        let params = {};
        params.user = this.state.user || this.comment.senderid;
        navigateToScreen('Profile', this.props.navigation, params);
    }

    _onPressDeleteButton() {
        const userid = this.props.observation.userid;
        const obsid = this.props.observation.observationid;
        const commentid = this.comment.id;

        removeComment(userid, obsid, commentid)
            .then(() => {
                this.props.onDelete && this.props.onDelete(this.state.observation);
            }).catch((error) => {
                console.log(error);
            }
        );
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
                <UserImageThumbnailComponent size={[styles.containerPadding, styles.roundProfileSmall]} onPress={this._onPressProfile} user={this.state.user}/>
                <View style={[{flexDirection: 'column', flex: 1}, styles.containerPadding]}>
                    <Text style={[styles.textStandardDark, {flex: 1}]}>{this.comment.message}</Text>
                    <TimeAgo name={'time'} style={styles.textSmall} time={this.comment.timestamp}/>
                </View>
                {
                    currentUser && this.comment.senderid === currentUser.uid &&
                    <TouchableOpacity onPress={this._onPressDeleteButton}>
                        <FontAwesome name={iconClose} size={iconSizeSmall} color={colorContrast} style={styles.containerPadding}/>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}