import React, { Component } from 'react';

import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  ActivityIndicator
} from 'react-native';

import * as Progress from 'react-native-progress'
import Toast from 'react-native-root-toast'
import RootSiblings from 'react-native-root-siblings';

let sibling = null;
let toast = null;
let HUDHideDelay = 1000;
let RequestFailureText = '网络异常';

export default class ProgressHUD {
  show() {
    this.hide();
    sibling = new RootSiblings(<ProgressUtil />);
  }
  hide() {
    if (sibling instanceof RootSiblings) {
      sibling.destroy();
      sibling = null;
    } else if (toast != null) {
      Toast.hide(toast);
      toast = null;
    }
  }

  showHUDWithText(text) {
    this.hide();
    toast = Toast.show(text, {
      duration: HUDHideDelay,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
        // calls on toast\`s appear animation start
      },
      onShown: () => {
        // calls on toast\`s appear animation end.
      },
      onHide: () => {
        // calls on toast\`s hide animation start.
      },
      onHidden: () => {
        // calls on toast\`s hide animation end.
      }
    });
  }
  hideHUDWithText(text) {
    this.hide();
    this.showHUDWithText(text);
  }
  hideHUDForRequestFailure() {
    this.hideHUDWithText(RequestFailureText);
  }
}

const { width, height } = Dimensions.get('window')
class ProgressUtil extends Component {
  render() {
    return (
      <View style={styles.baseViewStyle}>
        <View style={styles.backViewStyle}>
          <Progress.Circle size={width / 8} indeterminate={true} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create(
  {
    baseViewStyle: {
      position: 'absolute',
      top: (Platform.OS == 'ios') ? 0 : 0,
      height: (Platform.OS == 'ios') ? height : height,
      width: width,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)'
    },
    backViewStyle: {
      backgroundColor: 'white',
      width: width / 4,
      height: width / 4,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },

    centering: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
    },
  }
);
