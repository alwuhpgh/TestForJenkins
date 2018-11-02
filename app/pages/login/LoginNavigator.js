import {
  StackNavigator,
} from 'react-navigation';

import Login from './Login';
import HomeNavigator from './../home/HomeNavigator';
import HomeNavigatorComponent from './../home/HomeNavigatorComponent';

export default LoginNavigator = StackNavigator({
  //默认加载第一个页面，这里用来注册需要跳转的页面 相当于Manifest.xml文件
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    },
  },
  HomeNavigatorComponent: {
    screen: HomeNavigatorComponent,
    navigationOptions: {
      header: null,
    },
  },
});