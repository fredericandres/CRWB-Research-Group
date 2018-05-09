import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "./NavBarButton";
import {ObservationScreen} from "./ObservationScreen";
import styles from "./styles";
import {data} from "./MockupData";

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

    _onRefreshPulled() {
        // TODO: pull to refresh
    }

    render() {

        return (
            <FlatList
                data={data}
                renderItem={({item}) => <ObservationScreen observation={item.value} nav={this.props.navigation}/>}
                refreshing={false}
                onRefresh={() => this._onRefreshPulled}
                ListEmptyComponent={() => <Text style={styles.containerPadding}>Seems like your feed is empty. Why not follow some tastemates? </Text>}
                ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
            />
        );
    }
}
// TODO: empty list component with suggestions for followees/observations