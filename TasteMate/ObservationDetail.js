import React from 'react';
import {ObservationScreen} from "./ObservationScreen";
import {ScrollView} from "react-native";

export class ObservationDetailScreen extends React.Component {
    static navigationOptions = ()=> ({
        title: 'Detail',
    });

    render() {
        return (
            <ScrollView>
                <ObservationScreen nav={this.props.navigation} observation={this.props.navigation.getParam('observation', null)}/>
            </ScrollView>
        );
    }
}

