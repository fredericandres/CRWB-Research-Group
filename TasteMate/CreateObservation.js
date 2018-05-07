import React from 'react';
import {Button, View, Text, TouchableOpacity} from 'react-native';
import {HomeScreen} from "./Home";
import * as NavigationActions from "react-navigation";
import {NavBarCloseButton} from "./NavBarButton";

export class CreateObservationScreen extends React.Component {
    static navigationOptions =({navigation})=> ({
        title: 'Create Observation',
        headerLeft: (
            <NavBarCloseButton nav={navigation}/>
        ),
    });

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Create Observation Screen: {this.props.navigation.state.params.item.dishname}</Text>
            </View>
        );
    }
}
