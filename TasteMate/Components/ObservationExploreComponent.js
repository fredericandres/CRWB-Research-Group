import React from "react";
import {Image, TouchableOpacity} from "react-native";
import styles from "../styles";

export class ObservationExploreComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity name={'picture'} style={[styles.containerPadding, {flex: 1, flexDirection:'row'}]} onPress={() => this.props.nav.navigate('ObservationDetail',  { observation: this.props.observation })}>
                <Image name={'image'} resizeMode={'cover'} source={this.props.source || require('../carbonara.png')} style={{flex: 1, aspectRatio: 1}}/>
            </TouchableOpacity>
        );
    }
}

