import {Platform, StyleSheet} from 'react-native';
import {brandBackground, brandContrast, brandLight} from "./constants/Colors";

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
        backgroundColor: brandBackground+'99'
    },

    textTitleBold: {
        fontSize: 20,
        fontWeight: 'bold',
        color: brandContrast
    },
    textTitle: {
        fontSize: 20,
        color: brandContrast
    },
    textStandard: {
        color: brandContrast
    },
    textSmall: {
        fontSize: 10,
        color: brandLight
    }
});