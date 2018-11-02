/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Platform,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Linking,
  NativeModules,
} from 'react-native';

import {
  downloadRootDir,
  currentVersion,
  versionDetail,
  updateDate,
  downloadUpdate,
  saveVersionInfo,
  restartApp,
} from './utils/SRHotUpdate';

import './utils/UrlUtil'
import RequestUtil from './utils/RequestUtil';
import ProgressHUD from './utils/ProgressHUD';
import Constants from './utils/Constants';

import LoginNavigator from './pages/login/LoginNavigator';

let hud = new ProgressHUD;

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      backInfo: '',
    };

    // 检查更新
    this._requestCheckVersion();
  }

  // componentWillMount() {
  //   if (isFirstTime) {
  //     Alert.alert('提示', '这是当前版本第一次启动,是否要模拟启动失败?失败将回滚到上一版本', [
  //       { text: '是', onPress: () => { throw new Error('模拟启动失败,请重启应用') } },
  //       { text: '否', onPress: () => { markSuccess() } },
  //     ]);
  //   } else if (isRolledBack) {
  //     Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
  //   }
  // }
  // doUpdate = info => {
  //   downloadUpdate(info).then(hash => {
  //     Alert.alert('提示', '下载完毕,是否重启应用?', [
  //       { text: '是', onPress: () => { switchVersion(hash); } },
  //       { text: '否', },
  //       { text: '下次启动时', onPress: () => { switchVersionLater(hash); } },
  //     ]);
  //   }).catch(err => {
  //     Alert.alert('提示', '更新失败.');
  //   });
  // };
  // checkUpdate = () => {
  //   checkUpdate(appKey).then(info => {
  //     console.log('srinfo:', info);
  //     this.setState({
  //       backInfo: info,
  //     });
  //     if (info.expired) {
  //       Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
  //         { text: '确定', onPress: () => { info.downloadUrl && Linking.openURL(info.downloadUrl) } },
  //       ]);
  //     } else if (info.upToDate) {
  //       Alert.alert('提示', '您的应用版本已是最新.');
  //     } else {
  //       Alert.alert('提示', '检查到新的版本' + info.name + ',是否下载?\n' + info.description, [
  //         { text: '是', onPress: () => { this.doUpdate(info) } },
  //         { text: '否', },
  //       ]);
  //     }
  //   }).catch(err => {
  //     console.log('srerr:', err);
  //     Alert.alert('提示', '更新失败.');
  //   });
  // };

  // 请求检查版本接口
  _requestCheckVersion = () => {
    let url = baseUrl + '/onsite/api/appVersion/appVersion';
    var params = new Map();
    switch (Platform.OS) {
      case 'ios':
        params.set('type', '2');
        break;
      case 'android':
        params.set('type', '1');
        break;
      default:
        break;
    }
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        // 处理数据
        let obj = responseJson.obj;

        let versionCode = obj.versionCode;
        let updateDetails = obj.updateDetails;
        let updateDate = obj.updateDate;
        let updatePackUrl = obj.updatePackUrl;
        let forceUpdate = obj.forceUpdate;
        let versionStatus = obj.versionStatus;

        // 判断本地是否有版本信息，没有则储存
        if (versionCode == null) {
          var versionInfo = new Object();
          versionInfo.version = versionCode;
          versionInfo.versionDetail = updateDetails;
          versionInfo.updateDate = updateDate;
          saveVersionInfo(versionInfo);
        }

        // 判断是否需要更新
        if (versionCode != currentVersion || versionCode != Constants.Version) {
          // 热更新
          hud.showHUDWithText('检测到新版本，正在更新中');
          var option = new Object();
          option.version = versionCode;
          option.versionDetail = updateDetails;
          option.updateDate = updateDate;
          option.updateUrl = updatePackUrl;
          downloadUpdate(option).then(() => {
            Alert.alert('提示', '更新成功，请重新启动', [
              { text: '重新启动', onPress: () => { restartApp() } },
            ],
              { cancelable: false }
            );
            hud.hide();
          }).catch(err => {
            Alert.alert('提示', '更新失败\n' + err);
            hud.hide();
          });
        }
      } else {
      }
    }, (error) => {
    });
  }

  render() {
    return (
      <LoginNavigator />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
