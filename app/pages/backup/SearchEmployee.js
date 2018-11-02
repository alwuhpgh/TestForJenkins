import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';

import { renderListItem } from './SearchEmployeeListItem';

import BaseComponent from './../base/BaseComponent';
import { myScreenSize } from './../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

// 每个item的高
let itemHeight = myScreenSize.width * 78 / 750;
let itemLineHeight = myScreenSize.width * 1 / 750;

let hud = new ProgressHUD;

export default class SearchEmployee extends BaseComponent {
  _projectName = '';
  
  constructor(props) {
    super(props);

    // state
    this.state = {
      listData: [],
      refreshState: RefreshState.Idle,
    }
  }
  // 探索按钮点击事件
  _search = () => {
    // 请求员工列表数据
    this._loadData();
  }

  // 生成每个item的key
  _extraUniqueKey(item, index) {
    return "index" + index + item;
  }
  // 分割线
  _itemSeparatorComponent = () => (
    <View style={styles.list_separator_line}></View>
  );
  // 列表的item
  _renderListItem = (listRenderItem) => (
    <TouchableWithoutFeedback
      key={listRenderItem.index}
      onPress={() => this._itemDidSelect(listRenderItem.item, listRenderItem.index)}
    >
      {renderListItem(listRenderItem.item, itemHeight, listRenderItem.index)}
    </TouchableWithoutFeedback>
  )
  // item点击事件
  _itemDidSelect = (item, index) => {
    // 设置上个页面内容
    this.props.navigation.state.params.selectBack(item);
    // 返回
    this.props.navigation.pop();
  }
  // 下拉刷新
  _onHeaderRefresh = () => {
    // 设置刷新状态
    this.setState({
      refreshState: RefreshState.HeaderRefreshing,
    });
    // 请求
    this._loadData();
  }

  // 请求员工列表数据
  _loadData = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/backup/SimensStaff/queryStaff';
    var params = new Map();
    params.set('code', this._projectName);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        // 处理数据
        let obj = responseJson.obj;
        // 更新页面数据
        if (obj && obj.length > 0) {
          this.setState({
            listData: obj,
            refreshState: RefreshState.Idle,
          });
        } else {
          this.setState({
            refreshState: RefreshState.EmptyData,
          });
        }

        hud.hide();
      } else {
        hud.hideHUDWithText(responseJson.msg);
        this.setState({
          refreshState: RefreshState.Failure,
        });
      }
    }, (error) => {
      hud.hideHUDForRequestFailure();
      this.setState({
        refreshState: RefreshState.Failure,
      });
    });
  }
  render() {
    return (
      <View style={styles.container}>
        {/* 搜索框 */}
        <View style={styles.search_view}>
          <Image style={styles.search_icon} resizeMode="contain" source={require('./../../img/Common/search.png')} />
          <TextInput
            style={styles.search_text_input}
            placeholder='请输入员工编号'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._projectName = text}
            returnKeyType='search'
            onSubmitEditing={this._search}
          />
        </View>
        {/* 列表 */}
        <RefreshListView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => (
            { length: itemHeight, offset: (itemHeight + itemLineHeight) * index, index }
          )}
          ItemSeparatorComponent={this._itemSeparatorComponent}
          renderItem={this._renderListItem}
          keyExtractor={this._extraUniqueKey}
          data={this.state.listData}
          refreshState={this.state.refreshState}
          onHeaderRefresh={this._onHeaderRefresh}
        />
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
  search_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: myScreenSize.width * 30 / 750,
    width: myScreenSize.width * 690 / 750,
    height: myScreenSize.width * 70 / 750,
    borderColor: '#969696',
    borderWidth: 0.5,
  },
  search_icon: {
    marginLeft: myScreenSize.width * 30 / 750,
  },
  search_text_input: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: myScreenSize.width * 20 / 750,
    marginRight: myScreenSize.width * 20 / 750,
    paddingVertical: 0,
    fontSize: myScreenSize.width * 30 / 750,
    color: '#1e1e1e',
  },
  list: {
    marginTop: myScreenSize.width * 30 / 750,
    width: myScreenSize.width,
  },
  list_separator_line: {
    height: itemLineHeight,
    backgroundColor: '#d2d2d2',
  },
});