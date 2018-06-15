import React from "react";
import styles from "../styles";
import {Text, View} from "react-native";

export class EmptyComponent extends React.Component {

    render() {
        return (
            <View style={[styles.containerPadding, {justifyContent:'center', flex:1}]}>
                <Text style={[styles.textStandardDark, {textAlign:'center'}]}>{this.props.message}</Text>
            </View>
        );
    }
}