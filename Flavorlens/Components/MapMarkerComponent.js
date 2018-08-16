import React from "react";
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import {Dimensions, Text, View} from "react-native";
import {colorContrast} from "../Constants/Constants";
import styles from "../styles";

export class MapMarkerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.observation = this.props.observation;
    }

    render() {
        return (
            <MapboxGL.PointAnnotation
                coordinate={[this.observation.location.longitude, this.observation.location.latitude]}
                id={this.observation.observationid}
                selected={this.props.selected}
            >
                <MapboxGL.Callout>
                    <View style={{alignItems:'center', flexDirection:'column', width:Dimensions.get('window').width*2/3}}>
                        <View style={[styles.leftRoundedEdges, styles.rightRoundedEdges, {backgroundColor: 'white', alignItems: 'center', borderColor: colorContrast, borderWidth:1}]}>
                            <View style={[styles.containerPadding,]}>
                                <Text style={[{textAlign:'center'}, styles.textTitleBoldDark]}>{this.observation.dishname + ' (' + (this.observation.mypoccorrector || this.observation.mypoc) + ')'}</Text>
                                <Text style={[{textAlign:'center'}, styles.textSmall]}>{this.observation.location.name + ', ' + this.observation.location.address}</Text>
                            </View>
                        </View>
                        <View style={{
                            width: 0,
                            height: 0,
                            backgroundColor: 'transparent',
                            borderStyle: 'solid',
                            borderLeftWidth: 7.5,
                            borderRightWidth: 7.5,
                            borderBottomWidth: 15,
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent',
                            borderBottomColor: 'white',
                            transform: [{rotate: '180deg'}],
                        }}
                        />
                    </View>
                </MapboxGL.Callout>
            </MapboxGL.PointAnnotation>
        );
    }
}