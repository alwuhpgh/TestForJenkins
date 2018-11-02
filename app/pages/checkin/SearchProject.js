import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';

import { renderListItem } from './ProjectNameListItem';

import BaseComponent from './../base/BaseComponent';
import { myScreenSize } from './../../utils/util';
import './../../utils/UrlUtil';
import RequestUtil from './../../utils/RequestUtil';
import ProgressHUD from './../../utils/ProgressHUD';

// 每个item的高
let itemHeight = myScreenSize.width * 78 / 750;
let itemLineHeight = myScreenSize.width * 1 / 750;

let hud = new ProgressHUD;

export default class SearchProject extends BaseComponent {
  _projectName = '';
  _departmentName = '';

  constructor(props) {
    super(props);

    // state
    this.state = {
      listData: [],
      refreshState: RefreshState.Idle,
    }
  }

  componentDidMount() {
    // 加入StackNavigation监听
    this._willBlurSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        // 请求项目列表数据
        this._loadProjectListData();
      }
    );
  }

  componentWillUnmount() {
    // 清理StackNavigation监听
    if (this._willBlurSubscription) {
      this._willBlurSubscription.remove();
    }
  }

  // 创建项目按钮点击事件
  _createProjectBtnClick = () => {
    // 跳转到创建项目页面
    this.props.navigation.push('AddProject');
  }

  // 搜索按钮点击事件
  _search = () => {
    // 请求项目列表数据
    this._loadProjectListData();
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
    this.props.navigation.state.params.selectBack(item.id, item.name, item.departmentName);
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
    this._loadProjectListData();
  }

  // 请求项目列表数据
  _loadProjectListData = () => {
    hud.show();

    let url = baseUrl + '/onsite/api/SimensProject/proList';
    var params = new Map();
    params.set('name', this._projectName);
    params.set('departmentName', this._departmentName);
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
        {/* 员工姓名 */}
        <View style={[styles.item_view, { marginTop: myScreenSize.width * 20 / 750 }]}>
          <Text style={styles.title}>所属项目:</Text>
          <TextInput
            style={styles.text_input}
            placeholder='请输入项目姓名'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._projectName = text}
            returnKeyType='search'
            onSubmitEditing={this._search}
          />
        </View >
        {/* 项目名称 */}
        < View style={styles.item_view} >
          <Text style={styles.title}>部门名称:</Text>
          <TextInput
            style={styles.text_input}
            placeholder='请输入部门名称'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._departmentName = text}
            returnKeyType='search'
            onSubmitEditing={this._search}
          />
        </View >
        {/* 分割线 */}
        < View style={styles.line} />
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
        {/* 创建项目 */}
        <View style={styles.bottom_view}>
          <Text style={styles.no_project_text}>没有想找的项目？试试</Text>
          <TouchableWithoutFeedback
            onPress={this._createProjectBtnClick}
          >
            <View>
              <Text style={styles.create_project_text}>创建项目</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
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
    height: myScreenSize.width * 68 / 750,
  },
  title: {
    justifyContent: 'center',
    marginLeft: myScreenSize.width * 60 / 750,
    width: myScreenSize.width * 150 / 750,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#1e1e1e',
  },
  text_input: {
    justifyContent: 'center',
    width: myScreenSize.width * 480 / 750,
    height: myScreenSize.width * 52 / 750,
    paddingLeft: myScreenSize.width * 20 / 750,
    paddingVertical: 0,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#1e1e1e',
    borderColor: '#969696',
    borderWidth: 0.5,
    borderRadius: myScreenSize.width * 26 / 750,
  },
  line: {
    marginTop: myScreenSize.width * 20 / 750,
    width: myScreenSize.width * 682 / 750,
    height: myScreenSize.width * 2 / 750,
    backgroundColor: '#d2d2d2',
  },
  list: {
    marginTop: myScreenSize.width * 20 / 750,
    width: myScreenSize.width,
    flexGrow: 0,
  },
  list_separator_line: {
    height: itemLineHeight,
    backgroundColor: '#d2d2d2',
  },
  bottom_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: myScreenSize.width * 68 / 750,
  },
  no_project_text: {
    fontSize: myScreenSize.width * 24 / 750,
    color: '#1e1e1e',
  },
  create_project_text: {
    padding: myScreenSize.width * 10 / 750,
    fontSize: myScreenSize.width * 24 / 750,
    color: '#e6232b',
  },
});