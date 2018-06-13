import React from "react";
import styles from "../styles";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {_navigateToScreen, pathUsers} from "../constants/Constants";
import TimeAgo from "react-native-timeago";
import firebase from 'react-native-firebase';

export class CommentComponent extends React.Component {
    constructor(props) {
        super(props);
        this._onPressProfile = this._onPressProfile.bind(this);
        this.comment = this.props.comment;
        this.state = {
            user: {},
        };

        console.log('Loading comment writer info...');
        const refCreator = firebase.database().ref(pathUsers + '/' + this.comment.senderid);
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

    render() {
        return (
            <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={this._onPressProfile}>
                    <Image name={'userpic'} style={[styles.roundProfileSmall, styles.containerPadding]} resizeMode={'cover'} source={(this.state.user && this.state.user.imageUrl) ? {uri: this.state.user.imageUrl} : require('../nouser.jpg')}/>
                </TouchableOpacity>
                <View style={[{flexDirection: 'column', flex: 1}, styles.containerPadding]}>
                    <Text style={[styles.textStandardDark, {flex: 1}]}>{this.comment.message}</Text>
                    <TimeAgo name={'time'} style={styles.textSmall} time={this.comment.timestamp}/>
                </View>
            </View>
        );
    }
}