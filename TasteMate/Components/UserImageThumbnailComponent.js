import React from "react";
import styles from "../styles";
import {CachedImage} from 'react-native-cached-image';
import {TouchableOpacity} from "react-native";

export class UserImageThumbnailComponent extends React.Component {
    render() {
        return (
            <TouchableOpacity name={'header'} disabled={!this.props.onPress} onPress={this.props.onPress} style={[styles.containerPadding, {flex: 0, flexDirection:'column'}]}>
                <CachedImage name={'userprofilepic'} resizeMode={'cover'} source={this.props.source || require('../nouser.jpg')} style={this.props.size}/>
            </TouchableOpacity>
        );
    }
}