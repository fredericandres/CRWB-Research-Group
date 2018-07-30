import React from "react";
import {Text, View} from "react-native";
import styles from "../styles";
import strings from "../strings";
import {iconArrowUpLeft, iconSizeStandard} from "../constants/Constants";
import Feather from "react-native-vector-icons/Feather";

export class LogInMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View name={'loginmessage'} style={{flex:1, alignItems:'center'}}>
                <Feather size={iconSizeStandard} name={iconArrowUpLeft} style={[styles.containerPadding, {alignSelf:'flex-start'}]}/>
                <Text style={[styles.containerPadding, styles.textStandardDark]}>{strings.hiThere}</Text>
                <Text style={[styles.containerPadding, styles.textTitleBold]}>{strings.welcomeToTastemate}</Text>
                <Text style={[styles.containerPadding, styles.textStandardDark, {textAlign: 'center'}]}>{strings.limitedContentExplanation}</Text>
                <Text style={[styles.containerPadding, styles.textTitleBold]}>{strings.haveFun}</Text>
            </View>
        );
    }
}
