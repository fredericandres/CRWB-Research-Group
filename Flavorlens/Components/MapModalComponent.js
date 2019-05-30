import React, { Component } from 'react';
import { Button, Modal, Text, View, TouchableOpacity } from 'react-native';
import { debounce } from "../utils/debounce";
import Autocomplete from "react-native-autocomplete-input";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { geocoder } from "../Helpers/MapboxHelper";
import styles, { smallFontSize } from '../styles';
import { iconClose, iconArrowLeft, iconTimesCircle } from '../Constants/Constants';
import strings from '../strings';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class MapModalComponent extends Component {
    autoCompleteRef = {};

    constructor(props) {
        super(props);

        this.state = {
            locations: [],
            showUserLocation: true,
            center: [0, 0]
        }

        this._onchangeLocation = this._onchangeLocation.bind(this);
        this.onChangeLocationDelayed = debounce(this._onchangeLocation, 1000);
        this._onChooseLocation = this._onChooseLocation.bind(this);
    }

    _onchangeLocation(text) {
        geocoder.forward(text).then((result) => {
            this.setState({ ...this.state, locations: result.features || [] });
        });
        this.setState({ ...this.state, location: text });
    }

    _onChooseLocation(location) {

        this.setState({
            ...this.state,
            location,
            showUserLocation: false,
            locations: []
        });

        // this.autoCompleteRef.textInput.setImmediate(location.place_name);
    }

    _onClearClick() {
        this.setState({
            ...this.state,
            location: undefined,
            locations: []
        });
        this.autoCompleteRef.textInput.clear();
    }

    render() {
        const { locations, location, showUserLocation } = this.state;
        const { isModalVisible, onClose } = this.props;
        return isModalVisible && (
            <Modal {...this.props} style={{ flex: 1, flexDirection: 'row' }} onRequestClose={() => onClose(location)} >
                <View style={{height:50, flexDirection: "row", padding:5 }}>
                    <TouchableOpacity name={'okayButton'} onPress={() => onClose(location)} style={[{ width:40 }]}>
                        <FontAwesome style={[styles.textTitleBoldDark, styles.containerPadding, styles.center, {fontSize: 25}]} name={iconArrowLeft} />
                    </TouchableOpacity>
                    <Autocomplete
                        autoCapitalize="none"
                        autoCorrect={false}
                        //data to show in suggestion
                        data={locations}
                        ref={ref => this.autoCompleteRef = ref}
                        /*onchange of the text changing the state of the query which will trigger
                        the findFilm method to show the suggestions*/
                        onChangeText={this.onChangeLocationDelayed}
                        placeholder="Search for a place"
                        listStyle={{ zIndex: 1, position: 'absolute' }}
                        style={[styles.textStandard, { fontSize: 16 }]}
                        inputContainerStyle={{height:50, borderWidth: 0, flex:1}}
                        // listContainerStyle={{flex: 4}}
                        autoFocus={true}
                        renderItem={(location) => (
                            //you can change the view you want to show in suggestion from here
                            <TouchableOpacity style={{ padding: 5 }} onPress={() => {this._onChooseLocation(location.item)}}>
                                <Text>
                                    {(location && location.item && location.item.place_name) || ''}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity name={'resetButton'} onPress={() => {this._onClearClick()}} style={[{ width:40 }]}>
                        <FontAwesome style={[styles.textStandard, styles.containerPadding, styles.center, {color: '#ccc', fontSize: 25}]} name={iconTimesCircle} />
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                    <MapboxGL.MapView
                        showUserLocation={showUserLocation}
                        centerCoordinate={location && location.center}
                        zoomLevel={12}
                        userTrackingMode={MapboxGL.UserTrackingModes.Follow}
                        styleURL={this.props.styleURL}
                        style={{ flex: 1 }} />
                </View>
                {/* <Button style={[styles.textTitleBoldLight, styles.containerPadding]} onPress={() => onClose(location)} title="Okay" /> */}
            </Modal>
        );
    }
}