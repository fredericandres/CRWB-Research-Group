import React from 'react';
import {StackNavigator, TabBarBottom, TabNavigator} from 'react-navigation';
import {HomeScreen} from "./Home";
import {ObservationDetailScreen} from "./ObservationDetail";
import {SearchExploreScreen} from "./SearchExplore";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NotificationsScreen} from "./Notifications";
import {ProfileScreen} from "./Profile";
import {EatingOutListScreen} from "./EatingOutList";
import {CreateObservationScreen} from "./CreateObservation";
import {brandContrast, brandLight, brandMain} from './constants/Constants';
import {StyleSheet} from "react-native";
import {SettingsScreen} from "./Settings";
import {SignUpLogInScreen} from "./SignUpLogIn";


// TODO: Localization

const styles = StyleSheet.create({
    navHeaderStyle: {
        backgroundColor: brandMain
    },
    navHeaderTitleStyle: {
        fontWeight: 'bold',
    },
});

const HomeStack = StackNavigator({
        Home: { screen: HomeScreen },
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

const ExploreSearchStack = StackNavigator({
        Explore: { screen: SearchExploreScreen },
        ObservationDetail: { screen: ObservationDetailScreen },
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

const NotificationsStack = StackNavigator({
        Notifications: { screen: NotificationsScreen },
        ObservationDetail: { screen: ObservationDetailScreen },
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

const EatingOutListStack = StackNavigator({
        EatingOutList: { screen: EatingOutListScreen },
        ObservationDetail: { screen: ObservationDetailScreen },
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

const ProfileStack = StackNavigator({
        Profile: { screen: ProfileScreen },
        Settings: { screen: SettingsScreen },
        SignUpLogIn: { screen: SignUpLogInScreen },
        ObservationDetail: { screen: ObservationDetailScreen },
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

const CreateObservationStack = StackNavigator({
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

const TabBar = TabNavigator(
    {
        Home: { screen: HomeStack },
        Explore: { screen: ExploreSearchStack },
        Notifications: { screen: NotificationsStack },
        EatingOutList: { screen: EatingOutListStack },
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
                return <FontAwesome name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: brandMain,
            inactiveTintColor: brandLight,
            style: {
                backgroundColor: brandContrast,
            },
        },
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        animationEnabled: true,
        swipeEnabled: true,
    }
);

export default RootStack = StackNavigator(
    {
        Main: {
            screen: TabBar,
        },
        CreateObservation: {
            screen: CreateObservationStack,
        },
        Profile: {
            screen: ProfileStack,
        },
        SignUpLogIn: {
            screen: SignUpLogInScreen,
        }
    },
    {
        mode: 'modal',
        headerMode: 'none',
    }
);
