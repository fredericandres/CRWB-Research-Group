import React from 'react';
import {Text, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import strings from "../strings";

export class EatingOutListScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: strings.eatingOutList,
        headerLeft: (
            <NavBarProfileButton nav={navigation}/>
        ),
        headerRight: (
            <NavBarCreateObsButton nav={navigation}/>
        ),
    });

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Eating Out List Screen</Text>
            </View>
        );
    }
}
