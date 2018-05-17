import React from 'react';
import {Picker, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {NavBarCloseButton} from "../Components/NavBarButton";
import Observation from "../Data/Observation";
import strings from "../strings";
import styles from "../styles";
import {brandAccent, brandBackground, brandContrast, SmileysEnum} from "../constants/Constants";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import {SettingsTextInputComponent} from "../Components/SettingsTextInputComponent";
import {allCurrencies} from "../constants/Currencies";

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

        const edit = this.props.navigation.state.params && this.props.navigation.state.params.observation;
        this.state = {
            observation: edit ? this.props.navigation.state.params.observation : new Observation(),
            activePageIndex: 0,
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
        let obs = this.state.observation;
        obs.location = location;
        this._updateObservationState(obs);
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

    _updateObservationState(obs) {
        this.setState({observation: obs});
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
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
                                    <SettingsTextInputComponent style={{flex: 1}} placeholder={this.state.observation.description} value={this.state.observation.dishname} onChangeText={(text) => this._onUpdateDescription(text)} icon={'file-text'} keyboardType={'default'} multiline={true} />
                                </View>
                            </View>
                            <View style={[{flex:1, backgroundColor: brandBackground}, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges]}>
                                <Text style={[styles.textStandardDark, styles.containerPadding]}>{strings.rateExperience}</Text>
                                <View style={[{flexDirection: 'row', flex: 1, flexWrap: 'wrap', justifyContent: 'center'}]}>
                                    {
                                        Object.keys(SmileysEnum).map(index => (
                                            <TouchableOpacity style={{justifyContent: 'center'}} key={index} onPress={() => this._onPressSmiley(parseInt(index, 10))}>
                                                <Text style={{fontSize: this.state.observation.rating === parseInt(index, 10) ? 40 : 32, color: brandContrast}}>{SmileysEnum[index]}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            </View>
                            <SettingsTextInputComponent placeholder={strings.dishname} value={this.state.observation.dishname} onChangeText={(text) => this._onUpdateDishname(text)} icon={'cutlery'} keyboardType={'default'} />
                            <SettingsTextInputComponent placeholder={this.state.observation.mypoc} value={this.state.observation.mypoc} onChangeText={(text) => this._onUpdateMypoc(text)} icon={'question'} keyboardType={'default'} />
                            <SettingsTextInputComponent placeholder={strings.location} value={this.state.observation.location} onChangeText={(text) => this._onUpdateLocation(text)} icon={'location-arrow'} keyboardType={'default'} />
                            <SettingsTextInputComponent placeholder={strings.price} value={this.state.observation.price} onChangeText={(text) => this._onUpdatePrice(text)} icon={'money'} keyboardType={'numeric'} style={{flex:1}}/>
                            <View style={[{flex:1, flexDirection: 'row', alignItems:'center', backgroundColor: brandBackground}, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges]}>
                                <Text style={[styles.textStandardDark, styles.containerPadding]}>{strings.currency}</Text>
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
                    }
                    {
                        this.state.activePageIndex === 2 &&
                        <View>
                            <Text>Create Observation Screen: C {this.state.observation.dishname}</Text>
                        </View>
                    }

                </ScrollView>
                <View name={'interactionButtons'} style={{flexDirection: 'row', }}>
                    <View name={'previousButtonWrapper'} style={[styles.containerPadding, {flex: 1}]}>
                        <TouchableOpacity name={'previousButton'} onPress={this._onPressPrevious} style={[{backgroundColor:brandBackground, alignItems:'center'}, styles.containerPadding, styles.leftRoundedEdges]}>
                            <Text style={[styles.textTitleDark, styles.containerPadding]}>{this.state.activePageIndex === 0 ? strings.cancel: strings.previous}</Text>
                        </TouchableOpacity>
                    </View>
                    <View name={'nextButtonWrapper'} style={[styles.containerPadding, {flex: 1}]}>
                        <TouchableOpacity name={'nextButton'} onPress={this._onPressNext} style={[{backgroundColor:brandAccent, alignItems:'center'}, styles.containerPadding, styles.rightRoundedEdges]}>
                            <Text style={[styles.textTitleBoldLight, styles.containerPadding]}>{this.state.activePageIndex === 2 ? strings.publish: strings.next}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}