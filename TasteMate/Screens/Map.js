import React from 'react';
import MapView from "react-native-maps";
import strings from "../strings";

export class MapScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: strings.mapDetail,
    });

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
                <MapView.Marker
                    coordinate={{
                        latitude: this.observation.location.latitude,
                        longitude: this.observation.location.longitude
                    }}
                    title={this.observation.dishname}
                    description={this.observation.description}
                />
            </MapView>

        );
    }
}
