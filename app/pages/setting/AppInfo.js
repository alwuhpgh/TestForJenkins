import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from 'react-native';
import moment from 'moment';

import {
  downloadRootDir,
  currentVersion,
  versionDetail,
  updateDate,
  downloadUpdate,
  saveVersionInfo,
  restartApp,
} from './../../utils/SRHotUpdate';

import './../../utils/Variable';
import Constants from './../../utils/Constants';
import BaseComponent from './../base/BaseComponent';
import { myScreenSize, logoutAccount } from './../../utils/util';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

let hud = new ProgressHUD;

export default class AppInfo extends BaseComponent {
  _loginTimeString = '';

  constructor(props) {
    super(props);

    // 设置时间格式
    this._loginTimeString = moment(global.variables.loginTime).format('YYYY.MM.DD hh:mm:ss');;
  }

  // 检查更新按钮点击事件
  _checkVersionBtnClick = () => {
    this._requestCheckVersion();
  }

  // 修改密码按钮点击事件
  _changePasswordBtnClick = () => {
    // 跳转到修改密码页面
    this.props.navigation.push('ChangePassword');
  }

  // 退出登录按钮点击事件
  _logoutBtnClick = () => {
    logoutAccount();
  }

  // 请求检查版本接口
  _requestCheckVersion = () => {
    hud.show();

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
          Alert.alert('提示', '检测到新版本是否更新', [
            {
              text: '更新', onPress: () => {
                hud.showHUDWithText('正在更新中');
                // 热更新
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
            },
            { text: '取消', },
          ]);
        } else {
          Alert.alert('提示', '您的应用版本已是最新.');
        }
        hud.hide();
      } else {
        hud.hideHUDWithText(responseJson.msg);
      }
    }, (error) => {
      hud.hideHUDForRequestFailure();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {/* logo */}
        <Image style={styles.logo} resizeMode="contain" source={require('./../../img/Common/logo.png')} />
        {/* 应用名称 */}
        <Text style={styles.app_name_text}>Onsite/Offshore Vendor Staff Management</Text>
        {/* 应用版本 */}
        <Text style={styles.version_text}>V{currentVersion ? currentVersion : Constants.Version}</Text>
        {/* 更新日志 */}
        <Text style={styles.update_details_title}>当前版本更新日志：</Text>
        <Text style={styles.update_details_text}>{versionDetail}</Text>
        {/* 按钮 */}
        <View style={styles.bottom_container}>
          {/* 检查更新按钮 */}
          <TouchableWithoutFeedback
            onPress={this._checkVersionBtnClick}
          >
            <View style={styles.check_version_btn}>
              <Text style={styles.check_version_btn_text}>检查更新</Text>
            </View>
          </TouchableWithoutFeedback>
          {/* 修改密码按钮 */}
          <TouchableWithoutFeedback
            onPress={this._changePasswordBtnClick}
          >
            <View style={styles.change_password_btn}>
              <Text style={styles.change_password_btn_text}>修改密码</Text>
            </View>
          </TouchableWithoutFeedback>
          {/* 退出登录按钮 */}
          <TouchableWithoutFeedback
            onPress={this._logoutBtnClick}
          >
            <View style={styles.logout_btn}>
              <Text style={styles.logout_btn_text}>退出登录</Text>
            </View>
          </TouchableWithoutFeedback>
          {/* 更新时间 */}
          <Text style={styles.update_date_text}>更新时间：{updateDate}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    marginTop: myScreenSize.width * 100 / 750,
    width: myScreenSize.width * 352 / 750,
    height: myScreenSize.width * 126 / 750,
  },
  app_name_text: {
    marginTop: myScreenSize.width * 66 / 750,
    fontSize: myScreenSize.width * 28 / 750,
    color: '#878787',
  },
  version_text: {
    marginTop: myScreenSize.width * 18 / 750,
    fontSize: myScreenSize.width * 28 / 750,
    color: '#878787',
  },
  update_details_title: {
    marginTop: myScreenSize.width * 100 / 750,
    width: myScreenSize.width * 618 / 750,
    fontSize: myScreenSize.width * 32 / 750,
    color: '#000000',
  },
  update_details_text: {
    marginTop: myScreenSize.width * 36 / 750,
    width: myScreenSize.width * 618 / 750,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#000000',
    lineHeight: myScreenSize.width * 46 / 750,
  },
  bottom_container: {
    position: 'absolute',
    bottom: 0,
  },
  check_version_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: myScreenSize.width * 26 / 750,
    width: myScreenSize.width * 446 / 750,
    height: myScreenSize.width * 70 / 750,
    backgroundColor: '#0199a0',
    borderRadius: myScreenSize.width * 35 / 750,
  },
  check_version_btn_text: {
    fontSize: myScreenSize.width * 30 / 750,
    color: 'white',
  },
  change_password_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: myScreenSize.width * 26 / 750,
    width: myScreenSize.width * 446 / 750,
    height: myScreenSize.width * 70 / 750,
    backgroundColor: 'white',
    borderRadius: myScreenSize.width * 35 / 750,
    borderColor: '#0199a0',
    borderWidth: myScreenSize.width * 1 / 750,
  },
  change_password_btn_text: {
    fontSize: myScreenSize.width * 30 / 750,
    color: '#000000',
  },
  logout_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: myScreenSize.width * 100 / 750,
    width: myScreenSize.width * 446 / 750,
    height: myScreenSize.width * 70 / 750,
    backgroundColor: 'white',
    borderRadius: myScreenSize.width * 35 / 750,
    borderColor: '#0199a0',
    borderWidth: myScreenSize.width * 1 / 750,
  },
  logout_btn_text: {
    fontSize: myScreenSize.width * 30 / 750,
    color: '#000000',
  },
  update_date_text: {
    marginBottom: myScreenSize.width * 56 / 750,
    fontSize: myScreenSize.width * 28 / 750,
    color: '#bbbbbb',
  },
});