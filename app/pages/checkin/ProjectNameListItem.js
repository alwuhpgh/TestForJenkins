import React from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { myScreenSize } from './../../utils/util';

export const renderListItem = (item, itemHeight, index) => (
  <View style={[styles.container, { height: itemHeight }]}>
    <Text style={styles.name}>
      {item.name} - {item.departmentName}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    justifyContent: 'center',
    width: myScreenSize.width * 690 / 750,
    fontSize: myScreenSize.width * 26 / 750,
    color: '#1e1e1e',
  },
});
