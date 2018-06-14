import React from 'react';
import MapView from "react-native-maps";
import strings from "../strings";
import Permissions from "react-native-permissions";
import {MapMarkerComponent} from "../Components/MapMarkerComponent";

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
            <MapView style={{flex: 1}}
                     initialRegion={{
                         latitude: this.observation.location.latitude,
                         longitude: this.observation.location.longitude,
                         latitudeDelta: 0.01,
                         longitudeDelta: 0.01,
                     }}
                     showsCompass={true}
                     showsScale={true}
                     showsUserLocation={true}
                     showsMyLocationButton={true}
                     showsIndoors={false}
                     showsBuildings={false}
                     showsTraffic={false}
                     userLocationAnnotationTitle={''}
                     loadingEnabled={true}
            >
                <MapMarkerComponent observation={this.observation}/>
            </MapView>

        );
    }
}
