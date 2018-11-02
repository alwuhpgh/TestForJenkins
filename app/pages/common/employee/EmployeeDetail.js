import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-datepicker';

import { renderEquipmentListItem } from './EmployeeDetailEquipmentListItem';
import SRImage from './../../../utils/SRImage';

import './../../../utils/Variable';
import BaseComponent from './../../base/BaseComponent';
import { myScreenSize } from './../../../utils/util';
import SRDateUtil from './../../../utils/SRDateUtil';
import './../../../utils/UrlUtil';
import RequestUtil from './../../../utils/RequestUtil';
import ProgressHUD from './../../../utils/ProgressHUD';

// 每个item的高
let equipmentItemHeight = myScreenSize.width * 68 / 750;

let hud = new ProgressHUD;

export default class EmployeeDetail extends BaseComponent {
  // 根据用户类型设置页面数据显示
  _userType = global.variables.userType;

  constructor(props) {
    super(props);
    // state
    this.state = {
      data: {},
      renewalDate: '',
    };
    // 取出上个页面传来的值
    this._params = this.props.navigation.state.params;
    // 处理url
    if (this._params.type == 'CheckIn') {
      this._url = '/onsite/api/checkIn/SimensStaff/queryStaff';
    } else if (this._params.type == 'CheckOut') {
      this._url = '/onsite/api/checkOut/SimensStaff/queryCheckOutStaff';
    } else if (this._params.type == 'BackUp') {
      this._url = '/onsite/api/backup/SimensStaff/queryBackupStaff';
    }
    this._url = baseUrl + this._url;
    // 请求列表
    this._loadData();
  }
  // 确认续期按钮点击事件
  _renewalBtnClick = () => {
    if (this.state.renewalDate.length == 0) {
      hud.showHUDWithText('请选择续期时间');
    } else {
      // CheckOut员工
      this._requestRenewalDate();
    }
  }
  // checkout按钮点击事件
  _checkoutBtnClick = () => {
    if (this._userType == '2') {
      Alert.alert('提示', '确认是否CheckOut', [
        { text: '确定', onPress: () => { this._requestCheckOut(); } },
        { text: '取消', onPress: () => { } },
      ]);
    } else {
      var params = new Object();
      params.id = this.state.data.id;
      this.props.navigation.push('EmployeeCheckOut', params);
    }
  }

  // 生成每个item的key
  _extraUniqueKey(item, index) {
    return "index" + index + item;
  }
  // 列表的item
  _renderEquipmentListItem = (listRenderItem) => (
    <TouchableWithoutFeedback
      key={listRenderItem.index}
    >
      {renderEquipmentListItem(listRenderItem.item, equipmentItemHeight, listRenderItem.index)}
    </TouchableWithoutFeedback>
  )

  // 请求数据
  _loadData = () => {
    hud.show();

    var params = new Map();
    params.set('id', this._params.data.id);
    RequestUtil.post(this._url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        // 处理数据
        let obj = responseJson.obj;
        if (obj) {
          this.setState({
            data: obj,
          });
        }

        hud.hide();
      } else {
        hud.hideHUDWithText(responseJson.msg);
      }
    }, (error) => {
      hud.hideHUDForRequestFailure();
    });
  }

  // 续期员工
  _requestRenewalDate = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/checkIn/SimensStaff/staffRenewal';
    var params = new Map();
    params.set('id', this._params.data.id);
    params.set('time', this.state.renewalDate);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        hud.hideHUDWithText('处理成功');
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

  // CheckOut员工
  _requestCheckOut = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/checkIn/SimensStaff/checkOutStaff';
    var params = new Map();
    params.set('id', this._params.data.id);
    params.set('evaluateStr', '.');
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        hud.hideHUDWithText('处理成功');
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
        >
          {/* 员工头像 */}
          {/* <Image style={styles.avatar} resizeMode="contain" /> */}
          {/* 员工姓名 */}
          {/* <Text style={styles.name}>{this.state.data.name}</Text> */}
          <View style={[styles.item_view, { marginTop: myScreenSize.width * 30 / 750 }]}>
            <Text style={styles.title}>员工姓名：</Text>
            <Text style={styles.content}>{this.state.data.name}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 员工编号 */}
          {/* <View style={[styles.item_view, { marginTop: myScreenSize.width * 30 / 750 }]}> */}
          <View style={styles.item_view}>
            <Text style={styles.title}>员工编号：</Text>
            <Text style={styles.content}>{this.state.data.code}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 手机号码 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>手机号码：</Text>
            <Text style={styles.content}>{this.state.data.phone}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 邮箱 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>邮箱：</Text>
            <Text style={styles.content}>{this.state.data.email}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 供应商公司名称 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>供应商公司名称（中/英）：</Text>
            <Text style={styles.content}>{this.state.data.supplierName}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 身份证号/护照号 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>身份证号/护照号：</Text>
            <Text style={styles.content}>{this.state.data.idNumber}</Text>
            <View style={styles.item_line} />
          </View>
          {/* CheckIn日期 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>CheckIn日期：</Text>
            <Text style={styles.content}>{SRDateUtil.stringFromDate(this.state.data.entryTime)}</Text>
            <View style={styles.item_line} />
          </View>
          {/* CheckOut日期 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>CheckOut日期：</Text>
            <Text style={styles.content}>{SRDateUtil.stringFromDate(this.state.data.leaveTime)}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 所在项目组 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>所在项目组：</Text>
            <Text style={styles.content}>{this.state.data.projectName}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 所属部门 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>所属部门：</Text>
            <Text style={styles.content}>{this.state.data.departmentName}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 项目经理邮箱 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>项目经理邮箱：</Text>
            <Text style={styles.content}>{this.state.data.pmEmail}</Text>
            <View style={styles.item_line} />
          </View>
          {/* SuperVisor邮箱 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>SuperVisor邮箱：</Text>
            <Text style={styles.content}>{this.state.data.superVisorEmail}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 直属领导审核意见 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>直属领导审核意见：</Text>
            <Text style={styles.content}>{this.state.data.bossIdea}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 上级领导审核意见 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>上级领导审核意见：</Text>
            <Text style={styles.content}>{this.state.data.superiorBossIdea}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 设备清单 */}
          <View style={styles.equipment_view}>
            <View style={styles.equipment_title_view}>
              <Text style={styles.title}>设备清单：</Text>
            </View>
            {
              this.state.data.seqList == null || this.state.data.seqList.length == 0 ? (
                <Text style={[styles.content, { alignSelf: 'center' }]}>{this.state.data.seqList == null || this.state.data.seqList.length == 0 ? '无' : ''}</Text>
              ) : (
                  <FlatList
                    style={styles.equipment_list}
                    showsVerticalScrollIndicator={false}
                    getItemLayout={(data, index) => (
                      { length: equipmentItemHeight, offset: equipmentItemHeight * index, index }
                    )}
                    renderItem={this._renderEquipmentListItem}
                    keyExtractor={this._extraUniqueKey}
                    data={this.state.data.seqList}
                  />
                )
            }
          </View>
          {/* 公司ID卡照片 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>公司ID卡照片：</Text>
          </View>
          <SRImage
            style={styles.image}
            resizeMode="contain"
            sr_defaultSource={require('./../../../img/Employee/company_img_default.png')}
            source={{ uri: this.state.data.companyPicture }}
          />
          {/* 身份证/护照复印件 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>身份证/护照复印件：</Text>
          </View>
          <SRImage
            style={styles.image}
            resizeMode="contain"
            sr_defaultSource={require('./../../../img/Employee/identity_card_img_default.png')}
            source={{ uri: this.state.data.idNumberPicture }}
          />
          {/* 续期时间 */}
          {
            (this._userType == '3' || this._userType == '4') && this._params.type == 'CheckIn' ? (
              <View style={styles.item_view}>
                <Text style={styles.title}>选择续期时间：</Text>
                <DatePicker
                  style={styles.datePicker}
                  customStyles={{
                    dateTouchBody: styles.datePicker_dateTouchBody,
                    dateIcon: styles.datePicker_dateIcon,
                    dateInput: styles.datePicker_dateInput,
                  }}
                  date={this.state.renewalDate}
                  mode="date"
                  placeholder="请选择续期时间"
                  format="YYYY-MM-DD"
                  minDate={SRDateUtil.dateStringAddDay(SRDateUtil.stringFromDate(this.state.data.leaveTime), 1)}
                  maxDate="2100-12-31"
                  confirmBtnText="确定"
                  cancelBtnText="取消"
                  // showIcon={false}
                  // iconSource={require('./google_calendar.png')}
                  onDateChange={(date) => { this.setState({ renewalDate: date }); }}
                />
              </View>
            ) : (
                null
              )
          }

          {/* 按钮 */}
          <View style={styles.btn_container}>
            {/* 确认续期按钮 */}
            {
              (this._userType == '3' || this._userType == '4') && this._params.type == 'CheckIn' ? (
                <TouchableWithoutFeedback
                  onPress={this._renewalBtnClick}
                >
                  <View style={styles.btn}>
                    <Text style={styles.btn_text}>确认续期</Text>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                  null
                )
            }
            {/* CheckOut按钮 */}
            {
              (this._userType == '2' || this._userType == '4') && this._params.type == 'CheckIn' ? (
                <TouchableWithoutFeedback
                  onPress={this._checkoutBtnClick}
                >
                  <View style={styles.btn}>
                    <Text style={styles.btn_text}>Check Out</Text>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                  null
                )
            }
          </View>
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
  avatar: {
    marginTop: myScreenSize.width * 70 / 750,
    width: myScreenSize.width * 160 / 750,
    height: myScreenSize.width * 160 / 750,
    borderRadius: myScreenSize.width * 80 / 750,
  },
  name: {
    justifyContent: 'center',
    marginTop: myScreenSize.width * 80 / 750,
    fontSize: myScreenSize.width * 36 / 750,
    color: '#1e1e1e',
  },
  item_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: myScreenSize.width,
    height: myScreenSize.width * 68 / 750,
  },
  item_line: {
    position: 'absolute',
    bottom: 0,
    marginLeft: myScreenSize.width * 40 / 750,
    width: myScreenSize.width * 670 / 750,
    height: myScreenSize.width * 1 / 750,
    // backgroundColor: '#545454',
  },
  title: {
    justifyContent: 'center',
    marginLeft: myScreenSize.width * 40 / 750,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#1e1e1e',
  },
  content: {
    justifyContent: 'center',
    marginRight: myScreenSize.width * 40 / 750,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#1e1e1e',
    textAlign: 'right',
  },
  equipment_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: myScreenSize.width,
  },
  equipment_title_view: {
    flexDirection: 'row',
    alignItems: 'center',
    height: myScreenSize.width * 68 / 750,
  },
  equipment_list: {
    flexGrow: 0,
  },
  datePicker: {
    marginLeft: myScreenSize.width * 30 / 750,
    // width: myScreenSize.width * 300 / 750,
    height: myScreenSize.width * 68 / 750,
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
  image: {
    marginTop: myScreenSize.width * 16 / 750,
    width: myScreenSize.width * 324 / 750,
    height: myScreenSize.width * 226 / 750,
  },
  btn_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: myScreenSize.width * 50 / 750,
    marginBottom: myScreenSize.width * 105 / 750,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: myScreenSize.width * 60 / 750,
    marginRight: myScreenSize.width * 60 / 750,
    width: myScreenSize.width * 180 / 750,
    height: myScreenSize.width * 80 / 750,
    backgroundColor: '#4c8fe5',
  },
  btn_text: {
    fontSize: myScreenSize.width * 30 / 750,
    color: 'white',
  },
});