import React from "react";
import {FlatList, ScrollView, Text, View} from "react-native";
import styles from "../styles";
import {observations} from "../MockupData";
import {ObservationExploreComponent} from "./ObservationExploreComponent";

export class EatingOutListComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    _keyExtractor = (item, index) => index + item.observationid;

    render() {
        return (
            <View name={'wrapper'} style={styles.containerPadding}>
                <View name={'header'}>
                    <Text name={'location'} style={styles.textTitleBoldDark}>{this.props.observationList.location}</Text>
                </View>
                <FlatList
                    name={'observationsList'}
                    keyExtractor={this._keyExtractor}
                    data={observations}
                    renderItem={({item}) =>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={[styles.containerPadding, {flexDirection: 'column', flex: 2}]}>
                                <View style={{flex: 2, justifyContent: 'center', alignItems:'center'}}>
                                    <Text name={'placename'} style={[styles.textTitle, {textAlign: 'center'}]}>{item.location.name}</Text>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                                    <Text name={'address'} style={[styles.textSmall, {textAlign: 'center'}]}>{item.location.address}</Text>
                                </View>

                            </View>
                            <View style={{flexDirection: 'row', flex: 5}}>
                                <ScrollView style={{flexDirection: 'row'}} horizontal={true} pagingEnabled={true} contentContainerStyle={{flex: 1}}>
                                    <ObservationExploreComponent observation={item.value} nav={this.props.nav}/>
                                    <ObservationExploreComponent observation={item.value} nav={this.props.nav}/>
                                    <ObservationExploreComponent observation={item.value} nav={this.props.nav}/>
                                </ScrollView>
                            </View>
                        </View>
                    }
                    ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                />
            </View>
        );
    }
}
