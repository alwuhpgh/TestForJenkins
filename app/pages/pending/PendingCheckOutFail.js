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
import { myScreenSize } from './../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

// 评价最多字数
let maxEvaluateNum = 200;

let hud = new ProgressHUD;

export default class PendingCheckOutFail extends BaseComponent {
  _id = '';
  _evaluate = '';

  constructor(props) {
    super(props);
    // state
    this.state = {
      textNum: '0/' + maxEvaluateNum,
    }
    // 取出上个页面传来的值
    this._id = this.props.navigation.state.params.id;
  }

  // 输入框内容改变
  _textInputOnChangeText = (text) => {
    // 判断是否超长
    let finalText = text;
    if (text.length > maxEvaluateNum) {
      finalText = text.substr(0, maxEvaluateNum);
    }
    // 设置文字
    this._evaluate = finalText;
    this._textInput.setNativeProps({
      text: finalText,
    })
    // 设置字数
    this.setState({
      textNum: '' + finalText.length + '/' + maxEvaluateNum,
    })
  }

  // 不通过按钮点击事件
  _failBtnClick = () => {
    if (this._evaluate.length == 0) {
      hud.showHUDWithText('请填写拒绝原因');
    } else {
      // CheckOut员工
      this._requestCheckOut();
    }
  }

  // 拒绝申请
  _requestCheckOut = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/pending/SimensStaff/notCheckOutStaff';
    var params = new Map();
    params.set('id', this._id);
    params.set('notStr', this._evaluate);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        hud.hideHUDWithText('处理成功');
        // 延迟1s后返回
        this._timeoutId = setTimeout(() => {
          this.props.navigation.pop(2);
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
          {/* 员工评价 */}
          <Text style={styles.title}>员工评价：</Text>
          <TextInput
            ref={c => this._textInput = c}
            style={styles.text_input}
            placeholder='请输入您对本员工的评价'
            underlineColorAndroid="transparent"
            multiline={true}
            onChangeText={this._textInputOnChangeText}
          />
          <Text style={styles.text_num}>{this.state.textNum}</Text>
          {/* 不通过按钮 */}
          <TouchableWithoutFeedback
            onPress={this._failBtnClick}
          >
            <View style={styles.btn}>
              <Text style={styles.btn_text}>不通过</Text>
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
    marginTop: myScreenSize.width * 40 / 750,
    width: myScreenSize.width * 670 / 750,
    fontSize: myScreenSize.width * 30 / 750,
    color: '#1e1e1e',
  },
  text_input: {
    marginTop: myScreenSize.width * 20 / 750,
    width: myScreenSize.width * 670 / 750,
    height: myScreenSize.width * 400 / 750,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#1e1e1e',
    textAlignVertical: 'top',
  },
  text_num: {
    alignSelf: 'flex-end',
    marginRight: myScreenSize.width * 40 / 750,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#a3a3a3',
    textAlign: 'right',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: myScreenSize.width * 80 / 750,
    width: myScreenSize.width * 180 / 750,
    height: myScreenSize.width * 80 / 750,
    backgroundColor: '#4c8fe5',
  },
  btn_text: {
    fontSize: myScreenSize.width * 30 / 750,
    color: 'white',
  },
});