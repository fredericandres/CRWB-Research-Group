import React from 'react';
import {FlatList, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import {NotificationComponent} from "../Components/NotificationComponent";
import {LogInMessage} from "../Components/LogInMessage";
import {
    _navigateToScreen,
    _sortArrayByTimestamp,
    ActivityEnum,
    pathNotifications,
    pathObservations,
    pathUsers
} from "../constants/Constants";
import firebase from 'react-native-firebase';
import strings from "../strings";
import {EmptyComponent} from "../Components/EmptyComponent";

const NTF_LOAD_DEPTH = 15;
const initialState = {
    user: null,
    notifications: [],
    notificationsAll: [],
    users: {},
    observations: {},
    isRefreshing: false,
    emptyListMessage: strings.loading
};

// TODO [FEATURE]: push notifications
// TODO [FEATURE]: Group multiple notifications of same type together if no other type in between

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
        this.isLoadingNotifications = false;
    }

    //TODO: Fix onEndReached loading and loading until all notifications have been loaded

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
        const ntfSize = this.state.notificationsAll.length;
        if (!this.isLoadingNotifications && (ntfSize === 0 || ntfSize % NTF_LOAD_DEPTH === 0 || isRefreshing)) {
            if (isRefreshing) {
                this.setState({
                    notifications: [],
                    emptyListMessage: strings.loading
                });
            }

            this.isLoadingObservations = true;

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
                    this.isLoadingObservations = false;
                }).catch((error) => {
                    console.log('Error while retrieving notifications');
                    _handleError(error);
                    this.isLoadingObservations = false;
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
        let newNotifs = [];
        if (notifications && notifications.length > 0) {
            _sortArrayByTimestamp(notifications);

            let currentGroup = {};
            for (let i = 0; i < notifications.length; i++) {
                const notification = notifications[i];

                const follow = notification.type === ActivityEnum.FOLLOW;
                const other = !follow && notification.observationid === currentGroup.observationid;

                if (Object.keys(currentGroup).length === 0) {
                    currentGroup = notification;
                    currentGroup.users = [notification.userid];
                    //delete currentGroup.userid;
                } else if (currentGroup.type === notification.type && (follow || other)) {
                    if (!currentGroup.users.includes(notification.userid)) {
                        currentGroup.users.push(notification.userid);
                    }
                } else {
                    newNotifs.push(currentGroup);
                    currentGroup = {};
                    i -= 1;
                }
            }
            newNotifs.push(currentGroup);
        }
        this.setState({
            isRefreshing: false,
            notifications: newNotifs,
            notificationsAll: notifications
        });
        this._setEmptyMessage(strings.noNotifications);
    }

    _addUserToState(user, userid) {
        if (user) {
            let users = this.state.users;
            users[user.userid || userid] = user;
            this.setState({users: users});
        }
    }

    _addObservationToState(observation, observationid) {
        if (observation) {
            let observations = this.state.observations;
            observations[observation.observationid || observationid] = observation;
            this.setState({observations: observations});
        }
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
                    <View style={{flex:1}}>
                        {
                            this.state.notifications.length === 0 && <EmptyComponent message={this.state.emptyListMessage}/>
                        }
                        {
                            this.state.notifications.length > 0 &&
                            <FlatList
                                data={this.state.notifications}
                                extraData={this.state}
                                renderItem={({item}) =>
                                    <NotificationComponent notification={item}
                                                           users={this.state.users}
                                                           observation={this.state.observations[item.observationid]} {...this.props}/>
                                }
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh}
                                keyExtractor={this._keyExtractor}
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
