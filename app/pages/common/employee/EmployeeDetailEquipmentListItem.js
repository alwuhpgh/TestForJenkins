import React from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { myScreenSize } from './../../../utils/util';

export const renderEquipmentListItem = (item, itemHeight, index) => {
  return (
    <View style={[styles.container, { height: itemHeight }]}>
      <Text style={styles.title_text}>{item.name} * {item.num}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title_text: {
    justifyContent: 'center',
    marginRight: myScreenSize.width * 40 / 750,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#1e1e1e',
    textAlign: 'right',
  },
});