import React from 'react';
import {FlatList, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import {NotificationComponent} from "../Components/NotificationComponent";
import {LogInMessage} from "../Components/LogInMessage";
import {
    _navigateToScreen,
    _sortArrayByTimestamp,
    pathNotifications,
    pathObservations,
    pathUsers
} from "../constants/Constants";
import firebase from 'react-native-firebase';
import strings from "../strings";
import {EmptyComponent} from "../Components/EmptyComponent";

const NTF_LOAD_DEPTH = 10;
const initialState = {
    user: null,
    notifications: [],
    users: [],
    observations: [],
    isRefreshing: false,
    emptyListMessage: strings.loading
};

export class NotificationsScreen extends React.Component {
    static navigationOptions = ({navigation})=> {
        const {params = {}} = navigation.state;
        return {
            title: strings.notifications + ' ',
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

        this._addUserToState = this._addUserToState.bind(this);
        this._addObservationToState = this._addObservationToState.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._onEndReached = this._onEndReached.bind(this);
        this._loadNotifications = this._loadNotifications.bind(this);
        this._onNavBarButtonPressed = this._onNavBarButtonPressed.bind(this);
        this._setEmptyMessage = this._setEmptyMessage.bind(this);
        this._handleError = this._handleError.bind(this);

        this.unsubscriber = null;
        this.state = initialState;
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
                    this._loadNotifications(user.uid, true, false);
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

    _loadNotifications(userid, onStartup, isRefreshing) {
        const ntfSize = this.state.notifications.length;
        if (ntfSize === 0 || ntfSize % NTF_LOAD_DEPTH === 0 || isRefreshing) {
            const _addUserAction = this._addUserToState;
            const _addObservationAction = this._addObservationToState;
            const _handleError = this._handleError;

            const currentState = this.state;
            const index = (isRefreshing ? 0 : ntfSize) + NTF_LOAD_DEPTH;

            console.log('Loading notifications...');
            const refNotifications = firebase.database().ref(pathNotifications).child(userid).orderByChild('timestamp').limitToLast(index);
            refNotifications.once('value')
                .then((dataSnapshot) => {
                    console.log('Notifications successfully retrieved');
                    let notifications = dataSnapshot.toJSON() ? Object.values(dataSnapshot.toJSON()) : [];
                    this._addToNotificationState(notifications, onStartup, isRefreshing);

                    let iteratedUsers = [];
                    let iteratedObservations = [];
                    dataSnapshot.forEach(function (childSnapshot) {
                        const notification = childSnapshot.toJSON();

                        // Load username of notification sender
                        if (!iteratedUsers[notification.userid] && (!currentState.users[notification.userid])) {
                            iteratedUsers[notification.userid] = true;
                            firebase.database().ref(pathUsers).child(notification.userid).once('value')
                                .then((dataSnapshot) => {
                                    console.log('User successfully retrieved');
                                    _addUserAction(dataSnapshot ? dataSnapshot.toJSON() : null, notification.userid);
                                }).catch((error) => {
                                    console.log('Error while retrieving user');
                                    _handleError(error);
                                }
                            );
                        }

                        // Set read status to true
                        if (!notification.read) {
                            firebase.database().ref(pathNotifications).child(userid).child(childSnapshot.key).update({
                                read: true,
                            }).then(() => {
                                console.log('Successfully added read to notification on DB.');
                            }).catch((error) => {
                                console.log('Error during read notification transmission.');
                                _handleError(error);
                            });
                        }

                        // Load observation
                        if (notification.observationid && !iteratedObservations[notification.observationid] && (!currentState.observations[notification.observationid])) {
                            iteratedObservations[notification.observationid] = true;
                            firebase.database().ref(pathObservations).child(userid).child(notification.observationid).once('value')
                                .then((dataSnapshot) => {
                                    console.log('Observation successfully retrieved');
                                    const observation = dataSnapshot.toJSON();
                                    if (observation) {
                                        _addObservationAction(observation, notification.observationid);
                                    }
                                }).catch((error) => {
                                    console.log('Error while retrieving Observation');
                                    _handleError(error);
                                }
                            );
                        }
                    });
                }).catch((error) => {
                    console.log('Error while retrieving notifications');
                    _handleError(error);
                }
            );
        }
    }

    _handleError(error){
        console.log(error);
        this._setEmptyMessage(strings.errorOccurred);
    }

    _setEmptyMessage(message) {
        this.setState({emptyListMessage: message});
    }

    _addToNotificationState(notifications) {
        if (notifications && notifications.length > 0) {
            _sortArrayByTimestamp(notifications);
        }
        this.setState({
            isRefreshing: false,
            notifications: notifications,
        });
        this._setEmptyMessage(strings.noNotifications);
    }

    _addUserToState(user, userid) {
        let users = this.state.users;
        users[userid] = user;
        this.setState({users: users});
    }

    _addObservationToState(observation, observationid) {
        let observations = this.state.observations;
        observations[observationid] = observation;
        this.setState({observations: observations});
    }

    _onRefresh() {
        console.log('Refreshing...');
        this.setState({isRefreshing: true});
        this._loadNotifications(this.state.user.uid, false, true);
    }

    _onEndReached() {
        console.log('Loading more notifications...');
        this._loadNotifications(this.state.user.uid, false, false);
    }

    _keyExtractor = (item, index) => item.userid + item.type + item.timestamp + item.observationid;

    render() {
        return (
            <View style={{flex:1}}>
                {
                    this.state.user && !this.state.user.isAnonymous &&
                    <FlatList
                        removeClippedSubviews={true}
                        data={this.state.notifications}
                        renderItem={({item}) => <NotificationComponent notification={item} user={this.state.users[item.userid]} observation={this.state.observations[item.observationid]} {...this.props}/>}
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh}
                        ListEmptyComponent={() => <EmptyComponent message={this.state.emptyListMessage}/>}
                        keyExtractor={this._keyExtractor}
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
