import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import {Home, Server} from 'lucide-react-native';
import {useVpnStore} from '../store/useVpnStore';
import {getModeConfig} from '../constants/dnsModes';
import PowerButton from '../components/PowerButton';
import ModePicker from '../components/ModePicker';
import ServersScreen from './ServersScreen';

type Tab = 'home' | 'servers';

const HomeTab: React.FC = () => {
  const {isActive, isLoading, currentMode, error, toggleVpn, setMode} =
    useVpnStore();
  const modeConfig = getModeConfig(currentMode);
  const accentColor = modeConfig.accentColor;

  const statusOpacity = useSharedValue(1);

  const handleToggle = async () => {
    statusOpacity.value = withTiming(0, {duration: 120}, () => {
      statusOpacity.value = withSpring(1, {damping: 14});
    });
    await toggleVpn();
  };

  const statusStyle = useAnimatedStyle(() => ({
    opacity: statusOpacity.value,
  }));

  return (
    <ScrollView
      style={styles.homeScroll}
      contentContainerStyle={styles.homeContent}
      showsVerticalScrollIndicator={false}>
      {/* Power button */}
      <View style={styles.buttonArea}>
        <PowerButton
          isActive={isActive}
          isLoading={isLoading}
          accentColor={accentColor}
          onPress={handleToggle}
        />

        <Animated.View style={[styles.statusBlock, statusStyle]}>
          <Text
            style={[
              styles.statusText,
              {color: isActive ? accentColor : '#555'},
            ]}>
            {isLoading
              ? 'Verbinde...'
              : isActive
              ? 'Adblocker aktiv'
              : 'Adblocker inaktiv'}
          </Text>
          <Text style={styles.modeText}>
            Modus:{' '}
            <Text style={[styles.modeName, {color: accentColor + 'AA'}]}>
              {modeConfig.label}
            </Text>
          </Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </Animated.View>

        {/* Active DNS pill */}
        {isActive && (
          <View style={styles.dnsPill}>
            <Text style={styles.dnsPillLabel}>DNS</Text>
            <Text style={styles.dnsPillIp}>{modeConfig.dns[0]}</Text>
            <Text style={styles.dnsPillSep}>·</Text>
            <Text style={styles.dnsPillIp}>{modeConfig.dns[1]}</Text>
          </View>
        )}
      </View>

      {/* Mode picker */}
      <ModePicker currentMode={currentMode} onSelect={setMode} />
    </ScrollView>
  );
};

const MainScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const {isActive} = useVpnStore();
  const {accentColor} = getModeConfig(useVpnStore(s => s.currentMode));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>PureDNS</Text>
        <View
          style={[
            styles.statusDot,
            {backgroundColor: isActive ? accentColor : '#2C2C2E'},
          ]}
        />
      </View>

      {/* Screen content */}
      <View style={styles.screenArea}>
        {activeTab === 'home' ? <HomeTab /> : <ServersScreen />}
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}>
          <Home
            size={22}
            color={activeTab === 'home' ? '#E0E0E0' : '#3C3C3E'}
            strokeWidth={activeTab === 'home' ? 2.5 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              {color: activeTab === 'home' ? '#E0E0E0' : '#3C3C3E'},
            ]}>
            Start
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('servers')}
          activeOpacity={0.7}>
          <Server
            size={22}
            color={activeTab === 'servers' ? '#E0E0E0' : '#3C3C3E'}
            strokeWidth={activeTab === 'servers' ? 2.5 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              {color: activeTab === 'servers' ? '#E0E0E0' : '#3C3C3E'},
            ]}>
            Server
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  logo: {
    color: '#E0E0E0',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  screenArea: {
    flex: 1,
  },
  // Home tab
  homeScroll: {
    flex: 1,
  },
  homeContent: {
    paddingBottom: 20,
  },
  buttonArea: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 20,
  },
  statusBlock: {
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  modeText: {
    color: '#3C3C3E',
    fontSize: 13,
    fontWeight: '500',
  },
  modeName: {
    fontWeight: '700',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 4,
  },
  dnsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  dnsPillLabel: {
    color: '#444',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginRight: 2,
  },
  dnsPillIp: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  dnsPillSep: {
    color: '#2C2C2E',
    fontSize: 14,
  },
  // Tab bar
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#111',
    paddingBottom: 8,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default MainScreen;
