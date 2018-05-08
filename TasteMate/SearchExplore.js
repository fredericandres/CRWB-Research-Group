import React from 'react';
import {FlatList, TextInput, TouchableOpacity, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "./NavBarButton";
import styles from "./styles";
import {brandBackground, brandContrast, brandLight, brandMain} from "./constants/Colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {ObservationExploreScreen} from "./ObservationExploreScreen";

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

    }

    render() {
        return (
            <View name={'wrapper'} >
                <View name={'searchbar'} style={{backgroundColor: brandMain}}>
                    <View style={[styles.containerPadding, {flexDirection:'row', alignItems: 'center'}]}>
                        <TextInput style={[styles.textStandard, styles.containerPadding, {backgroundColor: brandBackground, flex: 1}]} placeholder="What food are you craving?" placeholderTextColor={brandLight} returnKeyType={'search'} keyboardType={'default'} underlineColorAndroid={brandContrast} selectionColor={brandContrast} onSubmitEditing={this._onPressSendButton}/>
                        <TouchableOpacity onPress={this._onPressSearchButton} style={styles.containerPadding}>
                            <FontAwesome name={'search'} size={25} color={brandContrast}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList contentContainerStyle={{justifyContent: 'space-between'}}
                          data={[
                              {key: '12343', value: { userid:213, dishname :'A  reall very long title will it fit what will the layout dor', mypoc:'Donut', location: 'Yoshinoya', googleMapsId: 'ChIJcfDfiROMGGARlXN3FRTivo8', rating:6, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'2 days ago', likes:'200k', cutleries:'5k'}},
                              {key: '1234', value: { userid:213, dishname :'Mr Frosty', mypoc:'Donut',location: 'National Institute of Informatics', googleMapsId: 'ChIJ93oq5RGMGGARDvEMb6UBvlk', rating:5, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'3 days ago', likes:'1', cutleries:'0'}},
                              {key: '12342', value: { userid:213, dishname :'Carbonarinis', mypoc:'Donut', location: 'Yoshinoya', googleMapsId: 'ChIJcfDfiROMGGARlXN3FRTivo8', rating:1, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'4 days ago', likes:'123m', cutleries:'2m'}},
                              {key: '12344', value: { userid:213, dishname :'Mr Frosty', mypoc:'Donut', location: 'Yoshinoya', googleMapsId: 'ChIJcfDfiROMGGARlXN3FRTivo8', rating:2, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'10 days ago', likes:'3k', cutleries:'607'}},
                              {key: '12345', value: { userid:213, dishname :'Madam with the longest title ever imaginable but it is a very important dish so it totally makes sense ya know it is more than four lines long wow', mypoc:'Donut', location: 'Yoshinoya', googleMapsId: 'ChIJcfDfiROMGGARlXN3FRTivo8', rating:9, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'32 days ago', likes:'110', cutleries:'7'}},
                          ]}
                          renderItem={({item}) => <ObservationExploreScreen item={item.value} nav={this.props.navigation}/>}
                          numColumns={numColumns}
                />
            </View>
        );
    }
}
