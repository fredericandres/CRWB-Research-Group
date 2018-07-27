import React from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {NavBarButton, NavBarCloseButton, NavBarFollowUnFollowButton} from "../Components/NavBarButton";
import {
    _formatNumber,
    _sortArrayByTimestamp,
    colorMain,
    iconCog,
    iconFollow,
    iconUnfollow,
    pathFollow,
    pathUsers
} from "../constants/Constants";
import styles from "../styles";
import {UserComponent} from "../Components/UserComponent";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import {ProfileSegmentedControlItem} from "../Components/ProfileSegmentedControlItem";
import strings from "../strings";
import {currentUser, currentUserInformation} from "../App";
import firebase from 'react-native-firebase';
import {EmptyComponent} from "../Components/EmptyComponent";
import {UserImageThumbnailComponent} from "../Components/UserImageThumbnailComponent";

function _toggleFollowUnfollow(navigation) {
    const isFollowing = navigation.getParam('isFollowing');
    const follower = currentUser ? currentUser.uid : null;
    const followee = userid;
    const combined = _generateCombinedKey(follower, followee);

    if (isFollowing === null) {
        // Do nothing, we are not sure yet if current user is following this user or not
    } else if (isFollowing) {
        console.log('Removing relationship of ' + follower + ' following ' + followee);
        const ref = firebase.database().ref(pathFollow).child(combined);
        ref.remove(
            (error) => {
                if (error) {
                    error.log(error);
                } else {
                    console.log('Successfully removed relationship of ' + follower + ' following ' + followee);
                    navigation.setParams({ isFollowing: false });
                }
            }
        );
    } else {
        firebase.database().ref(pathFollow).child(combined).set({
            follower: follower,
            followee: followee,
        }, (error) => {
            if (error) {
                console.error('Error during user following relationship transmission.');
                console.error(error);
            } else {
                console.log('Successfully added ' + follower + ' to follow ' + followee);
                navigation.setParams({ isFollowing: true });
            }
        });
    }
}

function _generateCombinedKey(follower, followee) {
    return follower + '_' + followee;
}

const FOLLOW_LOAD_DEPTH = 10;
const OBS_LOAD_DEPTH = 6;
let userid = null;

export class ProfileScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            title: '',
            // Set left header button to 'Close' if top of stack aka own profile
            headerLeft: !params.myProfile ? undefined : (
                <NavBarCloseButton nav={navigation}/>
            ),
            headerRight: (
                params.myProfile ?
                    <NavBarButton nav={navigation} icon={iconCog} screen={'Settings'} myProfile={true} onDataChangedAction={() => params.onDataChangedAction()}/>
                    :
                    currentUser && !(params.user === currentUser.uid) && !(params.user && params.user.userid === currentUser.uid) ?
                        <View>
                            {params.isFollowing &&
                            <NavBarFollowUnFollowButton icon={iconUnfollow}
                                                        action={() => _toggleFollowUnfollow(navigation)}/>}
                            {!params.isFollowing &&
                            <NavBarFollowUnFollowButton icon={iconFollow}
                                                        action={() => _toggleFollowUnfollow(navigation)}/>}
                        </View>
                        : <View/>
            ),
            headerStyle: {
                borderBottomWidth: 0,
                backgroundColor: colorMain,
                elevation: 0,
            },
            headerTitleStyle: {
                color: colorMain
            },
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            user: props.navigation.getParam('myProfile') ? currentUserInformation : (props.navigation.getParam('user').userid === currentUser.uid ? currentUserInformation : props.navigation.getParam('user')),
            followers: [],
            following: [],
            observations: [],
            selectedIndex: 4
        };
        this._onPressFollowers = this._onPressFollowers.bind(this);
        this._onPressPhotos = this._onPressPhotos.bind(this);
        this._onPressFollowing = this._onPressFollowing.bind(this);
        this._loadFollowing = this._loadFollowing.bind(this);
        this._loadFollowers = this._loadFollowers.bind(this);
        this._loadObservations = this._loadObservations.bind(this);
        this._onProfileUpdated = this._onProfileUpdated.bind(this);

        this.followingIds = {};
        this.followersIds = {};

        userid = this.state.user.userid || currentUser.uid;

        if (!this.state.user.username) {
            // Get user from DB
            firebase.database().ref(pathUsers).child(userid).once('value')
                .then((dataSnapshot) => {
                    console.log('Successfully retrieved user data');
                    const user = dataSnapshot.toJSON();
                    console.log('A');
                    this.setState({user: user});
                }).catch((error) => {
                    console.error('Error while retrieving user data');
                    console.error(error);
                }
            );
        }

        if (currentUser && userid !== currentUser.uid) {
            // Is current user following this user?
            console.log('Retrieving follower status...');
            const ref = firebase.database().ref(pathFollow).child(_generateCombinedKey(currentUser.uid, userid));
            ref.once('value')
                .then((dataSnapshot) => {
                    console.log('Successfully retrieved follower status');
                    this.props.navigation.setParams({isFollowing: dataSnapshot.toJSON() !== null});
                }).catch(
                (error) => {
                    console.error('Error while retrieving follower status');
                    console.error(error);
                }
            );
        }

        this._loadObservations(true);
        this._loadFollowers();
        this._loadFollowing();
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onDataChangedAction: this._onProfileUpdated,
        });
    }

    _loadFollowers() {
        const followersSize = Object.keys(this.followersIds).length;
        if (followersSize === 0 || followersSize % FOLLOW_LOAD_DEPTH === 0) {
            console.log('Loading followers...');
            this._loadUsers('followee', userid, this.followersIds, this.state.followers ? this.state.followers.length + FOLLOW_LOAD_DEPTH : FOLLOW_LOAD_DEPTH, (dataSnapshot) => {this.setState(prevState => ({followers: [...prevState.followers, dataSnapshot]}))});
        }
    }

    _loadFollowing() {
        const followingSize = Object.keys(this.followingIds).length;
        if (followingSize === 0 || followingSize % FOLLOW_LOAD_DEPTH === 0) {
            console.log('Loading following...');
            this._loadUsers('follower', userid, this.followingIds, this.state.followers ? this.state.followers.length + FOLLOW_LOAD_DEPTH : FOLLOW_LOAD_DEPTH, (dataSnapshot) => {this.setState(prevState => ({following: [...prevState.following, dataSnapshot]}))});
        }
    }

    _loadObservations(onStartup) {
        const obsSize = this.state.observations.length;
        if (!this.isLoadingObservations && (obsSize === 0 || obsSize % OBS_LOAD_DEPTH === 0)) {
            const index = this.state.observations.length;

            console.log('Loading observations... Starting at ' + index + ' to ' + (index + OBS_LOAD_DEPTH));
            this.isLoadingObservations = true;

            const httpsCallable = firebase.functions().httpsCallable('getXMostRecentObsForUserWithId');
            httpsCallable({
                userid: userid,
                from: index,
                to: index + OBS_LOAD_DEPTH
            }).then(({data}) => {
                console.log('Successfully loaded observations');
                this.isLoadingObservations = false;
                this._addToObservationState(data.observations, onStartup);
            }).catch(httpsError => {
                console.log(httpsError.code);
                console.log(httpsError.message);
                this.isLoadingObservations = false;
            })
        }
    }

    _addToObservationState(newObservations, onStartup) {
        let observations = newObservations ? Object.values(newObservations) : null;

        if (observations && observations.length > 0) {
            _sortArrayByTimestamp(observations);

            if (onStartup) {
                this.setState({observations: observations});
                this._onPressPhotos();
            } else {
                this.setState(prevState => ({observations: prevState.observations.concat(observations)}));
            }
        } else if (onStartup) {
            this._onPressPhotos();
        }
    }

    _loadUsers(type, userid, idarray, loadDepth, callback) {
        // Load all matches of userid in combination of type
        const ref = firebase.database().ref(pathFollow).orderByChild(type).equalTo(userid).limitToFirst(loadDepth);
        ref.once(
            'value',
            (dataSnapshot) => {
                console.log('Successfully loaded ' + type + 's');
                if (dataSnapshot.numChildren() !== idarray.size) {
                    // Loop through results to get all users
                    dataSnapshot.forEach(function (childSnapshot) {
                        const uid = type === 'follower' ? childSnapshot.toJSON().followee : childSnapshot.toJSON().follower;
                        if (uid && !idarray[uid]) {
                            idarray[uid] = true;
                            firebase.database().ref(pathUsers).child(uid).once(
                                'value',
                                (dataSnapshot) => {
                                    const user = dataSnapshot ? dataSnapshot.toJSON() : null;
                                    if (user !== null) {
                                        callback(user);
                                    } else {
                                        console.error('Error while retrieving user with id ' + uid)
                                    }
                                },
                                (error) => {
                                    console.error(error);
                                }
                            );
                        }
                    });
                }
            },
            (error) => {
                console.error('Error while retrieving ' + type + ' of ' + userid);
                console.error(error);
            }
        );
    }

    _onPressPhotos() {
        this.setState({selectedIndex: 0});
    }

    _onPressFollowers() {
        this.setState({selectedIndex: 1});
    }

    _onPressFollowing() {
        this.setState({selectedIndex: 2});
    }

    _onProfileUpdated() {
        this.setState({user: currentUserInformation});
    }

    _observationKeyExtractor = (item, index) => item.observationid;
    _followingKeyExtractor = (item, index) => item.username;

    render() {
        return (
            <SafeAreaView style={{flex: 1,}}>
                <View name={'header'} style={{flex: 2, backgroundColor: colorMain}}>
                    <UserImageThumbnailComponent size={styles.roundProfileLarge} user={this.state.user}/>
                    <View name={'username'} style={{flex: 1, alignItems: 'flex-end', flexDirection: 'row'}}>
                        <Text name={'username'}
                              style={[styles.textTitleBoldDark, {textAlign: 'center', flex: 1}]}>{this.state.user.username}</Text>
                    </View>
                    <Text name={'location'}
                          style={[styles.textTitle, {flex: 1, textAlign: 'center'}]}>{this.state.user.location}</Text>
                </View>
                <View name={'content'} style={{flex: 5}}>
                    <View name={'segmentedcontrolwrapper'}>
                        <View name={'weirdbackground'}
                              style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                            <View style={{flex: 1, backgroundColor: colorMain}}/>
                            <View style={{flex: 1}}/>
                        </View>
                        <View name={'segmentedcontrolwrapper'}
                              style={[{flexDirection: 'row'}, styles.containerPadding]}>
                            <ProfileSegmentedControlItem name={'photos'} text={strings.photos} number={_formatNumber(this.state.user.observations)}
                                                         isSelected={this.state.selectedIndex === 0}
                                                         action={this._onPressPhotos}/>
                            <ProfileSegmentedControlItem name={'followers'} text={strings.followers}
                                                         isSelected={this.state.selectedIndex === 1} number={_formatNumber(this.state.user.followers)}
                                                         action={this._onPressFollowers}/>
                            <ProfileSegmentedControlItem name={'following'} text={strings.following}
                                                         isSelected={this.state.selectedIndex === 2} number={_formatNumber(this.state.user.followees)}
                                                         action={this._onPressFollowing}/>
                        </View>
                    </View>
                    {this.state.selectedIndex === 4 && <EmptyComponent message={strings.loading}/>}
                    {
                        this.state.selectedIndex === 0 &&
                        <View style={{flex:1}}>
                            {
                                this.state.observations.length === 0 && <EmptyComponent message={strings.noPictures}/>
                            }
                            {
                                this.state.observations.length > 0 &&
                                <FlatList
                                    style={styles.explorePadding}
                                    data={this.state.observations}
                                    renderItem={({item}) => <ObservationExploreComponent observation={item} {...this.props}/>}
                                    numColumns={2}
                                    keyExtractor={this._observationKeyExtractor}
                                    onEndReached={() => this._loadObservations(false)}
                                    removeClippedSubviews={true}
                                />
                            }
                        </View>
                    }
                    {
                        this.state.selectedIndex === 1 &&
                        <View style={{flex:1}}>
                            {
                                this.state.followers.length === 0 && <EmptyComponent message={strings.noUsers}/>
                            }
                            {
                                this.state.followers.length > 0 &&
                                <FlatList
                                    style={styles.containerPadding}
                                    data={this.state.followers}
                                    ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                                    renderItem={({item}) => <UserComponent user={item} {...this.props}/>}
                                    keyExtractor={this._followingKeyExtractor}
                                    onEndReached={this._loadFollowers}
                                    removeClippedSubviews={true}
                                />
                            }
                        </View>
                    }
                    {
                        this.state.selectedIndex === 2 &&
                        <View style={{flex:1}}>
                            {
                                this.state.following.length === 0 && <EmptyComponent message={strings.noUsers}/>
                            }
                            {
                                this.state.following.length > 0 &&
                                <FlatList
                                    style={styles.containerPadding}
                                    data={this.state.following}
                                    ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                                    renderItem={({item}) => <UserComponent user={item} {...this.props}/>}
                                    keyExtractor={this._followingKeyExtractor}
                                    onEndReached={this._loadFollowing}
                                    removeClippedSubviews={true}
                                />
                            }
                        </View>
                    }
                </View>
            </SafeAreaView>
        );
    }
}