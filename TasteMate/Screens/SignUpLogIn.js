import React from 'react';
import {ImageBackground, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import strings from "../strings";
import styles from "../styles";
import {brandAccent, pathUsers} from "../constants/Constants";
import {TextInputComponent} from "../Components/TextInputComponent";
import firebase from 'react-native-firebase';

export class SignUpLogInScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this._onPressSwitch = this._onPressSwitch.bind(this);
        this._onPressSubmit = this._onPressSubmit.bind(this);
        this._onPressSkip = this._onPressSkip.bind(this);

        this.state = {
            username: undefined,
            email: undefined,
            location: undefined,
            password: undefined,
            signUpActive: false,
            error: null,
            user: null
        };

        this.unsubscriber = null;
        this.skipPressed = false;
    }

    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            this.setState({user: user});
            if (user && (!user.isAnonymous || this.skipPressed)) {
                this._close();
            }
        });
    }

    componentWillMount() {
        StatusBar.setHidden(true);
    }

    componentWillUnmount() {
        StatusBar.setHidden(false);
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    _onPressSubmit() {
        let errorMessage = '';
        if (!this.state.email) {
            errorMessage = strings.errorMessageEnterEmail;
        } else if (!this.state.password) {
            errorMessage = strings.errorMessageEnterPassword;
        } else {
            if (this.state.signUpActive) {
                if (!this.state.username) {
                    // TODO: check if username already taken
                    errorMessage = strings.errorMessageEnterUsername;
                } else if  (!this.state.location) {
                    errorMessage = strings.errorMessageEnterLocation;
                } else {
                    firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password).then((credentials) => {
                        console.log('Successfully signed up.');

                        // Add user's username & location to database
                        firebase.database().ref(pathUsers).child(credentials.user.uid).set({
                            username: this.state.username,
                            location: this.state.location
                        }, (error) => {
                            if (error) {
                                console.error('Error during user information transmission.');
                                console.error(error);
                                this._handleAuthError(error);
                            } else {
                                console.log('Successfully added user information to DB.');
                            }
                        });
                    }).catch((error) => {
                        console.error('Error during signup.');
                        console.error(error);
                        this._handleAuthError(error);
                    });
                }
            } else {
                firebase.auth().signInAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password).then(() => {
                    console.log('Successfully logged in.');
                }).catch((error) => {
                    console.log('Error during login.');
                    console.log(error);
                    this._handleAuthError(error);
                });
            }
        }

        this.setState({error: errorMessage});
    }

    _handleAuthError(error) {
        console.log('asdad');
        console.log(error.code);

        let errorMessage = '';

        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = strings.errorMessageInvalidEmail;
                break;
            case 'auth/user-disabled':
                errorMessage = strings.errorMessageUserDisabled;
                break;
            case 'auth/user-not-found':
                errorMessage = strings.errorMessageUserNotFound;
                break;
            case 'auth/wrong-password':
                errorMessage = strings.errorMessageWrongPassword;
                break;
            case 'auth/weak-password':
                errorMessage = strings.errorMessageWeakPassword;
                break;
            case 'auth/email-already-in-use':
                errorMessage = strings.errorMessageEmailAlreadyInUse;
                break;
        }

        this.setState({error: errorMessage});
    }

    _onPressSwitch() {
        this.setState({signUpActive: !this.state.signUpActive});
    }

    _onPressSkip() {
        this.skipPressed = true;
        if (this.state.user) {
            this._close();
        } else {
            firebase.auth().signInAnonymouslyAndRetrieveData().then(() => {
                console.log('Successfully signed up.');
            }).catch((error) => {
                console.error('Error during signup.');
                console.error(error);
                this._handleAuthError(error);
            });
        }
    }

    _close() {
        this.props.navigation.goBack(null);
    }

    render() {
        return (
            <ImageBackground source={require('../background.png')} resizeMode={'cover'}  style={{flex: 1}}>
                <View style={[styles.containerOpacityMain, {position:'absolute', left: 0, right: 0, top: 0, bottom: 0}]}/>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1}}/>
                    <View style={{flex: 6, alignItems: 'center'}}>
                        <View style={{flex: 1, flexDirection:'row', alignItems: 'flex-end'}}>
                            <Text style={[styles.textStandardDark, styles.containerPadding, {textAlign: 'center'}]}>{strings.welcomeTo}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection:'row', alignItems: 'flex-end'}}>
                            <Text style={[styles.textLargeBoldDark, styles.containerPadding, {textAlign: 'center'}]}>Tastemate</Text>
                        </View>
                        <View style={{flex: 1, flexDirection:'row', alignItems: 'flex-start'}}>
                            <Text style={[styles.textStandardDark, styles.containerPadding, {textAlign: 'center'}]}>{strings.tastemateDescription}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection:'row', alignItems: 'flex-start'}}>
                            <Text style={[styles.textTitleBoldDark, styles.containerPadding, {textAlign: 'center'}]}>{strings.getEating}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}/>
                </View>
                <View name={'inputWrapper'} style={[styles.containerPadding, {flex: 1}]}>
                    {this.state.signUpActive && <TextInputComponent placeholder={strings.username} value={this.state.username} onChangeText={(text) => this.setState({username: text.toLowerCase()})} icon={'user'} keyboardType={'default'} />}
                    <TextInputComponent placeholder={strings.emailAddress} value={this.state.email} onChangeText={(text) => this.setState({email: text})} icon={'envelope'} keyboardType={'email-address'} />
                    <TextInputComponent placeholder={strings.password} icon={'lock'} onChangeText={(text) => this.setState({password: text})} keyboardType={'default'} secureTextEntry={true} />
                    {this.state.signUpActive && <TextInputComponent placeholder={strings.location} value={this.state.location} onChangeText={(text) => this.setState({location: text})} icon={'location-arrow'} keyboardType={'default'} />}
                    {!this.state.signUpActive && <View style={{flex:2}}/>}
                </View>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                    <View style={[styles.containerOpacityMain, {flex: 1, flexDirection:'row', alignItems: 'center'}]}>
                        {this.state.error &&
                        <Text style={[styles.textStandard, styles.containerPadding, {textAlign: 'center', color:brandAccent}]}>{this.state.error}</Text>}
                    </View>
                    <View style={{flex: 6, alignItems: 'center'}}>
                        <View name={'submitButtonWrapper'} style={[styles.containerPadding]}>
                            <TouchableOpacity name={'saveChangesButton'} onPress={this._onPressSubmit} style={[{backgroundColor:brandAccent}, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges]}>
                                <Text style={[styles.textTitleBoldLight, styles.containerPadding]}>{this.state.signUpActive ? strings.signUp: strings.logIn}</Text>
                            </TouchableOpacity>
                        </View>
                        <View name={'changeButtonWrapper'} style={[styles.containerPadding]}>
                            <TouchableOpacity name={'changeButton'} onPress={this._onPressSwitch}>
                                <Text name={'other'} style={styles.textStandardDark}>{this.state.signUpActive ? strings.alreadyAccount: strings.noAccount}</Text>
                            </TouchableOpacity>
                        </View>
                        <View name={'skipButtonWrapper'} style={[styles.containerPadding]}>
                            <TouchableOpacity name={'skipButton'} onPress={this._onPressSkip}>
                                <Text name={'skip'} style={styles.textStandardDark}>{strings.skip}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 1}}/>
                </View>
            </ImageBackground>
        );
    }
}
