import React from 'react';
import {FlatList, Keyboard, Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import {ObservationComponent} from "../Components/ObservationComponent";
import styles from "../styles";
import strings from "../strings";
import firebase from 'react-native-firebase';
import {
    _checkInternetConnection,
    _formatNumberWithString,
    _navigateToScreen,
    _sortArrayByTimestamp,
    ActivityEnum,
    colorBackground,
    colorContrast,
    iconFollow,
    iconSizeSmall,
    iconSizeStandard,
    iconUnfollow,
    pathFollow,
    pathObservations,
    pathUsers,
    ReactNavigationTabBarHeight
} from "../constants/Constants";
import {LogInMessage} from "../Components/LogInMessage";
import {EmptyComponent} from "../Components/EmptyComponent";
import RNSafeAreaGetter from "../SafeAreaGetter";
import {UserImageThumbnailComponent} from "../Components/UserImageThumbnailComponent";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {currentUser} from "../App";
import {_generateCombinedKey} from "./Profile";

const OBS_LOAD_DEPTH = 4;
const initialState ={
    observations: [],
    user: null,
    isRefreshing: false,
    emptyListMessage: strings.loading,
    keyboardHeight: 0,
    feedEmpty: false,
    feedEmptyUsers: [],
    feedEmptyObservations: {},
    feedEmptySelectedIndex: 0,
    feedEmptyFollowing: {},
};

// TODO [FEATURE]: Scroll to top of list when clicking on tastemate logo

export class HomeScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
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
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._loadFeedEmptyInfo = this._loadFeedEmptyInfo.bind(this);
        this._addObservationsToState = this._addObservationsToState.bind(this);
        this._addIsFollowingToState = this._addIsFollowingToState.bind(this);

        this.unsubscriber = null;
        this.state = initialState;
        this.followees = null;
        this.flatList = null;
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
        this.bottomOfList = false;
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
                console.log(user);
                if (!user) {
                    // Open SingUpLogIn screen if no account associated (not even anonymous)
                    _navigateToScreen('SignUpLogIn', this.props.navigation);
                } else {
                    _checkInternetConnection(() => this._loadObservationFeed(user.uid, true, false), () => this._setEmptyMessage(strings.noInternet));
                }
            });
        });

        if (Platform.OS === 'ios') {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        }
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
        if (this.keyboardDidShowListener) {
            this.keyboardDidShowListener.remove();
        }
        if (this.keyboardDidHideListener) {
            this.keyboardDidHideListener.remove();
        }
    }

    _loadObservationFeed(userid, onStartup, isRefreshing) {
        const _loadObservations = this._loadObservations;

        if (this.followees && this.followees.length > 0 && !isRefreshing && !onStartup) {
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
        } else {
            this._loadFeedEmptyInfo();
        }
        this._setEmptyMessage(strings.emptyFeed);
        this.setState({
            isRefreshing: false,
        });
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

        const emptyFeed = !array || array.length === 0;
        this.setState({
            observations: array,
            feedEmpty: emptyFeed
        });
        if (emptyFeed) {
            this._loadFeedEmptyInfo();
        }
    }

    _onCreate(newObs) {
        this.setState((prevState) => ({observations: [newObs].concat(prevState.observations)}));
    }

    _scrollToItem(index) {
        if (index < this.state.observations.length - 1) {
            this.flatList.scrollToIndex({
                animated: true,
                index: index + 1,
                viewPosition: 1
            });
        } else if (this.bottomOfList) {
            this.flatList.scrollToIndex({
                animated: true,
                index: index,
                viewPosition: 0
            });
        } else {
            this.bottomOfList = true;
        }
    }

    _keyboardDidShow(e) {
        if (this.bottomOfList) {
            RNSafeAreaGetter.getBottomPadding((error, bottomPadding) => {
                if (error) {
                    console.log(error);
                } else {
                    this.setState({keyboardHeight: e.endCoordinates.height - bottomPadding - ReactNavigationTabBarHeight}, () => this._scrollToItem(this.state.observations.length - 1));
                }
            });
        }
    }

    _keyboardDidHide(e) {
        if (this.bottomOfList) {
            this.setState({keyboardHeight: 0});
            this.bottomOfList = false;
        }
    }

    _loadFeedEmptyInfo() {
        this.setState({
            feedEmpty: true
        });
        const _addObservationsToState = this._addObservationsToState;
        const _sortUsersByFollowers = HomeScreen._sortUsersByFollowers;

        console.log('Loading empty feed popular users...');
        const refUsers = firebase.database().ref(pathUsers).orderByChild('followers').limitToLast(8);
        refUsers.once('value')
            .then((dataSnapshot) => {
                console.log('Successfully retrieved empty feed popular users');
                const usersJson = dataSnapshot.toJSON();
                const users = usersJson && Object.values(usersJson);
                _sortUsersByFollowers(users);
                this.setState({
                    feedEmptyUsers: users,
                });
                dataSnapshot.forEach(function (childSnapshot) {
                    const refObs = firebase.database().ref(pathObservations).child(childSnapshot.key).orderByChild('timestamp').limitToLast(9);
                    refObs.once('value')
                        .then((dataSnapshot) => {
                            console.log('Popular observations successfully retrieved');
                            const observations = dataSnapshot.toJSON();
                            _addObservationsToState(observations && Object.values(observations), childSnapshot.key);
                        }).catch((error) => {
                            console.log('Error while retrieving observation of popular user with id ' + childSnapshot.key);
                            console.log(error);
                        }
                    );

                });
            }).catch((error) => {
                console.log('Error while retrieving most popular users');
                console.log(error);
            }
        );
    }

    static _sortUsersByFollowers(users) {
        if (users) {
            users.sort(function (a, b) {
                if (!a.followers)
                    return 1;
                if (!b.followers)
                    return -1;
                if (a.followers < b.followers)
                    return 1;
                if (a.followers > b.followers)
                    return -1;
                return 0;
            });
        }
    }

    _addObservationsToState(userObservations, userid) {
        if (userObservations) {
            let observations = this.state.feedEmptyObservations;
            _sortArrayByTimestamp(userObservations);
            observations[userid] = userObservations;
            this.setState({feedEmptyObservations: observations});
        }
    }

    _toggleFollowUnfollow(userid) {
        const follower = currentUser ? currentUser.uid : null;
        const followee = userid;
        const combined = _generateCombinedKey(follower, followee);
        const _addIsFollowingToState = this._addIsFollowingToState;

        if (!userid || follower === followee) {
            // Do nothing
        } else if (this.state.feedEmptyFollowing[userid]) {
            console.log('Removing relationship of ' + follower + ' following ' + followee + '...');
            const ref = firebase.database().ref(pathFollow).child(combined);
            ref.remove(
                (error) => {
                    if (error) {
                        error.log(error);
                    } else {
                        console.log('Successfully removed relationship of ' + follower + ' following ' + followee);
                        _addIsFollowingToState(false, userid);
                    }
                }
            );
        } else {
            console.log('Adding ' + follower + ' to follow ' + followee + '...');
            firebase.database().ref(pathFollow).child(combined).set({
                follower: follower,
                followee: followee,
            }, (error) => {
                if (error) {
                    console.error('Error during user following relationship transmission.');
                    console.error(error);
                } else {
                    console.log('Successfully added ' + follower + ' to follow ' + followee);
                    _addIsFollowingToState(true, userid);
                }
            });
        }
    }

    _addIsFollowingToState(isFollowing, userid) {
        let feedEmptyFollowing = this.state.feedEmptyFollowing;
        feedEmptyFollowing[userid] = isFollowing;
        this.setState({feedEmptyFollowing: feedEmptyFollowing}, (() => console.log(this.state.feedEmptyFollowing)));
    }

    _onPressUser(index) {
        this.setState({
            feedEmptySelectedIndex: index,
        });
    }

    _onPressProfile(user) {
        let params = {};
        params.user = user;
        _navigateToScreen('Profile', this.props.navigation, params);
    }

    _feedEmptyUserKeyExtractor = (item, index) => item.userid || item + index;
    _feedEmptyObsKeyExtractor = (item, index) => index + item;

    render() {
        const selectedUser = this.state.feedEmpty && this.state.feedEmptyUsers && this.state.feedEmptyUsers[this.state.feedEmptySelectedIndex];
        const selectedObservations = selectedUser && this.state.feedEmptyObservations[selectedUser.userid];

        return (
            <View style={{flex:1}}>
                {
                    this.state.user && !this.state.user.isAnonymous &&
                    <View style={{flex:1}}>
                        {
                            this.state.observations.length === 0 && !this.state.feedEmpty &&
                            <EmptyComponent message={this.state.emptyListMessage}/>
                        }
                        {
                            this.state.observations.length === 0 && this.state.feedEmpty &&
                            <ScrollView style={[{flex:1, flexDirection:'column'}]}>
                                <View style={styles.containerPadding}>
                                    <Text style={styles.textStandardDark}>{strings.emptyFeed} <Text onClick={() => this._loadObservationFeed(currentUser.uid, true, false)}>{strings.clickHereToRefresh}</Text></Text>
                                </View>
                                <View>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.feedEmptyUsers}
                                        extraData={this.state.feedEmptySelectedIndex}
                                        keyExtractor={this._feedEmptyUserKeyExtractor}
                                        renderItem={({item, index}) => {
                                            return (
                                                <View style={[{flexDirection: 'column', alignItems: 'center'}]}>
                                                    <View style={styles.containerPadding}>
                                                        <UserImageThumbnailComponent size={[styles.roundProfile]} onPress={() => this._onPressUser(index)} user={item}/>
                                                    </View>
                                                    {
                                                        selectedUser && item.userid === selectedUser.userid &&
                                                        <View style={[styles.triangle, {width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: iconSizeSmall / 2, borderRightWidth: iconSizeSmall / 2, borderBottomWidth: iconSizeSmall-7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: colorBackground}]}/>
                                                    }
                                                </View>
                                            )}
                                        }
                                    />
                                    {
                                        selectedUser &&
                                        <View style={{flexDirection: 'column', backgroundColor: colorBackground}}>
                                            <View style={[styles.containerPadding, {flexDirection: 'row', alignItems:'center'}]}>
                                                <View style={{flex:3, flexDirection:'column'}}>
                                                    <TouchableOpacity onPress={() => this._onPressProfile(selectedUser)}>
                                                        <Text style={[styles.textStandardBold]}>{(selectedUser && selectedUser.username) || strings.unknownUsername}</Text>
                                                    </TouchableOpacity>
                                                    <Text style={[styles.textSmall]}>{(selectedUser && selectedUser.location) || strings.unknownLocation} • {_formatNumberWithString(selectedUser.followers, ActivityEnum.FOLLOW)}</Text>
                                                </View>
                                                {
                                                    selectedUser.userid && selectedUser.userid !== currentUser.uid &&
                                                    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', flex: 1, alignItems: 'center',}} onPress={() => this._toggleFollowUnfollow(selectedUser.userid)}>
                                                        <SimpleLineIcons name={(this.state.feedEmptyFollowing && this.state.feedEmptyFollowing[selectedUser.userid]) ? iconUnfollow : iconFollow} size={iconSizeStandard} color={colorContrast}/>
                                                    </TouchableOpacity>
                                                }
                                                {
                                                    !selectedUser.userid || selectedUser.userid === currentUser.uid &&
                                                    <View style={{flex: 1}}/>
                                                }
                                            </View>
                                            {
                                                selectedObservations &&
                                                <FlatList
                                                    numColumns={3}
                                                    data={selectedObservations}
                                                    style={styles.containerPadding}
                                                    keyExtractor={this._feedEmptyObsKeyExtractor}
                                                    renderItem={({item, index}) =>
                                                        <ObservationExploreComponent
                                                            observation={item} {...this.props}/>
                                                    }
                                                />
                                            }
                                            {
                                                !selectedObservations &&
                                                <Text style={[styles.containerPadding, styles.textStandardDark]}>{strings.noPictures}</Text>
                                            }
                                        </View>
                                    }
                                </View>
                            </ScrollView>
                        }
                        {
                            this.state.observations.length > 0 &&
                            <FlatList
                                ref={flatList => this.flatList = flatList}
                                data={this.state.observations}
                                keyExtractor={this._keyExtractor}
                                renderItem={({item, index}) => <ObservationComponent observation={item} {...this.props} onDelete={this._onDelete} onWriteCommentPressed={Platform.OS === 'ios' && (() => this._scrollToItem(index))}/>}
                                ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh}
                                onEndReached={this._onEndReached}
                            />
                        }
                        <View style={{height: this.state.keyboardHeight}}/>
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
