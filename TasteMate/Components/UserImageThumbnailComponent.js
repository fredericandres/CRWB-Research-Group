import React from "react";
import styles from "../styles";
import {CachedImage} from 'react-native-cached-image';
import {TouchableOpacity} from "react-native";
import {currentUserInformation} from "../App";

export class UserImageThumbnailComponent extends React.Component {
    render() {
        let imageUrl = null;
        if (this.props.uri) {
            imageUrl = this.props.uri;
        } else if (this.props.user) {
            imageUrl = this.props.user.imageUrl;
            if (this.props.user.userid === currentUserInformation.uid) {
                imageUrl = currentUserInformation.imageUrl;
            }
        }
        const source = imageUrl ? {uri: imageUrl} : require('../nouser.jpg');

        return (
            <TouchableOpacity name={'header'} disabled={!this.props.onPress} onPress={this.props.onPress} style={[styles.containerPadding, {flex: 0, flexDirection:'column'}]}>
                <CachedImage name={'userprofilepic'} resizeMode={'cover'} source={source} style={this.props.size}/>
            </TouchableOpacity>
        );
    }
}