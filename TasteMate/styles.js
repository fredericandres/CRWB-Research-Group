import {Dimensions, Platform, StatusBar, StyleSheet} from 'react-native';
import {brandBackground, brandContrast, brandLight, brandMain} from "./constants/Constants";
import {Header} from 'react-navigation';

const bold = 'bold';
const center = 'center';

const opacity = '99';

export const smileySuperLargeFontSize = 50;
const extraLargeFontSize = 36;
const largeFontSize = 18;
export const standardFontSize = 14;
export const smallFontSize = 10;

const largeThumbnailSize = ((Dimensions.get('window').height - Header.HEIGHT - Header.HEIGHT - (Platform.OS === 'android' ? StatusBar.currentHeight : 0)) * 2 / 7) * 3 / 5;
const standardThumbnailSize = 40;
const smallThumbnailSize = 25;

const roundedEdges = Platform.OS === 'ios' ? 10 : 2;

export default StyleSheet.create({
    containerPadding: {
        ...Platform.select({
            ios: {
                padding: 4,
                margin: 2
            },
            android: {
                //padding: 6
                padding: 4,
                margin: 2
            }
        }),
    },

    explorePadding: {
        padding: 1
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
    containerOpacityMain: {
        backgroundColor: brandMain + opacity
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
    textTitleBoldLight: {
        fontSize: largeFontSize,
        fontWeight: bold,
        color: brandBackground,
    },
    textLargeBoldLight: {
        fontSize: extraLargeFontSize,
        fontWeight: bold,
        color: brandBackground,
    },
    textLargeBoldDark: {
        fontSize: extraLargeFontSize,
        fontWeight: bold,
        color: brandContrast,
    },
    textLargeDark: {
        fontSize: extraLargeFontSize,
        color: brandContrast,
    },
    textLargeBold: {
        fontSize: extraLargeFontSize,
        fontWeight: bold,
    },
    textTitle: {
        fontSize: largeFontSize,
        color: brandContrast,
    },
    textTitleLight: {
        fontSize: largeFontSize,
        color: brandBackground,
    },
    textStandardDark: {
        fontSize: standardFontSize,
        color: brandContrast
    },
    textStandardLight: {
        fontSize: standardFontSize,
        color: brandBackground
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
        borderBottomLeftRadius: roundedEdges,
        borderTopLeftRadius: roundedEdges,
    },
    rightRoundedEdges: {
        borderBottomRightRadius: roundedEdges,
        borderTopRightRadius: roundedEdges,
    },
});