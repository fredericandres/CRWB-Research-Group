import React from 'react';
import {
    Alert,
    CameraRoll,
    FlatList,
    Image,
    Linking,
    Picker,
    Platform,
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
    brandAccent,
    brandBackground,
    brandContrast,
    brandMain,
    EmojiEnum,
    iconSizeLarge,
    iconSizeStandard
} from "../constants/Constants";
import {googleApiKey} from "../constants/GoogleApiKey";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import {TextInputComponent} from "../Components/TextInputComponent";
import {allCurrencies} from "../constants/Currencies";
import {SearchBar} from "../Components/SearchBar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {SettingsSwitchComponent} from "../Components/SettingsSwitchComponent";
import {allVocabulary} from "../constants/Vocabulary";
import Permissions from 'react-native-permissions'
import {RNCamera} from 'react-native-camera';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RNFetchBlob from 'react-native-fetch-blob';
import XMLParser from 'react-xml-parser';
import firebase from 'react-native-firebase';

const PagesEnum = Object.freeze({SELECTIMAGE:0, DETAILS:1, TASTE:2});

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

        this._requestPermission = this._requestPermission.bind(this);
        this._alertForPermission = this._alertForPermission.bind(this);

        this._onUpdateDescription = this._onUpdateDescription.bind(this);
        this._onPressSmiley = this._onPressSmiley.bind(this);
        this._onUpdateDishname = this._onUpdateDishname.bind(this);
        this._onUpdateLocation = this._onUpdateLocation.bind(this);
        this._onUpdateMypoc = this._onUpdateMypoc.bind(this);
        this._onUpdatePrice = this._onUpdatePrice.bind(this);
        this._onUpdateCurrency = this._onUpdateCurrency.bind(this);

        this._onCheckBoxChanged = this._onCheckBoxChanged.bind(this);
        this._onSubmitSearch = this._onSubmitSearch.bind(this);

        const edit = this.props.navigation.state.params && this.props.navigation.state.params.observation;
        this.state = {
            observation: edit ? this.props.navigation.state.params.observation : new Observation(),
            activePageIndex: PagesEnum.SELECTIMAGE,
            locationText: edit ? (this.props.navigation.state.params.observation.location ? this.props.navigation.state.params.observation.location : '') + (this.props.navigation.state.params.observation.address ? ', ' + this.props.navigation.state.params.observation.address : '') : '',
            cameraActive: true,
            cameraFront: true,
            cameraFlash: true,
        };
    }

    /************* NAVIGATION *************/

    _onPressNext() {
        if (this.state.activePageIndex === PagesEnum.TASTE) {
            // TODO sumbit & close
            firebase.database().ref('observations').push(this.state.observation, (error) => {
                if (error) {
                    console.error('Error during observation transmission.');
                    console.error(error);
                    this._handleAuthError(error);
                    
                    // TODO: display error message
                } else {
                    console.log('Successfully added observation to DB.');
                    this.props.navigation.dismiss();
                }
            });
        } else {
            this.setState({activePageIndex: this.state.activePageIndex + 1});
        }
    }

    _onPressPrevious() {
        if (this.state.activePageIndex === PagesEnum.SELECTIMAGE) {
            // TODO cancel & close
            this.props.navigation.dismiss();
        } else {
            this.setState({activePageIndex: this.state.activePageIndex - 1});
        }
    }

    /************* PERMISSIONS *************/

    componentDidMount() {
        Permissions.checkMultiple(['camera', 'photo']).then(response => {
            this.setState({
                // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                cameraPermission: response.camera,
                photoPermission: response.photo,
            });
            this._onPressPermissionNeeded();
        })
    }

    _alertForPermission(type, question, explanation, enable, action) {
        const permState = type === 'camera' ? this.state.cameraPermission : this.state.photoPermission;
        if (permState === undefined || permState === 'restricted') {
            Alert.alert(
                strings.permissionDenied,
                enable,
                [{text: strings.ok}]
            );
        } else {
            Alert.alert(
                question,
                explanation,
                [
                    {
                        text: strings.no,
                        onPress: () => console.log('Permission denied'),
                        style: 'cancel',
                    },
                    permState === 'undetermined' || Platform.OS === 'android'
                        ? {text: strings.yes, onPress: action}
                        : {text: strings.openSettings, onPress: Permissions.openSettings},
                ],
            );
        }
    }

    _requestPermission(type, successAction){
        Permissions.request(type).then(response => {
            if (type === 'camera') {
                this.setState({ cameraPermission: response });
            } else if (type === 'photo') {
                this.setState({ photoPermission: response });
            }

            if (response === 'authorized') {
                successAction();
            }
        })
    }

    /************* CAMERA *************/

    _onPressCameraButton() {
        if (this.state.cameraPermission !== 'authorized') {
            this._alertForPermission('camera', strings.accessCameraQuestion, strings.accessCameraExplanation, strings.enableCamera, () => this._requestPermission('camera'));
        }
        this.setState({cameraActive: true});
    }

    _onPressPermissionNeeded() {
        if (this.state.cameraPermission !== 'authorized') {
            this._alertForPermission('camera', strings.accessCameraQuestion, strings.accessCameraExplanation, strings.enableCamera, () => this._requestPermission('camera', () => console.log('Camera permission granted')));
        }
        if (this.state.photoPermission !== 'authorized') {
            this._alertForPermission('photo', strings.accessPhotoQuestion, strings.accessPhotoExplanation, strings.enablePhoto, () => this._requestPermission('photo', () => console.log('Photo permission granted')));
        }
    }

    async takePicture() {
        if (this.camera) {
            const options = { quality: 0.75, base64: true, forceUpOrientation: true, fixOrientation: true, mirrorImage: this.state.cameraFront};
            const data = await this.camera.takePictureAsync(options);
            // TODO sound/image effects

            CameraRoll.saveToCameraRoll(data.uri).then((uri) => {
                this._onImageSelected(uri, data.base64);
            });
        }
    }

    _onPressFlash() {
        this.setState({ cameraFlash: !this.state.cameraFlash });
    }

    _onPressCameraSwitch() {
        this.setState({ cameraFront: !this.state.cameraFront });
    }

    /************* CAMERA ROLL *************/

    _onPressPhotoButton(){
        if (this.state.photoPermission !== 'authorized') {
            this._alertForPermission('photo', strings.accessPhotoQuestion, strings.accessPhotoExplanation, strings.enablePhoto, () => this._requestPermission('photo', this._onAuthorizedPhoto));
        } else {
            this._onAuthorizedPhoto();
        }
        this.setState({ cameraActive: false });
    }

    _onAuthorizedPhoto() {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
        })
            .then(r => {
                this.setState({ photos: r.edges });
            })
            .catch((err) => {
                console.log("Error while loading images from camera roll");
            });
        // TODO: load next photos when at bottom of flat list
    }

    _cameraRollKeyExtractor = (item, index) => item.node.image.uri;

    _onSelectImageFromCameraRoll(photo) {
        this._onImageSelected(photo.node.image.uri);
    }

    _onImageSelected(uri, base64) {
        let obs = this.state.observation;
        obs.image = uri;
        this._updateObservationState(obs);

        // TODO: save image base64 to Firebase storage or similar

        base64 ? this._sendToMyPoC(base64, this._onUpdateMypoc) : this._getBase64ForURi(uri, this._sendToMyPoC);

        this._onPressNext();
    }

    _getBase64ForURi(uri, action) {
        RNFetchBlob.fs.readFile(uri, 'base64')
            .then((data) => {
                action(data, this._onUpdateMypoc);
            });
    }

    _sendToMyPoC(base64, action) {
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
                                // Parse xml text into object and look for 'text' element --> MyPoC prediction of image
                                const xml = new XMLParser().parseFromString(xmlText);
                                const mypoc = xml.getElementsByTagName("text")[0].value;
                                action(mypoc);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    } else {
                        console.error('An error occurred while sending image to MyPoC server');
                        console.error(xhr);
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
        if (!this.state.observation.mypoc) {
            obs.mypoc = mypoc;
        } else {
            obs.mypoccorrector = mypoc;
            // TODO: Send corrected info to mypoc server
        }
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

    _onPressLocationResult(location) {
        let obs = this.state.observation;
        obs.location = location.name;
        obs.address = location.formatted_address;
        obs.googleMapsId = location.place_id;
        this._updateObservationState(obs);
        this._setLocationText();
    }

    _locationResultKeyExtractor = (item, index) => item.place_id;


    _setLocationText(text) {
        this.setState({locationText: text ? text : (this.state.observation.location ? this.state.observation.location : '') + (this.state.observation.address ? ', ' + this.state.observation.address : '')});
    }

    _updateObservationState(obs) {
        this.setState({observation: obs});
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

    /************* EATING EXPERIENCE *************/

    _onPressSearchButton(search) {
        // TODO filter items
    }

    _onCheckBoxChanged(id) {
        let obs = this.state.observation;
        obs.vocabulary[id] = !obs.vocabulary[id];
        this._updateObservationState(obs);
    }

    render() {
        const cameraAuthorized = this.state.cameraPermission === 'authorized' && this.state.photoPermission === 'authorized';
        const myPocAlertButtons = [
            {text: strings.ok},
            {text: strings.more, onPress: () => Linking.openURL('https://github.com/fredericandres/CRWB-Research-Group/wiki/MyPoC-App')}
        ];

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View name={'content'} style={{flex: 1}}>
                    {
                        this.state.activePageIndex === PagesEnum.SELECTIMAGE && cameraAuthorized &&
                        <View style={{flex:1}}>
                            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: brandMain}}>
                                {!this.state.cameraActive && <TouchableOpacity name={'camerabutton'} onPress={this._onPressCameraButton.bind(this)} style={[{flex: 1, alignItems:'center'}, styles.containerPadding]}>
                                    <FontAwesome name={'camera-retro'} size={iconSizeStandard} color={brandContrast}/>
                                </TouchableOpacity>}
                                {this.state.cameraActive && <TouchableOpacity name={'flashbutton'} onPress={this._onPressFlash.bind(this)} style={[{flex: 1, alignItems:'center'}, styles.containerPadding]}>
                                    <Ionicons name={this.state.cameraFlash ? 'ios-flash' : 'ios-flash-outline'} size={iconSizeStandard} color={brandContrast}/>
                                </TouchableOpacity>}
                                {this.state.cameraActive && <TouchableOpacity name={'photobutton'} onPress={this._onPressPhotoButton.bind(this)} style={[{flex:1, alignItems:'center'}, styles.containerPadding]}>
                                    <Ionicons name={'md-photos'} size={iconSizeStandard} color={brandContrast}/>
                                </TouchableOpacity>}
                                {this.state.cameraActive && <TouchableOpacity name={'switchbutton'} onPress={this._onPressCameraSwitch.bind(this)} style={[{flex:1, alignItems:'center'}, styles.containerPadding]}>
                                    <MaterialCommunityIcons name={this.state.cameraFront ? 'camera-front-variant' : 'camera-rear-variant'} size={iconSizeStandard} color={brandContrast}/>
                                </TouchableOpacity>}
                            </View>
                            {
                                this.state.cameraActive &&
                                <RNCamera
                                    ref={ref => {
                                        this.camera = ref;
                                    }}
                                    permissionDialogTitle={strings.accessCameraQuestion}
                                    permissionDialogMessage={strings.accessCameraExplanation}
                                    style = {{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}
                                    type={this.state.cameraFront ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
                                    flashMode={this.state.cameraFlash ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
                                    autoFocus={RNCamera.Constants.AutoFocus.on}
                                />
                            }
                            {
                                !this.state.cameraActive && this.state.photos &&
                                <FlatList
                                    name={'camerarollimages'}
                                    style={[{flex: 1, flexDirection:'column'}]}
                                    data={this.state.photos}
                                    numColumns={2}
                                    keyExtractor={this._cameraRollKeyExtractor}
                                    renderItem={({item}) =>
                                        <TouchableOpacity onPress={() => this._onSelectImageFromCameraRoll(item)} style={{flex:1}}>
                                            <Image style={{flex: 1, aspectRatio: 1}} resizeMode={'cover'} source={{uri: item.node.image.uri}}/>
                                        </TouchableOpacity>
                                    }
                                />
                            }
                            {
                                this.state.cameraActive &&
                                <View style={[{position: 'absolute', bottom:0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center'},styles.containerOpacity]}>
                                    <TouchableOpacity name={'takepicturebutton'} onPress={this.takePicture.bind(this)} style={[{flex: 1, alignItems:'center'}, styles.containerPadding]}>
                                        <FontAwesome name={'circle'} size={iconSizeLarge} color={brandContrast}/>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    }
                    {
                        this.state.activePageIndex === PagesEnum.SELECTIMAGE && !cameraAuthorized &&
                        <TouchableOpacity onPress={this._onPressPermissionNeeded.bind(this)} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                            <Text style={[styles.containerPadding, styles.textStandardDark, {textAlign:'center'}]}>{strings.enableCameraAndPhoto}</Text>
                        </TouchableOpacity>
                    }
                    {
                        this.state.activePageIndex === PagesEnum.DETAILS &&
                        <ScrollView name={'detailsscreen'} style={[styles.containerPadding, {flex: 1}]}>
                            <View name={'picanddescription'} style={{flexDirection:'row', flex: 1}}>
                                <View style={{flex:1}}>
                                    <ObservationExploreComponent source={{uri: this.state.observation.image}} style={{flexShrink:1, flex: 1}}/>
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
                                            <TouchableOpacity style={{justifyContent: 'center'}} key={index} onPress={() => this._onPressSmiley(parseInt(index, 10))}>
                                                <Text style={{fontSize: this.state.observation.rating === parseInt(index, 10) ? 40 : 32, color: brandContrast}}>{EmojiEnum[index]}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            </View>
                            <TextInputComponent placeholder={strings.dishname} value={this.state.observation.dishname} onChangeText={(text) => this._onUpdateDishname(text)} icon={'cutlery'} keyboardType={'default'} />
                            {/*TODO: Display ? + popup explanation of what mypoc is*/}
                            <TextInputComponent info={true} infoTitle={strings.mypocExplanationTitle} infoText={strings.mypocExplanationText} infoButtons={myPocAlertButtons} placeholder={this.state.observation.mypoc || 'prediction loading...'} value={this.state.observation.mypoccorrector || this.state.observation.mypoc} onChangeText={(text) => this._onUpdateMypoc(text)} icon={'question'} keyboardType={'default'} />
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
                <View name={'interactionButtons'} style={[ {flexDirection: 'row', }]}>
                    <View name={'previousButtonWrapper'} style={ {flex: 1}}>
                        <TouchableOpacity name={'previousButton'} onPress={this._onPressPrevious} style={[{flex:1, backgroundColor:brandBackground, alignItems:'center', justifyContent:'center'}, styles.containerPadding, styles.leftRoundedEdges]}>
                            <Text style={[styles.textTitleDark, styles.containerPadding]}>{this.state.activePageIndex === PagesEnum.SELECTIMAGE ? strings.cancel: strings.previous}</Text>
                        </TouchableOpacity>
                    </View>
                    <View name={'nextButtonWrapper'} style={{flex: 1}}>
                        <TouchableOpacity name={'nextButton'} onPress={this._onPressNext} style={[{backgroundColor:brandAccent, alignItems:'center'}, styles.containerPadding, styles.rightRoundedEdges]}>
                            <Text style={[styles.textTitleBoldLight, styles.containerPadding]}>{this.state.activePageIndex === PagesEnum.TASTE ? strings.publish: strings.next}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}