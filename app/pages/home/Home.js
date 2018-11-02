import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
} from 'react-native';

import { renderListItem } from './HomeListItem'

import './../../utils/Variable';
import BaseComponent from './../base/BaseComponent';
import { myScreenSize } from './../../utils/util';
import Constants from './../../utils/Constants';

// 每个item的宽高
let itemSize = { width: myScreenSize.width * 338 / 750, height: myScreenSize.width * 408 / 750 };

export default class Home extends BaseComponent {
  constructor(props) {
    super(props);
    // 根据用户类型设置页面数据显示
    let userType = global.variables.userType;
    if (userType == '3' || userType == '4') {
      // application manager
      this._listData = [{
        name: 'CheckIn',
        icon: require('./../../img/Home/checkin_icon.png'),
        page: 'CheckIn',
      }, {
        name: 'CheckOut',
        icon: require('./../../img/Home/checkout_icon.png'),
        page: 'CheckOut',
      }, {
        name: 'Back Up管理',
        icon: require('./../../img/Home/backup_icon.png'),
        page: 'BackUp',
      }, {
        name: '待处理',
        icon: require('./../../img/Home/backlog_icon.png'),
        page: 'Pending',
      }];
    } else if (userType == '2') {
      // supviser
      this._listData = [{
        name: 'CheckIn',
        icon: require('./../../img/Home/checkin_icon.png'),
        page: 'CheckIn',
      }, {
        name: 'CheckOut',
        icon: require('./../../img/Home/checkout_icon.png'),
        page: 'CheckOut',
      }, {
        name: 'Back Up管理',
        icon: require('./../../img/Home/backup_icon.png'),
        page: 'BackUp',
      }, {
        name: '待处理',
        icon: require('./../../img/Home/backlog_icon.png'),
        page: 'Pending',
      }];
    }
  }

  componentDidMount() {
    this._deEmitter = DeviceEventEmitter.addListener(Constants.HomeSettingBtnClickNotiName, (a) => {
      this._settingBtnClick();
    });
  }
  componentWillUnmount() {
    this._deEmitter.remove();
  }

  // 设置按钮点击事件
  _settingBtnClick = () => {
    // 跳转页面
    this.props.navigation.push('AppInfo');
  }

  // 生成每个item的key
  _extraUniqueKey(item, index) {
    return "index" + index + item;
  }
  // 列表的item
  _renderListItem = (listRenderItem) => (
    <TouchableWithoutFeedback
      key={listRenderItem.index}
      onPress={() => this._itemDidSelect(listRenderItem.item, listRenderItem.index)}
    >
      {renderListItem(listRenderItem.item, itemSize, listRenderItem.index)}
    </TouchableWithoutFeedback>
  )

  // item点击事件
  _itemDidSelect = (item, index) => {
    // 跳转页面
    this.props.navigation.push(item.page);
  }

  render() {
    return (
      <View style={styles.container}>
        {/* 状态栏 */}
        <StatusBar barStyle={'dark-content'} />
        {/* 列表 */}
        <FlatList
          style={styles.list}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          getItemLayout={(data, index) => (
            { length: itemSize.height, offset: itemSize.height * index, index }
          )}
          renderItem={this._renderListItem}
          keyExtractor={this._extraUniqueKey}
          data={this._listData}
        >
        </FlatList>
        {/* 登录信息 */}
        <Text style={styles.login_user_text}>当前登录：{global.variables.loginName} | {global.variables.loginTime}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  list: {
    marginTop: myScreenSize.width * 40 / 750,
  },
  login_user_text: {
    position: 'absolute',
    bottom: myScreenSize.width * 154 / 750,
    fontSize: myScreenSize.width * 32 / 750,
    color: '#bbbbbb',
  },
});