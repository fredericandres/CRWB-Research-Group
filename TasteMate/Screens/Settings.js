import React from 'react';
import {Alert, Button, ScrollView, Text, View} from 'react-native';
import {NavBarLogoutButton} from "../Components/NavBarButton";
import strings from "../strings";
import {TextInputComponent} from "../Components/TextInputComponent";
import {
    _formatUsername,
    _handleAuthError,
    brandAccent,
    brandBackground,
    maxUsernameLength,
    pathUsers
} from "../constants/Constants";
import styles from "../styles";
import {SettingsSwitchComponent} from "../Components/SettingsSwitchComponent";
import {currentUser, currentUserInformation} from "../App";
import firebase from 'react-native-firebase';

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
        this._onPressSave = this._onPressSave.bind(this);
        this._updateUserInfoInDatabase = this._updateUserInfoInDatabase.bind(this);

        // TODO [FEATURE]: Let user change his password
        this.state = {
            email: currentUser.email,
            username: currentUserInformation.username,
            location: currentUserInformation.location,
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
        let errorMessage = '';
        if (!this.state.username) {
            errorMessage = strings.errorMessageEnterUsername;
        } else if (!this.state.location) {
            errorMessage = strings.errorMessageEnterLocation;
        } else {
            let userInfoChange = {};
            let changes = false;
            if (this.state.username !== currentUserInformation.username) {
                userInfoChange.username = this.state.username;
                changes = true;
            }
            if (this.state.location !== currentUserInformation.location) {
                userInfoChange.location = this.state.location;
                changes = true;
            }

            if (changes) {
                if (userInfoChange.username) {
                    console.log('Checking if username already exists...');
                    const refUsername = firebase.database().ref(pathUsers).orderByChild('username').equalTo(userInfoChange.username);
                    refUsername.once(
                        'value',
                        (dataSnapshot) => {
                            console.log('Username successfully checked');
                            if (dataSnapshot.toJSON()) {
                                // Display error message
                                _handleAuthError(strings.errorMessageUsernameAlreadyInUse, this._showErrorPopup);
                            } else {
                                this._updateUserInfoInDatabase(userInfoChange);
                            }
                        },
                        (error) => {
                            console.error('Error while checking if username exists');
                            console.error(error);
                        }
                    );
                } else {
                    this._updateUserInfoInDatabase(userInfoChange);
                }
            }

        }
        this._showErrorPopup(errorMessage);
    }

    _showErrorPopup(message) {
        if (message) {
            Alert.alert(strings.missingValuesTitle, message,
                [
                    {text: strings.ok},
                ]
            );
        }
    }

    _updateUserInfoInDatabase(userInfo) {
        firebase.database().ref(pathUsers).child(currentUser.uid).update(userInfo,
            (error) => {
                if (error) {
                    console.error('Error during user information update transmission.');
                    console.error(error);
                    _handleAuthError(error, this._showErrorPopup);
                } else {
                    console.log('Successfully updated user information on DB.');
                    if (userInfo.username) {
                        currentUserInformation.username = userInfo.username;
                    }
                    if (userInfo.location) {
                        currentUserInformation.location = userInfo.location;
                    }

                    this.props.navigation.goBack();
                    // TODO: Reload content on Profile page
                }
            }
        );
    }

    render() {
        return (
            <ScrollView style={[{flex: 1}]}>
                <View name={'inputWrapper'} style={styles.containerPadding}>
                    <TextInputComponent
                        editable={false}
                        placeholder={strings.emailAddress}
                        value={this.state.email}
                        onChangeText={(text) => this.setState({email: text})}
                        icon={'envelope'}
                        keyboardType={'email-address'}
                    />
                    <TextInputComponent
                        placeholder={strings.username}
                        value={this.state.username}
                        onChangeText={(text) => this.setState({username: _formatUsername(text)})}
                        icon={'user'}
                        keyboardType={'default'}
                        maxLength={maxUsernameLength}
                    />
                    <TextInputComponent
                        placeholder={strings.location}
                        value={this.state.location}
                        onChangeText={(text) => this.setState({location: text})}
                        icon={'location-arrow'}
                        keyboardType={'default'}
                    />
                    {/*<TextInputComponent*/}
                    {/*placeholder={strings.oldPassword}*/}
                    {/*icon={'lock'}*/}
                    {/*onChangeText={(text) => this.setState({oldPassword: text})}*/}
                    {/*keyboardType={'default'}*/}
                    {/*secureTextEntry={true}*/}
                    {/*/>*/}
                    {/*<TextInputComponent*/}
                    {/*placeholder={strings.newPassword}*/}
                    {/*icon={'lock'}*/}
                    {/*onChangeText={(text) => this.setState({newPassword: text})}*/}
                    {/*keyboardType={'default'}*/}
                    {/*secureTextEntry={true}*/}
                    {/*/>*/}
                    {/*<TextInputComponent*/}
                    {/*placeholder={strings.newPasswordRepeat}*/}
                    {/*icon={'lock'}*/}
                    {/*onChangeText={(text) => this.setState({newPasswordRepeat: text})}*/}
                    {/*keyboardType={'default'}*/}
                    {/*secureTextEntry={true}*/}
                    {/*/>*/}
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
