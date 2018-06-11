import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import {NotificationComponent} from "../Components/NotificationComponent";
import styles from "../styles";
import {LogInMessage} from "../Components/LogInMessage";
import {_navigateToScreen, pathNotifications, pathObservations, pathUsers} from "../constants/Constants";
import firebase from 'react-native-firebase';

const NTF_LOAD_DEPTH = 10;

export class NotificationsScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: 'Notifications',
        headerLeft: (
            <NavBarProfileButton nav={navigation}/>
        ),
        headerRight: (
            <NavBarCreateObsButton nav={navigation}/>
        ),
    });

    constructor() {
        super();

        this._addUserToState = this._addUserToState.bind(this);
        this._addObservationToState = this._addObservationToState.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._onEndReached = this._onEndReached.bind(this);
        this._loadNotifications = this._loadNotifications.bind(this);

        this.unsubscriber = null;
        this.state = {
            user: null,
            notifications: [],
            users: [],
            observations: {},
            isRefreshing: false
        };
    }

    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                // Open SingUpLogIn screen if no account associated (not even anonymous)
                _navigateToScreen('SignUpLogIn', this.props.navigation);
            } else {
                this.setState({user: user});

                this._loadNotifications(user.uid, true, false);
            }
        });
    }

    _loadNotifications(userid, onStartup, isRefreshing) {
        const ntfSize = this.state.notifications.length;
        if (ntfSize === 0 || ntfSize % NTF_LOAD_DEPTH === 0 || isRefreshing) {
            const _addUserAction = this._addUserToState;
            const _addObservationAction = this._addObservationToState;

            const currentState = this.state;
            const index = (isRefreshing ? 0 : ntfSize) + NTF_LOAD_DEPTH;

            console.log('Loading notifications...');
            const refNotifications = firebase.database().ref(pathNotifications + '/' + userid).orderByChild('timestamp').limitToLast(index);
            refNotifications.once(
                'value',
                (dataSnapshot) => {
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
                            firebase.database().ref(pathUsers + '/' + notification.userid).once(
                                'value',
                                (dataSnapshot) => {
                                    console.log('User successfully retrieved');
                                    _addUserAction(dataSnapshot ? dataSnapshot.toJSON() : null, notification.userid);
                                },
                                (error) => {
                                    console.error('Error while retrieving user');
                                    console.error(error);
                                }
                            )
                        }
                        // TODO: load user pic

                        // Set read status to true
                        if (!notification.read) {
                            firebase.database().ref(pathNotifications + '/' + userid + '/' + childSnapshot.key).update({
                                read: true,
                            }, (error) => {
                                if (error) {
                                    console.error('Error during read notification transmission.');
                                    console.error(error);
                                    this._handleAuthError(error);
                                } else {
                                    console.log('Successfully added read to notification on DB.');
                                }
                            });
                        }

                        // Load observation
                        if (!iteratedObservations[notification.observationid] && (!currentState.observations[notification.observationid])) {
                            iteratedObservations[notifications.observationid] = true;
                            firebase.database().ref(pathObservations + '/' + userid + '/' + notification.observationid).once(
                                'value',
                                (dataSnapshot) => {
                                    console.log('Observation successfully retrieved');
                                    _addObservationAction(dataSnapshot ? dataSnapshot.toJSON() : null, notification.observationid);
                                },
                                (error) => {
                                    console.error('Error while retrieving Observation');
                                    console.error(error);
                                }
                            )

                        }
                        // TODO: Load observation pic
                    });
                },
                (error) => {
                    console.error('Error while retrieving notifications');
                    console.error(error);
                }
            );
        }
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    _addToNotificationState(notifications) {
        if (notifications && notifications.length > 0) {
            notifications.sort(function (a, b) {
                if (a.timestamp < b.timestamp)
                    return 1;
                if (a.timestamp > b.timestamp)
                    return -1;
                return 0;
            });

            this.setState({notifications: notifications, isRefreshing: false});
        }
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
                    this.state.user && !this.state.user.isAnonymous &&<FlatList
                        data={this.state.notifications}
                        renderItem={({item}) => <NotificationComponent notification={item} user={this.state.users[item.userid]} observation={this.state.observations[item.observationid]} {...this.props}/>}
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh}
                        ListEmptyComponent={() => <Text style={styles.containerPadding}>Seems like you do not have any notifications yet.</Text>}
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
