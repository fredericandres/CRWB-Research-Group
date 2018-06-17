import React from 'react';
import {FlatList, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import styles from "../styles";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import strings from "../strings";
import {SearchBar} from "../Components/SearchBar";
import {_navigateToScreen, brandMain} from "../constants/Constants";
import firebase from 'react-native-firebase';

const numColumns = 3;
const OBS_LOAD_DEPTH = 12;

export class SearchExploreScreen extends React.Component {
    static navigationOptions = ({navigation})=> {
        const {params = {}} = navigation.state;
        return {
            title: strings.explore + ' ',
            headerLeft: (
                <NavBarProfileButton nav={navigation} action={() => params.onProfilePressed()}/>
            ),
            headerRight: (
                <NavBarCreateObsButton nav={navigation} action={() => params.onCreateObsPressed()}/>
            ),
            headerStyle: {
                borderBottomWidth: 0,
                backgroundColor: brandMain,
                elevation: 0,
            },
        }
    };

    constructor() {
        super();

        this._addToObservationState = this._addToObservationState.bind(this);
        this._onEndReached = this._onEndReached.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._loadObservations = this._loadObservations.bind(this);
        this._onNavBarButtonPressed = this._onNavBarButtonPressed.bind(this);

        this.unsubscriber = null;
        this.state = {
            user: null,
            isRefreshing: false,
            observations: []
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onProfilePressed: (() => this._onNavBarButtonPressed(true)),
            onCreateObsPressed: this._onNavBarButtonPressed,
        });
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            // Reset page info
            this.setState({
                user: user,
                observations: [],
            }, () => {
                if (!user) {
                    // Do nothing
                } else {
                    this._loadObservations(true, false);
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
                _navigateToScreen('MyProfile', this.props.navigation, params);
            } else {
                _navigateToScreen('CreateObservation', this.props.navigation);
            }
        } else {
            _navigateToScreen('SignUpLogIn', this.props.navigation);
        }
    }

    _loadObservations(onStartup, isRefreshing) {
        const obsSize = this.state.observations.length;
        if (!this.isLoadingObservations && (obsSize === 0 || obsSize % OBS_LOAD_DEPTH === 0 || isRefreshing)) {
            const index = isRefreshing ? 0 : this.state.observations.length;

            console.log('Loading observations... Starting at ' + index + ' to ' + (index + OBS_LOAD_DEPTH));
            this.isLoadingObservations = true;

            const httpsCallable = firebase.functions().httpsCallable('getXMostRecentObs');
            httpsCallable({
                from: index,
                to: index + OBS_LOAD_DEPTH
            }).then(({data}) => {
                console.log('Observations successfully retrieved');
                this.isLoadingObservations = false;
                this._addToObservationState(data.observations, onStartup, isRefreshing);
            }).catch(httpsError => {
                console.log(httpsError.code);
                console.log(httpsError.message);
                this.isLoadingObservations = false;
            })
        }
    }

    _addToObservationState(observations, onStartup, isRefreshing) {
        observations.sort(function(a,b) {
            if (a.timestamp < b.timestamp)
                return 1;
            if (a.timestamp > b.timestamp)
                return -1;
            return 0;
        });

        if (observations && observations.length > 0) {
            observations.sort(function (a, b) {
                if (a.timestamp < b.timestamp)
                    return 1;
                if (a.timestamp > b.timestamp)
                    return -1;
                return 0;
            });

            if (onStartup || isRefreshing) {
                this.setState({observations: observations, isRefreshing: false});
            } else {
                this.setState(prevState => ({observations: prevState.observations.concat(observations), isRefreshing: false}));
            }
        }
    }

    _onRefresh() {
        console.log('Refreshing...');
        this.setState({isRefreshing: true});
        this._loadObservations(false, true);
    }

    _onEndReached() {
        console.log('Loading more observations...');
        this._loadObservations(false, false);
    }

    _onPressSearchButton() {
        // TODO: search for matching posts
    }

    _keyExtractor = (item, index) => item.observationid;

    render() {
        return (
            <View name={'wrapper'} style={{flex:1}}>
                <SearchBar placeholder={strings.foodCraving} onSubmitEditing={this._onPressSearchButton} onChangeText={this._onPressSearchButton} onPress={this._onPressSearchButton}/>
                <View style={[{flex:1}, styles.explorePadding]}>
                    <FlatList
                        keyExtractor={this._keyExtractor}
                        data={this.state.observations}
                        renderItem={({item}) => <ObservationExploreComponent observation={item} {...this.props}/>}
                        numColumns={numColumns}
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this._onEndReached}
                    />
                </View>
            </View>
        );
    }
}
