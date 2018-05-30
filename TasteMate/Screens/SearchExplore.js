import React from 'react';
import {FlatList, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import styles from "../styles";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import * as MockupData from "../MockupData";
import strings from "../strings";
import {SearchBar} from "../Components/SearchBar";
import {observations} from "../MockupData";

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

    _keyExtractor = (item, index) => item.observationid;

    render() {
        return (
            <View name={'wrapper'} >
                <SearchBar placeholder={strings.foodCraving} onSubmitEditing={this._onPressSearchButton} onChangeText={this._onPressSearchButton} onPress={this._onPressSearchButton}/>
                <FlatList
                    style={styles.containerPadding}
                    keyExtractor={this._keyExtractor}
                    data={observations}
                    renderItem={({item}) => <ObservationExploreComponent observation={item} {...this.props}/>}
                    numColumns={numColumns}
                />
            </View>
        );
    }
}
