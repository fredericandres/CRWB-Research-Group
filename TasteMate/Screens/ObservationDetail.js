import React from 'react';
import {ObservationComponent} from "../Components/ObservationComponent";
import {ScrollView} from "react-native";

export class ObservationDetailScreen extends React.Component {
    static navigationOptions = ()=> ({
        title: 'Detail',
    });

    render() {
        return (
            <ScrollView>
                <ObservationComponent nav={this.props.navigation} observation={this.props.navigation.getParam('observation', null)}/>
            </ScrollView>
        );
    }
}

