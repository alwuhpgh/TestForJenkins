import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';

import { renderListItem } from './SearchListItem';

import BaseComponent from './../../base/BaseComponent';
import { myScreenSize } from './../../../utils/util';

// 每个item的高
let itemHeight = myScreenSize.width * 78 / 750;
let itemLineHeight = myScreenSize.width * 1 / 750;

export default class Search extends BaseComponent {
  constructor(props) {
    super(props);
    // 测试用数据
    this._listData = [{
      name: '吴亦凡',
    }, {
      name: '吴亦凡',
    }, {
      name: '吴亦凡',
    }, {
      name: '吴亦凡',
    }, {
      name: '吴亦凡',
    }, {
      name: '吴亦凡',
    }];
  }
  // 探索按钮点击事件
  _search = () => {

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
  }
  render() {
    return (
      <View style={styles.container}>
        {/* 搜索框 */}
        <View style={styles.search_view}>
          <Image style={styles.search_icon} resizeMode="contain" source={require('./../../../img/Common/search.png')} />
          <TextInput
            style={styles.search_text_input}
            underlineColorAndroid="transparent"
            returnKeyType='search'
            onSubmitEditing={this._search}
          />
        </View>
        {/* 列表 */}
        <FlatList
          style={styles.list}
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => (
            { length: itemHeight, offset: (itemHeight + itemLineHeight) * index, index }
          )}
          ItemSeparatorComponent={this._itemSeparatorComponent}
          renderItem={this._renderListItem}
          keyExtractor={this._extraUniqueKey}
          data={this._listData}
        >
        </FlatList>
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