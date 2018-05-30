import React from "react";
import styles from "../styles";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {_navigateToScreen} from "../constants/Constants";

export class CommentComponent extends React.Component {
    constructor(props) {
        super(props);
        this._onPressProfile = this._onPressProfile.bind(this);
        this.comment = this.props.comment;
    }

    _onPressProfile() {
        _navigateToScreen('Profile', this.props.navigation, this.comment.userid, null);
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={this._onPressProfile}>
                    <Image name={'userpic'} style={[styles.roundProfileSmall, styles.containerPadding]} resizeMode={'cover'} source={require('../user.jpg')} />
                </TouchableOpacity>
                <Text style={[styles.textStandardDark, styles.containerPadding, {flex: 1}]}>{this.comment.message}</Text>
            </View>
        );
    }
}