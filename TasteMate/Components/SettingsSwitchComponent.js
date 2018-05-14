import React from "react";
import styles from "../styles";
import {brandAccent, brandBackground, brandContrast, brandLight, iconSizeStandard} from "../constants/Constants";
import {Switch, Text, TextInput, View} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import strings from "../strings";

export class SettingsSwitchComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[{flexDirection:'row', alignItems:'center'}, styles.containerPadding, {flex: 1}]}>
                <Switch value={this.props.value} onValueChange={this.props.onValueChange} style={{transform: [{ scaleX: .8 }, { scaleY: .8 }]}}tintColor={brandContrast} onTintColor={brandAccent}/>
                <Text style={[styles.textStandardDark, styles.containerPadding, {flex: 1}]}>{this.props.text}</Text>
            </View>
        );
    }
}