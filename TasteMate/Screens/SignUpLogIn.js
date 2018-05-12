import React from 'react';
import { Button, View, Text } from 'react-native';

export class SignUpLogInScreen extends React.Component {
    static navigationOptions = {
        title: 'SignUp/LogIn',
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Sign Up / Log In Screen</Text>
            </View>
        );
    }
}
