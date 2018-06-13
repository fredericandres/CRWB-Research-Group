import React from "react";
import {Alert, CameraRoll, FlatList, Image, Platform, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import styles from "../styles";
import strings from "../strings";
import {brandContrast, brandMain, iconSizeLarge, iconSizeStandard} from "../constants/Constants";
import Permissions from 'react-native-permissions'
import {RNCamera} from 'react-native-camera';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RNFetchBlob from "react-native-fetch-blob";

export class CameraCameraRollComponent extends React.Component {
    constructor(props) {
        super(props);

        this._requestPermission = this._requestPermission.bind(this);
        this._alertForPermission = this._alertForPermission.bind(this);
        this._onAuthorizedPhoto = this._onAuthorizedPhoto.bind(this);

        this.state = {
            cameraActive: true,
            cameraFront: true,
            cameraFlash: true,
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
            // TODO [FEATURE]: sound/image effects
            CameraRoll.saveToCameraRoll(data.uri).then((uri) => {
                this.props.onImageSelectedAction(uri, data.base64);
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
            this._alertForPermission('photo', strings.accessPhotoQuestion, strings.accessPhotoExplanation, strings.enablePhoto, () => this._requestPermission('photo', () => this._onAuthorizedPhoto(true)));
        } else {
            this._onAuthorizedPhoto(true);
        }
        this.setState({ cameraActive: false });
    }

    _onAuthorizedPhoto(reload) {
        // TODO: Fix bug where same pictures are loaded again and again

        if (reload) {
            this.setState({photos: null});
            this.photosPageInfo = null;
        }

        const newlyLoaded = !this.photosPageInfo;
        if (newlyLoaded || this.photosPageInfo.has_next_page) {
            let variables = {
                first: 5,
                assetType: 'Photos',
            };

            if (this.photosPageInfo) {
                variables.after = this.photosPageInfo.end_cursor;
            }

            CameraRoll.getPhotos(variables).then(r => {
                this.photosPageInfo = r.page_info;
                if (newlyLoaded) {
                    this.setState({ photos: r.edges });
                } else {
                    this.setState((prevState) => {
                        return {photos: prevState.photos.concat(r.edges)};
                    });
                }
            })
                .catch((err) => {
                    console.log("Error while loading images from camera roll");
                    console.log(err);
                });
        }
    }

    _cameraRollKeyExtractor = (item, index) => item.node.image.uri;

    _onSelectImageFromCameraRoll(photo) {
        const uri = photo.node.image.uri;
        RNFetchBlob.fs.readFile(uri, 'base64')
            .then((data) => {
                this.props.onImageSelectedAction(uri, data)
            });
    }

    render() {
        const cameraAuthorized = this.state.cameraPermission === 'authorized' && this.state.photoPermission === 'authorized';
        return (
            <SafeAreaView style={{flex:1}}>
                {
                    cameraAuthorized &&
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
                                onEndReached={() => this._onAuthorizedPhoto(false)}
                            />
                        }
                        {
                            this.state.cameraActive &&
                            <View style={[{flexDirection: 'row', justifyContent: 'center'}]}>
                                <TouchableOpacity name={'takepicturebutton'} onPress={this.takePicture.bind(this)} style={[{flex: 1, alignItems:'center'}, styles.containerPadding]}>
                                    <FontAwesome name={'circle'} size={iconSizeLarge} color={brandContrast}/>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                }
                {
                    !cameraAuthorized &&
                    <TouchableOpacity onPress={this._onPressPermissionNeeded.bind(this)} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <Text style={[styles.containerPadding, styles.textStandardDark, {textAlign:'center'}]}>{strings.enableCameraAndPhoto}</Text>
                    </TouchableOpacity>
                }
            </SafeAreaView>
        );
    }
}
