import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import DatePicker from 'react-native-datepicker';

import BaseComponent from './../base/BaseComponent';
import { myScreenSize } from '../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

let hud = new ProgressHUD;

export default class AddBackUp extends BaseComponent {
  _name = '';
  _idNumber = '';
  _phone = '';
  _staffCode = '';
  _staffId = '';
  _staffName = '';
  _projecId = '';
  _projectName = '';
  _departmentName = '';

  constructor(props) {
    super(props);

    // state
    this.state = {
      backupTime: '',
      checkoutTime: '',
    };
  }
  // 
  _staffNameTextInputOnChangeText = (text) => {
    // 设置数据
    this._staffCode = '';
    this._staffId = '';
    this._staffName = text;
    // 设置页面
    this._staffCodeTextInput.setNativeProps({
      text: '',
    });
  }
  // 选择编号点击事件
  _staffCodeBtnClick = () => {
    let params = new Object();
    params.selectBack = (item) => {
      // 设置数据
      this._staffCode = item.code;
      this._staffId = item.id;
      this._staffName = item.name;
      this._projecId = item.projecId;
      this._projectName = item.projectName;
      this._departmentName = item.departmentName;
      // 设置页面
      this._staffCodeTextInput.setNativeProps({
        text: item.code,
      });
      this._staffNameTextInput.setNativeProps({
        text: item.name,
      });
      this._projectTextInput.setNativeProps({
        text: item.projectName,
      });
      this._departmentTextInput.setNativeProps({
        text: item.departmentName,
      });
    }
    this.props.navigation.push('SearchEmployee', params);
  }
  // 查找项目按钮点击事件
  _searchProjectBtnClick = () => {
    let params = new Object();
    params.selectBack = (projecId, projectName, departmentName) => {
      // 设置数据
      this._projecId = projecId;
      this._projectName = projectName;
      this._departmentName = departmentName;
      // 设置页面
      this._projectTextInput.setNativeProps({
        text: projectName,
      });
      this._departmentTextInput.setNativeProps({
        text: departmentName,
      });
    }
    this.props.navigation.push('SearchProject', params);
  }
  // 完成按钮点击事件
  _completeBtnClick = () => {
    // 邮箱格式
    const emailRegular = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    // 判断是否填写
    if (this._name.length == 0) {
      hud.showHUDWithText('请输入BackUp员工姓名');
    } else if (this._idNumber.length == 0) {
      hud.showHUDWithText('请输入身份证号');
    } else if (this._phone.length == 0) {
      hud.showHUDWithText('请输入手机号码');
    } else if (this._staffName.length == 0) {
      hud.showHUDWithText('请选择或填写被代替的员工');
    } else if (this._projectName.length == 0) {
      hud.showHUDWithText('请选择所属项目');
    } else if (this._departmentName.length == 0) {
      hud.showHUDWithText('请选择部门名称');
    } else if (this.state.backupTime.length == 0) {
      hud.showHUDWithText('请选择BackUp时间');
    } else if (this.state.checkoutTime.length == 0) {
      hud.showHUDWithText('请选择CheckOut时间');
    } else if (this._phone.length != 11) {
      hud.showHUDWithText('请输入一个长度为11的手机号码');
    } else {
      // 上传员工信息数据
      this._requestStaffData();
    }
  }

  // 上传员工信息数据
  _requestStaffData = () => {
    // 处理时间格式
    let backupTimeString = this.state.backupTime.split('-').join('/');
    let checkoutTimeString = this.state.checkoutTime.split('-').join('/');

    hud.show();

    let url = baseUrl + '/onsite/api/backup/SimensStaff/addBackupStaff';
    var params = new Map();
    params.set('name', this._name);
    params.set('idNumber', this._idNumber);
    params.set('phone', this._phone);
    params.set('projecId', this._projecId);
    params.set('projectName', this._projectName);
    params.set('departmentName', this._departmentName);
    params.set('backupTime', backupTimeString);
    params.set('checkoutTime', checkoutTimeString);
    if (this._staffCode.length > 0) {
      params.set('staffCode', this._staffCode);
      params.set('staffId', this._staffId);
      params.set('staffName', this._staffName);
    } else {
      params.set('staffName', this._staffName);
    }
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        hud.hideHUDWithText('添加BackUp成功');
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
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {/* BackUp员工姓名 */}
          <Text style={[styles.title, { marginTop: myScreenSize.width * 28 / 750 }]}>BackUp员工姓名：</Text>
          <TextInput
            ref={c => this._nameTextInput = c}
            style={styles.text_input}
            placeholder='请输入BackUp员工姓名'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._name = text}
            returnKeyType='next'
            onSubmitEditing={(event) => this._idNumberTextInput.focus()}
          />
          <View style={styles.line} />
          {/* 身份证号/护照号 */}
          <Text style={styles.title}>身份证号：</Text>
          <TextInput
            ref={c => this._idNumberTextInput = c}
            style={styles.text_input}
            placeholder='请输入身份证号'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._idNumber = text}
            returnKeyType='next'
            onSubmitEditing={(event) => this._phoneTextInput.focus()}
          />
          <View style={styles.line} />
          {/* 手机号码 */}
          <Text style={styles.title}>手机号码：</Text>
          <TextInput
            ref={c => this._phoneTextInput = c}
            style={styles.text_input}
            placeholder='请输入手机号码'
            underlineColorAndroid="transparent"
            keyboardType='phone-pad'
            onChangeText={(text) => this._phone = text}
            returnKeyType='next'
            onSubmitEditing={(event) => this._staffNameTextInput.focus()}
          />
          <View style={styles.line} />
          {/* 被代替员工编号 */}
          <Text style={styles.title}>被代替员工编号：</Text>
          <View>
            <TextInput
              ref={c => this._staffCodeTextInput = c}
              style={styles.text_input}
              placeholder='请选择被代替员工编号'
              underlineColorAndroid="transparent"
              editable={false}
            />
            <TouchableWithoutFeedback
              onPress={this._staffCodeBtnClick}
            >
              <View style={styles.touchable_cover_view} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.line} />
          {/* 被代替员工姓名 */}
          <Text style={styles.title}>被代替员工姓名：</Text>
          <TextInput
            ref={c => this._staffNameTextInput = c}
            style={styles.text_input}
            placeholder='请输入被代替员工姓名'
            underlineColorAndroid="transparent"
            onChangeText={this._staffNameTextInputOnChangeText}
            returnKeyType='done'
          />
          <View style={styles.line} />
          {/* 所属项目 */}
          <Text style={styles.title}>所属项目：</Text>
          <View>
            <TextInput
              ref={c => this._projectTextInput = c}
              style={styles.text_input}
              placeholder='请选择所属项目'
              underlineColorAndroid="transparent"
              editable={false}
            />
            <TouchableWithoutFeedback
              onPress={this._searchProjectBtnClick}
            >
              <View style={styles.touchable_cover_view} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.line} />
          {/* 部门名称 */}
          <Text style={styles.title}>部门名称：</Text>
          <View>
            <TextInput
              ref={c => this._departmentTextInput = c}
              style={styles.text_input}
              placeholder='请选择部门名称'
              underlineColorAndroid="transparent"
              onChangeText={(text) => this._departmentName = text}
              editable={false}
            />
            <TouchableWithoutFeedback
              onPress={this._searchProjectBtnClick}
            >
              <View style={styles.touchable_cover_view} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.line} />
          {/* BackUp时间 */}
          <Text style={styles.title}>BackUp时间：</Text>
          <DatePicker
            style={styles.datePicker}
            customStyles={{
              dateTouchBody: styles.datePicker_dateTouchBody,
              dateIcon: styles.datePicker_dateIcon,
              dateInput: styles.datePicker_dateInput,
            }}

            date={this.state.backupTime}
            mode="date"
            placeholder="请选择BackUp时间"
            format="YYYY-MM-DD"
            minDate="2000-01-01"
            maxDate="2100-12-31"
            confirmBtnText="确定"
            cancelBtnText="取消"
            // showIcon={false}
            // iconSource={require('./google_calendar.png')}
            onDateChange={(date) => { this.setState({ backupTime: date }); }}
          />
          <View style={styles.line} />
          {/* CheckOut时间 */}
          <Text style={styles.title}>CheckOut时间：</Text>
          <DatePicker
            style={styles.datePicker}
            customStyles={{
              dateTouchBody: styles.datePicker_dateTouchBody,
              dateIcon: styles.datePicker_dateIcon,
              dateInput: styles.datePicker_dateInput,
              dateText: styles.datePicker_dateText,
            }}

            date={this.state.checkoutTime}
            mode="date"
            placeholder="请选择CheckOut时间"
            format="YYYY-MM-DD"
            minDate="2000-01-01"
            maxDate="2100-12-31"
            confirmBtnText="确定"
            cancelBtnText="取消"
            // showIcon={false}
            // iconSource={require('./google_calendar.png')}
            onDateChange={(date) => { this.setState({ checkoutTime: date }); }}
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
  touchable_cover_view: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  datePicker: {
    width: myScreenSize.width * 654 / 750,
    height: myScreenSize.width * 46 / 750,
  },
  datePicker_dateTouchBody: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  datePicker_dateIcon: {
    width: myScreenSize.width * 50 / 750,
    height: myScreenSize.width * 50 / 750,
    marginLeft: 0,
  },
  datePicker_dateInput: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'transparent',
    alignItems: 'flex-start',
  },
  datePicker_dateText: {
    justifyContent: 'center',
    padding: 0,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#1e1e1e',
  },
  line: {
    width: myScreenSize.width * 654 / 750,
    height: myScreenSize.width * 1 / 750,
    backgroundColor: '#545454',
  },
  image: {
    marginTop: myScreenSize.width * 25 / 750,
    width: myScreenSize.width * 324 / 750,
    height: myScreenSize.width * 226 / 750,
  },
  select_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: myScreenSize.width * 26 / 750,
    width: myScreenSize.width * 140 / 750,
    height: myScreenSize.width * 36 / 750,
    backgroundColor: '#4c8fe5',
    borderRadius: myScreenSize.width * 18 / 750,
  },
  select_btn_text: {
    fontSize: myScreenSize.width * 28 / 750,
    color: 'white',
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