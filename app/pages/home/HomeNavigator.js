import React, { Component } from 'react';
import {
  StackNavigator,
} from 'react-navigation';

import { myScreenSize } from '../../utils/util';

import BaseNavHeader from './../base/BaseNavHeader';
import BaseNavHeaderRightAddButton from './../base/BaseNavHeaderRightAddButton';
import BaseNavHeaderRightSearchButton from './../base/BaseNavHeaderRightSearchButton';
import BaseNavHeaderHomeSettingButton from './../base/BaseNavHeaderHomeSettingButton';
import Home from './Home';
import CheckIn from './../checkin/CheckIn';
import CheckOut from './../checkout/CheckOut';
import BackUp from './../backup/BackUp';
import Pending from './../pending/Pending';
import EmployeeInput from './../checkin/EmployeeInput';
import EmployeeDetail from './../common/employee/EmployeeDetail';
import Search from './../common/search/Search';
import SearchProject from './../checkin/SearchProject';
import AddProject from './../checkin/AddProject';
import EmployeeCheckOut from './../common/employee/EmployeeCheckOut';
import BackUpDetail from './../backup/BackUpDetail';
import AddBackUp from './../backup/AddBackUp';
import SearchEmployee from './../backup/SearchEmployee';
import PendingDetailCheckIn from './../pending/PendingDetailCheckIn';
import AddEquipment from './../pending/AddEquipment';
import PendingDetailCheckOut from './../pending/PendingDetailCheckOut';
import PendingDetailBackUp from './../pending/PendingDetailBackUp';
import CheckInSearch from './../checkin/CheckInSearch';
import CheckOutSearch from './../checkout/CheckOutSearch';
import BackUpSearch from './../backup/BackUpSearch';
import AppInfo from './../setting/AppInfo';
import ChangePassword from './../setting/ChangePassword';
import PendingCheckOutFail from './../pending/PendingCheckOutFail';

import Constants from './../../utils/Constants';

var routeConfigMap = {//默认加载第一个页面，这里用来注册需要跳转的页面 相当于Manifest.xml文件
  Home: {
    screen: Home,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader
          navigation={navigation}
          headerTitle='Siemens Onsite'
          headerRight={[
            <BaseNavHeaderHomeSettingButton key='1' navigation={navigation} clickToEmit={Constants.HomeSettingBtnClickNotiName} />
          ]}
        />
      ),
    },
  },
  CheckIn: {
    screen: CheckIn,
    navigationOptions: {
      header: ({ navigation }) => {
        // 用户类型
        let userType = global.variables.userType;
        // 根据用户类型是否显示添加按钮
        if (userType == '2') {
          return (
            <BaseNavHeader
              navigation={navigation}
              headerTitle='CheckIn'
              headerRight={[
                <BaseNavHeaderRightAddButton key='1' navigation={navigation} clickToPage='EmployeeInput' />,
                <BaseNavHeaderRightSearchButton key='2' style={{ right: myScreenSize.width * 104 / 750 }} navigation={navigation} clickToEmit={Constants.CheckInSearchBtnClickNotiName} />
              ]}
            />
          )
        } else {
          return (
            <BaseNavHeader
              navigation={navigation}
              headerTitle='CheckIn'
              headerRight={[
                <BaseNavHeaderRightSearchButton key='1' navigation={navigation} clickToEmit={Constants.CheckInSearchBtnClickNotiName} />
              ]}
            />
          )
        }
      },
    },
  },
  CheckOut: {
    screen: CheckOut,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader
          navigation={navigation}
          headerTitle='CheckOut'
          headerRight={[
            <BaseNavHeaderRightSearchButton key='1' navigation={navigation} clickToEmit={Constants.CheckOutSearchBtnClickNotiName} />
          ]}
        />
      ),
    },
  },
  BackUp: {
    screen: BackUp,
    navigationOptions: {
      header: ({ navigation }) => {
        // 用户类型
        let userType = global.variables.userType;
        // 根据用户类型是否显示添加按钮
        if (userType == '2') {
          return (
            <BaseNavHeader
              navigation={navigation}
              headerTitle='BackUp管理'
              headerRight={[
                <BaseNavHeaderRightAddButton key='1' navigation={navigation} clickToPage='AddBackUp' />,
                <BaseNavHeaderRightSearchButton key='2' style={{ right: myScreenSize.width * 104 / 750 }} navigation={navigation} clickToEmit={Constants.BackUpSearchBtnClickNotiName} />
              ]}
            />
          )
        } else {
          return (
            <BaseNavHeader
              navigation={navigation}
              headerTitle='BackUp管理'
              headerRight={[
                <BaseNavHeaderRightSearchButton key='1' navigation={navigation} clickToEmit={Constants.BackUpSearchBtnClickNotiName} />
              ]}
            />
          )
        }
      },
    },
  },
  Pending: {
    screen: Pending,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='待处理' />
      ),
    },
  },
  Search: {
    screen: Search,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='搜索' />
      ),
    },
  },
  EmployeeInput: {
    screen: EmployeeInput,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='人员信息补充' />
      ),
    },
  },
  EmployeeDetail: {
    screen: EmployeeDetail,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='员工信息详情' />
      ),
    },
  },
  SearchProject: {
    screen: SearchProject,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='查找项目' />
      ),
    },
  },
  AddProject: {
    screen: AddProject,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='创建项目' />
      ),
    },
  },
  EmployeeCheckOut: {
    screen: EmployeeCheckOut,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='Check Out' />
      ),
    },
  },
  BackUpDetail: {
    screen: BackUpDetail,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='员工信息详情' />
      ),
    },
  },
  AddBackUp: {
    screen: AddBackUp,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='添加BackUp' />
      ),
    },
  },
  SearchEmployee: {
    screen: SearchEmployee,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='查询员工' />
      ),
    },
  },
  PendingDetailCheckIn: {
    screen: PendingDetailCheckIn,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='人员信息审核' />
      ),
    },
  },
  AddEquipment: {
    screen: AddEquipment,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='添加设备' />
      ),
    },
  },
  PendingDetailCheckOut: {
    screen: PendingDetailCheckOut,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='人员信息审核' />
      ),
    },
  },
  PendingDetailBackUp: {
    screen: PendingDetailBackUp,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='人员信息审核' />
      ),
    },
  },
  CheckInSearch: {
    screen: CheckInSearch,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='搜索' />
      ),
    },
  },
  CheckOutSearch: {
    screen: CheckOutSearch,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='搜索' />
      ),
    },
  },
  BackUpSearch: {
    screen: BackUpSearch,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='搜索' />
      ),
    },
  },
  AppInfo: {
    screen: AppInfo,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='应用信息' />
      ),
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='修改密码' />
      ),
    },
  },
  PendingCheckOutFail: {
    screen: PendingCheckOutFail,
    navigationOptions: {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} headerTitle='人员信息审核' />
      ),
    },
  },
};
var stackConfig = {
  // 这里可以对标题栏进行通用设置
  // 但是当某个页面也设置了 navigationOptions，则会失效，优先使用页面设置
  navigationOptions: ({ navigation }) => {
    pageNavigation = navigation;
    return {
      header: ({ navigation }) => (
        <BaseNavHeader navigation={navigation} />
      ),
      cardStack: {
        gesturesEnabled: true
      },
    }
  },
  mode: 'card',
}
export default HomeNavigator = StackNavigator(routeConfigMap, stackConfig);