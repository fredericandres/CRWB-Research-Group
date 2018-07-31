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
            if (currentUserInformation && this.props.user.userid === currentUserInformation.uid) {
                imageUrl = currentUserInformation.imageUrl;
            }
        }
        const defaultSource = require('../Images/nouser.jpg');
        const source = imageUrl ? {uri: imageUrl} : defaultSource;

        return (
            <TouchableOpacity name={'header'} disabled={!this.props.onPress} onPress={this.props.onPress} style={{flex: 0, flexDirection:'column'}}>
                <CachedImage name={'userprofilepic'} resizeMode={'cover'} defaultSource={defaultSource} source={source} style={this.props.size}/>
            </TouchableOpacity>
        );
    }
}