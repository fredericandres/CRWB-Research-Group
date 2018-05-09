import React from "react";
import styles from "./styles";
import {Image, Text, View} from "react-native";
import TimeAgo from 'react-native-timeago'

export class NotificationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.notification = this.props.notification;
    }

    render() {
        let action = '';
        switch(this.notification.type) {
            case 'LIKE':
                action = 'liked your picture.';
                break;
            case 'WANTTOEAT':
                action = 'wants to eat your picture.';
                break;
            case 'SHARE':
                action = 'shared your picture.';
                break;
            case 'FOLLOW':
                action = 'started following you.';
                break;
        }

        const time = new Date(this.notification.timestamp);
        const currenttime = new Date();
        let timeString = '';

        return (
            <View style={{flexDirection:'row'}}>
                <View name={'header'} style={[styles.containerPadding, {flex: 0, flexDirection:'column'}]}>
                    <Image name={'userprofilepic'} resizeMode={'cover'} source={require('./user2.jpg')} style={styles.roundProfile}/>
                </View>
                <View>
                    <Text name={'action'}>
                        <Text style={[styles.textStandard, {fontWeight:'bold'}]}>{this.notification.senderid} </Text>
                        <Text style={[styles.textStandard]}>{action}</Text>
                    </Text>
                    <TimeAgo name={'time'} style={styles.textSmall} time={this.notification.timestamp}/>
                </View>
                <View></View>

            </View>
        );
    }
}
//