import React from 'react';
import {Text, View} from 'react-native';
import {NavBarCloseButton} from "./NavBarButton";

export class CreateObservationScreen extends React.Component {
    static navigationOptions =({navigation})=> ({
        title: 'Create Observation',
        headerLeft: (
            <NavBarCloseButton nav={navigation}/>
        ),
    });

    render() {
        let observation = {};
        if (this.props.navigation.state.params) {
            observation = this.props.navigation.state.params.item;
        }


        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Create Observation Screen: {observation.dishname}</Text>
            </View>
        );
    }
}