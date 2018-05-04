import React from 'react';
import {Text, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "./NavBarButton";

export class NotificationsScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: 'Notifications',
        headerLeft: (
            <NavBarProfileButton nav={navigation}/>
        ),
        headerRight: (
            <NavBarCreateObsButton nav={navigation}/>
        ),
    });

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Notifications Screen</Text>
            </View>
        );
    }
}
