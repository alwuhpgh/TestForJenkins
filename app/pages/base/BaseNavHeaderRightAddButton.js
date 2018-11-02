import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import { myScreenSize, getStatusBarHeight } from '../../utils/util';

export default class BaseNavHeaderRightAddButton extends Component {
  // 添加按钮点击事件
  _addBtnClick = () => {
    // 跳转至添加页面
    this.props.navigation.push(this.props.clickToPage);
  }
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this._addBtnClick}
      >
        <View style={styles.add_btn}>
          <Image style={styles.add_btn_image} resizeMode="contain" source={require('./../../img/Common/add_btn.png')} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    paddingTop: getStatusBarHeight(),
    height: getStatusBarHeight() + myScreenSize.width * 88 / 750,
  },
  title: {
    justifyContent: 'center',
    marginBottom: myScreenSize.width * 24 / 750,
    fontSize: myScreenSize.width * 36 / 750,
    color: '#282828',
  },
  title_line: {
    justifyContent: 'flex-end',
    width: myScreenSize.width,
    height: myScreenSize.width * 2 / 750,
    backgroundColor: '#31923f'
  },
  add_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: myScreenSize.width * 16 / 750,
    bottom: 0,
    width: myScreenSize.width * 88 / 750,
    height: myScreenSize.width * 88 / 750,
  },
  add_btn_image: {
    width: myScreenSize.width * 41 / 750,
    height: myScreenSize.width * 40 / 750,
  },
});
