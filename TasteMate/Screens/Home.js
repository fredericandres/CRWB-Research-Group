import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import {ObservationComponent} from "../Components/ObservationComponent";
import styles from "../styles";
import strings from "../strings";
import firebase from 'react-native-firebase';
import {_navigateToScreen, _sortArrayByTimestamp, pathFollow} from "../constants/Constants";
import {LogInMessage} from "../Components/LogInMessage";
import {EmptyComponent} from "../Components/EmptyComponent";

const OBS_LOAD_DEPTH = 4;

export class HomeScreen extends React.Component {
    static navigationOptions = ({navigation})=> {
        const {params = {}} = navigation.state;
        return {
            title: 'Tastemate ',
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

        this._addToObservationState = this._addToObservationState.bind(this);
        this._onEndReached = this._onEndReached.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._onDelete = this._onDelete.bind(this);
        this._onCreate = this._onCreate.bind(this);
        this._loadObservations = this._loadObservations.bind(this);
        this._onNavBarButtonPressed = this._onNavBarButtonPressed.bind(this);

        this.unsubscriber = null;
        this.state = {
            observations: [],
            followees: null,
            user: null,
            noMoreObservations: false,
            isRefreshing: false
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
                followees: null
            }, () => {
                if (!user) {
                    // Open SingUpLogIn screen if no account associated (not even anonymous)
                    _navigateToScreen('SignUpLogIn', this.props.navigation);
                } else {
                    this._loadObservationFeed(user.uid, true, false);
                }
            });
        });
    }

    _onNavBarButtonPressed(isProfile) {
        if (this.state.user && !this.state.user.isAnonymous) {
            if (isProfile) {
                let params = {};
                params.myProfile = true;
                _navigateToScreen('MyProfile', this.props.navigation, params);
            } else {
                let params = {};
                params.onCreate = this._onCreate;
                _navigateToScreen('CreateObservation', this.props.navigation, params);
            }
        } else {
            _navigateToScreen('SignUpLogIn', this.props.navigation);
        }
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    _loadObservationFeed(userid, onStartup, isRefreshing) {
        const _loadObservations = this._loadObservations;

        if (this.state.followees && !isRefreshing) {
            this._loadObservations(this.state.followees, onStartup, isRefreshing);
        } else {
            console.log('Loading people the current user follows...');
            const refFollowees = firebase.database().ref(pathFollow).orderByChild('follower').equalTo(userid);
            refFollowees.once(
                'value',
                (dataSnapshot) => {
                    console.log('Followees successfully retrieved');
                    let followees = [userid];
                    dataSnapshot.forEach(function (childSnapshot) {
                        followees.push(childSnapshot.toJSON().followee);
                    });
                    this.setState({followees: followees});
                    _loadObservations(followees, onStartup, isRefreshing);
                },
                (error) => {
                    console.error('Error while retrieving followees');
                    console.error(error);
                }
            );
        }
    }

    _loadObservations(followees, onStartup, isRefreshing) {
        const obsSize = this.state.observations.length;
        if (!this.isLoadingObservations && (obsSize === 0 || obsSize % OBS_LOAD_DEPTH === 0 || isRefreshing)) {
            const index = isRefreshing ? 0 : this.state.observations.length;

            console.log('Loading observations... Starting at ' + index + ' to ' + (index + OBS_LOAD_DEPTH));
            this.isLoadingObservations = true;

            const httpsCallable = firebase.functions().httpsCallable('getXMostRecentFeedObsForUsers');
            httpsCallable({
                users: followees,
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
        if (observations && observations.length > 0) {
            _sortArrayByTimestamp(observations);

            if (onStartup || isRefreshing) {
                this.setState({observations: observations});
            } else {
                this.setState(prevState => ({observations: prevState.observations.concat(observations)}));
            }
        }
        this.setState({isRefreshing: false});
    }

    _onRefresh() {
        console.log('Refreshing...');
        this.setState({isRefreshing: true});
        this._loadObservationFeed(this.state.user.uid, false, true);
    }

    _onEndReached() {
        console.log('Loading more observations...');
        this._loadObservationFeed(this.state.user.uid, false, false);
    }

    _keyExtractor = (item, index) => this.state.observations[index].observationid;

    _onDelete(observation) {
        let array = [...this.state.observations];
        let index = array.indexOf(observation);
        array.splice(index, 1);
        this.setState({observations: array});
    }

    _onCreate(newObs) {
        this.setState((prevState) => ({observations: [newObs].concat(prevState.observations)}));
    }

    render() {
        return (
            <View style={{flex:1}}>
                {
                    this.state.user && !this.state.user.isAnonymous &&
                    <FlatList
                        removeClippedSubviews={true}
                        data={this.state.observations}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item}) => <ObservationComponent observation={item} {...this.props} onDelete={this._onDelete}/>}
                        ListEmptyComponent={() => <EmptyComponent message={strings.emptyFeed}/>}
                        ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh}
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