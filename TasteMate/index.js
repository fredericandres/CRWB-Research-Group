import { AppRegistry, YellowBox } from 'react-native';
import App from './App';

// TODO: Find a nicer way to deal with the warning caused by isMounted() from react-navigation
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
AppRegistry.registerComponent('TasteMate', () => App);
