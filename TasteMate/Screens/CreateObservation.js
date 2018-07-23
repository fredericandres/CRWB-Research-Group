import React from 'react';
import {
    Alert,
    AsyncStorage,
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {NavBarCloseButton} from "../Components/NavBarButton";
import Observation from "../Data/Observation";
import strings from "../strings";
import styles, {smallFontSize, standardFontSize} from "../styles";
import {
    _addPictureToStorage,
    _checkInternetConnection,
    AsyncStorageKeyObservations,
    colorAccent,
    colorBackground,
    colorContrast,
    colorLight,
    colorMain,
    EmojiEnum,
    iconCutlery,
    iconDescription,
    iconDietaryInfo,
    iconDishName,
    iconEatingOut,
    iconLocation,
    iconMyPoc,
    iconPrice,
    iconSizeSmall,
    iconSizeStandard,
    pathObservations
} from "../constants/Constants";
import {mapboxApiKey} from "../constants/GoogleApiKey";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import {TextInputComponent} from "../Components/TextInputComponent";
import {allCurrencies} from "../constants/Currencies";
import {SearchBar} from "../Components/SearchBar";
import {SettingsSwitchComponent} from "../Components/SettingsSwitchComponent";
import {allVocabulary} from "../constants/Vocabulary";
import RNFetchBlob from 'react-native-fetch-blob';
import XMLParser from 'react-xml-parser';
import firebase from 'react-native-firebase';
import {currentUser} from "../App";
import {CameraCameraRollComponent} from "../Components/CameraCameraRollComponent";
import {ActivityIndicatorComponent} from "../Components/ActivityIndicatorComponent";
import {EmptyComponent} from "../Components/EmptyComponent";
import {Dropdown} from 'react-native-material-dropdown';
import {allDietaryRestrictions} from "../constants/DietaryRestrictions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const PagesEnum = Object.freeze({SELECTIMAGE:0, DETAILS:1, TASTE:2});
// let allVocabs = null;
let allVocabSorted = null;

export class CreateObservationScreen extends React.Component {
    static navigationOptions =({navigation})=> {
        const {params = {}} = navigation.state;
        return {
            title: (navigation.getParam('edit') ? strings.editObservation : strings.createObservation) + ' ',
            headerLeft: (
                <NavBarCloseButton nav={navigation} action={navigation.getParam('edit') ? null : () => params.onClose()}/>
            ),
        }
    };

    // TODO [FEATURE]: Disable orientation change when camera open
    // TODO [FEATURE]: Crop/add filters to picture

    constructor(props) {
        super(props);
        this._onPressNext = this._onPressNext.bind(this);
        this._onPressPrevious = this._onPressPrevious.bind(this);
        this._onPressSaveDraftButton = this._onPressSaveDraftButton.bind(this);
        this._onDraftSelected = this._onDraftSelected.bind(this);
        this._removeDraft = this._removeDraft.bind(this);
        this._loadDrafts = this._loadDrafts.bind(this);
        this._showDraftDeleteAlert = this._showDraftDeleteAlert.bind(this);
        this._sendObservation = this._sendObservation.bind(this);

        this._onSubmitSearch = this._onSubmitSearch.bind(this);
        this._sendToMyPoC = this._sendToMyPoC.bind(this);
        this._onImageSelected = this._onImageSelected.bind(this);
        this._onUpdateMyPoC = this._onUpdateMyPoC.bind(this);
        this._onUpdateCurrency = this._onUpdateCurrency.bind(this);

        this._startActivityIndicator = this._startActivityIndicator.bind(this);
        this._stopActivityIndicator = this._stopActivityIndicator.bind(this);
        this._setActivityIndicatorText = this._setActivityIndicatorText.bind(this);
        this._closeWindow = this._closeWindow.bind(this);

        this.isEditing = this.props.navigation.getParam('edit');
        this.inputs = {};
        const obs = this.props.navigation.getParam('observation');

        allVocabSorted = allVocabulary.slice();
        allVocabSorted.sort(function (a, b) {
            if (a.value.name < b.value.name)
                return -1;
            if (a.value.name > b.value.name)
                return 1;
            return 0;
        });

        this.state = {
            observation: this.isEditing ? obs : new Observation(),
            activePageIndex: this.isEditing ? PagesEnum.DETAILS : PagesEnum.SELECTIMAGE,
            locationText: (this.isEditing && obs.location) ? obs.location.address : '',
            myPocEdited: false,
            // sections: [],
            searchText: '',
            smallEmojiSize: 0,
            selectedEmojiSize: 0,
            searchedVocabSorted: allVocabSorted,
            drafts: {},
        };

        this.mypocRequest = null;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onClose: (() => this._openExitAlert()),
        });

        this._onPressSearchButton(null);

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this._openExitAlert();
            return true;
        });

        this._loadDrafts();
    }

    componentWillUnmount() {
        this.backHandler.remove();
        if (this.mypocRequest) {
            this.mypocRequest.onreadystatechange = null;
        }
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

        Alert.alert(strings.missingValuesTitle, message, [{text: strings.ok},]);
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
                missing.push(strings.picture.toLowerCase());
            }
            if (!this.state.observation.description) {
                missing.push(strings.description.toLowerCase());
            }
            if (!this.state.observation.dishname) {
                missing.push(strings.dishname.toLowerCase());
            }
            if (!this.state.observation.price) {
                missing.push(strings.price.toLowerCase());
            }
            if (!this.state.observation.currency) {
                missing.push(strings.currency.toLowerCase());
            }
            if (!this.state.observation.vocabulary || Object.keys(this.state.observation.vocabulary).length < 1) {
                missing.push(strings.tasteTerms);
            }
            if ((!this.state.observation.mypoc || this.state.observation.mypoc === '') && !this.state.observation.mypoccorrector) {
                missing.push(strings.myPoc.toLowerCase());
            }

            if (missing.length > 0) {
                this._handleMissing(missing);
            } else {
                _checkInternetConnection(this._sendObservation, null);
            }
        } else {
            this.setState((prevState) => ({activePageIndex: prevState.activePageIndex + 1}));
        }
    }

    _sendObservation() {
        this._startActivityIndicator(strings.savingObservation);

        let observation = this.state.observation;

        if (observation.location && !observation.location.name) {
            // Remove location property if no actual location was connected to it
            delete observation.location;
        }

        // Clean up text input: Remove spaces etc in front of/after; pare price as float
        observation.description = observation.description.trim();
        observation.dishname = observation.dishname.trim();
        if (observation.mypoccorrector) {
            observation.mypoccorrector = observation.mypoccorrector.toLowerCase().trim();
        }
        const priceNumber = parseFloat(observation.price);
        observation.price = priceNumber ? (parseInt(priceNumber) !== priceNumber ? priceNumber.toFixed(2) : priceNumber).toString() : '0';

        if (this.isEditing) {
            firebase.database().ref(pathObservations).child(currentUser.uid).child(this.state.observation.observationid).update(observation)
                .then(() => {
                    this._stopActivityIndicator();
                    console.log('Successfully updated observation at DB.');
                    this._closeWindow(observation, null);
                }).catch((error) => {
                    console.log('Error during observation update transmission.');
                    this._stopActivityIndicator();
                    console.log(error);
                    // TODO: display error message
                }
            );
        } else {
            let ref = firebase.database().ref(pathObservations).child(currentUser.uid);
            observation.userid = currentUser.uid;
            observation.timestamp = firebase.database().getServerTime();
            observation.observationid = observation.observationid || ref.push().key;

            // Remove image property but save for image upload
            const imageUrl = observation.image;
            delete observation.image;

            const observationRef = firebase.database().ref(pathObservations).child(currentUser.uid).child(observation.observationid);
            observationRef.set(observation)
                .then(() => {
                    console.log('Successfully added observation to DB.');
                    _addPictureToStorage('/' + pathObservations + '/' + observation.observationid + '.jpg', imageUrl, observationRef, ((url) => this._closeWindow(observation, url)), this._setActivityIndicatorText, this._stopActivityIndicator);
                }).catch((error) => {
                    console.log('Error during observation transmission.');
                    this._stopActivityIndicator();
                    console.log(error);
                    // TODO: display error message
                }
            );
            observation.image = imageUrl;
        }
    }

    _closeWindow(observation, url) {
        if (this.isEditing) {
            if (this.props.navigation.getParam('onUpdate')) {
                this.props.navigation.getParam('onUpdate')(observation);
            }
            this.props.navigation.dismiss();
        } else {
            this._removeDraft(observation.observationid).then(() => {
                    observation.imageUrl = url;
                    if (this.props.navigation.getParam('onCreate')) {
                        this.props.navigation.getParam('onCreate')(observation);
                    }
                    this.props.navigation.dismiss();
                }
            );
        }
    }

    _onPressPrevious() {
        if ((this.isEditing && this.state.activePageIndex === PagesEnum.DETAILS) || this.state.activePageIndex === PagesEnum.SELECTIMAGE) {
            this._openExitAlert();
        } else {
            this.setState((prevState) => ({activePageIndex: prevState.activePageIndex - 1}));
        }
    }

    /************* DRAFTS *************/

    _openExitAlert() {
        if (this.state.observation.observationid && this.state.drafts[this.state.observation.observationid]) {
            this._onPressSaveDraftButton();
        } else if (this.state.observation.image || this.state.observation.imageURL) {
            Alert.alert(strings.exitCreateAlertTitle, strings.exitCreateAlertMessage,
                [
                    {text: strings.discard, onPress: () => this.props.navigation.dismiss(), style: 'cancel'},
                    {text: strings.saveDraft, onPress: this._onPressSaveDraftButton},
                ]
            );
        } else {
            this.props.navigation.dismiss();
        }
    }

    async _loadDrafts() {
        try {
            const observationsJSON = await AsyncStorage.getItem('OBSERVATIONS');
            const observations = JSON.parse(observationsJSON);
            this.setState({drafts: observations});
        } catch (error) {
            console.log(error);
        }
    }

    async _onPressSaveDraftButton() {
        try {
            const observationsJSON = await AsyncStorage.getItem(AsyncStorageKeyObservations);
            let observations = {};

            if (observationsJSON !== null) {
                observations = JSON.parse(observationsJSON);
            }

            let obs = this.state.observation;
            if (!obs.observationid) {
                obs.observationid = firebase.database().ref(pathObservations).child(currentUser.uid).push().key;
            }

            observations[obs.observationid] = obs;
            await AsyncStorage.setItem(AsyncStorageKeyObservations, JSON.stringify(observations));
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
        this.props.navigation.dismiss();
    }

    _onDraftSelected(item) {
        console.log(item);
        this.setState({observation: item}, (() => {
            this._onPressNext();
            if (!item.mypoc) {
                this._sendToMyPoC(item.image).then(() => {
                    console.log('MyPoC request sent');
                });
            }
            if (item.location) {
                this._setLocationText();
            }
        }));
    }

    async _removeDraft(observationid) {
        console.log(observationid);
        try {
            let drafts = this.state.drafts;
            console.log(drafts);
            if (drafts[observationid]) {
                delete drafts[observationid];
                await AsyncStorage.setItem(AsyncStorageKeyObservations, JSON.stringify(drafts));
                this.setState({drafts: drafts});
            }
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
    }

    _showDraftDeleteAlert(item) {
        Alert.alert(strings.deleteDraftAlertTitle, strings.deleteDraftAlertMessage,
            [
                {text: strings.cancel, style: 'cancel'},
                {text: strings.deleteDraft, onPress: () => this._removeDraft(item.observationid), style: 'destructive'},
            ]
        );
    }

    /************* CAMERA ROLL *************/

    async _onImageSelected(uri) {
        let obs = this.state.observation;
        obs.image = uri;
        this._updateObservationState(obs);

        this._sendToMyPoC(uri).then(() => {
            console.log('MyPoC request sent');
        });
        this._onPressNext();
    }

    async _sendToMyPoC(uri) {
        const updateMyPoC = this._onUpdateMyPoC;
        // Create blob from base64
        RNFetchBlob.fs.readFile(uri, 'base64')
            .then((data) => {
                const Blob = RNFetchBlob.polyfill.Blob;
                Blob.build(data, { type : 'image/jpg;BASE64' }).then((blob) => {
                    if (this.mypocRequest) {
                        this.mypocRequest.onreadystatechange = null;
                    }

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
                                        updateMyPoC(mypoc, true);
                                    }).catch((error) => {
                                    console.log(error);
                                });
                            } else {
                                console.log('An error occurred while sending image to MyPoC server');
                                console.log(xhr);
                            }
                        }
                    };
                    xhr.send(blob);
                    this.mypocRequest = xhr;
                });
            }).catch((error) => {
            console.log('An error occurred while converting image to base64');
            console.log(error);
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

    _onUpdateMyPoC(mypoc, fromServer) {
        let obs = this.state.observation;
        if (!this.state.observation.mypoc && fromServer) {
            obs.mypoc = mypoc;
        } else {
            this.setState({myPocEdited:true});
            obs.mypoccorrector = mypoc;
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
        const query = this.state.locationText;
        let mapboxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(query) + '.json?access_token=' + mapboxApiKey;
        RNFetchBlob.fetch('GET', mapboxUrl)
            .then((response) => {
                const data = JSON.parse(response.data);
                this.setState({locationResults: data && data.features});
            }).catch((error) => {
                console.log(error);
            }
        );
    }

    _onPressLocationResult(location) {
        let obs = this.state.observation;
        obs.location = {};
        obs.location.name = location.text;
        obs.location.address = location.place_name;
        obs.location.latitude = location.geometry.coordinates[1];
        obs.location.longitude = location.geometry.coordinates[0];
        this._updateObservationState(obs);
        this._setLocationText();
    }

    _locationResultKeyExtractor = (item, index) => item.id;


    _setLocationText(text) {
        this.setState((prevState) => ({locationText: text ? text : prevState.observation.location.address}));
    }

    _updateObservationState(obs) {
        this.setState({observation: obs});
    }

    _onUpdatePrice(price) {
        let obs = this.state.observation;
        price = price.replace(/[^0-9.]/g, '');
        obs.price = price;
        this._updateObservationState(obs);
    }

    _onUpdateCurrency(currency, index) {
        let obs = this.state.observation;
        obs.currency = currency;
        this._updateObservationState(obs);
    }

    _onUpdateDietaryRestrictions(dietaryRestriction, index) {
        let obs = this.state.observation;
        obs.dietaryRestriction = dietaryRestriction;
        this._updateObservationState(obs);
    }

    _onPressHomemade(bool) {
        let obs = this.state.observation;
        obs.homemade = bool;
        this._updateObservationState(obs);
    }

    _focusNextField(key) {
        this.inputs[key].focus();
    }

    /************* EATING EXPERIENCE *************/

    _onPressSearchButton(searchText) {
        this.setState({searchText: searchText || ''});

        if (searchText) {
            searchText = searchText.toLowerCase();
        }

        let vocabArray = [];
        if (!allVocabSorted || (searchText && searchText !== '')) {
            allVocabSorted.forEach(function (vocabItem) {
                if (!allVocabSorted || vocabItem.value.name.toLowerCase().indexOf(searchText) >= 0) {
                    vocabArray.push(vocabItem);
                }
            });
        } else {
            vocabArray = allVocabSorted;
        }
        this.setState({searchedVocabSorted: vocabArray});

        // let sections = allVocabs;
        // if (!allVocabs || (searchText && searchText !== '')) {
        //     let vocabMap = {};
        //     allVocabulary.forEach(function (vocabItem) {
        //         if (!allVocabs || vocabItem.value.name.toLowerCase().indexOf(searchText) >= 0) {
        //             if (!vocabMap[vocabItem.type]) {
        //                 vocabMap[vocabItem.type] = [];
        //             }
        //             vocabMap[vocabItem.type].push(vocabItem);
        //         }
        //     });
        //     sections = [
        //         {title: VocabEnum.ODOR, data: vocabMap[VocabEnum.ODOR]},
        //         {title: VocabEnum.TASTE, data: vocabMap[VocabEnum.TASTE]},
        //         {title: VocabEnum.TEXTURE, data: vocabMap[VocabEnum.TEXTURE]},
        //     ];
        // }
        // this.setState({sections: sections});
        // if (!allVocabs) {
        //     allVocabs = sections;
        // }
    }

    _onCheckBoxChanged(id) {
        let obs = this.state.observation;
        if (obs.vocabulary[id]) {
            delete obs.vocabulary[id];
        } else {
            obs.vocabulary[id] = true;
        }
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

    onLayout(e) {
        const smallEmojiSize = (Dimensions.get('window').width - 4 * 6)/(Object.keys(EmojiEnum).length + 1);
        this.setState({
            smallEmojiSize: smallEmojiSize,
            selectedEmojiSize: smallEmojiSize * 1.5
        })
    }

    render() {
        const myPocAlertButtons = [
            {text: strings.ok},
            {text: strings.more, onPress: () => Linking.openURL('https://github.com/fredericandres/CRWB-Research-Group/wiki/MyPoC-App')}
        ];

        return (
            <SafeAreaView style={{ flex: 1 }} onLayout={this.onLayout.bind(this)}>
                <View name={'content'} style={{flex: 1}}>
                    {
                        this.state.activePageIndex === PagesEnum.SELECTIMAGE && <CameraCameraRollComponent drafts={Object.values(this.state.drafts)} onLongPress={this._showDraftDeleteAlert} onDraftSelected={this._onDraftSelected} onImageSelectedAction={this._onImageSelected} style={{flex:7, flexGrow:1}}/>
                    }
                    {
                        this.state.activePageIndex === PagesEnum.DETAILS &&
                        <ScrollView name={'detailsscreen'} style={[styles.containerPadding, {flex: 1}]}>
                            <View name={'picanddescription'} style={{flexDirection:'row', flex: 1}}>
                                <View style={[styles.containerPadding, {flex:1}]}>
                                    <ObservationExploreComponent disabled={true} source={{uri: this.state.observation.image || this.state.observation.imageUrl}} style={{flexShrink:1, flex: 1}}/>
                                </View>
                                <View style={{flex: 2}}>
                                    <TextInputComponent fontawesome={true} style={{flex: 1}} placeholder={strings.description} value={this.state.observation.description} onChangeText={(text) => this._onUpdateDescription(text)} icon={iconDescription} keyboardType={'default'} multiline={true} />
                                </View>
                            </View>
                            <View style={[{flex:1, backgroundColor: colorBackground}, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges]}>
                                <Text style={[styles.textStandardDark, styles.containerPadding]}>{strings.rateExperience}</Text>
                                <View style={[{flexDirection: 'row', flex: 1, flexWrap: 'wrap', justifyContent: 'center'}]}>
                                    {
                                        Object.keys(EmojiEnum).map(index => (
                                            <TouchableOpacity style={[{justifyContent: 'center', alignSelf:'center', width: this.state.observation.rating === parseInt(index, 10) ? this.state.selectedEmojiSize : this.state.smallEmojiSize, aspectRatio: 1}]} key={index} onPress={() => this._onPressSmiley(parseInt(index, 10))}>
                                                <Image name={'emoji'} resizeMode={'cover'} source={EmojiEnum[index]} style={{flex: 1, aspectRatio: 1}}/>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            </View>
                            <TextInputComponent
                                materialcommunityicons={true}
                                placeholder={strings.dishname}
                                value={this.state.observation.dishname}
                                onChangeText={(text) => this._onUpdateDishname(text)}
                                icon={iconDishName}
                                keyboardType={'default'}
                                returnKeyType={'next'}
                                onSubmitEditing={() => {this._focusNextField('mypoc');}}
                            />
                            <TextInputComponent
                                fontawesome={true}
                                ref={ input => {this.inputs['mypoc'] = input;}}
                                info={true}
                                infoTitle={strings.mypocExplanationTitle}
                                infoText={strings.mypocExplanationText}
                                infoButtons={myPocAlertButtons}
                                placeholder={this.state.observation.mypoc ? strings.formatString(strings.mypocPrediction, this.state.observation.mypoc) : strings.predictionLoading}
                                value={this.state.observation.mypoccorrector || this.state.observation.mypoc}
                                onChangeText={(text) => this._onUpdateMyPoC(text)}
                                icon={iconMyPoc}
                                keyboardType={'default'}
                                returnKeyType={'next'}
                                onSubmitEditing={() => {this._focusNextField('location');}}
                            />
                            <TextInputComponent
                                materialcommunityicons={true}
                                icon={iconDietaryInfo}
                                style={{flex:1}}
                                firstItem={
                                    <Dropdown
                                        style={{flex:1}}
                                        fontSize={standardFontSize}
                                        textColor={colorContrast}
                                        baseColor={colorLight}
                                        labelFontSize={smallFontSize}
                                        label={strings.dietaryInfo}
                                        labelHeight={15}
                                        data={Object.values(allDietaryRestrictions)}
                                        labelExtractor={(item, index) => item.value.name}
                                        valueExtractor={(item, index) => item.key}
                                        onChangeText={this._onUpdateDietaryRestrictions.bind(this)}
                                        value={allDietaryRestrictions[this.state.observation.dietaryRestriction].value.name}
                                        inputContainerStyle={{borderBottomColor: 'transparent', borderWidth:0}}
                                        inputContainerPadding={0}
                                    />
                                }
                            />
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <View style={[styles.containerPadding, styles.leftRoundedEdges, {flex: 1, backgroundColor: colorBackground, alignItems: 'center', justifyContent:'center'}]}>
                                    <FontAwesome name={iconCutlery} size={iconSizeStandard} color={colorContrast} style={[styles.containerPadding]}/>
                                </View>
                                <TouchableOpacity onPress={() => this._onPressHomemade(false)} style={[styles.containerPadding, {flex: 3, flexDirection:'row', backgroundColor: this.state.observation.homemade ? colorBackground : colorMain, alignItems:'center', justifyContent:'center'}]}>
                                    <MaterialIcons name={iconEatingOut} size={iconSizeSmall} color={colorContrast} style={styles.containerPadding}/>
                                    <Text style={styles.textStandardDark}>{strings.eatingOut}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this._onPressHomemade(true)} style={[styles.containerPadding, styles.rightRoundedEdges, {flex: 3, flexDirection:'row', backgroundColor: this.state.observation.homemade ? colorMain : colorBackground, alignItems:'center', justifyContent:'center'}]}>
                                    <Image source={require('../Images/Homemade/homemade.png')} resizeMode={'cover'} style={[styles.containerPadding, {width: iconSizeSmall, height:iconSizeSmall, opacity: 0.7}]}/>
                                    <Text style={styles.textStandardDark}>{strings.homemade}</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInputComponent
                                entypo={true}
                                placeholder={strings.price}
                                value={this.state.observation.price}
                                onChangeText={(text) => this._onUpdatePrice(text)}
                                icon={iconPrice}
                                keyboardType={'numeric'}
                                style={{flex:1}}
                                returnKeyType={'next'}
                                secondItem={
                                    <Dropdown
                                        style={{flex:1}}
                                        fontSize={standardFontSize}
                                        textColor={colorContrast}
                                        baseColor={colorLight}
                                        labelFontSize={smallFontSize}
                                        label={strings.currency}
                                        labelHeight={15}
                                        data={Object.values(allCurrencies)}
                                        labelExtractor={(item, index) => item.symbol + ' - ' + item.name}
                                        valueExtractor={(item, index) => item.code}
                                        onChangeText={this._onUpdateCurrency}
                                        value={this.state.observation.currency || ' '}
                                        inputContainerStyle={{borderBottomColor: 'transparent', borderWidth:0}}
                                        inputContainerPadding={0}
                                    />
                                }
                            />
                            <TextInputComponent
                                fontawesome={true}
                                ref={ input => {this.inputs['location'] = input;}}
                                placeholder={strings.location}
                                value={this.state.locationText}
                                onEndEditing={this._onSubmitSearch}
                                onChangeText={(text) => this._onUpdateLocation(text)}
                                icon={iconLocation}
                                keyboardType={'default'}
                                returnKeyType={'search'}
                            />
                            {
                                this.state.locationResults &&
                                <View style={[{flex:1, backgroundColor: colorBackground}, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges]}>
                                    <FlatList
                                        name={'locationresults'}
                                        removeClippedSubviews={true}
                                        data={this.state.locationResults}
                                        keyExtractor={this._locationResultKeyExtractor}
                                        renderItem={({item}) =>
                                            <TouchableOpacity style={[styles.containerPadding, {flex:1, flexDirection:'column'}]} onPress={() => this._onPressLocationResult(item)}>
                                                <Text style={[styles.textStandardDark, styles.containerPadding]}>{item.text}</Text>
                                                {item.properties && <Text style={[styles.textStandardDark, styles.containerPadding]}>{item.place_name}</Text>}
                                            </TouchableOpacity>
                                        }
                                        ListEmptyComponent={() => <EmptyComponent message={strings.noLocationResults}/>}
                                    />
                                </View>
                            }
                        </ScrollView>
                    }
                    {
                        this.state.activePageIndex === PagesEnum.TASTE &&
                        <ScrollView name={'adjectivesscreen'} style={{flex:1}}>
                            <SearchBar placeholder={strings.searchVocabulary}  value={this.state.searchText} onChangeText={(text) => this._onPressSearchButton(text)}/>
                            <FlatList
                                name={'selectedcheckboxes'}
                                style={[styles.containerPadding]}
                                data={Object.keys(this.state.observation.vocabulary)}
                                numColumns={3}
                                keyExtractor={(item, index) =>  'selected_' + item}
                                removeClippedSubviews={true}
                                ListHeaderComponent={() =>
                                    <Text style={[styles.containerPadding, styles.textTitleBoldDark]}>{strings.selected}</Text>
                                }
                                ListEmptyComponent={() => <EmptyComponent message={strings.noSelectedTerms}/>}
                                renderItem={({item}) =>
                                    <TouchableOpacity
                                        style={[styles.leftRoundedEdges, styles.rightRoundedEdges, styles.containerPadding, {
                                            flex: 1,
                                            backgroundColor: colorMain
                                        }]} onPress={() => this._onCheckBoxChanged(item)}>
                                        <SettingsSwitchComponent
                                            selected={this.state.observation.vocabulary && this.state.observation.vocabulary[item]}
                                            text={allVocabulary[item].value.name}/>
                                    </TouchableOpacity>
                                }
                            />
                            <FlatList
                                name={'checkboxes'}
                                style={[styles.containerPadding, {flex: 1}]}
                                data={this.state.searchedVocabSorted}
                                numColumns={3}
                                keyExtracor={(item, index) => item.key}
                                removeClippedSubviews={true}
                                ListEmptyComponent={() => <EmptyComponent message={strings.noMatchingTerms}/>}
                                ListHeaderComponent={() =>
                                    <Text style={[styles.containerPadding, styles.textTitleBoldDark]}>{strings.all/*section.title === VocabEnum.TASTE ? strings.flavor : section.title === VocabEnum.TEXTURE ? strings.texture : strings.odor*/}</Text>
                                }
                                renderItem={({item}) =>
                                    <TouchableOpacity
                                        style={[styles.leftRoundedEdges, styles.rightRoundedEdges, styles.containerPadding, {
                                            flex: 1,
                                            backgroundColor: (this.state.observation.vocabulary && this.state.observation.vocabulary[item.key] ? colorMain : colorBackground)
                                        }]} onPress={() => this._onCheckBoxChanged(item.key)}>
                                        <SettingsSwitchComponent
                                            selected={this.state.observation.vocabulary && this.state.observation.vocabulary[item.key]}
                                            text={item.value.name}/>
                                    </TouchableOpacity>
                                }
                            />
                        </ScrollView>
                    }
                </View>
                {(this.state.observation.image || this.state.observation.imageUrl) && <View name={'interactionButtons'} style={[ {flexDirection: 'row', }]}>
                    <View name={'previousButtonWrapper'} style={ {flex: 1}}>
                        <TouchableOpacity name={'previousButton'} onPress={this._onPressPrevious} style={[{flex:1, backgroundColor:colorBackground, alignItems:'center', justifyContent:'center'}, styles.containerPadding, styles.leftRoundedEdges]}>
                            <Text style={[styles.textTitleDark, styles.containerPadding]}>{(this.isEditing && this.state.activePageIndex === PagesEnum.DETAILS) || this.state.activePageIndex === PagesEnum.SELECTIMAGE ? strings.cancel: strings.previous}</Text>
                        </TouchableOpacity>
                    </View>
                    <View name={'nextButtonWrapper'} style={{flex: 1}}>
                        <TouchableOpacity name={'nextButton'} onPress={this._onPressNext} style={[{backgroundColor: colorAccent, alignItems:'center'}, styles.containerPadding, styles.rightRoundedEdges]}>
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

// Object.keys(this.state.sections).map(index => {
//     const section = this.state.sections[index];
//     return (
//         <View style={{flex:1}} key={section.title}>
//             <FlatList
//                 name={'checkboxes'}
//                 style={[styles.containerPadding, {flex: 1, flexDirection:'column'}]}
//                 data={section.data}
//                 numColumns={3}
//                 keyExtracor={(item, index) => section.title + '_' + item.key}
//                 removeClippedSubviews={true}
//                 ListEmptyComponent={() => <EmptyComponent message={strings.noMatchingTerms}/>}
//                 ListHeaderComponent={() =>
//                     <Text style={[styles.containerPadding, styles.textTitleBoldDark]}>{section.title === VocabEnum.TASTE ? strings.flavor : section.title === VocabEnum.TEXTURE ? strings.texture : strings.odor}</Text>
//                 }
//                 renderItem={({item}) =>
//                     <TouchableOpacity
//                         style={[styles.leftRoundedEdges, styles.rightRoundedEdges, styles.containerPadding, {
//                             flex: 1,
//                             backgroundColor: (this.state.observation.vocabulary && this.state.observation.vocabulary[item.key] ? brandMain : brandBackground)
//                         }]} onPress={() => this._onCheckBoxChanged(item.key)}>
//                         <SettingsSwitchComponent
//                             selected={this.state.observation.vocabulary && this.state.observation.vocabulary[item.key]}
//                             text={item.value.name}/>
//                     </TouchableOpacity>
//                 }
//             />
//         </View>
//     );
// })