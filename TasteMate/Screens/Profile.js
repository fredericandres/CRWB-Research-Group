import React from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import {NavBarButton, NavBarCloseButton, NavBarFollowUnfollowButton} from "../Components/NavBarButton";
import {brandMain} from "../constants/Constants";
import styles from "../styles";
import * as MockupData from "../MockupData";
import {userr, users} from "../MockupData";
import {UserComponent} from "../Components/UserComponent";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import {ProfileSegmentedControlItem} from "../Components/ProfileSegmentedControlItem";
import strings from "../strings";

function _toggleFollowUnfollow() {
    // TODO
    this.user = !this.user;
    return undefined;
}

export class ProfileScreen extends React.Component {
    static navigationOptions =({navigation})=> ({
        title: navigation.getParam('user') ? navigation.getParam('user').username : userr.username,
        // Set left header button to 'Close' if top of stack aka own profile
        headerLeft: !navigation.getParam('myProfile') ? undefined : (
            <NavBarCloseButton nav={navigation}/>
        ),
        headerRight: (
            navigation.getParam('myProfile') ?
                <NavBarButton nav={navigation} icon={'cog'} screen={'Settings'} myProfile={true}/>
                :
                <View>
                    {userr.isFollowing &&
                    <NavBarFollowUnfollowButton icon={'user-following'} actionn={_toggleFollowUnfollow}/>}
                    {!userr.isFollowing &&
                    <NavBarFollowUnfollowButton icon={'user-follow'} actionn={_toggleFollowUnfollow}/>}
                </View>

        ),
        headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: brandMain,
            elevation: 0,
        },
        headerTitleStyle: {
            color: brandMain
        },
    });

    constructor() {
        super();
        this.state = {
            selectedIndex: 0,
        };
        this._onPressFollowers = this._onPressFollowers.bind(this);
        this._onPressPhotos = this._onPressPhotos.bind(this);
        this._onPressFollowing = this._onPressFollowing.bind(this);
        this.user = userr;
    }

    _onPressPhotos() {
        // TODO
        this.setState(previousState => {
            return {selectedIndex: 0};
        });
    }

    _onPressFollowers() {
        // TODO
        this.setState(previousState => {
            return {selectedIndex: 1};
        });
    }

    _onPressFollowing() {
        // TODO
        this.setState(previousState => {
            return {selectedIndex: 2};
        });
    }

    render() {
        const user = userr; //this.props.navigation.getParam('userid')

        return (
            <View style={{flex: 1,}}>
                <View name={'header'} style={{flex: 2, backgroundColor: brandMain}}>
                    <View name={'userpic'} style={[styles.containerPadding, {
                        flex: 3,
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }]}>
                        <Image name={'userprofilepic'} resizeMode={'cover'} source={require('../user2.jpg')}
                               style={[{flex: 0}, styles.roundProfileLarge]}/>
                    </View>
                    <View name={'username'} style={{flex: 1, alignItems: 'flex-end', flexDirection: 'row'}}>
                        <Text name={'username'}
                              style={[styles.textTitleBoldDark, {textAlign: 'center', flex: 1}]}>{user.username}</Text>
                    </View>
                    <Text name={'location'}
                          style={[styles.textTitle, {flex: 1, textAlign: 'center'}]}>{user.location}</Text>
                </View>
                <View name={'content'} style={{flex: 5}}>
                    <View name={'segmentedcontrolwrapper'}>
                        <View name={'weirdbackground'}
                              style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                            <View style={{flex: 1, backgroundColor: brandMain}}/>
                            <View style={{flex: 1}}/>
                        </View>
                        {/*TODO: Reformat numbers*/}
                        <View name={'segmentedcontrolwrapper'}
                              style={[{flexDirection: 'row'}, styles.containerPadding]}>
                            <ProfileSegmentedControlItem name={'photos'} text={strings.photos} number='27'
                                                         isSelected={this.state.selectedIndex === 0}
                                                         action={this._onPressPhotos}/>
                            <ProfileSegmentedControlItem name={'followers'} text={strings.followers}
                                                         isSelected={this.state.selectedIndex === 1} number='200'
                                                         action={this._onPressFollowers}/>
                            <ProfileSegmentedControlItem name={'following'} text={strings.following}
                                                         isSelected={this.state.selectedIndex === 2} number='31'
                                                         action={this._onPressFollowing}/>
                        </View>
                    </View>
                    {
                        this.state.selectedIndex === 0 &&
                        <FlatList
                            style={styles.containerPadding}
                            ListEmptyComponent={() => <Text style={[styles.containerPadding, styles.textStandardDark]}>{strings.noPictures}</Text>}
                            data={MockupData.observations}
                            renderItem={({item}) => <ObservationExploreComponent observation={item.value}
                                                                                 nav={this.props.navigation}/>}
                            numColumns={3}
                        />
                    }
                    {
                        this.state.selectedIndex !== 0 &&
                        <FlatList
                            style={styles.containerPadding}
                            data={users}
                            ListEmptyComponent={() => <Text style={[styles.containerPadding, styles.textStandardDark]}>{strings.noUsers}</Text>}
                            ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                            renderItem={({item}) => <UserComponent user={item.value} nav={this.props.navigation}/>}
                        />
                    }
                </View>
            </View>
        );
    }
}