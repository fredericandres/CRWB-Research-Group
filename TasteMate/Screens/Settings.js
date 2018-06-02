import React from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import {NavBarButton, NavBarLogoutButton} from "../Components/NavBarButton";
import strings from "../strings";
import {TextInputComponent} from "../Components/TextInputComponent";
import {brandAccent, brandBackground} from "../constants/Constants";
import styles from "../styles";
import {SettingsSwitchComponent} from "../Components/SettingsSwitchComponent";

export class SettingsScreen extends React.Component {
    static navigationOptions =({navigation})=> ({
        title: strings.settings,
        headerRight: (
            <NavBarLogoutButton nav={navigation}/>
        ),
    });

    constructor(props) {
        super(props);
        this._onLikeNotificationChange = this._onLikeNotificationChange.bind(this);
        this._onWantToEatNotificationChange = this._onWantToEatNotificationChange.bind(this);
        this._onShareNotificationChange = this._onShareNotificationChange.bind(this);
        this._onFollowNotificationChange = this._onFollowNotificationChange.bind(this);

        // TODO: get user info from DB
        this.state = {
            username: 'isnotyourname',
            email: 'a@b.de',
            location: 'Los Angeles, CA, USA',
            oldPassword: '',
            newPassword: '',
            newPasswordRepeat: '',
            followNotification: true,
            likeNotification: true,
            wantToEatNotification: true,
            shareNotification: true,
        };
    }

    _onLikeNotificationChange(){
        this.setState({likeNotification: !this.state.likeNotification});
    }

    _onWantToEatNotificationChange(){
        this.setState({wantToEatNotification: !this.state.wantToEatNotification});
    }

    _onShareNotificationChange(){
        this.setState({shareNotification: !this.state.shareNotification});
    }

    _onFollowNotificationChange(){
        this.setState({followNotification: !this.state.followNotification});
    }

    _onPressSave() {
        // TODO: Submit changes to DB
    }

    render() {
        return (
            <ScrollView style={[{flex: 1}]}>
                <View name={'inputWrapper'} style={styles.containerPadding}>
                    <TextInputComponent placeholder={strings.username} value={this.state.username} onChangeText={(text) => this.setState({username: text})} icon={'user'} keyboardType={'default'} />
                    <TextInputComponent placeholder={strings.emailAddress} value={this.state.email} onChangeText={(text) => this.setState({email: text})} icon={'envelope'} keyboardType={'email-address'} />
                    <TextInputComponent placeholder={strings.location} value={this.state.location} onChangeText={(text) => this.setState({location: text})} icon={'location-arrow'} keyboardType={'default'} />
                    <TextInputComponent placeholder={strings.oldPassword} icon={'lock'} onChangeText={(text) => this.setState({oldPassword: text})} keyboardType={'default'} secureTextEntry={true} />
                    <TextInputComponent placeholder={strings.newPassword} icon={'lock'} onChangeText={(text) => this.setState({newPassword: text})} keyboardType={'default'} secureTextEntry={true} />
                    <TextInputComponent placeholder={strings.newPasswordRepeat} icon={'lock'} onChangeText={(text) => this.setState({newPasswordRepeat: text})} keyboardType={'default'} secureTextEntry={true} />
                </View>
                <View name={'switchWrapper'} style={styles.containerPadding}>
                    <View style={[{flex: 1, backgroundColor:brandBackground}, styles.rightRoundedEdges, styles.leftRoundedEdges]}>
                        <View style={styles.containerPadding}>
                            <Text name={'notificationsTitle'} style={[styles.textTitle]}>{strings.notifyMe}</Text>
                        </View>
                        <SettingsSwitchComponent value={this.state.likeNotification} onValueChange={this._onLikeNotificationChange} text={strings.likesPicture}/>
                        <SettingsSwitchComponent value={this.state.wantToEatNotification} onValueChange={this._onWantToEatNotificationChange} text={strings.addsToEatingOutPicture}/>
                        <SettingsSwitchComponent value={this.state.shareNotification} onValueChange={this._onShareNotificationChange} text={strings.sharesPicture}/>
                        <SettingsSwitchComponent value={this.state.followNotification} onValueChange={this._onFollowNotificationChange} text={strings.startsFollowing}/>
                    </View>
                </View>
                <View name={'saveButtonWrapper'} style={[styles.containerPadding, {flex: 1}]}>
                    <Button name={'saveChangesButton'} onPress={this._onPressSave} title={strings.saveChanges} color={brandAccent}/>
                </View>
            </ScrollView>
        );
    }
}
