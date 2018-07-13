import React from "react";
import {TextInput, TouchableOpacity, View} from "react-native";
import styles from "../styles";
import {brandBackground, brandContrast, brandLight, brandMain, iconSearch, iconSizeSmall} from "../constants/Constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View name={'searchbar'} style={{backgroundColor: brandMain}}>
                <View style={[styles.containerPadding, {flexDirection:'row', alignItems: 'center'}]}>
                    <TextInput
                        style={[styles.textStandardDark, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges, {backgroundColor: brandBackground, flex: 1}]}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        placeholderTextColor={brandLight}
                        returnKeyType={'search'}
                        keyboardType={'default'}
                        clearButtonMode={'always'}
                        underlineColorAndroid={brandBackground}
                        selectionColor={brandContrast}
                        onSubmitEditing={this.props.onSubmitEditing}
                        onChangeText={this.props.onChangeText}
                    />
                    <TouchableOpacity onPress={this.props.onPressSearch} style={styles.containerPadding}>
                        <FontAwesome name={iconSearch} size={iconSizeSmall} color={brandContrast}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
