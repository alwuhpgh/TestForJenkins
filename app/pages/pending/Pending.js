import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';

import { renderListItem } from './PendingListItem';

import BaseComponent from './../base/BaseComponent';
import { myScreenSize } from './../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

// 每个item的高
let itemHeight = myScreenSize.width * 370 / 750;

let hud = new ProgressHUD;

export default class Pending extends BaseComponent {
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
    params.data = item;
    if (item.status == '0') {
      // 跳转到CheckIn
      this.props.navigation.push('PendingDetailCheckIn', params);
    } else if (item.status == '1') {
      // 跳转到CheckOut
      this.props.navigation.push('PendingDetailCheckOut', params);
    } else if (item.status == '2') {
      // 跳转到BackUp
      this.props.navigation.push('PendingDetailBackUp', params);
    }
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

    let url = baseUrl + '/onsite/api/pending/SimensStaff/pendingStaffPageList';
    var params = new Map();
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

    let url = baseUrl + '/onsite/api/pending/SimensStaff/pendingStaffPageList';
    var params = new Map();
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
  list: {
    marginTop: myScreenSize.width * 30 / 750,
    width: myScreenSize.width,
  },
});