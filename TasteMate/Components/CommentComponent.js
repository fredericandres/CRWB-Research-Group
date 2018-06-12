import React from "react";
import styles from "../styles";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {_navigateToScreen} from "../constants/Constants";
import TimeAgo from "react-native-timeago";

export class CommentComponent extends React.Component {
    constructor(props) {
        super(props);
        this._onPressProfile = this._onPressProfile.bind(this);
        this.comment = this.props.comment;
    }

    _onPressProfile() {
        let params = {};
        params.user = this.comment.userid;
        _navigateToScreen('Profile', this.props.navigation, params);
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={this._onPressProfile}>
                    <Image name={'userpic'} style={[styles.roundProfileSmall, styles.containerPadding]} resizeMode={'cover'} source={require('../user.jpg')} />
                </TouchableOpacity>
                <View style={[{flexDirection: 'column', flex: 1}, styles.containerPadding]}>
                    <Text style={[styles.textStandardDark, {flex: 1}]}>{this.comment.message}</Text>
                    <TimeAgo name={'time'} style={styles.textSmall} time={this.comment.timestamp}/>
                </View>
            </View>
        );
    }
}