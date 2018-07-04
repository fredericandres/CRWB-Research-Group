import React from 'react';
import strings from "../strings";
import Permissions from "react-native-permissions";
import {MapMarkerComponent} from "../Components/MapMarkerComponent";
import MapboxGL from '@mapbox/react-native-mapbox-gl';

export class MapScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: strings.mapDetail + ' ',
    });

    componentDidMount() {
        Permissions.request('location').then(response => {
            console.log(response);
            this.setState({locationPermission: response});
        });
    }

    render() {
        this.observation = this.props.navigation.getParam('observation');
        return (
            <MapboxGL.MapView
                style={{flex: 1}}
                centerCoordinate={[this.observation.location.longitude, this.observation.location.latitude]}
                compassEnabled={true}
                showUserLocation={true}
                zoomEnabled={true}
                localizeLabels={true}
            >
                <MapMarkerComponent observation={this.observation} key={this.observation.observationid} selected={true}/>
            </MapboxGL.MapView>

        );
    }
}
