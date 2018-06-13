import React from "react";
import styles from "../styles";
import {Animated, Image, Text, TouchableOpacity, View} from "react-native";
import TimeAgo from 'react-native-timeago'
import {_navigateToScreen, ActivityEnum, brandMain} from "../constants/Constants";
import strings from "../strings";

export class NotificationComponent extends React.Component {
    constructor(props) {
        super(props);
        this._onPressProfile = this._onPressProfile.bind(this);
        this._onPressObservation = this._onPressObservation.bind(this);
        this.notification = this.props.notification;
        this.state = {
            fadeAnim: new Animated.Value(1)
        }

        // TODO [FEATURE]: small icons to describe the type of action
    }

    componentDidMount() {
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 0,                   // Animate to opacity: 1 (opaque)
                duration: 10000,              // Make it take a while
            }
        ).start();
    }

    _onPressMultipleProfiles() {
        // TODO: When more than 2 people --> clicking on names leads to a list of users
    }

    _onPressProfile(index) {
        let params = {};
        params.user = this.props.user;
        _navigateToScreen('Profile', this.props.navigation, params/*this.notification.senderid[index]*/);
    }

    _onPressObservation() {
        this.props.navigation.navigate('ObservationDetail',  { observation: this.props.observation });
    }

    render() {
        let action = '';
        switch(this.notification.type) {
            case ActivityEnum.LIKE:
                action = strings.likedPicture;
                break;
            case ActivityEnum.CUTLERY:
                action = strings.addedToEatingOutPicture;
                break;
            case ActivityEnum.SHARE:
                action = strings.sharedPicture;
                break;
            case ActivityEnum.FOLLOW:
                action = strings.startedFollowing;
                break;
            case ActivityEnum.COMMENT:
                action = strings.commentedPicture;
                break;
        }

        let completeActionString = strings.formatString(action, this.props.user ? this.props.user.username : '...');
        // TODO: Group multiple notifications of same type together if no other type in between
        // let completeActionString = '';
        // if (this.notification.userid.length === 1) {
        //     completeActionString = strings.formatString(action, this.notification.senderid[0]);
        // } else if (this.notification.senderid.length === 2) {
        //     completeActionString = strings.formatString(action, strings.formatString(strings.userAndUser, this.notification.senderid[0], this.notification.senderid[1]));
        // } else {
        //     completeActionString = strings.formatString(action, strings.formatString(strings.userAndUser, this.notification.senderid[0], strings.formatString(strings.others, this.notification.senderid.length - 1)));
        // }

        return (
            <TouchableOpacity onPress={this.notification.type === ActivityEnum.FOLLOW ? this._onPressProfile : this._onPressObservation} style={[{flexDirection:'row'}]}>
                {!this.notification.read && <Animated.View name={'fadingbackground'} style={{position: 'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:brandMain, opacity: this.state.fadeAnim}}/>}
                <TouchableOpacity name={'userpic'} onPress={this._onPressProfile/*this.notification.senderid.length === 1 ? () => this._onPressProfile(0) : this._onPressMultipleProfiles*/} style={[styles.containerPadding, {flexDirection:'column', justifyContent:'center'}]}>
                    <Image name={'userprofilepic'} resizeMode={'cover'} source={require('../user2.jpg')} style={styles.roundProfile}/>
                </TouchableOpacity>
                <View name={'textcontentwrapper'} style={[styles.containerPadding, {flex: 1, flexDirection:'column', justifyContent:'center'}]}>
                    <Text name={'action'}>
                        <Text onPress={() => this._onPressProfile(0)} style={styles.textStandardBold}>{completeActionString/*this.notification.senderid[0]*/}</Text>
                        {/*
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
                                                <Text style={[styles.textStandardDark]}> {action}</Text>*/}
                    </Text>
                    <TimeAgo name={'time'} style={styles.textSmall} time={this.notification.timestamp}/>
                </View>
                {this.notification.type !== ActivityEnum.FOLLOW &&
                <TouchableOpacity name={'image'} onPress={this._onPressObservation} style={[styles.containerPadding, {flex: 0, flexDirection:'column', justifyContent:'center'}]}>
                    <Image name={'userprofilepic'} resizeMode={'cover'} source={this.props.observation && this.props.observation.imageUrl ? {uri: this.props.observation.imageUrl} : require('../noimage.png')} style={styles.squareThumbnail}/>
                </TouchableOpacity>}
            </TouchableOpacity>
        );
    }
}