import React from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Linking,
    Picker,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {NavBarCloseButton} from "../Components/NavBarButton";
import Observation from "../Data/Observation";
import strings from "../strings";
import styles from "../styles";
import {
    _addPictureToStorage,
    brandAccent,
    brandBackground,
    brandContrast,
    EmojiEnum,
    iconSizeStandard,
    pathObservations
} from "../constants/Constants";
import {googleApiKey} from "../constants/GoogleApiKey";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import {TextInputComponent} from "../Components/TextInputComponent";
import {allCurrencies} from "../constants/Currencies";
import {SearchBar} from "../Components/SearchBar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {SettingsSwitchComponent} from "../Components/SettingsSwitchComponent";
import {allVocabulary} from "../constants/Vocabulary";
import RNFetchBlob from 'react-native-fetch-blob';
import XMLParser from 'react-xml-parser';
import firebase from 'react-native-firebase';
import {currentUser} from "../App";
import {CameraCameraRollComponent} from "../Components/CameraCameraRollComponent";
import {ActivityIndicatorComponent} from "../Components/ActivityIndicatorComponent";

const PagesEnum = Object.freeze({SELECTIMAGE:0, DETAILS:1, TASTE:2});

export class CreateObservationScreen extends React.Component {
    static navigationOptions =({navigation})=> ({
        title: (navigation.getParam('edit') ? strings.editObservation : strings.createObservation) + ' ',
        headerLeft: (
            <NavBarCloseButton nav={navigation}/>
        ),
    });

    constructor(props) {
        super(props);
        this._onPressNext = this._onPressNext.bind(this);
        this._onPressPrevious = this._onPressPrevious.bind(this);

        this._onUpdateDescription = this._onUpdateDescription.bind(this);
        this._onPressSmiley = this._onPressSmiley.bind(this);
        this._onUpdateDishname = this._onUpdateDishname.bind(this);
        this._onUpdateLocation = this._onUpdateLocation.bind(this);
        this._onUpdateMypoc = this._onUpdateMypoc.bind(this);
        this._onUpdatePrice = this._onUpdatePrice.bind(this);
        this._onUpdateCurrency = this._onUpdateCurrency.bind(this);

        this._onCheckBoxChanged = this._onCheckBoxChanged.bind(this);
        this._onSubmitSearch = this._onSubmitSearch.bind(this);

        this._sendToMyPoC = this._sendToMyPoC.bind(this);
        this._onImageSelected = this._onImageSelected.bind(this);

        this._startActivityIndicator = this._startActivityIndicator.bind(this);
        this._stopActivityIndicator = this._stopActivityIndicator.bind(this);
        this._setActivityIndicatorText = this._setActivityIndicatorText.bind(this);

        this.isEditing = this.props.navigation.getParam('edit');
        this.inputs = {};
        const obs = this.props.navigation.state.params.observation;
        this.state = {
            observation: this.isEditing ? obs : new Observation(),
            activePageIndex: this.isEditing ? PagesEnum.DETAILS : PagesEnum.SELECTIMAGE,
            locationText: (this.isEditing && obs.location) ? (obs.location.name ? obs.location.name : '') + (obs.location.address ? ', ' + obs.location.address : '') : '',
            myPocEdited: false,
        };
    }

    /************* NAVIGATION *************/

    _handleMissing(missing){
        let message = '';
        if (missing.length === 1) {
            message = strings.formatString(strings.missingValuesTextSg, missing[0]);
        } else if (missing.length === 2) {
            message = strings.formatString(strings.missingValuesTextPl, missing[0], missing[1]);
        } else {
            const lastElement = missing[missing.length - 1];
            message = strings.formatString(strings.missingValuesTextPl, this._getItemizedMessage(missing), lastElement);
        }

        Alert.alert(strings.missingValuesTitle, message,
            [
                {text: strings.ok},
            ]
        );
    }

    _getItemizedMessage(missing) {
        if (missing.length === 1) {
            return '';
        } else if (missing.length === 2) {
            return missing[0];
        } else {
            const newMissing = missing.splice(1,missing.length-1);
            return strings.formatString(strings.itemization, missing[0], this._getItemizedMessage(newMissing));
        }
    }

    _onPressNext() {
        if (this.state.activePageIndex === PagesEnum.TASTE) {
            // Check if all mandatory fields have content
            let missing = [];
            if (!this.state.observation.image && !this.state.observation.imageUrl) {
                missing.push(strings.picture);
            }
            if (!this.state.observation.description) {
                missing.push(strings.description);
            }
            if (!this.state.observation.dishname) {
                missing.push(strings.dishname);
            }
            if (!this.state.observation.price) {
                missing.push(strings.price);
            }
            if (!this.state.observation.currency) {
                missing.push(strings.currency);
            }
            // TODO: At least 3 (?) tastes should be selected

            if (missing.length > 0) {
                this._handleMissing(missing);
            } else {
                this._startActivityIndicator(strings.savingObservation);

                let observation = this.state.observation;

                if (observation.location && !observation.location.name) {
                    // Remove location property if no actual location was connected to it
                    delete observation.location;
                }

                if (this.isEditing) {
                    firebase.database().ref(pathObservations + '/' + currentUser.uid + '/' + this.state.observation.observationid).update(observation, (error) => {
                        this._stopActivityIndicator();
                        if (error) {
                            console.error('Error during observation update transmission.');
                            console.error(error);
                            this._handleAuthError(error);

                            // TODO: display error message
                        } else {
                            console.log('Successfully updated observation at DB.');
                            this.props.navigation.dismiss();
                        }
                    });
                } else {
                    let ref = firebase.database().ref(pathObservations + '/' + currentUser.uid);
                    observation.userid = currentUser.uid;
                    observation.timestamp = firebase.database().getServerTime();
                    observation.observationid = ref.push().key;

                    // Remove image property but save for image upload
                    const imageUrl = observation.image;
                    delete observation.image;

                    const observationRef = firebase.database().ref(pathObservations + '/' + currentUser.uid + '/' + observation.observationid);
                    observationRef.set(observation,
                        (error) => {
                            this._stopActivityIndicator();
                            if (error) {
                                console.error('Error during observation transmission.');
                                console.error(error);
                                // TODO: display error message
                            } else {
                                console.log('Successfully added observation to DB.');
                                _addPictureToStorage('/' + pathObservations + '/' + observation.observationid + '.jpg', imageUrl, observationRef);
                                this.props.navigation.dismiss();
                            }
                        });
                }
            }
        } else {
            this.setState({activePageIndex: this.state.activePageIndex + 1});
        }
    }

    _onPressPrevious() {
        if ((this.isEditing && this.state.activePageIndex === PagesEnum.DETAILS) || this.state.activePageIndex === PagesEnum.SELECTIMAGE) {
            this.props.navigation.dismiss();
        } else {
            this.setState({activePageIndex: this.state.activePageIndex - 1});
        }
    }

    /************* CAMERA ROLL *************/

    _onImageSelected(uri, base64) {
        let obs = this.state.observation;
        obs.image = uri;
        this._updateObservationState(obs);

        this._sendToMyPoC(base64, this._onUpdateMypoc).then(() => {
            console.log('MyPoC blob created');
        });
        this._onPressNext();
    }

    async _sendToMyPoC(base64, action) {
        // let obs = this.state.observation;
        // obs.imageBase64 = base64;
        // this._updateObservationState(obs);

        // Create blob from base64
        const Blob = RNFetchBlob.polyfill.Blob;
        Blob.build(base64, { type : 'image/jpg;BASE64' }).then((blob) => {
            // Send blob as octet-stream POST request to MyPoC server
            let xhr = new RNFetchBlob.polyfill.XMLHttpRequest();
            xhr.open('POST', 'http://odbenchmark.isima.fr/CRWB-Erina-web/resource/observation');
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        // GET xml file for observation
                        fetch(xhr.response)
                            .then((response) => response.text())
                            .then((xmlText) => {
                                console.log('MyPoC prediction successfully retrieved');
                                // Parse xml text into object and look for 'text' element --> MyPoC prediction of image
                                const xml = new XMLParser().parseFromString(xmlText);
                                const mypoc = xml.getElementsByTagName("text")[0].value;
                                action(mypoc);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else {
                        console.log('An error occurred while sending image to MyPoC server');
                        console.log(xhr);
                    }
                }
            };
            xhr.send(blob);
        });
    }

    /************* DETAILS *************/

    _onUpdateDescription(description) {
        let obs = this.state.observation;
        obs.description = description;
        this._updateObservationState(obs);
    }

    _onPressSmiley(index) {
        let obs = this.state.observation;
        obs.rating = index;
        this._updateObservationState(obs);
    }

    _onUpdateDishname(dishname) {
        let obs = this.state.observation;
        obs.dishname = dishname;
        this._updateObservationState(obs);
    }

    _onUpdateMypoc(mypoc) {
        let obs = this.state.observation;
        if (!this.state.observation.mypoc ) {
            obs.mypoc = mypoc;
        } else {
            this.setState({myPocEdited:true});
            obs.mypoccorrector = mypoc.toLowerCase();
            // TODO [FEATURE]: Send corrected info to mypoc server
        }
        this._updateObservationState(obs);
    }

    _onUpdateLocation(location) {
        if (!location) {
            let obs = this.state.observation;
            obs.location = {};
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

    _onPressLocationResult(location) {
        let obs = this.state.observation;
        obs.location = {};

        obs.location.name = location.name;
        obs.location.address = location.formatted_address;
        obs.location.googleMapsId = location.place_id;
        obs.location.latitude = location.geometry.location.lat;
        obs.location.longitude = location.geometry.location.lng;
        console.log(obs);
        this._updateObservationState(obs);
        this._setLocationText();
    }

    _locationResultKeyExtractor = (item, index) => item.place_id;


    _setLocationText(text) {
        this.setState({locationText: text ? text : (this.state.observation.location.name || '') + (this.state.observation.location.address ? ', ' + this.state.observation.location.address : '')});
    }

    _updateObservationState(obs) {
        this.setState({observation: obs});
    }

    _onUpdatePrice(price) {
        let obs = this.state.observation;
        obs.price = price + '';
        this._updateObservationState(obs);
    }

    _onUpdateCurrency(currency) {
        let obs = this.state.observation;
        obs.currency = currency;
        this._updateObservationState(obs);
    }

    _focusNextField(key) {
        this.inputs[key].focus();
    }

    /************* EATING EXPERIENCE *************/

    _onPressSearchButton(search) {
        // TODO filter items
    }

    _onCheckBoxChanged(id) {
        let obs = this.state.observation;
        obs.vocabulary[id] = !obs.vocabulary[id];
        this._updateObservationState(obs);
    }

    /************* ACTIVITY INDICATOR *************/

    _startActivityIndicator(text) {
        if (!this.state.loadingIndicatorVisible) {
            this.setState({loadingIndicatorVisible: true});
            this._setActivityIndicatorText(text);
        }
    }

    _stopActivityIndicator() {
        if (this.state.loadingIndicatorVisible) {
            this.setState({loadingIndicatorVisible: false});
            this._setActivityIndicatorText('');
        }
    }

    _setActivityIndicatorText(text) {
        this.setState({loadingIndicatorText: text});
    }

    render() {
        const myPocAlertButtons = [
            {text: strings.ok},
            {text: strings.more, onPress: () => Linking.openURL('https://github.com/fredericandres/CRWB-Research-Group/wiki/MyPoC-App')}
        ];

        const smallEmojiSize = (Dimensions.get('window').width - 4 * 6)/(Object.keys(EmojiEnum).length + 1);
        const selectedEmojiSize = smallEmojiSize * 1.5;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View name={'content'} style={{flex: 1}}>
                    {
                        this.state.activePageIndex === PagesEnum.SELECTIMAGE && <CameraCameraRollComponent onImageSelectedAction={this._onImageSelected}/>
                    }
                    {
                        this.state.activePageIndex === PagesEnum.DETAILS &&
                        <ScrollView name={'detailsscreen'} style={[styles.containerPadding, {flex: 1}]}>
                            <View name={'picanddescription'} style={{flexDirection:'row', flex: 1}}>
                                <View style={[styles.containerPadding, {flex:1}]}>
                                    <ObservationExploreComponent source={{uri: this.state.observation.image || this.state.observation.imageUrl}} style={{flexShrink:1, flex: 1}}/>
                                </View>
                                <View style={{flex: 2}}>
                                    <TextInputComponent style={{flex: 1}} placeholder={strings.description} value={this.state.observation.description} onChangeText={(text) => this._onUpdateDescription(text)} icon={'file-text'} keyboardType={'default'} multiline={true} />
                                </View>
                            </View>
                            <View style={[{flex:1, backgroundColor: brandBackground}, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges]}>
                                <Text style={[styles.textStandardDark, styles.containerPadding]}>{strings.rateExperience}</Text>
                                <View style={[{flexDirection: 'row', flex: 1, flexWrap: 'wrap', justifyContent: 'center'}]}>
                                    {
                                        Object.keys(EmojiEnum).map(index => (
                                            <TouchableOpacity style={[{justifyContent: 'center', alignSelf:'center', width: this.state.observation.rating === parseInt(index, 10) ? selectedEmojiSize : smallEmojiSize, aspectRatio: 1}]} key={index} onPress={() => this._onPressSmiley(parseInt(index, 10))}>
                                                <Image name={'emoji'} resizeMode={'cover'} source={EmojiEnum[index]} style={{flex: 1, aspectRatio: 1}}/>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            </View>
                            <TextInputComponent
                                placeholder={strings.dishname}
                                value={this.state.observation.dishname}
                                onChangeText={(text) => this._onUpdateDishname(text)}
                                icon={'cutlery'}
                                keyboardType={'default'}
                                returnKeyType={'next'}
                                onSubmitEditing={() => {this._focusNextField('mypoc');}}
                            />
                            <TextInputComponent
                                ref={ input => {this.inputs['mypoc'] = input;}}
                                info={true}
                                infoTitle={strings.mypocExplanationTitle}
                                infoText={strings.mypocExplanationText}
                                infoButtons={myPocAlertButtons}
                                placeholder={this.state.observation.mypoc || 'prediction loading...'}
                                value={this.state.myPocEdited ? this.state.observation.mypoccorrector : this.state.observation.mypoc}
                                onChangeText={(text) => this._onUpdateMypoc(text)}
                                icon={'question'}
                                keyboardType={'default'}
                                returnKeyType={'next'}
                                onSubmitEditing={() => {this._focusNextField('location');}}
                            />
                            <TextInputComponent
                                ref={ input => {this.inputs['location'] = input;}}
                                placeholder={strings.location}
                                value={this.state.locationText}
                                onEndEditing={this._onSubmitSearch}
                                onChangeText={(text) => this._onUpdateLocation(text)}
                                icon={'location-arrow'}
                                keyboardType={'default'}
                                returnKeyType={'search'}
                            />
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
                            <TextInputComponent
                                placeholder={strings.price}
                                value={this.state.observation.price}
                                onChangeText={(text) => this._onUpdatePrice(text)}
                                icon={'money'}
                                keyboardType={'numeric'}
                                style={{flex:1}}
                                returnKeyType={'next'}
                            />
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
                        </ScrollView>
                    }
                    {
                        this.state.activePageIndex === PagesEnum.TASTE &&
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
                </View>
                {(this.state.observation.image || this.state.observation.imageUrl) && <View name={'interactionButtons'} style={[ {flexDirection: 'row', }]}>
                    <View name={'previousButtonWrapper'} style={ {flex: 1}}>
                        <TouchableOpacity name={'previousButton'} onPress={this._onPressPrevious} style={[{flex:1, backgroundColor:brandBackground, alignItems:'center', justifyContent:'center'}, styles.containerPadding, styles.leftRoundedEdges]}>
                            <Text style={[styles.textTitleDark, styles.containerPadding]}>{(this.isEditing && this.state.activePageIndex === PagesEnum.DETAILS) || this.state.activePageIndex === PagesEnum.SELECTIMAGE ? strings.cancel: strings.previous}</Text>
                        </TouchableOpacity>
                    </View>
                    <View name={'nextButtonWrapper'} style={{flex: 1}}>
                        <TouchableOpacity name={'nextButton'} onPress={this._onPressNext} style={[{backgroundColor: brandAccent, alignItems:'center'}, styles.containerPadding, styles.rightRoundedEdges]}>
                            <Text style={[styles.textTitleBoldLight, styles.containerPadding]}>{this.state.activePageIndex === PagesEnum.TASTE ? (this.isEditing ? strings.save : strings.publish): strings.next}</Text>
                        </TouchableOpacity>
                    </View>
                </View>}
                {
                    this.state.loadingIndicatorVisible &&
                    <ActivityIndicatorComponent visible={this.state.loadingIndicatorVisible} text={this.state.loadingIndicatorText}/>
                }
            </SafeAreaView>
        );
    }
}