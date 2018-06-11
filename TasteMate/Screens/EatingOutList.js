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
import firebase from 'react-native-firebase';
import {_navigateToScreen} from "../constants/Constants";
import {LogInMessage} from "../Components/LogInMessage";

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

        this.unsubscriber = null;
        this.state = {
            selectedIndex: 0,
            observations: observations,
            user: null
        };
        this._onPressList = this._onPressList.bind(this);
        this._onPressMap = this._onPressMap.bind(this);
    }

    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            // Reset page info
            this.setState({
                user: user,
                selectedIndex: 0,
                observations: observations
            }, () => {
                if (!user) {
                    // Open SingUpLogIn screen if no account associated (not even anonymous)
                    _navigateToScreen('SignUpLogIn', this.props.navigation);
                } else {
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
                    })                }
            });
        });
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    _onPressList() {
        this.setState({selectedIndex: 0});
    }

    _onPressMap() {
        this.setState({selectedIndex: 1});
    }

    _keyExtractor = (item, index) => item.id;

    render() {
        return (
            <View style={{flex:1}}>
                {
                    this.state.user && !this.state.user.isAnonymous &&
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
                                     userLocationAnnotationTitle={''}
                            >
                                {this.state.observations.map(obs => (
                                    <MapView.Marker
                                        coordinate={{
                                            latitude: obs.location.latitude,
                                            longitude: obs.location.longitude
                                        }}
                                        title={obs.dishname}
                                        description={obs.description}
                                        key={obs.observationid}
                                    />
                                ))}
                            </MapView>
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
