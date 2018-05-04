import React from 'react';
import {Button, Text, View} from 'react-native';
import StandardStyle from "./StandardStyle";
import {NavBarCreateObsButton, NavBarProfileButton} from "./NavBarButton";

export class HomeScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: 'Tastemate',
        headerLeft: (
            <NavBarProfileButton nav={navigation}/>
        ),
        headerRight: (
            <NavBarCreateObsButton nav={navigation}/>
        ),
    });

    render() {
        return (
            <View style={StandardStyle.container}>
                <Text>Home Screen</Text>
                <Button
                    title="Go to ObsDetail"
                    onPress={() => this.props.navigation.navigate('ObservationDetail')}
                />
            </View>
        );
    }
}
