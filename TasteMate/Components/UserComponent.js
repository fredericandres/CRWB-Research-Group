import React from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import styles from "../styles";
import { _navigateToScreen } from '../constants/Constants';

export class UserComponent extends React.Component {
    constructor(props) {
        super(props);
        this.user = this.props.user;
        this._onPressUser = this._onPressUser.bind(this);
    }

    _onPressUser () {
        let params = {};
        params.user = this.user;
        _navigateToScreen('Profile', this.props.navigation, params);
    }

    render() {
        return (
            <TouchableOpacity onPress={this._onPressUser} style={{flexDirection:'row'}}>
                    <Image name={'userprofilepic'} resizeMode={'cover'} source={require('../user2.jpg')} style={[styles.roundProfile, styles.containerPadding, {flexDirection:'column', justifyContent:'center'}]}/>
                <View name={'textcontentwrapper'} style={[styles.containerPadding, {flex: 1, flexDirection:'column', justifyContent:'center'}]}>
                    <Text name={'username'} style={styles.textStandardBold}>{this.user.username}</Text>
                    <Text name={'location'} style={styles.textSmall}>{this.user.location}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

