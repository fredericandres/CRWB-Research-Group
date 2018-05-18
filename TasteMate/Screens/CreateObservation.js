import React from 'react';
import {FlatList, Picker, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {NavBarCloseButton} from "../Components/NavBarButton";
import Observation from "../Data/Observation";
import strings from "../strings";
import styles from "../styles";
import {brandAccent, brandBackground, brandContrast, iconSizeStandard, EmojiEnum} from "../constants/Constants";
import {googleApiKey} from "../constants/GoogleApiKey";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import {TextInputComponent} from "../Components/TextInputComponent";
import {allCurrencies} from "../constants/Currencies";
import {SearchBar} from "../Components/SearchBar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {SettingsSwitchComponent} from "../Components/SettingsSwitchComponent";
import {allVocabulary} from "../constants/Vocabulary";

export class CreateObservationScreen extends React.Component {
    static navigationOptions =({navigation})=> ({
        title: strings.createObservation,
        headerLeft: (
            <NavBarCloseButton nav={navigation}/>
        ),
    });

    constructor(props) {
        super(props);
        // TODO: get observation info from DB

        this._onPressNext = this._onPressNext.bind(this);
        this._onPressPrevious = this._onPressPrevious.bind(this);
        this._onUpdateDishname = this._onUpdateDishname.bind(this);
        this._onUpdateDescription = this._onUpdateDescription.bind(this);
        this._onUpdateLocation = this._onUpdateLocation.bind(this);
        this._onUpdateMypoc = this._onUpdateMypoc.bind(this);
        this._onUpdatePrice = this._onUpdatePrice.bind(this);
        this._onUpdateCurrency = this._onUpdateCurrency.bind(this);
        this._onPressSmiley = this._onPressSmiley.bind(this);
        this._onCheckBoxChanged = this._onCheckBoxChanged.bind(this);
        this._onSubmitSearch = this._onSubmitSearch.bind(this);

        const edit = this.props.navigation.state.params && this.props.navigation.state.params.observation;
        this.state = {
            observation: edit ? this.props.navigation.state.params.observation : new Observation(),
            activePageIndex: 0,
            locationText: edit ? (this.props.navigation.state.params.observation.location ? this.props.navigation.state.params.observation.location : '') + (this.props.navigation.state.params.observation.address ? ', ' + this.props.navigation.state.params.observation.address : '') : '',
        };
    }

    _onPressNext() {
        if (this.state.activePageIndex === 2) {
            // TODO sumbit & close
            this.props.navigation.dismiss();
        } else {
            this.setState({activePageIndex: this.state.activePageIndex + 1});
        }
    }

    _onPressPrevious() {
        if (this.state.activePageIndex === 0) {
            // TODO cancel & close
            this.props.navigation.dismiss();
        } else {
            this.setState({activePageIndex: this.state.activePageIndex - 1});
        }
    }

    _onUpdateDishname(dishname) {
        let obs = this.state.observation;
        obs.dishname = dishname;
        this._updateObservationState(obs);
    }

    _onUpdateDescription(description) {
        let obs = this.state.observation;
        obs.description = description;
        this._updateObservationState(obs);
    }

    _onUpdateLocation(location) {
        if (!location) {
            let obs = this.state.observation;
            obs.location = '';
            obs.address = '';
            obs.googleMapsId = '';
            this._updateObservationState(obs);
        }
        this._setLocationText(location);
    }

    _onSubmitSearch() {
        let googleUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + encodeURI(this.state.locationText) + '&key=' + googleApiKey;
        fetch(googleUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({locationResults: responseJson.results});
            })
            .catch((error) => {
                console.error(error);
            });
    }

    _onUpdateMypoc(mypoc) {
        let obs = this.state.observation;
        obs.mypoc = mypoc;
        this._updateObservationState(obs);
    }

    _onUpdatePrice(price) {
        let obs = this.state.observation;
        obs.price = price;
        this._updateObservationState(obs);
    }

    _onUpdateCurrency(currency) {
        let obs = this.state.observation;
        obs.currency = currency;
        this._updateObservationState(obs);
    }

    _onPressSmiley(index) {
        let obs = this.state.observation;
        obs.rating = index;
        this._updateObservationState(obs);
    }

    _onPressLocationResult(location) {
        let obs = this.state.observation;
        obs.location = location.name;
        obs.address = location.formatted_address;
        obs.googleMapsId = location.place_id;
        this._updateObservationState(obs);
        this._setLocationText();
    }

    _setLocationText(text) {
        this.setState({locationText: text ? text : (this.state.observation.location ? this.state.observation.location : '') + (this.state.observation.address ? ', ' + this.state.observation.address : '')});
    }

    _updateObservationState(obs) {
        this.setState({observation: obs});
    }

    _onPressSearchButton(search) {
        // TODO
    }

    _onCheckBoxChanged(id) {
        let obs = this.state.observation;
        obs.vocabulary[id] = !obs.vocabulary[id];
        this._updateObservationState(obs);
    }

    _locationResultKeyExtractor = (item, index) => item.place_id;

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView name={'content'} style={{flex: 1}}>
                    {
                        this.state.activePageIndex === 0 &&
                        <View>
                            <Text>Create Observation Screen: A {this.state.observation.dishname}</Text>
                        </View>
                    }
                    {
                        this.state.activePageIndex === 1 &&
                        <View name={'detailsscreen'} style={[styles.containerPadding, {flex: 1}]}>
                            <View name={'picanddescription'} style={{flexDirection:'row', flex: 1}}>
                                <View style={{flex:1}}>
                                    <ObservationExploreComponent style={{flexShrink:1, flex: 1}}/>
                                </View>
                                <View style={{flex: 2}}>
                                    <TextInputComponent style={{flex: 1}} placeholder={this.state.observation.description} value={this.state.observation.dishname} onChangeText={(text) => this._onUpdateDescription(text)} icon={'file-text'} keyboardType={'default'} multiline={true} />
                                </View>
                            </View>
                            <View style={[{flex:1, backgroundColor: brandBackground}, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges]}>
                                <Text style={[styles.textStandardDark, styles.containerPadding]}>{strings.rateExperience}</Text>
                                <View style={[{flexDirection: 'row', flex: 1, flexWrap: 'wrap', justifyContent: 'center'}]}>
                                    {
                                        Object.keys(EmojiEnum).map(index => (
                                            <TouchableOpacity style={{justifyContent: 'center'}} key={index} onPress={() => this._onPressSmiley(parseInt(index, 10))}>
                                                <Text style={{fontSize: this.state.observation.rating === parseInt(index, 10) ? 40 : 32, color: brandContrast}}>{EmojiEnum[index]}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            </View>
                            <TextInputComponent placeholder={strings.dishname} value={this.state.observation.dishname} onChangeText={(text) => this._onUpdateDishname(text)} icon={'cutlery'} keyboardType={'default'} />
                            <TextInputComponent placeholder={this.state.observation.mypoc} value={this.state.observation.mypoc} onChangeText={(text) => this._onUpdateMypoc(text)} icon={'question'} keyboardType={'default'} />
                            <TextInputComponent placeholder={strings.location} value={this.state.locationText} onEndEditing={this._onSubmitSearch} onChangeText={(text) => this._onUpdateLocation(text)} icon={'location-arrow'} keyboardType={'default'} returnKeyType={'search'} />
                            {
                                this.state.locationResults &&
                                <View style={[{flex:1, backgroundColor: brandBackground}, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges]}>
                                    <FlatList
                                        name={'locationresults'}
                                        data={this.state.locationResults}
                                        keyExtractor={this._locationResultKeyExtractor}
                                        renderItem={({item}) =>
                                            <TouchableOpacity style={[styles.containerPadding, {flex:1, flexDirection:'column'}]} onPress={() => this._onPressLocationResult(item)}>
                                                <Text style={[styles.textStandardDark, styles.containerPadding]}>{item.name}</Text>
                                                {item.formatted_address && <Text style={[styles.textStandardDark, styles.containerPadding]}>{item.formatted_address}</Text>}
                                            </TouchableOpacity>
                                        }
                                        ListEmptyComponent={() => <Text style={[styles.containerPadding, styles.textStandardDark]}>{strings.noLocationResults}</Text>}
                                    />
                                </View>
                            }
                            <TextInputComponent placeholder={strings.price} value={this.state.observation.price} onChangeText={(text) => this._onUpdatePrice(text)} icon={'money'} keyboardType={'numeric'} style={{flex:1}}/>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <View style={[styles.containerPadding, styles.leftRoundedEdges, {flex: 1, backgroundColor: brandBackground, alignItems: 'center', justifyContent:'center'}]}>
                                    <FontAwesome name={'dollar'} size={iconSizeStandard} color={brandContrast} style={[styles.containerPadding]}/>
                                </View>
                                <View style={[styles.containerPadding, styles.rightRoundedEdges, {flex: 6, backgroundColor: brandBackground}]}>
                                    <Picker
                                        style={{flex:1}}
                                        prompt={strings.selectCurrency}
                                        selectedValue={this.state.observation.currency}
                                        onValueChange={(itemValue, itemIndex) => this._onUpdateCurrency(itemValue)}>
                                        {
                                            Object.keys(allCurrencies).map(currency => (
                                                <Picker.Item key={currency} label={currency + ' - ' + allCurrencies[currency].name} value={currency} />
                                            ))
                                        }
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    }
                    {
                        this.state.activePageIndex === 2 &&
                        <View name={'adjectivesscreen'} style={{flex:1}}>
                            <SearchBar placeholder={strings.searchVocabulary} onSubmitEditing={this._onPressSearchButton} onChangeText={this._onPressSearchButton} onPress={this._onPressSearchButton}/>
                            <FlatList
                                name={'checkboxes'}
                                style={[styles.containerPadding, {flex: 1, flexDirection:'column'}]}
                                data={allVocabulary}
                                numColumns={2}
                                renderItem={({item}) =>
                                    <View style={[styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges, {flex:1}]}>
                                        <SettingsSwitchComponent value={this.state.observation.vocabulary && this.state.observation.vocabulary[item.key] ? this.state.observation.vocabulary[item.key] : false} onValueChange={() => this._onCheckBoxChanged(item.key)} text={item.value.en}/>
                                    </View>
                                }
                            />
                        </View>
                    }
                </ScrollView>
                <View name={'interactionButtons'} style={[styles.containerPadding, {flexDirection: 'row', }]}>
                    <View name={'previousButtonWrapper'} style={ {flex: 1}}>
                        <TouchableOpacity name={'previousButton'} onPress={this._onPressPrevious} style={[{flex:1, backgroundColor:brandBackground, alignItems:'center', justifyContent:'center'}, styles.containerPadding, styles.leftRoundedEdges]}>
                            <Text style={[styles.textTitleDark, styles.containerPadding]}>{this.state.activePageIndex === 0 ? strings.cancel: strings.previous}</Text>
                        </TouchableOpacity>
                    </View>
                    <View name={'nextButtonWrapper'} style={{flex: 1}}>
                        <TouchableOpacity name={'nextButton'} onPress={this._onPressNext} style={[{backgroundColor:brandAccent, alignItems:'center'}, styles.containerPadding, styles.rightRoundedEdges]}>
                            <Text style={[styles.textTitleBoldLight, styles.containerPadding]}>{this.state.activePageIndex === 2 ? strings.publish: strings.next}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}