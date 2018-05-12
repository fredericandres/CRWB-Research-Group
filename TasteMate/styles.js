import {Platform, StyleSheet, Dimensions} from 'react-native';
import {brandBackground, brandContrast, brandLight, brandMain} from "./constants/Constants";
import { StatusBar } from 'react-native';
import { Header, TabNavigator } from 'react-navigation';

const bold = 'bold';
const center = 'center';

const opacity = '99';

const extraLargeFontSize = 36;
const largeFontSize = 18;
const standardFontSize = 14;
const smallFontSize = 10;

const largeThumbnailSize = ((Dimensions.get('window').height - Header.HEIGHT - Header.HEIGHT - (Platform.OS === 'android' ? StatusBar.currentHeight : 0)) * 2 / 7) * 3 / 5;
const standardThumbnailSize = 40;
const smallThumbnailSize = 25;

export default StyleSheet.create({
    containerPadding: {
        ...Platform.select({
            ios: {
                padding: 4,
                margin: 2
            },
            android: {
                padding: 6
            }
        }),
    },

    baseContainer: {
        backgroundColor: brandBackground
    },

    containerOpacity: {
        backgroundColor: brandBackground + opacity
    },
    containerOpacityDark: {
        backgroundColor: brandContrast + opacity
    },

    textTitleBoldDark: {
        fontSize: largeFontSize,
        fontWeight: bold,
        color: brandContrast,
    },
    textTitleBold: {
        fontSize: largeFontSize,
        fontWeight: bold,
    },
    textLargeBoldLight: {
        fontSize: extraLargeFontSize,
        fontWeight: bold,
        color: brandBackground,
    },
    textLargeBold: {
        fontSize: extraLargeFontSize,
        fontWeight: bold,
    },
    textTitle: {
        fontSize: largeFontSize,
        color: brandContrast,
    },
    textStandardDark: {
        fontSize: standardFontSize,
        color: brandContrast
    },
    textStandard: {
        fontSize: standardFontSize,
    },
    textStandardBold: {
        fontSize: standardFontSize,
        color: brandContrast,
        fontWeight: bold,
    },
    textSmall: {
        fontSize: smallFontSize,
        color: brandLight,
    },

    roundProfile: {
        alignSelf: center,
        height: standardThumbnailSize,
        width: standardThumbnailSize,
        borderRadius: standardThumbnailSize/2
    },
    roundProfileLarge: {
        alignSelf: center,
        height: largeThumbnailSize,
        width: largeThumbnailSize,
        borderRadius: largeThumbnailSize/2
    },
    roundProfileSmall: {
        alignSelf: center,
        height: smallThumbnailSize,
        width: smallThumbnailSize,
        borderRadius: smallThumbnailSize/2
    },
    squareThumbnail: {
        alignSelf: center,
        height: standardThumbnailSize,
        width: standardThumbnailSize,
    },

    bottomLine: {
        borderBottomColor: brandContrast,
        borderBottomWidth: 0.2,
    },

    segmentedControl:{
        flex: 1,
        justifyContent: 'space-around'
    },
    itemSelected :{
        backgroundColor: brandContrast,
    },
    textSelected: {
        color: brandMain,
    },
    itemNotSelected: {
        backgroundColor: brandBackground,
    },
    textNotSelected: {
        color: brandContrast,
    },
    leftRoundedEdges: {
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    },
    rightRoundedEdges: {
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
    },
});