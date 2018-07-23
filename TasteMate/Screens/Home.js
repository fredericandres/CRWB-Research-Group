import React from 'react';
import {FlatList, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import {ObservationComponent} from "../Components/ObservationComponent";
import styles from "../styles";
import strings from "../strings";
import firebase from 'react-native-firebase';
import {_navigateToScreen, _sortArrayByTimestamp, pathFollow} from "../constants/Constants";
import {LogInMessage} from "../Components/LogInMessage";
import {EmptyComponent} from "../Components/EmptyComponent";

const OBS_LOAD_DEPTH = 4;
const initialState ={
    observations: [],
    user: null,
    isRefreshing: false,
    emptyListMessage: strings.loading
};

// TODO [FEATURE]: Scroll to top of list when clicking on tastemate logo

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
        this._setEmptyMessage = this._setEmptyMessage.bind(this);
        this._handleError = this._handleError.bind(this);

        this.unsubscriber = null;
        this.state = initialState;
        this.followees = null;
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

        if (this.followees && !isRefreshing) {
            this._loadObservations(onStartup, isRefreshing);
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
                    this.followees = followees;
                    _loadObservations(onStartup, isRefreshing);
                },
                (error) => {
                    console.log('Error while retrieving followees');
                    this._handleError(error);
                }
            );
        }
    }

    _loadObservations(onStartup, isRefreshing) {
        const obsSize = this.state.observations.length;
        if (!this.isLoadingObservations && (obsSize === 0 || obsSize % OBS_LOAD_DEPTH === 0 || isRefreshing)) {
            if (isRefreshing) {
                this.setState({
                    observations: [],
                    emptyListMessage: strings.loading
                });
            }
            const index = isRefreshing ? 0 : this.state.observations.length;

            console.log('Loading observations... Starting at ' + index + ' to ' + (index + OBS_LOAD_DEPTH));
            this.isLoadingObservations = true;

            const httpsCallable = firebase.functions().httpsCallable('getXMostRecentFeedObsForUsers');
            httpsCallable({
                users: this.followees,
                from: index,
                to: index + OBS_LOAD_DEPTH
            }).then(({data}) => {
                console.log('Observations successfully retrieved');
                this.isLoadingObservations = false;
                this._addToObservationState(data.observations, onStartup, isRefreshing);
            }).catch(httpsError => {
                console.log(httpsError.code);
                console.log(httpsError.message);
                this._handleError(httpsError);
                this.isLoadingObservations = false;
            })
        }
    }

    _handleError(error){
        console.log(error);
        this._setEmptyMessage(strings.errorOccurred);
    }

    _setEmptyMessage(message) {
        this.setState({emptyListMessage: message});
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
        this._setEmptyMessage(strings.emptyFeed);
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
                    <View style={{flex:1}}>
                        {
                            this.state.observations.length === 0 && <EmptyComponent message={this.state.emptyListMessage}/>
                        }
                        {
                            this.state.observations.length > 0 &&
                            <FlatList
                                data={this.state.observations}
                                keyExtractor={this._keyExtractor}
                                renderItem={({item}) => <ObservationComponent observation={item} {...this.props} onDelete={this._onDelete}/>}
                                ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh}
                                onEndReached={this._onEndReached}
                            />
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
// TODO [FEATURE]: empty list component with suggestions for followees/observations