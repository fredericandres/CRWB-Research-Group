import React from "react";
import {Text, View} from "react-native";
import styles from "../styles";
import strings, {appName} from "../strings";
import {iconArrowUpLeft, iconSizeStandard} from "../Constants/Constants";
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
                <Text style={[styles.containerPadding, styles.textTitleBold]}>{strings.formatString(strings.welcomeToTastemate, appName)}</Text>
                <Text style={[styles.containerPadding, styles.textStandardDark, {textAlign: 'center'}]}>{strings.limitedContentExplanation}</Text>
                <Text style={[styles.containerPadding, styles.textTitleBold]}>{strings.haveFun}</Text>
            </View>
        );
    }
}
