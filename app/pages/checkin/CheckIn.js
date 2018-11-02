import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
} from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';

import { renderListItem } from './CheckInListItem';

import BaseComponent from './../base/BaseComponent';
import { myScreenSize } from './../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';
import Constants from './../../utils/Constants';

// 每个item的高
let itemHeight = myScreenSize.width * 312 / 750;

let hud = new ProgressHUD;

export default class CheckIn extends BaseComponent {
  _name = '';
  _projectName = '';
  _code = '';

  _currentPage = 1;
  _pageSize = 15;

  constructor(props) {
    super(props);
    // state
    this.state = {
      listData: [],
      refreshState: RefreshState.Idle,
    };
  }

  componentDidMount() {
    // 加入通知监听
    this._deEmitter = DeviceEventEmitter.addListener(Constants.CheckInSearchBtnClickNotiName, (a) => {
      let params = new Object();
      params.selectBack = (name, projectName, code) => {
        // 设置数据
        this._name = name;
        this._projectName = projectName;
        this._code = code;
      }
      this.props.navigation.push('CheckInSearch', params);
    });
    // 加入StackNavigation监听
    this._willBlurSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        // 请求列表
        this._loadData();
      }
    );
  }
  componentWillUnmount() {
    // 清理通知监听
    if (this._deEmitter) {
      this._deEmitter.remove();
    }
    // 清理StackNavigation监听
    if (this._willBlurSubscription) {
      this._willBlurSubscription.remove();
    }
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
      {renderListItem(listRenderItem.item, itemHeight, listRenderItem.index)}
    </TouchableWithoutFeedback>
  )
  // item点击事件
  _itemDidSelect = (item, index) => {
    var params = new Object();
    params.type = 'CheckIn';
    params.data = item;
    this.props.navigation.push('EmployeeDetail', params);
  }
  // 下拉刷新
  _onHeaderRefresh = () => {
    // 设置刷新状态
    this.setState({
      refreshState: RefreshState.HeaderRefreshing,
    });
    // 清理搜索
    this._name = '';
    this._projectName = '';
    this._code = '';
    // 请求
    this._loadData();
  }
  // 上拉加载
  _onFooterRefresh = () => {
    this.setState({
      refreshState: RefreshState.FooterRefreshing,
    });
    // 请求
    this._loadMoreData();
  }

  // 请求列表
  _loadData = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/checkIn/SimensStaff/queryStaffPageList';
    var params = new Map();
    params.set('name', this._name);
    params.set('projectName', this._projectName);
    params.set('code', this._code);
    params.set('current', 1);
    params.set('size', this._pageSize);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        // 处理数据
        let obj = responseJson.obj;
        // 更新页面数据
        let records = obj.records;
        if (records && records.length > 0) {
          this.setState({
            listData: records,
            refreshState: RefreshState.Idle,
          });
        } else {
          this.setState({
            listData: [],
            refreshState: RefreshState.EmptyData,
          });
        }
        // 重置当前页数
        this._currentPage = 1;
        // 判断是否还有内容，如果没有则让上拉加载失效
        let totalPages = obj.pages;
        if (this._currentPage == totalPages) {
          this.setState({
            refreshState: RefreshState.NoMoreData,
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

  // 请求列表更多数据
  _loadMoreData = () => {
    // hud.show();

    let url = baseUrl + '/onsite/api/checkIn/SimensStaff/queryStaffPageList';
    var params = new Map();
    params.set('name', this._name);
    params.set('projectName', this._projectName);
    params.set('code', this._code);
    params.set('current', this._currentPage + 1);
    params.set('size', this._pageSize);
    RequestUtil.post(url, params, async (responseJson) => {
      var code = responseJson.code;
      if (code == '00') {
        // 处理数据
        let obj = responseJson.obj;
        let records = obj.records;
        if (records && records.length > 0) {
          this.setState({
            listData: this.state.listData.concat(records),
            refreshState: RefreshState.Idle,
          });
        } else {
          this.setState({
            refreshState: RefreshState.NoMoreData,
          });
        }
        // 设置当前页数
        this._currentPage = obj.current;
        // 判断是否还有内容，如果没有则让上拉加载失效
        let totalPages = obj.pages;
        if (this._currentPage == totalPages) {
          this.setState({
            refreshState: RefreshState.NoMoreData,
          });
        }

        // hud.hide();
      } else {
        // hud.hideHUDWithText(responseJson.msg);
        this.setState({
          refreshState: RefreshState.Failure,
        });
      }
    }, (error) => {
      // hud.hideHUDForRequestFailure();
      this.setState({
        refreshState: RefreshState.Failure,
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {/* 列表 */}
        <RefreshListView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => (
            { length: itemHeight, offset: itemHeight * index, index }
          )}
          renderItem={this._renderListItem}
          keyExtractor={this._extraUniqueKey}
          data={this.state.listData}
          refreshState={this.state.refreshState}
          onHeaderRefresh={this._onHeaderRefresh}
          onFooterRefresh={this._onFooterRefresh}
        />
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
  item_view: {
    flexDirection: 'row',
    alignItems: 'center',
    width: myScreenSize.width,
    height: myScreenSize.width * 80 / 750,
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
  list: {
    marginTop: myScreenSize.width * 30 / 750,
    width: myScreenSize.width,
  },
});