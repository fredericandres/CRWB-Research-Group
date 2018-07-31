import React from "react";
import styles from "../styles";
import {Animated, Text, TouchableOpacity, View} from "react-native";
import TimeAgo from 'react-native-timeago'
import {
    _navigateToScreen,
    ActivityEnum,
    colorAccent,
    colorBackground,
    colorContrast,
    colorLight,
    colorMain,
    colorMainDark,
    iconComment,
    iconCutlery,
    iconFollow,
    iconLike,
    iconShare,
    iconSizeTiny
} from "../constants/Constants";
import strings from "../strings";
import {UserImageThumbnailComponent} from "./UserImageThumbnailComponent";
import {CachedImage} from "react-native-cached-image";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export class NotificationComponent extends React.Component {
    constructor(props) {
        super(props);
        this._onPressProfile = this._onPressProfile.bind(this);
        this._onPressObservation = this._onPressObservation.bind(this);
        this._getUsername = this._getUsername.bind(this);
        this.notification = this.props.notification;
        this.users = this.props.users;
        this.state = {
            fadeAnim: new Animated.Value(1)
        };
    }

    componentDidMount() {
        if (!this.notification.read) {
            Animated.timing(                  // Animate over time
                this.state.fadeAnim,            // The animated value to drive
                {
                    toValue: 0,                   // Animate to opacity: 1 (opaque)
                    duration: 10000,              // Make it take a while
                }
            ).start();
        }
    }

    _onPressProfile() {
        let params = {};
        if (this.notification.users.length === 1) {
            params.user = this.users[this.notification.userid];
            _navigateToScreen('Profile', this.props.navigation, params);
        } else {
            params.allUsers = this.users;
            params.users = this.notification.users;
            params.type = this.notification.type;
            _navigateToScreen('Users', this.props.navigation, params);
        }
    }

    _onPressObservation() {
        this.props.navigation.navigate('ObservationDetail',  { observation: this.props.observation });
    }

    _getUsername(index) {
        if (!this.users || !this.notification || !this.notification.users || this.notification.users.length < index) {
            return undefined;
        }
        return this.users[this.notification.users[index]];
    }

    render() {
        let action = '';
        let iconName = '';
        let backgroundColor = '';
        let iconColor = '';
        switch(this.notification.type) {
            case ActivityEnum.LIKE:
                action = strings.likedPicture;
                iconName = iconLike;
                backgroundColor = colorAccent;
                iconColor = colorBackground;
                break;
            case ActivityEnum.CUTLERY:
                action = strings.addedToEatingOutPicture;
                iconName = iconCutlery;
                backgroundColor = colorMain;
                iconColor = colorContrast;
                break;
            case ActivityEnum.SHARE:
                action = strings.sharedPicture;
                iconName = iconShare;
                backgroundColor = colorMainDark;
                iconColor = colorContrast;
                break;
            case ActivityEnum.FOLLOW:
                action = strings.startedFollowing;
                iconName = iconFollow;
                backgroundColor = colorContrast;
                iconColor = colorBackground;
                break;
            case ActivityEnum.COMMENT:
                action = strings.commentedPicture;
                iconName = iconComment;
                backgroundColor = colorLight;
                iconColor = colorBackground;
                break;
        }

        const userLoading = '...';
        let completeActionString = '';
        const user1 = this.users && this._getUsername(0);
        const user1Username = (user1 && user1.username) || userLoading;
        if (this.notification.users.length === 1) {
            completeActionString = strings.formatString(action, user1Username);
        } else if (this.notification.users.length === 2) {
            const user2 = this.users && this._getUsername(1);
            completeActionString = strings.formatString(action, strings.formatString(strings.userAndUser, user1Username, ((user2 && user2.username) || userLoading)));
        } else {
            completeActionString = strings.formatString(action, strings.formatString(strings.userAndUser, user1Username, strings.formatString(strings.others, this.notification.users.length - 1)));
        }

        return (
            <View style={{flex:1}}>
                <TouchableOpacity onPress={this.notification.type === ActivityEnum.FOLLOW ? this._onPressProfile : this._onPressObservation} style={[{flexDirection:'row', backgroundColor:colorBackground}]}>
                    {!this.notification.read && <Animated.View name={'fadingbackground'} style={{position: 'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:colorMain, opacity: this.state.fadeAnim}}/>}
                    <View style={{flexDirection:'column', justifyContent:'center'}}>
                        <UserImageThumbnailComponent size={[styles.roundProfile, styles.containerPadding]} user={this.users && this.users[this.notification.users[0]]} onPress={this._onPressProfile/*this.notification.senderid.length === 1 ? () => this._onPressProfile(0) : this._onPressMultipleProfiles*/} />
                        <View style={[styles.containerPadding, styles.roundProfileSmall, {backgroundColor:backgroundColor, position:'absolute', bottom:0, right:0, justifyContent:'center', alignItems:'center'}]}>
                            <View style={{width:iconSizeTiny, height:iconSizeTiny, alignItems:'center', justifyContent:'center'}}>
                                {
                                    this.notification.type === ActivityEnum.FOLLOW &&
                                    <SimpleLineIcons name={iconName} size={iconSizeTiny} color={iconColor}/>
                                }
                                {
                                    this.notification.type !== ActivityEnum.FOLLOW &&
                                    <FontAwesome name={iconName} size={iconSizeTiny} color={iconColor}/>
                                }
                            </View>
                        </View>
                    </View>
                    <View name={'textcontentwrapper'} style={[styles.containerPadding, {flex: 1, flexDirection:'column', justifyContent:'center'}]}>
                        <Text name={'action'}>
                            <Text onPress={this._onPressProfile} style={styles.textStandardBold}>{completeActionString/*this.notification.senderid[0]*/}</Text>
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
                    {this.notification && this.notification.observationid && this.notification.type !== ActivityEnum.FOLLOW &&
                    <TouchableOpacity name={'image'} onPress={this._onPressObservation} style={[styles.containerPadding, {flex: 0, flexDirection:'column', justifyContent:'center'}]}>
                        <CachedImage name={'userprofilepic'} resizeMode={'cover'} source={this.props.observation && this.props.observation.imageUrl ? {uri: this.props.observation.imageUrl} : require('../Images/noimage.jpg')} style={styles.squareThumbnail}/>
                    </TouchableOpacity>}
                </TouchableOpacity>
            </View>
        );
    }
}