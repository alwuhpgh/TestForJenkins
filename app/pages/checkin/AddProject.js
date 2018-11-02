import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import BaseComponent from './../base/BaseComponent';
import { myScreenSize } from '../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

let hud = new ProgressHUD;

export default class AddProject extends BaseComponent {
  _projectName = '';
  _departmentName = '';

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    // 清除timeout
    clearTimeout(this._timeoutId);
  }

  // 完成按钮点击事件
  _completeBtnClick = () => {
    // 判断是否填写
    if (this._projectName.length == 0) {
      hud.showHUDWithText('请输入项目名称');
    } else if (this._departmentName.length == 0) {
      hud.showHUDWithText('请输入部门名称');
    } else {
      // 收起键盘
      Keyboard.dismiss();

      // 请求数据
      this._requestData();
    }
  }

  // 上传项目信息数据
  _requestData = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/SimensProject/proAdd';
    var params = new Map();
    params.set('name', this._projectName);
    params.set('departmentName', this._departmentName);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        hud.hideHUDWithText('创建项目成功');
        // 延迟1s后返回
        this._timeoutId = setTimeout(() => {
          this.props.navigation.pop();
        }, 1000)
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
          {/* 项目名称 */}
          <Text style={[styles.title, { marginTop: myScreenSize.width * 28 / 750 }]}>项目名称：</Text>
          <TextInput
            style={styles.text_input}
            placeholder='请输入项目名称'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._projectName = text}
          />
          <View style={styles.line} />
          {/* 部门名称 */}
          <Text style={styles.title}>部门名称：</Text>
          <TextInput
            style={styles.text_input}
            placeholder='请输入部门名称'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._departmentName = text}
          />
          <View style={styles.line} />
          {/* 完成按钮 */}
          <TouchableWithoutFeedback
            onPress={this._completeBtnClick}>
            <View style={styles.complete_btn}>
              <Text style={styles.complete_btn_text}>
                完成
            </Text>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View >
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
    flexDirection: 'column',
    alignItems: 'center',
    width: myScreenSize.width,
  },
  title: {
    justifyContent: 'center',
    marginTop: myScreenSize.width * 16 / 750,
    width: myScreenSize.width * 654 / 750,
    height: myScreenSize.width * 74 / 750,
    fontSize: myScreenSize.width * 28 / 750,
    color: '#4c8fe5',
  },
  text_input: {
    justifyContent: 'center',
    width: myScreenSize.width * 654 / 750,
    height: myScreenSize.width * 46 / 750,
    padding: 0,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#1e1e1e',
  },
  line: {
    width: myScreenSize.width * 654 / 750,
    height: myScreenSize.width * 1 / 750,
    backgroundColor: '#545454',
  },
  complete_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: myScreenSize.width * 105 / 750,
    marginBottom: myScreenSize.width * 105 / 750,
    width: myScreenSize.width * 277 / 750,
    height: myScreenSize.width * 70 / 750,
    backgroundColor: '#4c8fe5',
    borderRadius: myScreenSize.width * 35 / 750,
  },
  complete_btn_text: {
    fontSize: myScreenSize.width * 32 / 750,
    color: 'white',
  }
});