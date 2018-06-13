import {StackActions} from "react-navigation";
import {NativeModules, Platform} from "react-native";
import strings from "../strings";

export const brandMain = '#ffc658';
export const brandContrast = '#333333';
export const brandLight = '#999999';
export const brandBackground = '#f2f2f2';
export const brandMainDark ='#fab150';
export const brandAccent = '#578fff';

export const iconSizeLarge = 50;
export const iconSizeStandard = 25;
export const iconSizeSmall = 15;

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