import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import strings from "../strings";
import styles from "../styles";
import {ProfileSegmentedControlItem} from "../Components/EatingOutListSegmentedControlItem";
import {eatingOutObservations} from "../MockupData";
import {EatingOutListComponent} from "../Components/EatingOutListComponent";

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

    constructor() {
        super();
        this.state = {
            selectedIndex: 0,
        };
        this._onPressList = this._onPressList.bind(this);
        this._onPressMap = this._onPressMap.bind(this);
    }

    _onPressList() {
        // TODO
        this.setState(previousState => {
            return {selectedIndex: 0};
        });
    }

    _onPressMap() {
        // TODO
        this.setState(previousState => {
            return {selectedIndex: 1};
        });
    }

    _keyExtractor = (item, index) => item.key;


    render() {
        return (
            <View style={{ flex: 1 }}>
                <View name={'segmentedcontrolwrapper'}
                      style={[{flexDirection: 'row'}, styles.containerPadding]}>
                    <ProfileSegmentedControlItem name={'list'} text={strings.list}
                                                 isSelected={this.state.selectedIndex === 0}
                                                 action={this._onPressList}/>
                    <ProfileSegmentedControlItem name={'map'} text={strings.map}
                                                 isSelected={this.state.selectedIndex === 1}
                                                 action={this._onPressMap}/>
                </View>
                {
                    this.state.selectedIndex === 0 &&
                    <FlatList
                        data={eatingOutObservations}
                        renderItem={({item}) => <EatingOutListComponent key={item.key} observationList={item.value} nav={this.props.navigation}/>}
                        ListEmptyComponent={() => <Text style={styles.containerPadding}>{strings.noEatingOut}</Text>}
                        ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                    />
                }
                {
                    this.state.selectedIndex === 1 &&
                    <View/>
                }

            </View>
        );
    }
}
