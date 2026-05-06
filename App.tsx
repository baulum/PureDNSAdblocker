/**
 * PureDNS Adblocker
 * DNS-based ad blocking via Android VpnService
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainScreen from './src/screens/MainScreen';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <MainScreen />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
