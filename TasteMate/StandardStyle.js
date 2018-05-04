import {StyleSheet, Platform} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
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
});