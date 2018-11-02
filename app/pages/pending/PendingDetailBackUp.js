import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';

import { renderEquipmentListItem } from './../common/employee/EmployeeDetailEquipmentListItem';
import SRImage from './../../utils/SRImage';

import './../../utils/Variable';
import BaseComponent from './../base/BaseComponent';
import { myScreenSize } from './../../utils/util';
import SRDateUtil from './../../utils/SRDateUtil';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

// 每个item的高
let equipmentItemHeight = myScreenSize.width * 68 / 750;
// 评价最多字数
let maxEvaluateNum = 200;

let hud = new ProgressHUD;

export default class PendingDetailBackUp extends BaseComponent {
  // 根据用户类型设置页面数据显示
  _userType = global.variables.userType;
  // 审批意见
  _evaluate = '';

  constructor(props) {
    super(props);
    // state
    this.state = {
      data: {},
      textNum: '0/' + maxEvaluateNum,
    };
    // 取出上个页面传来的值
    this._params = this.props.navigation.state.params;
    // 请求列表
    this._loadData();
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

  // 通过按钮点击事件
  _passBtnClick = () => {
    // 请求通过接口
    this._requestPassData();
  }
  // 不通过按钮点击事件
  _failBtnClick = () => {
    // 请求不通过接口
    this._requestFailData();
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

    let url = baseUrl + '/onsite/api/backup/SimensStaff/queryBackupStaff';
    var params = new Map();
    params.set('id', this._params.data.id);
    RequestUtil.post(url, params, async (responseJson) => {
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

  // 请求通过接口
  _requestPassData = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/pending/SimensStaff/uptStaffPass';
    var params = new Map();
    params.set('id', this._params.data.id);
    params.set('projecId', this.state.data.projecId);
    params.set('projectName', this.state.data.projectName);
    params.set('departmentName', this.state.data.departmentName);
    if (this._evaluate.length > 0) {
      if (this._userType == '3') {
        params.set('bossIdea', this._evaluate);
      } else if (this._userType == '4') {
        params.set('superiorBossIdea', this._evaluate);
      }
    }
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

  // 请求不通过接口
  _requestFailData = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/pending/SimensStaff/staffNotPass';
    var params = new Map();
    params.set('id', this._params.data.id);
    params.set('notPassStr', this._evaluate);
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
          {/* 暂离员工信息 */}
          {/* 暂离员工信息标题 */}
          <View style={styles.section_title_view}>
            <Text style={styles.section_title}>暂离员工信息</Text>
          </View>
          {/* 暂离员工编号 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>暂离员工编号：</Text>
            <Text style={styles.content}>{this.state.data.staffBackUp ? this.state.data.staffBackUp.staffCode : ''}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 暂离员工姓名 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>暂离员工姓名：</Text>
            <Text style={styles.content}>{this.state.data.staffBackUp ? this.state.data.staffBackUp.staffName : ''}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 分割线 */}
          <View style={styles.section_line} />
          {/* BackUp员工信息 */}
          {/* BackUp员工信息标题 */}
          <View style={styles.section_title_view}>
            <Text style={styles.section_title}>BackUp员工信息</Text>
          </View>
          {/* 员工姓名 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>员工姓名：</Text>
            <Text style={styles.content}>{this.state.data.name}</Text>
            <View style={styles.item_line} />
          </View>
          {/* 员工编号 */}
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
            sr_defaultSource={require('./../../img/Employee/company_img_default.png')}
            source={{ uri: this.state.data.companyPicture }}
          />
          {/* 身份证/护照复印件 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>身份证/护照复印件：</Text>
          </View>
          <SRImage
            style={styles.image}
            resizeMode="contain"
            sr_defaultSource={require('./../../img/Employee/identity_card_img_default.png')}
            source={{ uri: this.state.data.idNumberPicture }}
          />
          {/* 按钮 */}
          {
            this._userType == '3' || this._userType == '4' ? (
              <View style={styles.examine_view}>
                {/* 审批意见 */}
                <View style={styles.item_view}>
                  <Text style={styles.title}>审批意见：</Text>
                </View>
                <TextInput
                  ref={c => this._textInput = c}
                  style={styles.text_input}
                  placeholder='请输入您对本员工的审批意见'
                  underlineColorAndroid="transparent"
                  multiline={true}
                  onChangeText={this._textInputOnChangeText}
                />
                <Text style={styles.text_num}>{this.state.textNum}</Text>
                <View style={styles.btn_container}>
                  {/* 通过按钮 */}
                  <TouchableWithoutFeedback
                    onPress={this._passBtnClick}
                  >
                    <View style={[styles.btn, { marginRight: myScreenSize.width * 120 / 750 }]}>
                      <Text style={styles.btn_text}>通过</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  {/* 不通过按钮 */}
                  <TouchableWithoutFeedback
                    onPress={this._failBtnClick}
                  >
                    <View style={styles.btn}>
                      <Text style={styles.btn_text}>不通过</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            ) : (
                null
              )
          }
          <View style={styles.bottom_blank_view} />
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
    paddingBottom: myScreenSize.width * 80 / 750,
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
  section_title_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: myScreenSize.width,
    height: myScreenSize.width * 80 / 750,
  },
  section_title: {
    fontSize: myScreenSize.width * 30 / 750,
    // fontWeight: 'bold',
    color: '#1e1e1e',
  },
  section_line: {
    width: myScreenSize.width * 670 / 750,
    height: myScreenSize.width * 1 / 750,
    backgroundColor: '#545454',
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
    width: myScreenSize.width * 300 / 750,
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
  examine_view: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
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
    marginTop: myScreenSize.width * 50 / 750,
    width: myScreenSize.width * 180 / 750,
    height: myScreenSize.width * 80 / 750,
    backgroundColor: '#4c8fe5',
  },
  btn_text: {
    fontSize: myScreenSize.width * 30 / 750,
    color: 'white',
  },
  bottom_blank_view: {
    height: myScreenSize.width * 105 / 750,
  },
});