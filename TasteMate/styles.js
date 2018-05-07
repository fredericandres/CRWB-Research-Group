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
        //borderStyle: 'solid',
        //borderWidth: 0.5,
    },

    baseContainer: {
        backgroundColor: brandBackground
    },

    containerOpacity: {
        backgroundColor: brandBackground+'99'
    },

    textTitleBold: {
        fontSize: 18,
        fontWeight: 'bold',
        color: brandContrast,
        //backgroundColor: 'blue'
    },
    textTitle: {
        fontSize: 18,
        color: brandContrast,
        //backgroundColor: 'red'
    },
    textStandard: {
        fontSize: 14,
        color: brandContrast
    },
    textSmall: {
        fontSize: 10,
        color: brandLight,
        //backgroundColor: 'pink'
    },

    roundProfile: {
        alignSelf: 'center',
        height: 40,
        width: 40,
        //borderWidth: 1,
        borderRadius: 20
    },
    roundProfileSmall: {
        alignSelf: 'center',
        height: 25,
        width: 25,
        //borderWidth: 1,
        borderRadius: 12
    },

    bottomLine: {
        borderBottomColor: brandContrast,
        borderBottomWidth: 0.2,
    }
});