import React from 'react';
import { Button, View, Text } from 'react-native';
import {NavBarButton} from "./NavBarButton";

export class SettingsScreen extends React.Component {
    static navigationOptions =({navigation})=> ({
        title: 'Settings',
        headerRight: (
            <NavBarButton nav={navigation} icon={'sign-out'} screen={'SignUpLogIn'}/>
        ),
    });

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Settings Screen</Text>
            </View>
        );
    }
}
