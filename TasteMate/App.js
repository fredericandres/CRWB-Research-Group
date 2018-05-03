import React from 'react';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import {HomeScreen} from "./Home";
import {DetailsScreen} from "./Details";
import {SearchExploreScreen} from "./SearchExplore";
//import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeStack = StackNavigator({
    Home: { screen: HomeScreen },
    Details: { screen: DetailsScreen },
});

const ExploreStack = StackNavigator({
    Explore: { screen: SearchExploreScreen },
    Details: { screen: DetailsScreen },
});

export default TabNavigator(
    {
        Home: { screen: HomeStack },
        Explore: { screen: ExploreStack },
    },
    /*{
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Home') {
                    iconName = `ios-information-circle${focused ? '' : '-outline'}`;
                } else if (routeName === 'Explore') {
                    iconName = `ios-options${focused ? '' : '-outline'}`;
                }

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false,
    }*/
);
