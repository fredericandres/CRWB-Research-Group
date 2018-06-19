import React from "react";
import styles from "../styles";
import {iconSizeSmall, iconSizeStandard} from "../constants/Constants";
import {Text, TouchableOpacity, View} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export class SettingsSwitchComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} disabled={!this.props.onPress} style={[{flexDirection:'row', alignItems:'center'}, styles.containerPadding, {flex: 1}]}>
                <FontAwesome name={this.props.selected ? 'check-square-o' : 'square-o'} size={iconSizeSmall} style={[styles.containerPadding]}/>
                <View styles={[styles.containerPadding, {justifyContent:'center', flex: 1}]}>
                    <Text style={[styles.textStandardDark]}>{this.props.text}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}