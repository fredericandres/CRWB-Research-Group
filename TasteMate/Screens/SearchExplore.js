import React from 'react';
import {FlatList, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import styles from "../styles";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import * as MockupData from "../MockupData";
import strings from "../strings";
import {SearchBar} from "../Components/SearchBar";

const numColumns = 3;

export class SearchExploreScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: strings.explore,
        headerLeft: (
            <NavBarProfileButton nav={navigation}/>
        ),
        headerRight: (
            <NavBarCreateObsButton nav={navigation}/>
        ),
    });

    _onPressSearchButton() {
        // TODO: search for matching posts
    }

    render() {
        return (
            <View name={'wrapper'} >
                <SearchBar placeholder={strings.foodCraving} onSubmitEditing={this._onPressSearchButton} onChangeText={this._onPressSearchButton} onPress={this._onPressSearchButton}/>
                <FlatList
                    style={styles.containerPadding}
                    data={MockupData.observations}
                    renderItem={({item}) => <ObservationExploreComponent observation={item.value} nav={this.props.navigation}/>}
                    numColumns={numColumns}
                />
            </View>
        );
    }
}
