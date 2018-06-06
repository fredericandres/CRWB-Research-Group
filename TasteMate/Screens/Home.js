import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import {ObservationComponent} from "../Components/ObservationComponent";
import styles from "../styles";
import strings from "../strings";
import firebase from 'react-native-firebase';
import {_navigateToScreen, pathObservations} from "../constants/Constants";
import {LogInMessage} from "../Components/LogInMessage";

const FEED_LOAD_DEPTH = 3.6e6;
const FEED_LOAD_DEPTH_SIMPLE = 2;
const APP_BEGINNING_UNIX = 1528153200000;

export class HomeScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: 'Tastemate',
        headerLeft: (
            <NavBarProfileButton nav={navigation}/>
        ),
        headerRight: (
            <NavBarCreateObsButton nav={navigation}/>
        ),
    });

    constructor() {
        super();

        this._addToObservationState = this._addToObservationState.bind(this);
        this._loadMoreObservations = this._loadMoreObservations.bind(this);
        this._onEndReached = this._onEndReached.bind(this);
        this._onRefresh = this._onRefresh.bind(this);

        this.unsubscriber = null;
        this.state = {
            observations: null,
            followees: null,
            user: null,
            noMoreObservations: false,
            isRefreshing: false
        };
        this.loadDepthSimple = FEED_LOAD_DEPTH_SIMPLE;

        // TODO: Load profile pics
        // TODO: Load Food pics
        // TODO: Load comments
    }

    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                // Open SingUpLogIn screen if no account associated (not even anonymous)
                _navigateToScreen('SignUpLogIn', this.props.navigation);
            } else {
                this.setState({user: user});
                this._loadObservationFeed(this._addToObservationState, false);
            }
        });
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    _loadObservationFeed(action, isRefreshing) {
        const _loadObservations = this._loadObservations;
        _loadObservations(null, action, this.state.observations, this.loadDepthSimple, isRefreshing);
    }

    _loadObservations(followees, action, oldObservations, loadDepth, isRefreshing) {
        console.log('Loading observations...');
        const refObservations = firebase.database().ref(pathObservations).orderByChild('timestamp').limitToLast(loadDepth);
        refObservations.once(
            'value',
            (dataSnapshot) => {
                const observations = dataSnapshot.toJSON();
                console.log(observations);
                console.log(oldObservations);
                if (!isRefreshing && (!observations || (oldObservations && oldObservations.length === Object.values(observations).length))) {
                    console.log('No more observations available');
                    this.noMoreObservations = true;
                } else {
                    action(observations);
                }
            },
            (error) => {
                console.error('Error while retrieving observations in feed');
                console.error(error);
            }
        );
    }

    _addToObservationState(newObservations) {
        let observations = newObservations ? Object.values(newObservations) : null;

        observations.sort(function(a,b) {
            if (a.timestamp < b.timestamp)
                return 1;
            if (a.timestamp > b.timestamp)
                return -1;
            return 0;
        });

        this.setState({observations: observations, isRefreshing: false});
    }

    _loadMoreObservations() {
        this.loadDepthSimple += FEED_LOAD_DEPTH_SIMPLE;
        if (!this.noMoreObservations) {
            this._loadObservationFeed(this._addToObservationState, false);
        }
    }

    _onRefresh() {
        console.log('Refreshing...');
        this.setState({isRefreshing: true});
        this._loadObservationFeed(this._addToObservationState, true);
    }

    _onEndReached() {
        console.log('Loading more...');
        this._loadMoreObservations();
    }

    _keyExtractor = (item, index) => this.state.observations[index].userid + this.state.observations[index].timestamp;

    render() {
        return (
            <View style={{flex:1}}>
                {
                    this.state.user && !this.state.user.isAnonymous &&
                    <FlatList
                        data={this.state.observations}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item}) => <ObservationComponent observation={item} {...this.props}/>}
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh}
                        ListEmptyComponent={() => <Text style={[styles.containerPadding, styles.textStandardDark]}>{strings.emptyFeed}</Text>}
                        ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                        onEndReached={this._onEndReached}
                    />
                }
                {
                    !this.state.user || this.state.user.isAnonymous &&
                    <LogInMessage style={{flex:1}}/>
                }
            </View>
        );
    }
}
// TODO [FEATURE]: empty list component with suggestions for followees/observations
