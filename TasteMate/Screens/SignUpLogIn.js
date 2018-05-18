import React from 'react';
import {ImageBackground, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import strings from "../strings";
import styles from "../styles";
import {brandAccent} from "../constants/Constants";
import {TextInputComponent} from "../Components/TextInputComponent";

export class SignUpLogInScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this._onPressSwitch = this._onPressSwitch.bind(this);
        this._onPressSubmit = this._onPressSubmit.bind(this);
        this._onPressSkip = this._onPressSkip.bind(this);

        // TODO: get user info from DB
        this.state = {
            username: undefined,
            email: undefined,
            location: undefined,
            password: undefined,
            signUpActive: false,
        };
    }

    componentWillMount() {
        StatusBar.setHidden(true);
    }
    componentWillUnmount() {
        StatusBar.setHidden(false);
    }

    _onPressSubmit() {
        // TODO: Check with DB
        // TODO: Display error/success msg
        this.props.navigation.dismiss();
    }

    _onPressSwitch() {
        this.setState({signUpActive: !this.state.signUpActive});
    }

    _onPressSkip() {
        this.props.navigation.dismiss();
    }

    render() {
        // TODO: skip button
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
                    {this.state.signUpActive && <TextInputComponent placeholder={strings.username} value={this.state.username} onChangeText={(text) => this.setState({username: text})} icon={'user'} keyboardType={'default'} />}
                    <TextInputComponent placeholder={strings.emailAddress} value={this.state.email} onChangeText={(text) => this.setState({email: text})} icon={'envelope'} keyboardType={'email-address'} />
                    <TextInputComponent placeholder={strings.password} icon={'lock'} onChangeText={(text) => this.setState({password: text})} keyboardType={'default'} secureTextEntry={true} />
                    {this.state.signUpActive && <TextInputComponent placeholder={strings.location} value={this.state.location} onChangeText={(text) => this.setState({location: text})} icon={'location-arrow'} keyboardType={'default'} />}
                    {!this.state.signUpActive && <View style={{flex:2}}/>}
                </View>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{flex: 1}}/>
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
