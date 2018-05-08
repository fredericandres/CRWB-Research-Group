import React from "react";
import {Image, Text, View} from "react-native";
import styles from "./styles";

export class ObservationExploreScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View name={'picture'} style={{flex: 1, flexDirection:'row'}}>
                    <Image name={'image'} resizeMode={'contain'} source={require('./carbonara.png')} style={{flex: 1, aspectRatio: 1}}/>
                </View>
            </View>

        );
    }
}

