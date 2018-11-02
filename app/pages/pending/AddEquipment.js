import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

import BaseComponent from './../base/BaseComponent';
import { myScreenSize } from '../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

let hud = new ProgressHUD;

export default class AddEquipment extends BaseComponent {
  _name = '';
  _num = '';
  _code = '';

  constructor(props) {
    super(props);
    // 取出上个页面传来的值
    this._params = this.props.navigation.state.params;
  }

  // 添加按钮点击事件
  _finishBtnClick = () => {
    // 判断是否填写
    if (this._name.length == 0) {
      hud.showHUDWithText('请输入设备名称');
    } else if (this._num.length == 0) {
      hud.showHUDWithText('请输入设备数量');
    } else {
      // 请求添加设备接口
      this._requestAddEquipmentData();
    }
  }

  // 请求添加设备接口
  _requestAddEquipmentData = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/SimensEquip/EquipAdd';
    var params = new Map();
    params.set('staffId', this._params.data.id);
    params.set('name', this._name);
    params.set('num', this._num);
    if (this._code.length > 0) {
      params.set('code', this._code);
    }
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        hud.hideHUDWithText('处理成功');
        // 刷新上个页面
        this._params.addBack();
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
        {/* 设备名称 */}
        <View style={[styles.item_view, { marginTop: myScreenSize.width * 28 / 750 }]}>
          <Text style={styles.title}>设备名称：</Text>
          <TextInput
            ref={c => this._nameTextInput = c}
            style={styles.text_input}
            placeholder='请输入设备名称'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._name = text}
            returnKeyType='next'
            onSubmitEditing={(event) => this._numTextInput.focus()}
          />
          <View style={styles.line} />
        </View >
        {/* 设备数量 */}
        <View style={styles.item_view} >
          <Text style={styles.title}>设备数量：</Text>
          <TextInput
            ref={c => this._numTextInput = c}
            style={styles.text_input}
            placeholder='请输入设备数量'
            underlineColorAndroid="transparent"
            keyboardType='numeric'
            onChangeText={(text) => this._num = text}
            returnKeyType='next'
            onSubmitEditing={(event) => this._codeTextInput.focus()}
          />
          <View style={styles.line} />
        </View>
        {/* 完成按钮 */}
        <TouchableWithoutFeedback
          onPress={this._finishBtnClick}
        >
          <View style={styles.finish_btn}>
            <Text style={styles.finish_btn_text}>完成</Text>
          </View>
        </TouchableWithoutFeedback>
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
  finish_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: myScreenSize.width * 70 / 750,
    width: myScreenSize.width * 445 / 750,
    height: myScreenSize.width * 80 / 750,
    backgroundColor: '#4c8fe5',
    borderRadius: myScreenSize.width * 40 / 750,
  },
  finish_btn_text: {
    fontSize: myScreenSize.width * 30 / 750,
    color: 'white',
  },
});