import React from 'react';
import {FlatList, Platform, TouchableOpacity, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from '../Components/NavBarButton';
import strings from '../strings';
import {EatingOutListComponent} from '../Components/EatingOutListComponent';
import Permissions from 'react-native-permissions';
import firebase from 'react-native-firebase';
import {
    colorAccent,
    colorBackground,
    iconList,
    iconMap,
    iconSizeStandard,
    navigateToScreen
} from '../Constants/Constants';
import {LogInMessage} from '../Components/LogInMessage';
import {MapMarkerComponent} from '../Components/MapMarkerComponent';
import {EmptyComponent} from '../Components/EmptyComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import {_checkInternetConnection} from '../App';
import {getActions, getObservation, sortArrayByTimestamp} from '../Helpers/FirebaseHelper';

export const NO_LOCATION = 'noLocation';
export const FURTHER_AWAY = 'furtherAway';
const ScreensEnum = Object.freeze({LIST:1, MAP:2});
const initialState = {
    selectedIndex: ScreensEnum.MAP,
    observationsList: [],
    observations: [],
    user: null,
    userlocation: null,
    isRefreshing: false,
    emptyListMessage: strings.loading,
    cannotLoad: false,
};

export class EatingOutListScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            title: strings.eatingOutList + ' ',
            headerLeft: (
                <NavBarProfileButton nav={navigation} action={() => params.onProfilePressed()}/>
            ),
            headerRight: (
                <NavBarCreateObsButton nav={navigation} action={() => params.onCreateObsPressed()}/>
            ),
        }
    };

    constructor() {
        super();

        this.unsubscriber = null;
        this.state = initialState;
        this._onPressList = this._onPressList.bind(this);
        this._onPressMap = this._onPressMap.bind(this);
        this._getEatingOutObservations = this._getEatingOutObservations.bind(this);
        this._getDistanceFromLatLonInKm = this._getDistanceFromLatLonInKm.bind(this);
        this._onNavBarButtonPressed = this._onNavBarButtonPressed.bind(this);
        this._setEmptyMessage = this._setEmptyMessage.bind(this);
        this._checkInternetConnectionAndStart = this._checkInternetConnectionAndStart.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onProfilePressed: (() => this._onNavBarButtonPressed(true)),
            onCreateObsPressed: this._onNavBarButtonPressed,
        });
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            // Reset page info
            let resetState = initialState;
            resetState.user = user;
            this.setState(resetState, () => {
                if (!user) {
                    // Do nothing
                } else {
                    this._checkInternetConnectionAndStart();
                }
            });
        });
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    _onNavBarButtonPressed(isProfile) {
        if (this.state.user && !this.state.user.isAnonymous) {
            if (isProfile) {
                let params = {};
                params.myProfile = true;
                navigateToScreen('MyProfile', this.props.navigation, params);
            } else {
                navigateToScreen('CreateObservation', this.props.navigation);
            }
        } else {
            navigateToScreen('SignUpLogIn', this.props.navigation);
        }
    }

    _checkInternetConnectionAndStart() {
        _checkInternetConnection(() => {
            if (Platform.OS === 'android' && Platform.Version < 23) {
                // Do not check permission pre-Marshmallow
                this._getEatingOutObservations();
            } else {
                Permissions.request('location').then(response => {
                    this.setState({locationPermission: response});
                    if (response === 'authorized') {
                        navigator.geolocation.getCurrentPosition((position) => {
                            this.setState({userlocation: position.coords}, () => this._getEatingOutObservations());
                        }).catch((error) => {
                            console.log('Error while getting user location');
                            console.log(error);
                            this._getEatingOutObservations();
                        });
                    } else {
                        this._getEatingOutObservations();
                    }
                }).catch((error) => {
                    console.log('Error while requesting location permission');
                    console.log(error);
                    this._getEatingOutObservations();
                });
            }
        }, () => this._setEmptyMessage(strings.noInternet, true));
    }

    _getEatingOutObservations() {
        const _getDistanceFromLatLonInKm = this._getDistanceFromLatLonInKm;
        const curState = this.state;

        this._setEmptyMessage(strings.loading, false);

        // TODO [FEATURE]: Get cutleries more fficiently
        getActions()
            .then((dataSnapshot) => {
                let observations = [];
                let asyncWorkers = [];
                dataSnapshot.forEach(function (userIdSnapshot) {
                    const userid = userIdSnapshot.key;
                    if (userid !== curState.user.uid) {
                        userIdSnapshot.forEach(function (obsIdSnapshot) {
                            const obsid = obsIdSnapshot.key;
                            const actions = obsIdSnapshot.toJSON();
                            if (actions.cutleries && actions.cutleries[curState.user.uid]) {
                                const promise = new Promise(function (resolve, reject) {
                                    getObservation(userid, obsid)
                                        .then((observation) => {
                                            if (curState.locationPermission && curState.userlocation) {
                                                observation.distance = _getDistanceFromLatLonInKm(observation);
                                            }
                                            observations.push(observation);
                                            resolve();
                                        }).catch((error) => {
                                            console.log(error);
                                            reject(error);
                                        }
                                    );
                                });
                                asyncWorkers.push(promise);
                            }
                        });
                    }
                });

                Promise.all(asyncWorkers).then(() => {
                    let observationsList = [];

                    if (curState.userlocation) {
                        observations.sort(function(a,b) {
                            if (a.distance < b.distance)
                                return -1;
                            if (a.distance > b.distance)
                                return 1;
                            return 0;
                        });

                        // Put observations in different arrays according to how far away from user they are
                        const distances = [1, 2, 5, 10];
                        let currentObs = [];
                        let distanceCount = 0;

                        for (let i = 0; i < observations.length; i++) {
                            let observation = observations[i];
                            if (observation.distance <= distances[distanceCount]) {
                                currentObs.push(observation);
                            } else {
                                observationsList.push({distance: distances[distanceCount], observations:currentObs});
                                currentObs = [];
                                distanceCount++;

                                if (distanceCount === distances.length) {
                                    currentObs = observations.slice(i, observations.length);
                                    observationsList.push({distance: FURTHER_AWAY, observations:currentObs});
                                    break;
                                } else {
                                    i--;
                                }
                            }
                        }
                    } else {
                        sortArrayByTimestamp(observations);
                        observationsList.push({distance: NO_LOCATION, observations:observations});
                    }

                    this.setState({
                        observations: observations,
                        observationsList: observationsList,
                    });
                    this._setEmptyMessage(strings.noEatingOutList, false);
                }).catch(
                    (error) => {
                        console.log('Error while retrieving observations in Eating Out');
                        console.log(error);
                    }
                );
            }).catch((error) => {
                console.log('Error while retrieving observations ids saved as Eating Out');
                console.log(error);
            }
        );
    }

    _getDistanceFromLatLonInKm(observation) {
        if(observation.location) {
            const lat1 = observation.location.latitude;
            const lon1 = observation.location.longitude;
            const lat2 = this.state.userlocation.latitude;
            const lon2 = this.state.userlocation.longitude;
            const R = 6371;
            let dLat = EatingOutListScreen._deg2rad(lat2 - lat1);
            let dLon = EatingOutListScreen._deg2rad(lon2 - lon1);
            let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(EatingOutListScreen._deg2rad(lat1)) *
                Math.cos(EatingOutListScreen._deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c;
            return d;
        } else {
            return 100000000;
        }
    }

    static _deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    _setEmptyMessage(message, cannotLoad) {
        this.setState({
            emptyListMessage: message,
            cannotLoad: cannotLoad
        });
    }

    _onPressList() {
        this.setState({selectedIndex: ScreensEnum.LIST});
    }

    _onPressMap() {
        this.setState({selectedIndex: ScreensEnum.MAP});
    }

    _keyExtractor = (item) => item.distance.toString();

    render() {
        let location = this.state.userlocation;
        if (!location && this.state.observations) {
            for (let i = 0; i < this.state.observations.length; i++) {
                const obs = this.state.observations[i];
                if (obs.location) {
                    location = obs.location;
                    break;
                }
            }
        }

        return (
            <View style={{flex:1}}>
                {
                    this.state.user && !this.state.user.isAnonymous &&
                    <View style={{ flex: 1 }}>
                        {
                            (!this.state.observations || this.state.observations.length === 0) &&
                            <EmptyComponent message={this.state.emptyListMessage} retry={this.state.cannotLoad && this._checkInternetConnectionAndStart}/>
                        }
                        {
                            (this.state.observations &&  this.state.observations.length > 0) &&
                            <View style={{ flex: 1 }}>
                                {
                                    (this.state.selectedIndex === ScreensEnum.LIST || !location) &&
                                    <FlatList
                                        data={this.state.observationsList}
                                        renderItem={({item}) => item.observations.length > 0 ? <EatingOutListComponent observationsList={item} {...this.props}/> : <View style={{backgroundColor: 'red'}}/>}
                                        keyExtractor={this._keyExtractor}
                                        removeClippedSubviews={true}
                                        onRefresh={this._getEatingOutObservations}
                                        refreshing={this.state.isRefreshing}
                                    />
                                }
                                {
                                    this.state.selectedIndex === ScreensEnum.MAP && location &&
                                    <MapboxGL.MapView
                                        style={{flex: 1}}
                                        centerCoordinate={[location.longitude, location.latitude]}
                                        compassEnabled={true}
                                        showUserLocation={true}
                                        zoomEnabled={true}
                                        localizeLabels={true}
                                    >
                                        {this.state.observations && this.state.observations.map(obs => (
                                            obs.location && <MapMarkerComponent observation={obs} key={obs.observationid}/>
                                        ))}
                                    </MapboxGL.MapView>
                                }
                                <TouchableOpacity name={'actionbutton'} onPress={this.state.selectedIndex === ScreensEnum.MAP ? this._onPressList : this._onPressMap} style={[this.state.selectedIndex === ScreensEnum.MAP ? {top: 10, left: 10} : {top: 10, right: 10}, {width: 60, height: 60, borderRadius: 30, backgroundColor: colorAccent, position: 'absolute', alignItems:'center', justifyContent:'center'}]}>
                                    <FontAwesome name={this.state.selectedIndex === ScreensEnum.MAP ? iconList : iconMap}  size={iconSizeStandard} color={colorBackground} />
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                }
                {
                    !this.state.user || this.state.user.isAnonymous &&
                    <LogInMessage style={{flex:1}}/>
                }
            </View>
        );
    }
}

