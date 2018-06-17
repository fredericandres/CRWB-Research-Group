import React from "react";
import {TouchableOpacity} from "react-native";
import styles from "../styles";
import {CachedImage} from "react-native-cached-image";

export class ObservationExploreComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity name={'picture'} style={[styles.explorePadding, {flex: 1, flexDirection:'row'}]} onPress={() => this.props.navigation.navigate('ObservationDetail',  { observation: this.props.observation })}>
                <CachedImage name={'image'} resizeMode={'cover'} source={this.props.source || ((this.props.observation && this.props.observation.imageUrl) ? {uri: this.props.observation.imageUrl} : require('../noimage.png'))} style={{flex: 1, aspectRatio: 1}}/>
            </TouchableOpacity>
        );
    }
}

