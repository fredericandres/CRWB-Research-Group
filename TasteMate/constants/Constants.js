import {StackActions} from "react-navigation";
import {NativeModules, Platform} from "react-native";
import strings from "../strings";
import firebase from 'react-native-firebase';
import {currentUser} from "../App";
import ImageResizer from 'react-native-image-resizer';

export const brandMain = '#ffc658';
export const brandContrast = '#333333';
export const brandLight = '#999999';
export const brandBackground = '#f2f2f2';
export const brandMainDark ='#fab150';
export const brandAccent = '#578fff';

export const tastemateFont = 'TastemateRegular';

export const iconSizeLarge = 50;
export const iconSizeNavBar = (Platform.OS !== 'ios' ? 54/2 : 64/3);
export const iconSizeStandard = 25;
export const iconSizeSmall = 15;

export const maxUsernameLength = 15;

// TODO [FEATURE]: Custom icons based on logo
export const EmojiEnum = Object.freeze({
    1:require('../Images/Emoji/emojienum_1.png'),
    2:require('../Images/Emoji/emojienum_2.png'),
    3:require('../Images/Emoji/emojienum_3.png'),
    4:require('../Images/Emoji/emojienum_4.png'),
    5:require('../Images/Emoji/emojienum_5.png'),
    6:require('../Images/Emoji/emojienum_6.png'),
    7:require('../Images/Emoji/emojienum_7.png'),
    8:require('../Images/Emoji/emojienum_8.png'),
    9:require('../Images/Emoji/emojienum_9.png')
});
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

export function _addPictureToStorage(path, imageUrl, refToUpdate, callback, setActivityIndicatorText, stopActivityIndicator) {
    // TODO: Fix app crash on iOS picture upload
    setActivityIndicatorText(strings.uploadingPicture);
    if (Platform.OS === 'android') {
        console.log('Resizing picture...');

        ImageResizer.createResizedImage(imageUrl, 2000, 2000, 'JPEG', 80, 0)
            .then(reply => {
                console.log('Adding picture to storage...');
                const settableMetadata = {
                    contentType: 'image/jpeg',
                    customMetadata: {
                        userid: currentUser.uid
                    }
                };

                const imageRef = firebase.storage().ref(path);
                imageRef.putFile(reply.uri, settableMetadata)
                    .then((response) => {
                        console.log('Successfully added picture to storage');
                        console.log('Saving image url to item...');
                        const update = {imageUrl: response.downloadURL};
                        refToUpdate.update(update)
                            .then(() => {
                                console.log('Successfully updated item to include image url.');
                                stopActivityIndicator();
                                if (callback) {
                                    callback(response.downloadURL);
                                }
                            }).catch((error) => {
                                console.log('Error during image url transmission.');
                                stopActivityIndicator();
                                console.log(error);
                                // TODO: display error message
                            }
                        );
                    }).catch((error) => {
                    stopActivityIndicator();
                    console.log('Error while adding picture to storage');
                    console.log(error);
                });
            }).catch((error) => {
            stopActivityIndicator();
            console.log('Error while resizing picture');
            console.log(error);
        });
    }
}