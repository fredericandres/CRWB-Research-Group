import React from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import styles from "./styles";

export class UserComponent extends React.Component {
    constructor(props) {
        super(props);
        this.user = this.props.user;
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.props.nav.navigate('Profile',  { user: this.user })} style={{flexDirection:'row'}}>
                    <Image name={'userprofilepic'} resizeMode={'cover'} source={require('./user2.jpg')} style={[styles.roundProfile, styles.containerPadding, {flexDirection:'column', justifyContent:'center'}]}/>
                <View name={'textcontentwrapper'} style={[styles.containerPadding, {flex: 1, flexDirection:'column', justifyContent:'center'}]}>
                    <Text name={'username'} style={styles.textStandardBold}>{this.user.username}</Text>
                    <Text name={'location'} style={styles.textSmall}>{this.user.location}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

