import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import styles from "../styles";
import {_navigateToScreen} from '../constants/Constants';
import {UserImageThumbnailComponent} from "./UserImageThumbnailComponent";

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
                <UserImageThumbnailComponent size={styles.roundProfile} source={this.user.imageUrl && {uri: this.user.imageUrl}} />
                <View name={'textcontentwrapper'} style={[styles.containerPadding, {flex: 1, flexDirection:'column', justifyContent:'center'}]}>
                    <Text name={'username'} style={styles.textStandardBold}>{this.user.username}</Text>
                    <Text name={'location'} style={styles.textSmall}>{this.user.location}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

