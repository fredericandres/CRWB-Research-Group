import React from 'react';
import {createBottomTabNavigator, createStackNavigator} from 'react-navigation';
import {HomeScreen} from "./Screens/Home";
import {ObservationDetailScreen} from "./Screens/ObservationDetail";
import {SearchExploreScreen} from "./Screens/SearchExplore";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NotificationsScreen} from "./Screens/Notifications";
import {ProfileScreen} from "./Screens/Profile";
import {EatingOutListScreen} from "./Screens/EatingOutList";
import {CreateObservationScreen} from "./Screens/CreateObservation";
import {brandContrast, brandLight, brandMain, iconSizeStandard, pathUsers, tastemateFont} from './constants/Constants';
import {Platform, StatusBar, StyleSheet} from "react-native";
import {SettingsScreen} from "./Screens/Settings";
import {SignUpLogInScreen} from "./Screens/SignUpLogIn";
import strings from "./strings";
import {MapScreen} from "./Screens/Map";
import firebase from 'react-native-firebase';
import {CommentsScreen} from "./Screens/Comments";
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import {mapboxApiKey} from "./constants/GoogleApiKey";

StatusBar.setHidden(false);

const styles = StyleSheet.create({
    navHeaderStyle: {
        backgroundColor: brandMain
    },
    navHeaderTitleStyle: {
        //fontWeight: 'bold',
        fontFamily: tastemateFont,
        fontWeight:'200',
        fontSize: Platform.OS === 'ios' ? 20 : 30,
    },
});

// TODO: Firebase other DB
// TODO: Parse strings to remove empty spaces/lines before/after when uploading to DB
MapboxGL.setAccessToken(mapboxApiKey);

export let currentUser = null;
export let currentUserInformation = null;
firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;

    if (user) {
        // Load user data
        firebase.database().ref(pathUsers).child(currentUser.uid).on(
            'value',
            (dataSnapshot) => {
                currentUserInformation = dataSnapshot.toJSON();
            },
            (error) => {
                console.error('Could not load user data');
                console.error(error);
            }
        );
    }
});

const HomeStack = createStackNavigator({
        Home: { screen: HomeScreen },
        Profile: { screen: ProfileScreen },
        ObservationDetail: { screen: ObservationDetailScreen },
        Map: { screen: MapScreen },
        Comments: { screen: CommentsScreen },
    },
    {
        initialRouteName: 'Home',
        navigationOptions: {
            headerStyle: styles.navHeaderStyle,
            headerTintColor: brandContrast,
            headerTitleStyle: styles.navHeaderTitleStyle,
        }
    }
);

const ExploreSearchStack = createStackNavigator({
        Explore: { screen: SearchExploreScreen },
        ObservationDetail: { screen: ObservationDetailScreen },
        Profile: { screen: ProfileScreen },
        Map: { screen: MapScreen },
        Comments: { screen: CommentsScreen },
    },
    {
        initialRouteName: 'Explore',
        navigationOptions: {
            headerStyle: styles.navHeaderStyle,
            headerTintColor: brandContrast,
            headerTitleStyle: styles.navHeaderTitleStyle,
        }
    }
);

const NotificationsStack = createStackNavigator({
        Notifications: { screen: NotificationsScreen },
        ObservationDetail: { screen: ObservationDetailScreen },
        Profile: { screen: ProfileScreen },
        Map: { screen: MapScreen },
        Comments: { screen: CommentsScreen },
    },
    {
        initialRouteName: 'Notifications',
        navigationOptions: {
            headerStyle: styles.navHeaderStyle,
            headerTintColor: brandContrast,
            headerTitleStyle: styles.navHeaderTitleStyle,
        }
    }
);

const EatingOutListStack = createStackNavigator({
        EatingOutList: { screen: EatingOutListScreen },
        ObservationDetail: { screen: ObservationDetailScreen },
        Profile: { screen: ProfileScreen },
        Map: { screen: MapScreen },
        Comments: { screen: CommentsScreen },
    },
    {
        initialRouteName: 'EatingOutList',
        navigationOptions: {
            headerStyle: styles.navHeaderStyle,
            headerTintColor: brandContrast,
            headerTitleStyle: styles.navHeaderTitleStyle,
        }
    }
);

const ProfileStack = createStackNavigator({
        Profile: { screen: ProfileScreen },
        Settings: { screen: SettingsScreen },
        ObservationDetail: { screen: ObservationDetailScreen },
        Map: { screen: MapScreen },
        Comments: { screen: CommentsScreen },
    },
    {
        initialRouteName: 'Profile',
        navigationOptions: {
            headerStyle: styles.navHeaderStyle,
            headerTintColor: brandContrast,
            headerTitleStyle: styles.navHeaderTitleStyle,
        }
    }
);

const SignUpLogInStack = createStackNavigator({
        SignUpLogIn: { screen: SignUpLogInScreen },
    },
    {
        initialRouteName: 'SignUpLogIn',
        navigationOptions: {
            headerStyle: styles.navHeaderStyle,
            headerTintColor: brandContrast,
            headerTitleStyle: styles.navHeaderTitleStyle,
        }
    }
);

const CreateObservationStack = createStackNavigator({
        CreateObservation: { screen: CreateObservationScreen },
    },
    {
        initialRouteName: 'CreateObservation',
        navigationOptions: {
            headerStyle: styles.navHeaderStyle,
            headerTintColor: brandContrast,
            headerTitleStyle: styles.navHeaderTitleStyle,
        }
    }
);

const TabBar = createBottomTabNavigator(
    {
        Home: { screen: HomeStack, navigationOptions: {title: strings.home} },
        Explore: { screen: ExploreSearchStack, navigationOptions: {title: strings.explore} },
        Notifications: { screen: NotificationsStack, navigationOptions: {title: strings.notifications} },
        EatingOutList: { screen: EatingOutListStack, navigationOptions: {title: strings.eatingOutList} },
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Home') {
                    iconName = `home`;
                } else if (routeName === 'Explore') {
                    iconName = `search`;
                } else if (routeName === 'Notifications') {
                    iconName = `heart`;
                } else if (routeName === 'EatingOutList') {
                    iconName = `cutlery`;
                }
                return <FontAwesome name={iconName} size={iconSizeStandard} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: brandMain,
            inactiveTintColor: brandLight,
            style: {
                backgroundColor: brandContrast,
            },
        },
        animationEnabled: true,
        swipeEnabled: true,
    }
);

export default RootStack = createStackNavigator(
    {
        Main: {
            screen: TabBar,
        },
        SignUpLogIn: {
            screen: SignUpLogInStack,
        },
        CreateObservation: {
            screen: CreateObservationStack,
        },
        MyProfile: {
            screen: ProfileStack,
        },
    },
    {
        mode: 'modal',
        headerMode: 'none',
    }
);
