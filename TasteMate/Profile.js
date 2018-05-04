import React from 'react';
import {Button, View, Text, TouchableOpacity} from 'react-native';
import {NavBarCloseButton} from "./NavBarButton";

export class ProfileScreen extends React.Component {
    static navigationOptions =({navigation})=> ({
        title: 'Profile',
        headerLeft: (
            <NavBarCloseButton nav={navigation}/>
        ),
    });

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Profile Screen</Text>
            </View>
        );
    }
}
