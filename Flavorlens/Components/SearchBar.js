import React from "react";
import {TextInput, TouchableOpacity, View} from "react-native";
import styles from "../styles";
import {colorBackground, colorContrast, colorLight, colorMain, iconSearch, iconSizeSmall} from "../Constants/Constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View name={'searchbar'} style={{backgroundColor: colorMain}}>
                <View style={[styles.containerPadding, {flexDirection:'row', alignItems: 'center'}]}>
                    <TextInput
                        style={[styles.textStandardDark, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges, {backgroundColor: colorBackground, flex: 1}]}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        placeholderTextColor={colorLight}
                        returnKeyType={'search'}
                        keyboardType={'default'}
                        clearButtonMode={'always'}
                        underlineColorAndroid={colorBackground}
                        selectionColor={colorContrast}
                        onSubmitEditing={this.props.onSubmitEditing}
                        onChangeText={this.props.onChangeText}
                    />
                    <TouchableOpacity onPress={this.props.onPressSearch} style={styles.containerPadding}>
                        <FontAwesome name={iconSearch} size={iconSizeSmall} color={colorContrast}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
