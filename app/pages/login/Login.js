import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  StatusBar,
  ScrollView,
} from 'react-native';
import PushUtil from './../../libs/UmengSDK/PushUtil';

import './../../utils/Variable';
import { myScreenSize } from './../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';
import UserDefaultsManager from './../../utils/UserDefaultsManager';

let hud = new ProgressHUD;

export default class Login extends Component {
  _username = '';
  _password = '';

  constructor(props) {
    super(props);
    this.state = {
      showVerificationCode: false,
    };

    // 取出上次登录帐号
    UserDefaultsManager.historyUsername().then((historyUsername) => {
      this._usernameTextInput.setNativeProps({
        text: historyUsername,
      });
      this._username = historyUsername;
      ///////////
      // this._password = '123456';
      ///////////
    });
  }
  // 登录按钮点击事件
  _loginBtnClick = async () => {
    // 跳转至首页
    // global.variables.userType = 3;
    // this.props.navigation.replace('HomeNavigatorComponent');
    // return;
    // 判断是否填写
    if (this._username.length == 0) {
      hud.showHUDWithText('请输入邮箱/手机号/登录名');
    } else if (this._password.length == 0) {
      hud.showHUDWithText('请输入密码');
    } else {
      await this._requestLoginData();
    }
  }
  // 登录请求
  async _requestLoginData() {
    hud.show();

    let url = baseUrl + '/onsite/api/login/main';
    var params = new Map();
    params.set('username', this._username);
    params.set('password', this._password);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        // 处理数据
        let obj = responseJson.obj;

        let userId = obj.userId;
        let personStatus = obj.personStatus;
        let loginName = obj.loginName;
        let userType = obj.userType;
        let loginTime = obj.loginTime;
        let nickName = obj.nickName;
        let email = obj.email;
        // 存储登录信息
        // 将用户名存入历史
        await UserDefaultsManager.setHistoryUsername(this._username);

        // 全局变量中存储用户数据
        global.variables.userId = userId;
        global.variables.personStatus = personStatus;
        global.variables.loginName = loginName;
        global.variables.userType = userType;
        global.variables.loginTime = loginTime;
        global.variables.nickName = nickName;
        global.variables.email = email;

        // 设置友盟
        // alias
        PushUtil.addAlias(email, 'email', (code) => {
        });

        // 查询已有tag
        PushUtil.listTag((code, result) => {
          // 判断需要删除哪些tag和添加哪些tag
          if (result == null || !Array.isArray(result)) {
            result = [];
          }
          var currentTagSet = new Set(result);
          var willAddTagSet = new Set();
          willAddTagSet.add(userId + '');
          willAddTagSet.add(personStatus + '');
          willAddTagSet.add(loginName + '');
          willAddTagSet.add(userType + '');
          willAddTagSet.add(loginTime + '');
          willAddTagSet.add(nickName + '');
          var willRemoveTagSet = new Set();
          // 开始判断、分类
          for (let item of currentTagSet.keys()) {
            if (willAddTagSet.has(item)) {
              willAddTagSet.delete(item);
            } else {
              willRemoveTagSet.add(item);
            }
          }
          // 开始删除
          for (let item of willRemoveTagSet.keys()) {
            PushUtil.deleteTag(item + '', (code, result) => {
            });
          }
          // 开始添加
          for (let item of willAddTagSet.keys()) {
            PushUtil.addTag(item + '', (code, remain) => {
            });
          }
        });

        // 跳转至首页
        this.props.navigation.replace('HomeNavigatorComponent');
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
        <StatusBar barStyle={'default'} />
        <ScrollView
          style={styles.scroll_view}
          contentContainerStyle={styles.scroll_content}
          scrollEnabled={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {/* 上边图片 */}
          <Image style={styles.upper} source={require('./../../img/Login/login_upper.png')} />
          {/* 帐号 */}
          <TextInput
            ref={c => this._usernameTextInput = c}
            style={[styles.text_input, { marginTop: myScreenSize.width * 90 / 750 }]}
            placeholder='邮箱/手机号/登录名'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._username = text}
          />
          <View style={styles.underline} />
          {/* 密码 */}
          <TextInput
            ref={c => this._passwordTextInput = c}
            style={[styles.text_input, { marginTop: myScreenSize.width * 44 / 750 }]}
            placeholder='密码'
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._password = text}
          />
          <View style={styles.underline} />
          {/* 登录按钮 */}
          <TouchableWithoutFeedback
            onPress={this._loginBtnClick}>
            <View style={styles.login_btn}>
              <Text style={styles.login}>
                登录
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
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
  scroll_view: {
    flex: 1,
  },
  scroll_content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  upper: {
    width: myScreenSize.width,
    height: myScreenSize.width * 400 / 750,
  },
  text_input: {
    justifyContent: 'center',
    width: myScreenSize.width * 578 / 750,
    height: myScreenSize.width * 70 / 750,
    paddingVertical: 0,
    fontSize: myScreenSize.width * 30 / 750,
    color: '#1e1e1e',
  },
  underline: {
    width: myScreenSize.width * 578 / 750,
    height: myScreenSize.width * 1 / 750,
    backgroundColor: '#b8b8b8',
  },
  login_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: myScreenSize.width * 222 / 750,
    width: myScreenSize.width * 445 / 750,
    height: myScreenSize.width * 80 / 750,
    backgroundColor: '#4c8fe5',
    borderRadius: myScreenSize.width * 40 / 750,
  },
  login: {
    fontSize: myScreenSize.width * 36 / 750,
    color: 'white',
  },
});