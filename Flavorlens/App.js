import React from 'react';
import {createBottomTabNavigator, createStackNavigator} from 'react-navigation';
import {HomeScreen} from './Screens/Home';
import {ObservationDetailScreen} from './Screens/ObservationDetail';
import {SearchExploreScreen} from './Screens/SearchExplore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NotificationsScreen} from './Screens/Notifications';
import {ProfileScreen} from './Screens/Profile';
import {EatingOutListScreen} from './Screens/EatingOutList';
import {CreateObservationScreen} from './Screens/CreateObservation';
import {
    colorContrast,
    colorLight,
    colorMain,
    iconCutlery,
    iconHome,
    iconNotifications,
    iconSearch,
    iconSizeStandard,
    tastemateFont
} from './Constants/Constants';
import {Alert, AsyncStorage, NetInfo, Platform, StatusBar, StyleSheet} from 'react-native';
import {SettingsScreen} from './Screens/Settings';
import {SignUpLogInScreen} from './Screens/SignUpLogIn';
import strings from './strings';
import {MapScreen} from './Screens/Map';
import firebase from 'react-native-firebase';
import {CommentsScreen} from './Screens/Comments';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import {mapboxApiKey} from './Constants/ApiKeys';
import {UsersScreen} from './Screens/Users';
import {getUser, updateUserInformation} from './Helpers/FirebaseHelper';
import { storeDataAsync, getDataAsync } from './Helpers/AsyncStorageHelper';

StatusBar.setHidden(false);

const styles = StyleSheet.create({
    navHeaderStyle: {
        backgroundColor: colorMain
    },
    navHeaderTitleStyle: {
        fontFamily: tastemateFont,
        fontWeight:'200',
        fontSize: Platform.OS === 'ios' ? 20 : 30,
    },
});

// TODO: Firebase other DB
// TODO: Push notifications
MapboxGL.setAccessToken(mapboxApiKey);

export let currentUser = null;
getDataAsync('currentUser').then((user) => {
    currentUser = user;
    console.log('Got user from Storage', currentUser);
});
const setCurrentUser = (user) => {
    currentUser = user;
    storeDataAsync('currentUser', currentUser);
}
export let currentUserInformation = null;
getDataAsync('currentUserInformation').then((userInfo) => {
    currentUserInformation = userInfo;
    console.log('Got userInfo from Storage', currentUserInformation);
});
export const setUserInformation = (user) => {
    setCurrentUser(user);

    if (user) {
        getUser(currentUser.uid)
            .then((user) => {
                currentUserInformation = user;
                storeDataAsync('currentUserInformation', currentUserInformation);
            }).catch((error) => {
                console.log(error);
            }
        );
    }
};
firebase.auth().onAuthStateChanged((user) => setUserInformation(user));

let connectionInfo = null;
let firstConnectionCall = null;
const connectionHandler = connectionInformation => {
    connectionInfo = connectionInformation;
    console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    if (firstConnectionCall) {
        _checkInternetConnection(firstConnectionCall.onSuccess, firstConnectionCall.onError);
        firstConnectionCall = null;
    }
};

export function _checkInternetConnection(onSuccess, onError) {
    if (Platform.OS === 'android') {
        NetInfo.getConnectionInfo().then((connectionInformation) => {
            console.log('Initial, type: ' + connectionInformation.type + ', effectiveType: ' + connectionInformation.effectiveType);
            dealWithConnectionInfo(connectionInformation, onSuccess, onError);
        });
    } else {
        if (connectionInfo) {
            dealWithConnectionInfo(connectionInfo, onSuccess, onError);
        } else {
            firstConnectionCall = {onSuccess: onSuccess, onError: onError};
            NetInfo.addEventListener('connectionChange', connectionHandler);
        }
    }
}

function dealWithConnectionInfo(connectionInformation, onSuccess, onError) {
    if (connectionInformation.type === 'wifi' || connectionInformation.type === 'cellular') {
        if (onSuccess) {
            onSuccess();
        } else {
            console.log('WARNING - _checkInternetConnection: No success action defined!');
        }
    } else {
        if (onError) {
            onError();
        } else {
            Alert.alert(strings.noInternetAlertTitle, strings.noInternetAlertMessage, [{text: strings.ok}]);
        }
    }
}

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
            headerTintColor: colorContrast,
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
            headerTintColor: colorContrast,
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
        Users: { screen: UsersScreen },
    },
    {
        initialRouteName: 'Notifications',
        navigationOptions: {
            headerStyle: styles.navHeaderStyle,
            headerTintColor: colorContrast,
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
            headerTintColor: colorContrast,
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
            headerTintColor: colorContrast,
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
            headerTintColor: colorContrast,
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
            headerTintColor: colorContrast,
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
                    iconName = iconHome;
                } else if (routeName === 'Explore') {
                    iconName = iconSearch;
                } else if (routeName === 'Notifications') {
                    iconName = iconNotifications;
                } else if (routeName === 'EatingOutList') {
                    iconName = iconCutlery;
                }
                return <FontAwesome name={iconName} size={iconSizeStandard} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: colorMain,
            inactiveTintColor: colorLight,
            style: {
                backgroundColor: colorContrast,
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
