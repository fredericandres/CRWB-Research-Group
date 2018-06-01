import React from "react";
import styles from "../styles";
import {brandBackground, brandContrast, brandLight, brandMain, iconSizeStandard} from "../constants/Constants";
import {Alert, TextInput, TouchableOpacity, View} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export class TextInputComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flexDirection: 'row', flex: 1}}>
                <View style={[styles.containerPadding, styles.leftRoundedEdges, {flex: 1, backgroundColor: brandBackground, alignItems: 'center', justifyContent:'center'}]}>
                    <FontAwesome name={this.props.icon} size={iconSizeStandard} color={brandContrast} style={[styles.containerPadding]}/>
                </View>
                <View style={[styles.containerPadding, !this.props.info && styles.rightRoundedEdges, {flex: this.props.info? 5: 6, backgroundColor: brandBackground}]}>
                    <TextInput style={[styles.textStandardDark, styles.containerPadding, {backgroundColor: 'transparent', flex: 1}]}
                               placeholder={this.props.placeholder}
                               value={this.props.value}
                               placeholderTextColor={brandLight}
                               returnKeyType={this.props.returnKeyType ? this.props.returnKeyType: 'done'}
                               keyboardType={this.props.keyboardType}
                               clearButtonMode={'while-editing'}
                               underlineColorAndroid={brandBackground}
                               selectionColor={brandMain}
                               secureTextEntry={this.props.secureTextEntry}
                               onChangeText={this.props.onChangeText}
                               multiline={this.props.multiline}
                               onEndEditing={this.props.onEndEditing}
                    />
                </View>
                {this.props.info && <TouchableOpacity onPress={() => Alert.alert(this.props.infoTitle, this.props.infoText, this.props.infoButtons)} style={[styles.containerPadding, styles.rightRoundedEdges, {flex: 1, backgroundColor: brandBackground, alignItems: 'center', justifyContent:'center'}]}>
                    <FontAwesome name={'info'} size={iconSizeStandard} color={brandContrast} style={[styles.containerPadding]}/>
                </TouchableOpacity>}
            </View>
        );
    }
}