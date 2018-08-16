import React from 'react';
import {Alert, CameraRoll, FlatList, Image, Platform, SafeAreaView, TouchableOpacity, View} from 'react-native';
import styles from '../styles';
import strings, {appName} from '../strings';
import {
    colorContrast,
    colorMain,
    iconCamera,
    iconCameraBack,
    iconCameraFront,
    iconCameraRoll,
    iconEdit,
    iconFlashOff,
    iconFlashOn,
    iconSizeLarge,
    iconSizeStandard
} from '../Constants/Constants';
import Permissions from 'react-native-permissions';
import {RNCamera} from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {EmptyComponent} from './EmptyComponent';
import {ObservationExploreComponent} from './ObservationExploreComponent';
import Entypo from 'react-native-vector-icons/Entypo';

export const SourceEnum = Object.freeze({CAMERA:1, GALLERY:2, DRAFTS:3});

export class CameraCameraRollComponent extends React.Component {
    constructor(props) {
        super(props);

        this._requestPermission = this._requestPermission.bind(this);
        this._alertForPermission = this._alertForPermission.bind(this);
        this._onAuthorizedPhoto = this._onAuthorizedPhoto.bind(this);

        this.state = {
            activeItem: SourceEnum.CAMERA,
            cameraFront: false,
            cameraFlash: false,
            loading: false,
        }
    }

    /************* PERMISSIONS *************/

    componentDidMount() {
        Permissions.checkMultiple(['camera', 'photo']).then(response => {
            this.setState({
                // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                cameraPermission: response.camera,
                photoPermission: response.photo,
            }, this._onPressPermissionNeeded);
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
            let action = () => console.log('not authorized');
            if (response === 'authorized') {
                action = successAction;
            }

            if (type === 'camera') {
                this.setState({ cameraPermission: response }, action);
            } else if (type === 'photo') {
                this.setState({ photoPermission: response }, action);
            }
        });
    }

    _onPressPermissionNeeded() {
        if (this.state.cameraPermission !== 'authorized') {
            this._alertForPermission('camera', strings.accessCameraQuestion, strings.accessCameraExplanation, strings.formatString(strings.enableCamera, appName), () => this._requestPermission('camera', this._onPressPermissionNeeded));
        } else if (this.state.photoPermission !== 'authorized') {
            this._alertForPermission('photo', strings.accessPhotoQuestion, strings.accessPhotoExplanation, strings.formatString(strings.enablePhoto, appName), () => this._requestPermission('photo', () => console.log('Photo permission granted')));
        }
    }

    /************* CAMERA *************/

    _onPressCameraButton() {
        if (this.state.cameraPermission !== 'authorized') {
            this._alertForPermission('camera', strings.accessCameraQuestion, strings.accessCameraExplanation, strings.formatString(strings.enableCamera, appName), () => this._requestPermission('camera'));
        }
        this.setState({activeItem: SourceEnum.CAMERA});
    }

    async takePicture() {
        if (this.camera) {
            this.setState({loading: true});
            const options = { quality: 1, base64: true, fixOrientation: false, mirrorImage: this.state.cameraFront};
            const data = await this.camera.takePictureAsync(options);
            // TODO [FEATURE]: sound/image effects

            console.log('Adding picture to camera roll');
            CameraRoll.saveToCameraRoll(data.uri, 'photo' )
                .then((uri) => {
                    console.log('Successfully added picture to camera roll');
                    this.setState({loading: false});
                    this.props.onImageSelectedAction && this.props.onImageSelectedAction(uri);
                }).catch((err) => {
                console.log("Error while adding picture to camera roll");
                console.log(err);
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
            this._alertForPermission('photo', strings.accessPhotoQuestion, strings.accessPhotoExplanation, strings.formatString(strings.enablePhoto, appName), () => this._requestPermission('photo', () => this._onAuthorizedPhoto(true)));
        } else {
            this._onAuthorizedPhoto(true);
        }
        this.setState({ activeItem: SourceEnum.GALLERY });
    }

    _onAuthorizedPhoto(reload) {
        if (reload) {
            this.setState({photos: null});
            this.photosPageInfo = null;
        }

        const newlyLoaded = !this.photosPageInfo;
        if (newlyLoaded || this.photosPageInfo.has_next_page) {
            let variables = {
                first: 25,
                assetType: 'Photos',
            };

            if (this.photosPageInfo) {
                variables.after = this.photosPageInfo.end_cursor;
            }

            CameraRoll.getPhotos(variables).then(r => {
                if (r && r.edges) {
                    this.photosPageInfo = r.page_info;
                    if (newlyLoaded) {
                        this.setState({ photos: r.edges });
                    } else {
                        this.setState((prevState) => {
                            return {photos: prevState.photos.concat(r.edges)};
                        });
                    }
                }
            }).catch((err) => {
                console.log("Error while loading images from camera roll");
                console.log(err);
            });
        }
    }

    _cameraRollKeyExtractor = (item) => item.node.image.uri;

    async _onSelectImageFromCameraRoll(photo) {
        this.setState({loading: true});
        const uri = photo.node.image.uri;
        this.props.onImageSelectedAction && this.props.onImageSelectedAction(uri);
    }

    /************* DRAFTS *************/

    _draftsKeyExtractor = (item) => item.observationid;

    async _onPressDraftsButton(){
        this.setState({ activeItem: SourceEnum.DRAFTS });
    }

    /************* RENDER *************/

    render() {
        const cameraAuthorized = this.state.cameraPermission === 'authorized' && this.state.photoPermission === 'authorized';
        return (
            <SafeAreaView style={{flex:1}}>
                {
                    cameraAuthorized &&
                    <View style={{flex:1}}>
                        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: colorMain}}>
                            {this.state.activeItem !== SourceEnum.CAMERA && <TouchableOpacity name={'camerabutton'} onPress={this._onPressCameraButton.bind(this)} style={[{flex: 1, alignItems:'center'}, styles.containerPadding]}>
                                <FontAwesome name={iconCamera} size={iconSizeStandard} color={colorContrast}/>
                            </TouchableOpacity>}
                            {this.state.activeItem === SourceEnum.CAMERA && <TouchableOpacity name={'flashbutton'} onPress={this._onPressFlash.bind(this)} style={[{flex: 1, alignItems:'center'}, styles.containerPadding]}>
                                <Ionicons name={this.state.cameraFlash ? iconFlashOn : iconFlashOff} size={iconSizeStandard} color={colorContrast}/>
                            </TouchableOpacity>}
                            {this.state.activeItem !== SourceEnum.GALLERY && <TouchableOpacity name={'photobutton'} onPress={this._onPressPhotoButton.bind(this)} style={[{flex:1, alignItems:'center'}, styles.containerPadding]}>
                                <Ionicons name={iconCameraRoll} size={iconSizeStandard} color={colorContrast}/>
                            </TouchableOpacity>}
                            {this.state.activeItem !== SourceEnum.DRAFTS && this.props.drafts && this.props.drafts.length > 0 && <TouchableOpacity name={'draftsbutton'} onPress={this._onPressDraftsButton.bind(this)} style={[{flex:1, alignItems:'center'}, styles.containerPadding]}>
                                <Entypo name={iconEdit} size={iconSizeStandard} color={colorContrast}/>
                            </TouchableOpacity>}
                            {this.state.activeItem === SourceEnum.CAMERA && <TouchableOpacity name={'switchbutton'} onPress={this._onPressCameraSwitch.bind(this)} style={[{flex:1, alignItems:'center'}, styles.containerPadding]}>
                                <MaterialCommunityIcons name={this.state.cameraFront ? iconCameraFront : iconCameraBack} size={iconSizeStandard} color={colorContrast}/>
                            </TouchableOpacity>}
                        </View>
                        {
                            this.state.activeItem === SourceEnum.CAMERA &&
                            <View style={{flex:1}}>
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
                                <View style={[{flexDirection: 'row', justifyContent: 'center'}]}>
                                    <TouchableOpacity name={'takepicturebutton'} onPress={this.takePicture.bind(this)} style={[{flex: 1, alignItems:'center'}, styles.containerPadding]}>
                                        <FontAwesome name={'circle'} size={iconSizeLarge} color={colorContrast}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {
                            this.state.activeItem === SourceEnum.GALLERY && this.state.photos &&
                            <FlatList
                                name={'camerarollimages'}
                                style={[{flex: 1, flexDirection:'column'}, styles.explorePadding]}
                                data={this.state.photos}
                                numColumns={3}
                                keyExtractor={this._cameraRollKeyExtractor}
                                renderItem={({item}) =>
                                    <TouchableOpacity onPress={() => this._onSelectImageFromCameraRoll(item)} style={[styles.explorePadding, {flex:1}]}>
                                        <Image style={{flex: 1, aspectRatio: 1}} resizeMode={'cover'} source={{uri: item.node.image.uri}}/>
                                    </TouchableOpacity>
                                }
                                onEndReached={() => this._onAuthorizedPhoto(false)}
                                removeClippedSubviews={true}
                                ListEmptyComponent={() => <EmptyComponent message={strings.noImages}/>}
                            />
                        }
                        {
                            this.state.activeItem === SourceEnum.DRAFTS && this.props.onDraftSelected && this.props.drafts && this.props.drafts.length > 0 &&
                            <FlatList
                                style={styles.explorePadding}
                                keyExtractor={this._draftsKeyExtractor}
                                data={this.props.drafts}
                                renderItem={({item}) => <ObservationExploreComponent observation={item} onLongPress={this.props.onLongPress} onPress={this.props.onDraftSelected && (() => this.props.onDraftSelected(item))} source={item.image ? {uri: item.image} : null} {...this.props}/>}
                                numColumns={3}
                                removeClippedSubviews={true}
                            />
                        }
                        {
                            this.state.activeItem === SourceEnum.DRAFTS && this.props.onDraftSelected && (!this.props.drafts || this.props.drafts.length === 0) &&
                            <EmptyComponent message={strings.noDrafts}/>
                        }
                    </View>
                }
                {
                    !cameraAuthorized &&
                    <TouchableOpacity onPress={this._onPressPermissionNeeded.bind(this)} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <EmptyComponent message={strings.formatString(strings.enableCameraAndPhoto, appName)}/>
                    </TouchableOpacity>
                }
                {
                    this.state.loading &&
                    <View style={[styles.containerOpacityDark, {position: 'absolute', start:0, end:0, top:0, bottom:0}]}/>
                }
            </SafeAreaView>
        );
    }
}
