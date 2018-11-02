import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import { myScreenSize } from './../../utils/util';

let pendingColor = '#f7ab00';
let superPendingColor = '#f7ab00';
let passColor = '#25be7e';
let failColor = '#a0141a';
export const renderListItem = (item, itemHeight, index) => {
  var examineStatusColor = '#797979';
  if (item.examineStatus == '0') {
    examineStatusColor = pendingColor;
  } else if (item.examineStatus == '1') {
    examineStatusColor = superPendingColor;
  } else if (item.examineStatus == '2') {
    examineStatusColor = passColor;
  } else if (item.examineStatus == '3') {
    examineStatusColor = failColor;
  } else if (item.examineStatus == '4') {
    examineStatusColor = failColor;
  } else if (item.examineStatus == '9') {
    examineStatusColor = pendingColor;
  }
  return (
    <View style={[styles.container, { height: itemHeight }]}>
      {/* 内容View */}
      <View style={styles.content_view}>
        {/* 待处理的类型View */}
        <View style={styles.type_view}>
          {/* 待处理的类型标题 */}
          <Text style={styles.type_title}>{item.statusName}</Text>
        </View>
        {/* 分割线 */}
        <View style={[styles.line, { marginTop: 0 }]}></View>
        {/* 信息 */}
        <View style={[styles.item_view, { marginTop: myScreenSize.width * 18 / 750, marginLeft: myScreenSize.width * 0 / 750 }]}>
          {/* 员工姓名 */}
          <View style={styles.item_view}>
            <Text style={styles.title_text}>员工姓名（中/英）：</Text>
            <Text style={styles.content_text}>{item.name}</Text>
          </View>
          {/* <View style={[styles.item_view, { position: 'absolute', left: myScreenSize.width * 349 / 750 }]}>
          <Text style={[styles.title_text]}>电话号：</Text>
          <Text style={styles.content_text}>{item.tel}</Text>
        </View> */}
        </View>
        {/* 项目名称 */}
        <View style={styles.item_view}>
          <Text style={styles.title_text}>项目名称：</Text>
          <Text style={styles.content_text}>{item.projectName}</Text>
        </View>
        {/* 部门名称 */}
        <View style={styles.item_view}>
          <Text style={styles.title_text}>部门名称：</Text>
          <Text style={styles.content_text}>{item.departmentName}</Text>
        </View>
        {/* 审批状态 */}
        <View style={styles.item_view}>
          <Text style={styles.title_text}>审批状态：</Text>
          <View style={[styles.examine_status_dot, { backgroundColor: examineStatusColor }]} />
          <Text style={[styles.examine_status_text, { color: examineStatusColor }]}>{item.examineStatusName}</Text>
        </View>
        {/* 分割线 */}
        <View style={styles.line}></View>
        {/* 查看详情 */}
        <View style={styles.bottom_view}>
          <Text style={styles.bottom_text}>点击查看详情</Text>
          <Image style={styles.bottom_arrow} resizeMode="contain" source={require('./../../img/Common/detail_arrow.png')} />
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content_view: {
    flexDirection: 'column',
    width: myScreenSize.width * 654 / 750,
    height: myScreenSize.width * 312 / 750,
    borderRadius: myScreenSize.width * 22 / 750,
    backgroundColor: 'white',
    shadowColor: '#cccccc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
  },
  type_view: {
    width: myScreenSize.width * 654 / 750,
    height: myScreenSize.width * 57 / 750,
    flexDirection: 'row',
    alignItems: 'center',
  },
  type_title: {
    marginLeft: myScreenSize.width * 28 / 750,
    fontSize: myScreenSize.width * 30 / 750,
    fontWeight: 'bold',
    color: '#353535',
  },
  item_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: myScreenSize.width * 28 / 750,
    height: myScreenSize.width * 42 / 750,
  },
  title_text: {
    fontSize: myScreenSize.width * 20 / 750,
    fontWeight: 'bold',
    color: '#353535',
  },
  content_text: {
    marginLeft: myScreenSize.width * 15 / 750,
    fontSize: myScreenSize.width * 20 / 750,
    color: '#797979',
  },
  examine_status_dot: {
    marginLeft: myScreenSize.width * 15 / 750,
    width: myScreenSize.width * 18 / 750,
    height: myScreenSize.width * 18 / 750,
    borderRadius: myScreenSize.width * 9 / 750,
  },
  examine_status_text: {
    marginLeft: myScreenSize.width * 6 / 750,
    fontSize: myScreenSize.width * 20 / 750,
    color: '#797979',
  },
  line: {
    marginTop: myScreenSize.width * 13 / 750,
    width: myScreenSize.width * 654 / 750,
    height: myScreenSize.width * 1 / 750,
    backgroundColor: '#dbdbdb',
  },
  bottom_view: {
    width: myScreenSize.width * 654 / 750,
    height: myScreenSize.width * 49 / 750,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottom_text: {
    marginLeft: myScreenSize.width * 28 / 750,
    fontSize: myScreenSize.width * 20 / 750,
    fontWeight: 'bold',
    color: '#353535',
  },
  bottom_arrow: {
    position: 'absolute',
    right: myScreenSize.width * 25 / 750,
  },
});