import {StackActions} from "react-navigation";
import {NativeModules, Platform} from "react-native";
import strings from "../strings";
import firebase from 'react-native-firebase';

export const brandMain = '#ffc658';
export const brandContrast = '#333333';
export const brandLight = '#999999';
export const brandBackground = '#f2f2f2';
export const brandMainDark ='#fab150';
export const brandAccent = '#578fff';

export const iconSizeLarge = 50;
export const iconSizeStandard = 25;
export const iconSizeSmall = 15;

export const maxUsernameLength = 15;

// TODO [FEATURE]: Custom icons based on logo
export const EmojiEnum = Object.freeze({1: '🤢', 2:'😖', 3:'😟', 4:'😕', 5:'😶', 6:'🙂', 7:'😊', 8:'🤤', 9:'😍'});
export const VocabEnum = Object.freeze({TASTE:1, TEXTURE:2, ODOR:3});
export const ActivityEnum = Object.freeze({LIKE:'LIKE', SHARE:'SHARE', CUTLERY:'CUTLERY', FOLLOW:'FOLLOW', COMMENT:'COMMENT'});

export const pathObservations = 'observations';
export const pathUsers = 'users';
export const pathActions = 'actions';
export const pathFollow = 'follow';
export const pathNotifications = 'notifications';
export const pathLikes = 'likes';
export const pathShares = 'shares';
export const pathCutleries = 'cutleries';
export const pathComments = 'comments';

export function _formatNumberWithString(number, type) {
    let wordString = '';
    let numberString = '';

    if (number === 1) {
        switch (type) {
            case ActivityEnum.LIKE:
                wordString = strings.likesSg;
                break;
            case ActivityEnum.SHARE:
                wordString = strings.sharesSg;
                break;
            case ActivityEnum.CUTLERY:
                wordString = strings.cutleriesSg;
                break;
            case ActivityEnum.COMMENT:
                wordString = strings.commentsSg;
                break;
        }
        numberString = number;
    } else {
        switch (type) {
            case ActivityEnum.LIKE:
                wordString = strings.likes;
                break;
            case ActivityEnum.SHARE:
                wordString = strings.shares;
                break;
            case ActivityEnum.CUTLERY:
                wordString = strings.cutleries;
                break;
            case ActivityEnum.COMMENT:
                wordString = strings.comments;
                break;
        }

        if (number === undefined) {
            numberString = '0';
        } else if (number < 1000) {
            numberString = number;
        } else if (number < 1000000) {
            numberString = strings.formatString(strings.thousand, Math.floor(number / 1000));
        } else {
            numberString = strings.formatString(strings.million, Math.floor(number / 1000000));
        }
    }
    return strings.formatString(wordString, numberString);
}

export function _formatNumber(number) {
    if (number === undefined) {
        return '0';
    } else if (number < 1000) {
        return number;
    } else if (number < 1000000) {
        return Math.floor(number / 1000);
    } else {
        return Math.floor(number / 1000000);
    }
}

export function _navigateToScreen(screen, navigation, params) {
    const pushAction = StackActions.push({
        routeName: screen,
        params: params,
    });
    navigation.dispatch(pushAction);
}

export function _getLanguageCode() {
    let systemLanguage = 'en';
    if (Platform.OS === 'android') {
        systemLanguage = NativeModules.I18nManager.localeIdentifier;
    } else {
        systemLanguage = NativeModules.SettingsManager.settings.AppleLocale;
    }
    const languageCode = systemLanguage.substring(0, 2);
    return languageCode;
}

export function _sortArrayByTimestamp(array, reverse) {
    if (array) {
        array.sort(function (a, b) {
            if (a.timestamp < b.timestamp)
                return reverse ? -1 : 1;
            if (a.timestamp > b.timestamp)
                return reverse ? 1 : -1;
            return 0;
        });
    }
}

export function _handleAuthError(error, action) {
    let errorMessage = '';

    switch (error.code) {
        case 'auth/invalid-email':
            errorMessage = strings.errorMessageInvalidEmail;
            break;
        case 'auth/user-disabled':
            errorMessage = strings.errorMessageUserDisabled;
            break;
        case 'auth/user-not-found':
            errorMessage = strings.errorMessageUserNotFound;
            break;
        case 'auth/wrong-password':
            errorMessage = strings.errorMessageWrongPassword;
            break;
        case 'auth/weak-password':
            errorMessage = strings.errorMessageWeakPassword;
            break;
        case 'auth/email-already-in-use':
            errorMessage = strings.errorMessageEmailAlreadyInUse;
            break;
    }

    action(errorMessage)
}

export function _formatUsername(username) {
    return username.toLowerCase().replace(/[^0-9a-z]/g, '');
}

export function _addPictureToStorage(path, imageUrl, refToUpdate, callback) {
    // TODO: Fix app crash on iOS picture upload
    if (Platform.OS === 'android') {
        console.log('Adding picture to storage...');
        const imageRef = firebase.storage().ref(path);
        imageRef.putFile(imageUrl)
            .then(() => {
                    console.log('Successfully added picture to storage');
                    console.log('Updating metadata for image...');
                    const settableMetadata = {
                        contentType: 'image/jpeg',
                    };

                    imageRef.updateMetadata(settableMetadata)
                        .then((metadata) => {
                            console.log('Loading image url...');
                            const refImage = firebase.storage().ref(metadata.fullPath);
                            refImage.getDownloadURL()
                                .then((url) => {
                                    console.log('Saving image url to item...');
                                    const update = {imageUrl: url};
                                    refToUpdate.update(
                                        update,
                                        (error) => {
                                            if (error) {
                                                console.error('Error during image url transmission.');
                                                console.error(error);
                                                // TODO: display error message
                                            } else {
                                                console.log('Successfully update item to include image url.');
                                                if (callback) {
                                                    callback();
                                                }
                                            }
                                        }
                                    );
                                })
                                .catch((error) => {
                                    console.log('Error while retrieving image url');
                                    console.log(error);
                                });
                            console.log('Successfully added metadata to image');
                        }) .catch((error) => {
                            console.log('Error while updating metadata');
                            console.log(error)
                        }
                    );
                }
            )
            .catch((error) => {
                    console.log('Error while adding picture to storage');
                    console.log(error)
                }
            );
    }
}