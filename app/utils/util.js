import { Dimensions, Platform, StatusBar, DeviceEventEmitter } from 'react-native';
import Constants from './Constants';
import './UrlUtil';
import RequestUtil from './RequestUtil';

export const myScreenSize = Dimensions.get('window');

export const BGColor = '#ebeef2'

// 登出帐号
export function logoutAccount() {
  // 清除数据
  global.variables.userId = '';
  global.variables.personStatus = '';
  global.variables.loginName = '';
  global.variables.userType = '';
  global.variables.loginTime = '';
  global.variables.nickName = '';
  global.variables.email = '';
  // 通知跳转
  DeviceEventEmitter.emit(Constants.JumpToLoginNotiName);
  // 请求登出接口
  _requestPassData = () => {
    let url = baseUrl + '/onsite/api/systemLogout';
    var params = new Map();
    RequestUtil.post(url, params, async (responseJson) => {
    }, (error) => {
    });
  }
}

// 判断是否为iPhoenX
export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
  );
}

export function ifIphoneX(iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function getStatusBarHeight(safe) {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight
  });
}

export function getBottomSpace() {
  return isIphoneX() ? 34 : 0;
}
