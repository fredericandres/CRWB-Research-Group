import React from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {NavBarButton, NavBarCloseButton, NavBarFollowUnFollowButton} from '../Components/NavBarButton';
import {colorMain, FollowerFolloweeEnum, formatNumber, iconCog, iconFollow, iconUnfollow} from '../Constants/Constants';
import styles from '../styles';
import {UserComponent} from '../Components/UserComponent';
import {ObservationExploreComponent} from '../Components/ObservationExploreComponent';
import {ProfileSegmentedControlItem} from '../Components/ProfileSegmentedControlItem';
import strings from '../strings';
import {currentUser, currentUserInformation} from '../App';
import {EmptyComponent} from '../Components/EmptyComponent';
import {UserImageThumbnailComponent} from '../Components/UserImageThumbnailComponent';
import {
    addFollowRelationship,
    getFollowers,
    getUser,
    getXMostRecentObsForUserWithId,
    isFollowing,
    removeFollowRelationship,
    sortArrayByTimestamp
} from '../Helpers/FirebaseHelper';

function _toggleFollowUnfollow(navigation) {
    const isFollowing = navigation.getParam('isFollowing');
    const follower = currentUser ? currentUser.uid : null;
    const followee = userid;

    if (isFollowing === null || !userid || follower === followee) {
        // Do nothing, we are not sure yet if current user is following this user or not
    } else if (isFollowing) {
        removeFollowRelationship(follower, followee)
            .then(() => {
                navigation.setParams({ isFollowing: false });
            }).catch((error) => {
                console.log(error);
            }
        );
    } else {
        addFollowRelationship(follower, followee)
            .then(() => {
                navigation.setParams({ isFollowing: true });
            }).catch((error) => {
                console.log(error);
            }
        );
    }
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

        if (!this.state.user.userid) {
            this.props.navigation.goBack();
        }

        this._onPressFollowers = this._onPressFollowers.bind(this);
        this._onPressPhotos = this._onPressPhotos.bind(this);
        this._onPressFollowing = this._onPressFollowing.bind(this);
        this._loadFollowing = this._loadFollowing.bind(this);
        this._loadFollowers = this._loadFollowers.bind(this);
        this._loadObservations = this._loadObservations.bind(this);
        this._onProfileUpdated = this._onProfileUpdated.bind(this);

        this.followingIds = {};
        this.followersIds = {};

        userid = this.state.user.userid;

        if (!this.state.user.username && userid) {
            // Get user from DB
            getUser(userid)
                .then((user) => {
                    this.setState({user: user});
                }).catch((error) => {
                    console.log(error);
                }
            );
        }

        if (currentUser && userid && userid !== currentUser.uid) {
            // Is current user following this user?
            isFollowing(currentUser.uid, userid)
                .then((isFollowing) => {
                    this.props.navigation.setParams({isFollowing: isFollowing});
                }).catch((error) => {
                    console.log(error);
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
            this._loadUsers(FollowerFolloweeEnum.FOLLOWEE, userid, this.followersIds, this.state.followers ? this.state.followers.length + FOLLOW_LOAD_DEPTH : FOLLOW_LOAD_DEPTH, (dataSnapshot) => this.setState(prevState => ({followers: [...prevState.followers, dataSnapshot]})));
        }
    }

    _loadFollowing() {
        const followingSize = Object.keys(this.followingIds).length;
        if (followingSize === 0 || followingSize % FOLLOW_LOAD_DEPTH === 0) {
            console.log('Loading following...');
            this._loadUsers(FollowerFolloweeEnum.FOLLOWER, userid, this.followingIds, this.state.followers ? this.state.followers.length + FOLLOW_LOAD_DEPTH : FOLLOW_LOAD_DEPTH, (dataSnapshot) => this.setState(prevState => ({following: [...prevState.following, dataSnapshot]})));
        }
    }

    _loadObservations(onStartup) {
        const obsSize = this.state.observations.length;
        if (userid && !this.isLoadingObservations && (obsSize === 0 || obsSize % OBS_LOAD_DEPTH === 0)) {
            const index = this.state.observations.length;
            this.isLoadingObservations = true;

            getXMostRecentObsForUserWithId(userid, index, index + OBS_LOAD_DEPTH)
                .then((observations) => {
                    this.isLoadingObservations = false;
                    this._addToObservationState(observations, onStartup);
                }).catch((error) => {
                    console.log(error);
                    this.isLoadingObservations = false;
                }
            );
        }
    }

    _addToObservationState(newObservations, onStartup) {
        let observations = newObservations ? Object.values(newObservations) : null;

        if (observations && observations.length > 0) {
            sortArrayByTimestamp(observations);

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
        getFollowers(type, userid, loadDepth)
            .then((followeers) => {
                for (let i = 0; i < followeers.length; i++) {
                    const uid = followeers[i];
                    if (uid && !idarray[uid]) {
                        idarray[uid] = true;
                        getUser(uid)
                            .then((user) => {
                                if (user !== null) {
                                    callback(user);
                                } else {
                                    console.log('User with id ' + uid + ' does not exist');
                                }
                            }).catch ((error) => {
                                console.log(error);
                            }
                        );
                    }
                }
            }).catch ((error) => {
                console.log(error);
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

    _observationKeyExtractor = (item) => item.observationid;
    _followingKeyExtractor = (item, index) => item.username || item + index;

    render() {
        return (
            <SafeAreaView style={{flex: 1,}}>
                <View name={'header'} style={{flex: 2, backgroundColor: colorMain}}>
                    <View style={styles.containerPadding}>
                        <UserImageThumbnailComponent size={styles.roundProfileLarge} user={this.state.user}/>
                    </View>
                    <View name={'username'} style={{flex: 1, alignItems: 'flex-end', flexDirection: 'row'}}>
                        <Text name={'username'}
                              style={[styles.textTitleBoldDark, {textAlign: 'center', flex: 1}]}>{this.state.user.username || strings.unknownUsername}</Text>
                    </View>
                    <Text name={'location'}
                          style={[styles.textTitle, {flex: 1, textAlign: 'center'}]}>{this.state.user.location || strings.unknownLocation}</Text>
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
                            <ProfileSegmentedControlItem name={'photos'} text={strings.photos} number={formatNumber(this.state.user.observations)}
                                                         isSelected={this.state.selectedIndex === 0}
                                                         action={this._onPressPhotos}/>
                            <ProfileSegmentedControlItem name={'followers'} text={strings.followers}
                                                         isSelected={this.state.selectedIndex === 1} number={formatNumber(this.state.user.followers)}
                                                         action={this._onPressFollowers}/>
                            <ProfileSegmentedControlItem name={'following'} text={strings.following}
                                                         isSelected={this.state.selectedIndex === 2} number={formatNumber(this.state.user.followees)}
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