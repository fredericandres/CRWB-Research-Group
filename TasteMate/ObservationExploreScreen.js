import React from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import styles from "./styles";

export class ObservationExploreScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <TouchableOpacity name={'picture'} style={{flex: 1, flexDirection:'row'}} onPress={() => this.props.nav.navigate('ObservationDetail',  { observation: this.props.observation })}>
                    <Image name={'image'} resizeMode={'contain'} source={require('./carbonara.png')} style={{flex: 1, aspectRatio: 1}}/>
                </TouchableOpacity>
            </View>

        );
    }
}

