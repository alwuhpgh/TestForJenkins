import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import { myScreenSize, getStatusBarHeight } from '../../utils/util';

export default class BaseNavHeader extends Component {
  // 返回按钮点击事件
  _backBtnClick = () => {
    // 返回
    this.props.navigation.pop();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.headerTitle}
        </Text>
        {
          this.props.navigation.state.index > 0 ? (
            <TouchableWithoutFeedback
              onPress={this._backBtnClick}
            >
              <View style={styles.back_btn}>
                <Image style={styles.back_btn_image} resizeMode="contain" source={require('./../../img/Main/nav_back_btn.png')} />
              </View>
            </TouchableWithoutFeedback>
          ) : (
              null
            )
        }
        {
          this.props.headerRight ? (
            this.props.headerRight
          ) : (
              null
            )
        }
      </View>
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
    shadowColor: '#aaaaaa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    justifyContent: 'center',
    marginBottom: myScreenSize.width * 24 / 750,
    fontSize: myScreenSize.width * 36 / 750,
    color: '#282828',
  },
  back_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: myScreenSize.width * 120 / 750,
    height: myScreenSize.width * 88 / 750,
  },
  back_btn_image: {
    width: myScreenSize.width * 19 / 750,
    height: myScreenSize.width * 29 / 750,
  },
});
