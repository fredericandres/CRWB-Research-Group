import {Platform, StyleSheet} from 'react-native';
import {brandBackground, brandContrast, brandLight} from "./constants/Constants";

const bold = 'bold';
const center = 'center';

const extraLargeFontSize = 36;
const largeFontSize = 18;
const standardFontSize = 14;
const smallFontSize = 10;

const largeThumbnailSize = 40;
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
        backgroundColor: brandBackground + '99'
    },
    containerOpacityDark: {
        backgroundColor: brandContrast + '99'
    },

    textTitleBold: {
        fontSize: largeFontSize,
        fontWeight: bold,
        color: brandContrast,
    },
    textAdjBoldLight: {
        fontSize: extraLargeFontSize,
        fontWeight: bold,
        color: brandBackground,
    },
    textTitle: {
        fontSize: largeFontSize,
        color: brandContrast,
    },
    textStandard: {
        fontSize: standardFontSize,
        color: brandContrast
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
        height: largeThumbnailSize,
        width: largeThumbnailSize,
    },

    bottomLine: {
        borderBottomColor: brandContrast,
        borderBottomWidth: 0.2,
    }
});