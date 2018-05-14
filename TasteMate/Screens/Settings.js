import React from 'react';
import {Text, View} from 'react-native';
import {NavBarButton} from "../Components/NavBarButton";
import strings from "../strings";

export class SettingsScreen extends React.Component {
    static navigationOptions =({navigation})=> ({
        title: strings.settings,
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
