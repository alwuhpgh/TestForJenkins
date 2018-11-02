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
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker';

import BaseComponent from './../base/BaseComponent';
import { myScreenSize } from '../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

let hud = new ProgressHUD;

export default class EmployeeInput extends BaseComponent {
  _name = '';
  _idNumber = '';
  _phone = '';
  _email = '';
  _projecId = '';
  _projectName = '';
  _departmentName = '';
  _pmEmail = '';
  _superVisorEmail = '';
  _companyPicture = '';
  _idNumberPicture = '';

  _isSelectedCompanyPicture = false;
  _isSelectedIdNumberPicture = false;

  _currentRequestCount = 0;

  constructor(props) {
    super(props);

    // state
    this.state = {
      companyImgSource: require('./../../img/Employee/company_img_default.png'),
      identityCardImgSource: require('./../../img/Employee/identity_card_img_default.png'),
      entryTime: '',
      leaveTime: '',
    };
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
  // 公司ID卡照片选择按钮点击事件
  _selectCompanyImgBtnClick = () => {
    let options = {
      title: '选择公司ID卡照片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍摄照片',
      chooseFromLibraryButtonTitle: '从手机中选择图片',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        // 处理图片
        const source = { uri: response.uri };
        // 设置页面
        this.setState({
          companyImgSource: source,
        });
        // 设置已添加图片
        this._isSelectedCompanyPicture = true;
      }
    });
  }
  // 身份证/护照复印件选择按钮点击事件
  _selectIdentityCardImgBtnClick = () => {
    let options = {
      title: '选择身份证/护照复印件照片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍摄照片',
      chooseFromLibraryButtonTitle: '从手机中选择图片',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        // 处理图片
        const source = { uri: response.uri };
        // 设置页面
        this.setState({
          identityCardImgSource: source,
        });
        // 设置已添加图片
        this._isSelectedIdNumberPicture = true;
      }
    });
  }
  // 完成按钮点击事件
  _completeBtnClick = () => {
    // 邮箱格式
    const emailRegular = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    // 判断是否填写
    if (this._name.length == 0) {
      hud.showHUDWithText('请输入员工姓名');
    } else if (this._idNumber.length == 0) {
      hud.showHUDWithText('请输入身份证号/护照号');
    } else if (this._phone.length == 0) {
      hud.showHUDWithText('请输入手机号码');
    } else if (this._email.length == 0) {
      hud.showHUDWithText('请输入邮箱');
    } else if (this._projectName.length == 0) {
      hud.showHUDWithText('请选择所属项目');
    } else if (this._departmentName.length == 0) {
      hud.showHUDWithText('请选择部门名称');
    } else if (this._pmEmail.length == 0) {
      hud.showHUDWithText('请输入项目经理邮箱');
    } else if (this._superVisorEmail.length == 0) {
      hud.showHUDWithText('请输入superVisor邮箱');
    } else if (this._isSelectedCompanyPicture == false) {
      hud.showHUDWithText('请添加公司ID卡照片');
    } else if (this._isSelectedIdNumberPicture == false) {
      hud.showHUDWithText('请添加身份证/护照复印件图片');
    } else if (this.state.entryTime.length == 0) {
      hud.showHUDWithText('请选择入职时间');
    } else if (this.state.leaveTime.length == 0) {
      hud.showHUDWithText('请选择离职时间');
    } else if (this._phone.length != 11) {
      hud.showHUDWithText('请输入一个长度为11的手机号码');
    } else if (!emailRegular.test(this._email)) {
      hud.showHUDWithText('邮箱请输入正确的格式');
    } else if (!emailRegular.test(this._pmEmail)) {
      hud.showHUDWithText('项目经理邮箱请输入正确的格式');
    } else if (!emailRegular.test(this._superVisorEmail)) {
      hud.showHUDWithText('superVisor邮箱请输入正确的格式');
    } else {
      // 上传所有数据
      this._requestAllData();
    }
  }

  // 设置当前请求数量
  _setCurrentRequestCount = (count) => {
    this._currentRequestCount = count;

    if (count <= 0) {
      this._requestStaffData();
    }
  }

  // 上传所有数据
  _requestAllData = () => {
    hud.show();
    // 将当前上传数量归零
    this._currentRequestCount = 0;
    // 上传公司ID卡图片数据
    this._requestCompanyPicData();
    // 上传身份证/护照图片数据
    this._requestIdNumberPicData();
  }

  // 上传公司ID卡图片数据
  _requestCompanyPicData = () => {
    this._setCurrentRequestCount(this._currentRequestCount + 1);

    let imagePath = this.state.companyImgSource.uri;
    let file = { uri: imagePath, type: 'image/jpeg', name: 'jpg' };
    let url = baseUrl + '/onsite/api/system/uploadFile';

    let params = new FormData();
    params.append('module', 'attachment');
    params.append('file', file);
    RequestUtil.uploadImage(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        // 设置数据
        this._companyPicture = responseJson.obj;
        // 完成一个请求
        this._setCurrentRequestCount(this._currentRequestCount - 1);
      } else {
        hud.hideHUDWithText(responseJson.msg);
      }
    }, (error) => {
      hud.hideHUDForRequestFailure();
    });
  }

  // 上传身份证/护照图片数据
  _requestIdNumberPicData = () => {
    this._setCurrentRequestCount(this._currentRequestCount + 1);

    let imagePath = this.state.identityCardImgSource.uri
    let file = { uri: imagePath, type: 'image/jpeg', name: 'jpg' };
    let url = baseUrl + '/onsite/api/system/uploadFile';

    let params = new FormData();
    params.append('module', 'attachment');
    params.append('file', file);
    RequestUtil.uploadImage(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        // 设置数据
        this._idNumberPicture = responseJson.obj;
        // 完成一个请求
        this._setCurrentRequestCount(this._currentRequestCount - 1);
      } else {
        hud.hideHUDWithText(responseJson.msg);
      }
    }, (error) => {
      hud.hideHUDForRequestFailure();
    });
  }

  // 上传员工信息数据
  _requestStaffData = () => {
    // 处理时间格式
    let entryTimeString = this.state.entryTime.split('-').join('/');
    let leaveTimeString = this.state.leaveTime.split('-').join('/');

    let url = baseUrl + '/onsite/api/checkIn/SimensStaff/addStaff';
    var params = new Map();
    params.set('name', this._name);
    params.set('idNumber', this._idNumber);
    params.set('phone', this._phone);
    params.set('email', this._email);
    params.set('projecId', this._projecId);
    params.set('projectName', this._projectName);
    params.set('departmentName', this._departmentName);
    params.set('pmEmail', this._pmEmail);
    params.set('superVisorEmail', this._superVisorEmail);
    params.set('entryTime', entryTimeString);
    params.set('leaveTime', leaveTimeString);
    params.set('companyPicture', this._companyPicture);
    params.set('idNumberPicture', this._idNumberPicture);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        hud.hideHUDWithText('添加员工成功');
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
          {/* 员工姓名 */}
          <Text style={[styles.title, { marginTop: myScreenSize.width * 28 / 750 }]}>员工姓名(中/英)：</Text>
          <TextInput
            ref={c => this._nameTextInput = c}
            style={styles.text_input}
            placeholder='请输入员工姓名'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._name = text}
            returnKeyType='next'
            onSubmitEditing={(event) => this._idNumberTextInput.focus()}
          />
          <View style={styles.line} />
          {/* 身份证号/护照号 */}
          <Text style={styles.title}>身份证号/护照号：</Text>
          <TextInput
            ref={c => this._idNumberTextInput = c}
            style={styles.text_input}
            placeholder='请输入身份证号/护照号'
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
            onSubmitEditing={(event) => this._emailTextInput.focus()}
          />
          <View style={styles.line} />
          {/* 邮箱 */}
          <Text style={styles.title}>邮箱：</Text>
          <TextInput
            ref={c => this._emailTextInput = c}
            style={styles.text_input}
            placeholder='请输入邮箱'
            underlineColorAndroid="transparent"
            keyboardType='email-address'
            onChangeText={(text) => this._email = text}
            returnKeyType='next'
            onSubmitEditing={(event) => this._pmEmailTextInput.focus()}
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
            <View style={styles.line} />
          </View>
          {/* 项目经理邮箱 */}
          <Text style={styles.title}>项目经理邮箱：</Text>
          <TextInput
            ref={c => this._pmEmailTextInput = c}
            style={styles.text_input}
            placeholder='请输入项目经理邮箱'
            underlineColorAndroid="transparent"
            keyboardType='email-address'
            onChangeText={(text) => this._pmEmail = text}
            returnKeyType='next'
            onSubmitEditing={(event) => this._superVisorEmailTextInput.focus()}
          />
          <View style={styles.line} />
          {/* superVisor邮箱 */}
          <Text style={styles.title}>superVisor邮箱：</Text>
          <TextInput
            ref={c => this._superVisorEmailTextInput = c}
            style={styles.text_input}
            placeholder='请输入superVisor邮箱'
            underlineColorAndroid="transparent"
            keyboardType='email-address'
            onChangeText={(text) => this._superVisorEmail = text}
            returnKeyType='done'
          />
          <View style={styles.line} />
          {/* 入职时间 */}
          <Text style={styles.title}>入职时间：</Text>
          <DatePicker
            style={styles.datePicker}
            customStyles={{
              dateTouchBody: styles.datePicker_dateTouchBody,
              dateIcon: styles.datePicker_dateIcon,
              dateInput: styles.datePicker_dateInput,
            }}

            date={this.state.entryTime}
            mode="date"
            placeholder="请选择入职时间"
            format="YYYY-MM-DD"
            minDate="2000-01-01"
            maxDate="2100-12-31"
            confirmBtnText="确定"
            cancelBtnText="取消"
            // showIcon={false}
            // iconSource={require('./google_calendar.png')}
            onDateChange={(date) => { this.setState({ entryTime: date }); }}
          />
          <View style={styles.line} />
          {/* 离职时间 */}
          <Text style={styles.title}>离职时间：</Text>
          <DatePicker
            style={styles.datePicker}
            customStyles={{
              dateTouchBody: styles.datePicker_dateTouchBody,
              dateIcon: styles.datePicker_dateIcon,
              dateInput: styles.datePicker_dateInput,
              dateText: styles.datePicker_dateText,
            }}

            date={this.state.leaveTime}
            mode="date"
            placeholder="请选择离职时间"
            format="YYYY-MM-DD"
            minDate="2000-01-01"
            maxDate="2100-12-31"
            confirmBtnText="确定"
            cancelBtnText="取消"
            // showIcon={false}
            // iconSource={require('./google_calendar.png')}
            onDateChange={(date) => { this.setState({ leaveTime: date }); }}
          />
          <View style={styles.line} />
          {/* 公司ID卡照片 */}
          <Text style={[styles.title, { marginTop: myScreenSize.width * 40 / 750 }]}>公司ID卡照片：</Text>
          <TouchableWithoutFeedback
            onPress={this._selectCompanyImgBtnClick}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={this.state.companyImgSource}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={this._selectCompanyImgBtnClick}>
            <View style={styles.select_btn}>
              <Text style={styles.select_btn_text}>
                选择
            </Text>
            </View>
          </TouchableWithoutFeedback>
          {/* 身份证/护照复印件 */}
          <Text style={[styles.title, { marginTop: myScreenSize.width * 20 / 750 }]}>身份证/护照复印件：</Text>
          <TouchableWithoutFeedback
            onPress={this._selectIdentityCardImgBtnClick}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={this.state.identityCardImgSource}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={this._selectIdentityCardImgBtnClick}>
            <View style={styles.select_btn}>
              <Text style={styles.select_btn_text}>
                选择
              </Text>
            </View>
          </TouchableWithoutFeedback>
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