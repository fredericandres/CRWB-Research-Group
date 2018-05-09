import {Platform, StyleSheet} from 'react-native';
import {brandBackground, brandContrast, brandLight} from "./constants/Constants";

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
        fontSize: 18,
        fontWeight: 'bold',
        color: brandContrast,
    },
    textTitleBoldLight: {
        fontSize: 36,
        fontWeight: 'bold',
        color: brandBackground,
    },
    textTitle: {
        fontSize: 18,
        color: brandContrast,
    },
    textStandard: {
        fontSize: 14,
        color: brandContrast
    },
    textSmall: {
        fontSize: 10,
        color: brandLight,
    },

    roundProfile: {
        alignSelf: 'center',
        height: 40,
        width: 40, borderRadius: 20
    },
    roundProfileSmall: {
        alignSelf: 'center',
        height: 25,
        width: 25,
        borderRadius: 12
    },

    bottomLine: {
        borderBottomColor: brandContrast,
        borderBottomWidth: 0.2,
    }
});