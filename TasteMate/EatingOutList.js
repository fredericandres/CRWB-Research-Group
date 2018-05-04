import React from 'react';
import { Button, View, Text } from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "./NavBarButton";

export class EatingOutListScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: 'Eating Out List',
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
                <Text>Eating Out List Screen</Text>
            </View>
        );
    }
}
