import React from "react";
import MapView from 'react-native-maps';

export class MapMarkerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.observation = this.props.observation;
    }

    render() {
        return (
            <MapView.Marker
                coordinate={{
                    latitude: this.observation.location.latitude,
                    longitude: this.observation.location.longitude
                }}
                title={this.observation.dishname + '(' + (this.observation.mypoccorrector || this.observation.mypoc) + ')'}
                description={this.observation.location.name + ', ' + this.observation.location.address}
                key={this.observation.observationid}
            />
        );
    }
}