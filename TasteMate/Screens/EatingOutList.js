import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import strings from "../strings";
import styles from "../styles";
import {ProfileSegmentedControlItem} from "../Components/EatingOutListSegmentedControlItem";
import {eatingOutObservations, observations} from "../MockupData";
import {EatingOutListComponent} from "../Components/EatingOutListComponent";
import MapView from 'react-native-maps';
import Permissions from "react-native-permissions";

export class EatingOutListScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: strings.eatingOutList,
        headerLeft: (
            <NavBarProfileButton nav={navigation}/>
        ),
        headerRight: (
            <NavBarCreateObsButton nav={navigation}/>
        ),
    });

    constructor() {
        super();

        this.state = {
            selectedIndex: 0,
            observations: observations,
        };
        this._onPressList = this._onPressList.bind(this);
        this._onPressMap = this._onPressMap.bind(this);
    }

    _onPressList() {
        this.setState({selectedIndex: 0});
    }

    _onPressMap() {
        this.setState({selectedIndex: 1});
    }

    componentDidMount() {
        Permissions.check('location').then(response => {
            this.setState({
                // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                locationPermission: response,
            });
            if (response === 'authorized') {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.setState({ userlocation: position.coords });
                });
            }
        })
    }

    _keyExtractor = (item, index) => item.id;

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View name={'segmentedcontrolwrapper'}
                      style={[{flexDirection: 'row'}, styles.containerPadding]}>
                    <ProfileSegmentedControlItem name={'list'} text={strings.list}
                                                 isSelected={this.state.selectedIndex === 0}
                                                 action={this._onPressList}/>
                    <ProfileSegmentedControlItem name={'map'} text={strings.map}
                                                 isSelected={this.state.selectedIndex === 1}
                                                 action={this._onPressMap}/>
                </View>
                {
                    this.state.selectedIndex === 0 &&
                    <FlatList
                        data={eatingOutObservations}
                        renderItem={({item}) => <EatingOutListComponent observationList={item} {...this.props}/>}
                        ListEmptyComponent={() => <Text style={[styles.containerPadding, styles.textStandardDark]}>{strings.noEatingOut}</Text>}
                        ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                        keyExtractor={this._keyExtractor}
                    />
                }
                {
                    this.state.selectedIndex === 1 &&
                    <MapView style={{flex: 1}}
                             initialRegion={{
                                 latitude: this.state.userlocation ? this.state.userlocation.latitude : this.state.observations[0].location.latitude,
                                 longitude: this.state.userlocation ? this.state.userlocation.longitude : this.state.observations[0].location.longitude,
                                 latitudeDelta: 1,
                                 longitudeDelta: 1,
                             }}
                             showsCompass={true}
                             showsScale={true}
                             showsUserLocation={true}
                             showsMyLocationButton={true}
                             showsIndoors={false}
                             showsBuildings={false}
                             showsTraffic={false}
                    >
                        {this.state.observations.map(obs => (
                            <MapView.Marker
                                coordinate={{
                                    latitude: obs.location.latitude,
                                    longitude: obs.location.longitude
                                }}
                                title={obs.location.name}
                                description={obs.description}
                                key={obs.observationid}
                            />
                        ))}
                    </MapView>
                }

            </View>
        );
    }
}
