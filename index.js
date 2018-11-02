import { AppRegistry } from 'react-native';
import App from './app/App';

AppRegistry.registerComponent('SiemensPOC', () => App);

// 忽略警告
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
YellowBox.ignoreWarnings(['Module RCTHotUpdate']);
