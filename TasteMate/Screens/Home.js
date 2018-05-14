import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import {ObservationComponent} from "../Components/ObservationComponent";
import styles from "../styles";
import {observations} from "../MockupData";
import strings from "../strings";

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
                data={observations}
                renderItem={({item}) => <ObservationComponent observation={item.value} nav={this.props.navigation}/>}
                refreshing={false}
                onRefresh={() => this._onRefreshPulled}
                ListEmptyComponent={() => <Text style={styles.containerPadding}>{strings.emptyFeed}</Text>}
                ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
            />
        );
    }
}
// TODO: empty list component with suggestions for followees/observations