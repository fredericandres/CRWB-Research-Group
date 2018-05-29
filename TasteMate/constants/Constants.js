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

export const EmojiEnum = Object.freeze({1: '🤢', 2:'😖', 3:'😟', 4:'😕', 5:'😶', 6:'🙂', 7:'😊', 8:'🤤', 9:'😍'});
export const VocabEnum = Object.freeze({TASTE:1, TEXTURE:2, ODOR:3});

export function _formatNumber(number, type) {
    let wordString = '';
    let numberString = '';
    if (number === 1) {
        switch (type) {
            case 'LIKE':
                wordString = strings.likesSg;
                break;
            case 'SHARE':
                wordString = strings.sharesSg;
                break;
            case 'CUTLERY':
                wordString = strings.cutleriesSg;
                break;
        }
        numberString = number;
    } else {
        switch (type) {
            case 'LIKE':
                wordString = strings.likes;
                break;
            case 'SHARE':
                wordString = strings.shares;
                break;
            case 'CUTLERY':
                wordString = strings.cutleries;
                break;
        }
        if (number < 1000) {
            numberString = number;
        } else if (number < 1000000) {
            numberString = strings.formatString(strings.thousand, Math.floor(number / 1000));
        } else {
            numberString = strings.formatString(strings.million, Math.floor(number / 1000000));
        }
    }
    return strings.formatString(wordString, numberString);
}

export function _navigateToScreen(screen, navigation, user, myProfile) {
    const pushAction = StackActions.push({
        routeName: screen,
        params: {
            myProfile: myProfile ? myProfile : undefined,
            user: user ? user : undefined,
        },
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