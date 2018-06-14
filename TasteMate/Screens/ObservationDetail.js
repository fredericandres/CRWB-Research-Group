import React from 'react';
import {ObservationComponent} from "../Components/ObservationComponent";
import {ScrollView} from "react-native";
import strings from "../strings";

export class ObservationDetailScreen extends React.Component {
    static navigationOptions = ()=> ({
        title: strings.observationDetail + ' ',
    });

    render() {
        return (
            <ScrollView>
                <ObservationComponent {...this.props} observation={this.props.navigation.getParam('observation', null)}/>
            </ScrollView>
        );
    }
}

