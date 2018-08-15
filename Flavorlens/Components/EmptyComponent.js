import React from "react";
import styles from "../styles";
import {Text, TouchableOpacity, View} from "react-native";
import {colorAccent} from "../Constants/Constants";
import strings from "../strings";

export class EmptyComponent extends React.Component {

    render() {
        return (
            <View style={[styles.containerPadding, {justifyContent:'center', flexDirection:'column', flex:1}]}>
                <Text style={[styles.textStandardDark, {textAlign:'center'}]}>{this.props.message}</Text>
                {
                    this.props.retry &&
                    <View name={'submitButtonWrapper'} style={[styles.containerPadding, {justifyContent:'center', flexDirection:'row'}]}>
                        <TouchableOpacity name={'saveChangesButton'} onPress={this.props.retry} style={[{backgroundColor:colorAccent}, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges]}>
                            <Text style={[styles.textTitleBoldLight, styles.containerPadding]}>{strings.tryAgain}</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}