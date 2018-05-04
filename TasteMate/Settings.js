import React from 'react';
import { Button, View, Text } from 'react-native';

export class Settings extends React.Component {
    static navigationOptions = {
        title: 'Settings',
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Settings Screen</Text>
            </View>
        );
    }
}
