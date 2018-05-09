import React from 'react';
import {FlatList, TextInput, TouchableOpacity, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "./NavBarButton";
import styles from "./styles";
import {brandBackground, brandContrast, brandLight, brandMain} from "./constants/Constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {ObservationExploreComponent} from "./ObservationExploreComponent";
import * as MockupData from "./MockupData";

const numColumns = 3;

export class SearchExploreScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: 'Explore',
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
                <View name={'searchbar'} style={{backgroundColor: brandMain}}>
                    <View style={[styles.containerPadding, {flexDirection:'row', alignItems: 'center'}]}>
                        <TextInput style={[styles.textStandard, styles.containerPadding, {backgroundColor: brandBackground, flex: 1}]}
                                   placeholder="What food are you craving?"
                                   placeholderTextColor={brandLight}
                                   returnKeyType={'search'}
                                   keyboardType={'default'}
                                   clearButtonMode={'always'}
                                   underlineColorAndroid={brandBackground}
                                   selectionColor={brandContrast}
                                   onSubmitEditing={this._onPressSendButton}
                                   onChangeText={this._onPressSearchButton}
                        />
                        <TouchableOpacity onPress={this._onPressSearchButton} style={styles.containerPadding}>
                            <FontAwesome name={'search'} size={25} color={brandContrast}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList contentContainerStyle={{justifyContent: 'space-between'}}
                          data={MockupData.observations}
                          renderItem={({item}) => <ObservationExploreComponent observation={item.value} nav={this.props.navigation}/>}
                          numColumns={numColumns}
                />
            </View>
        );
    }
}
