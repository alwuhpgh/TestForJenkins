import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
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

let hud = new ProgressHUD;

export default class PendingDetailCheckOut extends BaseComponent {
  // 根据用户类型设置页面数据显示
  _userType = global.variables.userType;

  constructor(props) {
    super(props);
    // 取出上个页面传来的值
    this._params = this.props.navigation.state.params;
    // state
    this.state = {
      data: {},
    };
    // 请求列表
    this._loadData();
  }

  // 通过按钮点击事件
  _passBtnClick = () => {
    // 请求确认checkOut接口
    this._requestCheckOutData();
  }

  // 不通过按钮点击事件
  _failBtnClick = () => {
    var params = new Object();
    params.id = this._params.data.id;
    this.props.navigation.push('PendingCheckOutFail', params);
  }

  // 重新申请按钮点击事件
  _reapplyBtnClick = () => {
    // 请求重提CheckOut接口
    this._requestReapplyCheckOutData();
  }

  // 删除按钮点击事件
  _deleteBtnClick = () => {
    // 请求回退为CheckIn接口
    this._requestRevertCheckInData();
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

    let url = baseUrl + '/onsite/api/pending/SimensStaff/queryPendingStaff';
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

  // 请求确认CheckOut接口
  _requestCheckOutData = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/pending/SimensStaff/confirmCheckOutStaff';
    var params = new Map();
    params.set('id', this._params.data.id);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        hud.hideHUDWithText('处理成功');
        // 延迟1s后返回
        this._timeoutId = setTimeout(() => {
          this.props.navigation.pop();
        }, 1000);
      } else {
        hud.hideHUDWithText(responseJson.msg);
      }
    }, (error) => {
      hud.hideHUDForRequestFailure();
    });
  }

  // 请求重提CheckOut接口
  _requestReapplyCheckOutData = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/pending/SimensStaff/revertCheckOut';
    var params = new Map();
    params.set('id', this._params.data.id);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        hud.hideHUDWithText('处理成功');
        // 延迟1s后返回
        this._timeoutId = setTimeout(() => {
          this.props.navigation.pop();
        }, 1000);
      } else {
        hud.hideHUDWithText(responseJson.msg);
      }
    }, (error) => {
      hud.hideHUDForRequestFailure();
    });
  }

  // 请求回退为CheckIn接口
  _requestRevertCheckInData = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/pending/SimensStaff/revertcheckIn';
    var params = new Map();
    params.set('id', this._params.data.id);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        hud.hideHUDWithText('处理成功');
        // 延迟1s后返回
        this._timeoutId = setTimeout(() => {
          this.props.navigation.pop();
        }, 1000);
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
          {/* CheckOut原因 */}
          <View style={styles.item_view}>
            <Text style={styles.title}>CheckOut原因：</Text>
            <Text style={styles.content}>{this.state.data.cause && this.state.data.cause.length > 0 ? this.state.data.cause : '-'}</Text>
            <View style={styles.item_line} />
          </View>
          {/* CheckOut审核意见 */}
          {
            this.state.data.examineStatus == '4' ? (
              <View style={styles.item_view}>
                <Text style={styles.title}>CheckOut审核意见：</Text>
                <Text style={styles.content}>{this.state.data.remarks && this.state.data.remarks.length > 0 ? this.state.data.remarks : '-'}</Text>
                <View style={styles.item_line} />
              </View>
            ) : (
                null
              )
          }
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
          <View style={styles.btn_container}>
            {/* 通过按钮 */}
            {
              this._userType == '3' ? (
                <TouchableWithoutFeedback
                  onPress={this._passBtnClick}
                >
                  <View style={styles.btn}>
                    <Text style={styles.btn_text}>通过</Text>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                  null
                )
            }
            {/* 不通过按钮 */}
            {
              this._userType == '3' ? (
                <TouchableWithoutFeedback
                  onPress={this._failBtnClick}
                >
                  <View style={styles.btn}>
                    <Text style={styles.btn_text}>不通过</Text>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                  null
                )
            }
            {/* 重提CheckOut按钮 */}
            {
              this.state.data.startBy == global.variables.userId && this.state.data.examineStatus == '4' ? (
                <TouchableWithoutFeedback
                  onPress={this._reapplyBtnClick}
                >
                  <View style={styles.btn}>
                    <Text style={styles.btn_text}>重提</Text>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                  null
                )
            }
            {/* 删除按钮 */}
            {
              this.state.data.startBy == global.variables.userId && this.state.data.examineStatus == '4' ? (
                <TouchableWithoutFeedback
                  onPress={this._deleteBtnClick}
                >
                  <View style={styles.btn}>
                    <Text style={styles.btn_text}>删除</Text>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                  null
                )
            }
          </View>
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
  image: {
    marginTop: myScreenSize.width * 16 / 750,
    width: myScreenSize.width * 324 / 750,
    height: myScreenSize.width * 226 / 750,
  },
  btn_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: myScreenSize.width * 50 / 750,
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
  bottom_blank_view: {
    height: myScreenSize.width * 105 / 750,
  },
});