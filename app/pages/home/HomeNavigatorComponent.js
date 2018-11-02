import React, { Component } from 'react';
import {
  DeviceEventEmitter,
} from 'react-native';

import HomeNavigator from './HomeNavigator';

import Constants from './../../utils/Constants';

export default class HomeNavigatorComponent extends Component {
  componentDidMount() {
    this._deEmitter = DeviceEventEmitter.addListener(Constants.JumpToLoginNotiName, (a) => {
      this.props.navigation.replace('Login');
    });
  }
  componentWillUnmount() {
    this._deEmitter.remove();
  }
  render() {
    return (
      <HomeNavigator />
    )
  }
}
