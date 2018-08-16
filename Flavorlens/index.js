import { AppRegistry, YellowBox } from 'react-native';
import App from './App';

// TODO: Find a nicer way to deal with the warning caused by isMounted() from react-navigation
YellowBox.ignoreWarnings([
    'Warning: isMounted(...) is deprecated',
    'Module RCTImageLoader requires main queue setup',
    'Module RNFetchBlob requires main queue setup',
    'Class RCTCxxModule was not exported'
]);
AppRegistry.registerComponent('Flavorlens', () => App);
