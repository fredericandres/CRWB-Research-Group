import React from "react";
import {FlatList, ScrollView, Text, View} from "react-native";
import styles from "../styles";
import {observations} from "../MockupData";
import {ObservationExploreComponent} from "./ObservationExploreComponent";
import {FURTHER_AWAY, NO_LOCATION} from "../Screens/EatingOutList";

export class EatingOutListComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    _keyExtractor = (item, index) => index + item.observationid;

    render() {
        return (
            <View name={'wrapper'} style={styles.containerPadding}>
                {this.props.observationsList.distance !== NO_LOCATION && <View name={'header'}>
                    <Text name={'location'} style={styles.textTitleBoldDark}>{this.props.observationsList.distance === FURTHER_AWAY ? strings.furtherAway : strings.formatString(strings.lessThanKm, this.props.observationsList.distance)}</Text>
                </View>}
                <FlatList
                    name={'observationsList'}
                    keyExtractor={this._keyExtractor}
                    data={this.props.observationsList.observations}
                    renderItem={({item}) =>
                        <View style={{flexDirection: 'row', alignItems: 'center', flex:1}}>
                            <View style={[styles.containerPadding, {flex: 1}]}>
                                <View style={{flex: 1, justifyContent: 'flex-end', alignItems:'center'}}>
                                    <Text name={'placename'} numberOfLines={2} style={[styles.textTitle, {textAlign: 'center'}]}>{item.location.name}</Text>
                                </View>
                                <View style={{flex: 1, justifyContent: 'flex-start', alignItems:'center'}}>
                                    <Text name={'address'} numberOfLines={4} style={[styles.textSmall, {textAlign: 'center'}]}>{item.location.address}</Text>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center', alignItems:'center', flexDirection:'row'}}>
                                    <Text name={'description'} numberOfLines={4} style={[styles.textStandardDark, {textAlign: 'center'}]}>"{item.description}"</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <ObservationExploreComponent observation={item} {...this.props}/>
                            </View>
                        </View>
                    }
                    ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                />
            </View>
        );
    }
}
