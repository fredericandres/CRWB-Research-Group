import React from "react";
import {TouchableOpacity} from "react-native";
import styles from "../styles";
import {CachedImage} from "react-native-cached-image";

export class ObservationExploreComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let onPress = this.props.onPress;
        if (!onPress) {
            onPress = () => this.props.navigation.navigate('ObservationDetail',  { observation: this.props.observation });
        }
        const onLongPress = this.props.onLongPress;

        return (
            <TouchableOpacity name={'picture'} disabled={this.props.disabled} onPress={onPress} onLongPress={() => onLongPress(this.props.observation)} style={[styles.explorePadding, {flex: 1, flexDirection:'row'}]}>
                <CachedImage name={'image'} resizeMode={'cover'} source={this.props.source || ((this.props.observation && this.props.observation.imageUrl) ? {uri: this.props.observation.imageUrl} : require('../Images/noimage.jpg'))} style={{flex: 1, aspectRatio: 1}}/>
            </TouchableOpacity>
        );
    }
}

