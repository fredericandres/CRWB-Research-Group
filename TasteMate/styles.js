import {Dimensions, Platform, StatusBar, StyleSheet} from 'react-native';
import {colorBackground, colorContrast, colorLight, colorMain} from "./constants/Constants";
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
        backgroundColor: colorBackground
    },

    containerOpacity: {
        backgroundColor: colorBackground + opacity
    },
    containerOpacityDark: {
        backgroundColor: colorContrast + opacity
    },
    containerOpacityMain: {
        backgroundColor: colorMain + opacity
    },

    textTitleBoldDark: {
        fontSize: largeFontSize,
        fontWeight: bold,
        color: colorContrast,
    },
    textTitleBold: {
        fontSize: largeFontSize,
        fontWeight: bold,
    },
    textTitleBoldLight: {
        fontSize: largeFontSize,
        fontWeight: bold,
        color: colorBackground,
    },
    textLargeBoldLight: {
        fontSize: extraLargeFontSize,
        fontWeight: bold,
        color: colorBackground,
    },
    textLargeBoldDark: {
        fontSize: extraLargeFontSize,
        fontWeight: bold,
        color: colorContrast,
    },
    textLargeDark: {
        fontSize: extraLargeFontSize,
        color: colorContrast,
    },
    textLargeBold: {
        fontSize: extraLargeFontSize,
        fontWeight: bold,
    },
    textTitle: {
        fontSize: largeFontSize,
        color: colorContrast,
    },
    textTitleLight: {
        fontSize: largeFontSize,
        color: colorBackground,
    },
    textStandardDark: {
        fontSize: standardFontSize,
        color: colorContrast
    },
    textStandardLight: {
        fontSize: standardFontSize,
        color: colorBackground
    },
    textStandard: {
        fontSize: standardFontSize,
    },
    textStandardBold: {
        fontSize: standardFontSize,
        color: colorContrast,
        fontWeight: bold,
    },
    textSmall: {
        fontSize: smallFontSize,
        color: colorLight,
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
        borderBottomColor: colorContrast,
        borderBottomWidth: 0.2,
    },

    segmentedControl:{
        flex: 1,
        justifyContent: 'space-around'
    },
    itemSelected :{
        backgroundColor: colorContrast,
    },
    textSelected: {
        color: colorMain,
    },
    itemNotSelected: {
        backgroundColor: colorBackground,
    },
    textNotSelected: {
        color: colorContrast,
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