import React from 'react';
import { Button, View, Text } from 'react-native';
import strings from "../strings";
export class SignUpLogInScreen extends React.Component {
    static navigationOptions = {
        title: strings.signUpLogIn,
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Sign Up / Log In Screen</Text>
            </View>
        );
    }
}
