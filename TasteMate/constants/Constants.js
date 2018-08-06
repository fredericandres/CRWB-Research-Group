import {StackActions} from "react-navigation";
import {NativeModules, Platform} from "react-native";
import strings from "../strings";

export const colorMain = '#ffc658';
export const colorContrast = '#333333';
export const colorLight = '#999999';
export const colorBackground = '#f2f2f2';
export const colorMainDark ='#fab150';
export const colorAccent = '#578fff';
export const colorStandardBackground = '#E9E9EF';

export const tastemateFont = 'TastemateRegular';

export const iconSizeLarge = 50;
export const iconSizeNavBar = (Platform.OS !== 'ios' ? 54/2 : 64/3);
export const iconSizeStandard = 25;
export const iconSizeSmall = 15;
export const iconSizeTiny = 12;

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
export const FollowerFolloweeEnum = Object.freeze({FOLLOWER:'follower', FOLLOWEE:'followee'});
export const StoragePathEnum = Object.freeze({USER:0, OBSERVATION:1});

export const pathObservations = 'observations';
export const pathUsers = 'users';
export const pathActions = 'actions';
export const pathFollow = 'follow';
export const pathNotifications = 'notifications';
export const pathLikes = 'likes';
export const pathShares = 'shares';
export const pathCutleries = 'cutleries';
export const pathComments = 'comments';

export const iconLike = 'thumbs-up';
export const iconShare = 'share';
export const iconCutlery = 'cutlery';
export const iconComment = 'comment';
export const iconFollow = 'user-follow';
export const iconUnfollow = 'user-following';
export const iconEatingOut = 'room-service';
export const iconNew = 'plus';
export const iconUser = 'user';
export const iconCog = 'cog';
export const iconSignOut = 'sign-out';
export const iconDescription = 'file-text';
export const iconDishName = 'food-apple';
export const iconMyPoc = 'question';
export const iconDietaryInfo = 'food-off';
export const iconPrice = 'price-tag';
export const iconLocation = 'location-arrow';
export const iconCheckboxChecked = 'check-square-o';
export const iconCheckboxUnchecked = 'square-o';
export const iconSend = 'send';
export const iconClose = 'close';
export const iconCamera = 'camera-retro';
export const iconFlashOn = 'ios-flash';
export const iconFlashOff = 'ios-flash-off';
export const iconCameraRoll = 'md-photos';
export const iconCameraFront = 'camera-front-variant';
export const iconCameraBack = 'camera-rear-variant';
export const iconEmail = 'envelope';
export const iconPassword = 'lock';
export const iconHome = 'home';
export const iconSearch = 'search';
export const iconNotifications = 'bell';
export const iconMenu = 'ellipsis-v';
export const iconList = 'list';
export const iconMap = 'map';
export const iconArrowUpLeft = 'arrow-up-left';
export const iconEdit = 'edit';

export const AsyncStorageKeyObservations = 'OBSERVATIONS';

export const ReactNavigationTabBarHeight = 49;

/**
 * Formats a given number of a given ActivityEnum type into a user-readable string. For example
 * formatNumberWithString(0, ActivityEnum.LIKE) returns the string 'zero likes'
 * @param number The number to be formatted
 * @param type The ActivityEnum type of the number
 * @returns {Array<string | module:react-native-localization.Formatted> | string} A localized string of the number
 * and type
 */
export function formatNumberWithString(number, type) {
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
            case ActivityEnum.FOLLOW:
                wordString = strings.kFollowersSg;
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
            case ActivityEnum.FOLLOW:
                wordString = strings.kFollowers;
                break;
        }

        numberString = formatNumber(number);
    }
    return strings.formatString(wordString, numberString);
}

/**
 * Formats a number into a more human-readable number, such as 1000 into 1k
 * @param number The number to be formatted
 * @returns {*} A string of the formatted number and its abbreviation (if any)
 */
export function formatNumber(number) {
    if (number === undefined) {
        return '0';
    } else if (number < 1000) {
        return number.toString();
    } else if (number < 1000000) {
        return strings.formatString(strings.thousand, Math.floor(number / 1000));
    } else {
        return strings.formatString(strings.million, Math.floor(number / 1000000));
    }
}

/**
 * Navigates to the specified screen with the specified parameters
 * @param screen The name of the screen to be navigated to
 * @param navigation The navigation object to be used
 * @param params The parameters to be handed over to the screen
 */
export function navigateToScreen(screen, navigation, params) {
    const pushAction = StackActions.push({
        routeName: screen,
        params: params,
    });
    navigation.dispatch(pushAction);
}

/**
 * Gets the current language code of the system
 * @returns {*|string|string} A two-character string of the system language, default is 'en'
 */
export function getLanguageCode() {
    let systemLanguage = '';
    if (Platform.OS === 'android') {
        systemLanguage = NativeModules.I18nManager.localeIdentifier;
    } else {
        systemLanguage = NativeModules.SettingsManager.settings.AppleLocale;
    }
    return (systemLanguage && systemLanguage.substring(0, 2)) || 'en';
}

/**
 * Formats a specified username to be alphanumeric
 * @param username The username to be formatted
 * @returns {*} The formatted username
 */
export function formatUsername(username) {
    return username.replace(/[^0-9A-Za-z]/g, '');
}
