import React from "react";
import styles from "./styles";
import {Image, Text, TouchableOpacity, View} from "react-native";
import TimeAgo from 'react-native-timeago'
import {_formatNumber, brandMain} from "./constants/Constants";

export class NotificationComponent extends React.Component {
    constructor(props) {
        super(props);
        this._onPressProfile = this._onPressProfile.bind(this);
        this._onPresObservation = this._onPresObservation.bind(this);
        this.notification = this.props.notification;
    }

    // TODO: onclick//view -> mark as read

    _onPressMultipleProfiles() {
        // TODO: When more than 2 people --> clicking on names leads to a list of users
    }

    _onPressProfile(index) {
        this.props.nav.navigate('Profile',  { userid: this.notification.senderid[index] });
    }

    _onPresObservation() {
        this.props.nav.navigate('ObservationDetail',  { observation: this.notification.observationid });
    }

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
            <TouchableOpacity onPress={this.notification.type === 'FOLLOW' ? this._onPressProfile : this._onPresObservation} style={[{flexDirection:'row'}, !this.notification.read ? {backgroundColor:brandMain} : {}]}>
                <TouchableOpacity name={'userpic'} onPress={this.notification.senderid.length === 1 ? () => this._onPressProfile(0) : this._onPressMultipleProfiles} style={[styles.containerPadding, {flexDirection:'column', justifyContent:'center'}]}>
                    <Image name={'userprofilepic'} resizeMode={'cover'} source={require('./user2.jpg')} style={styles.roundProfile}/>
                </TouchableOpacity>
                <View name={'textcontentwrapper'} style={[styles.containerPadding, {flex: 1, flexDirection:'column', justifyContent:'center'}]}>
                    <Text name={'action'}>
                        <Text onPress={() => this._onPressProfile(0)} style={styles.textStandardBold}>{this.notification.senderid[0]}</Text>
                        {
                            (this.notification.senderid.length > 1) &&
                            <Text style={styles.textStandardDark}> and </Text>
                        }
                        {
                            (this.notification.senderid.length === 2) &&
                            <Text onPress={() => this._onPressProfile(1)} style={styles.textStandardBold}>{this.notification.senderid[1]}</Text>
                        }
                        {
                            (this.notification.senderid.length > 2) &&
                            <Text onPress={this._onPressMultipleProfiles} style={styles.textStandardBold}>{_formatNumber(this.notification.senderid.length - 1)} others</Text>
                        }
                        <Text style={[styles.textStandardDark]}> {action}</Text>
                    </Text>
                    <TimeAgo name={'time'} style={styles.textSmall} time={this.notification.timestamp}/>
                </View>
                {this.notification.type !== 'FOLLOW' &&
                <TouchableOpacity name={'image'} onPress={this._onPresObservation} style={[styles.containerPadding, {flex: 0, flexDirection:'column', justifyContent:'center'}]}>
                    <Image name={'userprofilepic'} resizeMode={'cover'} source={require('./carbonara.png')} style={styles.squareThumbnail}/>
                </TouchableOpacity>}
            </TouchableOpacity>
        );
    }
}