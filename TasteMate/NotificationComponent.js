import React from "react";
import styles from "./styles";
import {Image, Text, TouchableOpacity, View} from "react-native";
import TimeAgo from 'react-native-timeago'
import {brandContrast, brandMain} from "./constants/Constants";

export class NotificationComponent extends React.Component {
    constructor(props) {
        super(props);
        this._onPressProfile = this._onPressProfile.bind(this);
        this._onPresObservation = this._onPresObservation.bind(this);
        this.notification = this.props.notification;
    }

    _onPressProfile() {
        this.props.nav.navigate('Profile',  { user: this.notification.senderid });
    }

    _onPresObservation() {
        this.props.nav.navigate('ObservationDetail',  { observation: this.notification.observationid });
    }

    // TODO: onclick//view -> mark as read

    render() {
        let action = '';
        switch(this.notification.type) {
            case 'LIKE':
                action = 'liked your picture.';
                break;
            case 'WANTTOEAT':
                action = 'wants to eat your picture.';
                break;
            case 'SHARE':
                action = 'shared your picture.';
                break;
            case 'FOLLOW':
                action = 'started following you.';
                break;
        }

        return (
            <View style={[{flexDirection:'row'}, !this.notification.read ? {backgroundColor:brandMain} : {}]}>
                <TouchableOpacity name={'userpic'} onPress={this._onPressProfile} style={[styles.containerPadding, {flex: 0, flexDirection:'column'}]}>
                    <Image name={'userprofilepic'} resizeMode={'cover'} source={require('./user2.jpg')} style={styles.roundProfile}/>
                </TouchableOpacity>
                <TouchableOpacity name={'header'} onPress={this.notification.type === 'FOLLOW' ? this._onPressProfile : this._onPresObservation} style={[styles.containerPadding, {flex: 1, flexDirection:'column', justifyContent:'center'}]}>
                    <Text name={'action'}>
                        <Text style={[styles.textStandard, {fontWeight:'bold'}]}>{this.notification.senderid} </Text>
                        <Text style={[styles.textStandard]}>{action}</Text>
                    </Text>
                    <TimeAgo name={'time'} style={styles.textSmall} time={this.notification.timestamp}/>
                </TouchableOpacity>
                {this.notification.type !== 'FOLLOW' &&
                <TouchableOpacity name={'image'} onPress={this._onPresObservation} style={[styles.containerPadding, {flex: 0, flexDirection:'column'}]}>
                    <Image name={'userprofilepic'} resizeMode={'cover'} source={require('./carbonara.png')} style={styles.squareThumbnail}/>
                </TouchableOpacity>}
            </View>
        );
    }
}