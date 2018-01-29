import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import styles from './styles';

const Progress = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
  </View>
);

export default Progress;
