/**
 * PureDNS Adblocker
 * DNS-based ad blocking via Android VpnService
 */

import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainScreen from './src/screens/MainScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import {useAuthStore} from './src/store/useAuthStore';
import {initI18n} from './src/i18n';

function App(): React.JSX.Element {
  const {isInitialized, session, isOnboardingCompleted, initializeAuth} =
    useAuthStore();
  const [i18nLoaded, setI18nLoaded] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await initI18n();
      setI18nLoaded(true);
      await initializeAuth();
    };
    setup();
  }, [initializeAuth]);

  if (!isInitialized || !i18nLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4FACFE" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {!isOnboardingCompleted ? (
          <OnboardingScreen />
        ) : !session ? (
          <AuthScreen />
        ) : (
          <MainScreen />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
