import React from 'react';
import {ObservationComponent} from "../Components/ObservationComponent";
import {ScrollView} from "react-native";
import strings from "../strings";

export class ObservationDetailScreen extends React.Component {
    static navigationOptions = ()=> ({
        title: strings.observationDetail,
    });

    render() {
        return (
            <ScrollView>
                <ObservationComponent nav={this.props.navigation} observation={this.props.navigation.getParam('observation', null)}/>
            </ScrollView>
        );
    }
}

