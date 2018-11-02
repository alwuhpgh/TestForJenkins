import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
} from 'react-native';

import { myScreenSize, getStatusBarHeight } from '../../utils/util';

export default class BaseNavHeaderRightSearchButton extends Component {
  // 按钮点击事件
  _btnClick = () => {
    // 发送
    DeviceEventEmitter.emit(this.props.clickToEmit);
  }
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this._btnClick}
      >
        <View style={[styles.btn, this.props.style]}>
          <Image style={styles.btn_image} resizeMode="contain" source={require('./../../img/Common/search.png')} />
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
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: myScreenSize.width * 16 / 750,
    bottom: 0,
    width: myScreenSize.width * 88 / 750,
    height: myScreenSize.width * 88 / 750,
  },
  btn_image: {
    width: myScreenSize.width * 37.6 / 750,
    height: myScreenSize.width * 40 / 750,
  },
});
