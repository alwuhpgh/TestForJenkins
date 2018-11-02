import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

import BaseComponent from './../base/BaseComponent';
import { myScreenSize, logoutAccount } from './../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

let hud = new ProgressHUD;

export default class ChangePassword extends BaseComponent {
  _oldPassword = '';
  _newPassword = '';
  _confirmPassword = '';

  constructor(props) {
    super(props);
  }

  // 提交按钮点击事件
  _submitBtnClick = () => {
    // 判断是否填写，以及是否填写错误
    if (this._oldPassword.length == 0) {
      hud.showHUDWithText('请输入原始密码');
    } else if (this._newPassword.length < 6 || this._newPassword.length > 20) {
      hud.showHUDWithText('请输入一个6-20位的新密码');
    } else if (this._newPassword !== this._confirmPassword) {
      hud.showHUDWithText('两次输入的密码不一致');
    } else {
      this._requestPasswordData();
    }
  }

  // 请求项目列表数据
  _requestPasswordData = () => {
    let url = baseUrl + '/onsite/api/system/changePassword';
    var params = new Map();
    params.set('oldPwd', this._oldPassword);
    params.set('newPwd', this._newPassword);
    params.set('confirmPwd', this._confirmPassword);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        // 处理数据
        let obj = responseJson.obj;
        // 成功后退出登录，跳转到登录页面
        this._timeoutId = setTimeout(() => {
          logoutAccount();
        }, 1000);

        hud.hideHUDWithText(responseJson.msg);
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
        <ScrollView
          style={styles.scroll_view}
          contentContainerStyle={styles.scroll_content}
          scrollEnabled={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {/* 原始密码 */}
          <View style={[styles.item_view, { marginTop: myScreenSize.width * 40 / 750 }]}>
            <Text style={styles.title}>原始密码：</Text>
            <View style={styles.text_input_view}>
              <TextInput
                style={styles.text_input}
                placeholder='请输入原始密码'
                secureTextEntry={true}
                underlineColorAndroid="transparent"
                onChangeText={(text) => this._oldPassword = text}
              />
              <View style={styles.text_line} />
            </View>
          </View>
          {/* 新密码 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>新密码：</Text>
            <View style={styles.text_input_view}>
              <TextInput
                style={styles.text_input}
                placeholder='请输入新密码'
                secureTextEntry={true}
                underlineColorAndroid="transparent"
                onChangeText={(text) => this._newPassword = text}
              />
              <View style={styles.text_line} />
            </View>
          </View >
          {/* 确认新密码 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>确认新密码：</Text>
            <View style={styles.text_input_view}>
              <TextInput
                style={styles.text_input}
                placeholder='请再次输入新密码'
                secureTextEntry={true}
                underlineColorAndroid="transparent"
                onChangeText={(text) => this._confirmPassword = text}
              />
              <View style={styles.text_line} />
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={this._submitBtnClick}
          >
            <View style={styles.btn}>
              <Text style={styles.btn_text}>提交</Text>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    )
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
  item_view: {
    flexDirection: 'row',
    alignItems: 'center',
    width: myScreenSize.width,
    height: myScreenSize.width * 120 / 750,
  },
  title: {
    justifyContent: 'center',
    marginLeft: myScreenSize.width * 50 / 750,
    width: myScreenSize.width * 180 / 750,
    fontSize: myScreenSize.width * 28 / 750,
    color: '#1e1e1e',
  },
  text_input_view: {
    flexDirection: 'column',
    alignItems: 'center',
    width: myScreenSize.width * 480 / 750,
    height: myScreenSize.width * 48 / 750,
  },
  text_input: {
    justifyContent: 'center',
    width: myScreenSize.width * 480 / 750,
    height: myScreenSize.width * 46 / 750,
    padding: 0,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#1e1e1e',
  },
  text_line: {
    width: myScreenSize.width * 480 / 750,
    height: myScreenSize.width * 1 / 750,
    backgroundColor: '#545454',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: myScreenSize.width * 70 / 750,
    width: myScreenSize.width * 445 / 750,
    height: myScreenSize.width * 70 / 750,
    backgroundColor: '#0199a0',
    borderRadius: myScreenSize.width * 35 / 750,
  },
  btn_text: {
    fontSize: myScreenSize.width * 36 / 750,
    color: 'white',
  },
});