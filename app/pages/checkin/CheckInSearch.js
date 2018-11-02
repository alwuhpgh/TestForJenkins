import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Picker from 'react-native-picker';

import BaseComponent from './../base/BaseComponent';
import { myScreenSize } from './../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

let hud = new ProgressHUD;

export default class CheckInSearch extends BaseComponent {
  _name = '';
  _projectName = '';
  _code = '';
  _projectNameList = [];
  _waitToShowProjectList = false;

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    Picker.hide();
  }

  // 选择项目点击事件
  _selectProjectBtnClick = () => {
    if (this._projectNameList.length > 0) {
      // 有数据直接显示选择列表
      this._showProjectList();
    } else {
      // 没数据加载数据
      hud.show();
      this._waitToShowProjectList = true;
      this._loadProjectListData();
    }
  }

  // 显示项目列表选择
  _showProjectList = () => {
    // 取消等待
    this._waitToShowProjectList = false;
    // 显示列表选择
    Picker.init({
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '请选择项目',
      pickerBg: [255, 255, 255, 1],
      pickerData: this._projectNameList,
      onPickerConfirm: data => {
        this._projectName = data[0];
        this._projectNameTextInput.setNativeProps({
          text: data[0],
        });
      },
      onPickerCancel: data => {
      },
      onPickerSelect: data => {
      }
    });
    Picker.show();
  }

  // 搜索按钮点击事件
  _search = () => {
    // 设置上个页面内容
    this.props.navigation.state.params.selectBack(this._name, this._projectName, this._code);
    // 返回
    this.props.navigation.pop();
  }

  // 请求项目列表数据
  _loadProjectListData = () => {
    let url = baseUrl + '/onsite/api/SimensProject/proList';
    var params = new Map();
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        // 处理数据
        let obj = responseJson.obj;
        if (obj) {
          this._projectNameList = [];
          for (let i = 0; i < obj.length; i++) {
            this._projectNameList.push(obj[i].name);
          }
          if (this._waitToShowProjectList) {
            if (this._projectNameList.length == 0) {
              hud.hideHUDWithText('没有项目');
              return;
            } else {
              this._showProjectList();
            }
          }
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
        <ScrollView
          style={styles.scroll_view}
          contentContainerStyle={styles.scroll_content}
          scrollEnabled={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {/* 项目名称 */}
          <View style={[styles.item_view, { marginTop: myScreenSize.width * 40 / 750 }]}>
            <Text style={styles.title}>项目名称：</Text>
            <View style={styles.text_input_view}>
              <TextInput
                ref={c => this._projectNameTextInput = c}
                style={styles.text_input}
                placeholder='请输入项目名称'
                underlineColorAndroid="transparent"
                onChangeText={(text) => this._projectName = text}
                editable={false}
              />
              <View style={styles.text_line} />
              <TouchableWithoutFeedback
                onPress={this._selectProjectBtnClick}
              >
                <View style={styles.touchable_cover_view} />
              </TouchableWithoutFeedback>
            </View>
          </View>
          {/* 员工姓名 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>员工姓名：</Text>
            <View style={styles.text_input_view}>
              <TextInput
                style={styles.text_input}
                placeholder='请输入员工姓名'
                underlineColorAndroid="transparent"
                onChangeText={(text) => this._name = text}
              />
              <View style={styles.text_line} />
            </View>
          </View >
          {/* 员工编号 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>员工编号：</Text>
            <View style={styles.text_input_view}>
              <TextInput
                style={styles.text_input}
                placeholder='请输入员工编号'
                underlineColorAndroid="transparent"
                onChangeText={(text) => this._code = text}
              />
              <View style={styles.text_line} />
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={this._search}
          >
            <View style={styles.search_btn}>
              <Text style={styles.search}>搜索</Text>
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
    height: myScreenSize.width * 140 / 750,
  },
  title: {
    justifyContent: 'center',
    marginLeft: myScreenSize.width * 60 / 750,
    width: myScreenSize.width * 150 / 750,
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
  touchable_cover_view: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  search_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: myScreenSize.width * 70 / 750,
    width: myScreenSize.width * 445 / 750,
    height: myScreenSize.width * 80 / 750,
    backgroundColor: '#4c8fe5',
    borderRadius: myScreenSize.width * 40 / 750,
  },
  search: {
    fontSize: myScreenSize.width * 36 / 750,
    color: 'white',
  },
});