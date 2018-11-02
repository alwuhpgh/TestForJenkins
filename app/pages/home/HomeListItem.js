import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import { myScreenSize } from '../../utils/util';

export const renderListItem = (item, size, index) => (
  <View style={[styles.container, { width: size.width, height: size.height }]}>
    {/* 内容View */}
    <View style={styles.content_view}>
      <Image style={styles.icon} resizeMode="contain" source={item.icon} />
      <Text style={styles.title}>{item.name}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content_view: {
    alignItems: 'center',
    width: myScreenSize.width * 314 / 750,
    height: myScreenSize.width * 382 / 750,
    borderRadius: myScreenSize.width * 19 / 750,
    backgroundColor: 'white',
    shadowColor: '#aaaaaa',
    shadowOffset: { width: myScreenSize.width * -2 / 750, height: myScreenSize.width * 0 / 750 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    marginTop: myScreenSize.width * 47 / 750,
    width: myScreenSize.width * 177 / 750,
    height: myScreenSize.width * 177 / 750,
  },
  title: {
    marginTop: myScreenSize.width * 48 / 750,
    fontSize: myScreenSize.width * 36 / 750,
    color: '#4c8fe5',
  },
});