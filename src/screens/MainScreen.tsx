import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import {Home, Server, BarChart2, User} from 'lucide-react-native';
import {useVpnStore} from '../store/useVpnStore';
import {useTrafficStore} from '../store/useTrafficStore';
import {getModeConfig} from '../constants/dnsModes';
import PowerButton from '../components/PowerButton';
import ModePicker from '../components/ModePicker';
import MiniStatsStrip from '../components/MiniStatsStrip';
import ServersScreen from './ServersScreen';
import StatsScreen from './StatsScreen';
import ProfileScreen from './ProfileScreen';
import {useTranslation} from 'react-i18next';

type Tab = 'home' | 'servers' | 'stats' | 'profile';

// ─── Home Tab ─────────────────────────────────────────────────────────────────
const HomeTab: React.FC = () => {
  const {t} = useTranslation();
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
              ? t('connecting')
              : isActive
              ? t('active')
              : t('inactive')}
          </Text>
          <Text style={styles.modeText}>
            {t('mode')}{' '}
            <Text style={[styles.modeName, {color: accentColor + 'BB'}]}>
              {t(modeConfig.label)}
            </Text>
          </Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </Animated.View>

        {/* Active DNS pill */}
        {isActive && (
          <View style={styles.dnsPill}>
            <Text style={styles.dnsPillLabel}>{t('dns')}</Text>
            <Text style={styles.dnsPillIp}>{modeConfig.dns[0]}</Text>
            <Text style={styles.dnsPillSep}>·</Text>
            <Text style={styles.dnsPillIp}>{modeConfig.dns[1]}</Text>
          </View>
        )}
      </View>

      {/* Mini traffic stats (only when active) */}
      {isActive && <MiniStatsStrip accentColor={accentColor} />}

      {/* Mode picker */}
      <ModePicker currentMode={currentMode} onSelect={setMode} />
    </ScrollView>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const MainScreen: React.FC = () => {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const {isActive} = useVpnStore();
  const {accentColor} = getModeConfig(useVpnStore(s => s.currentMode));
  const {startPolling, stopPolling, reset} = useTrafficStore();
  const insets = useSafeAreaInsets();

  // Start/stop traffic polling when VPN toggles
  useEffect(() => {
    if (isActive) {
      reset();
      startPolling();
    } else {
      stopPolling();
    }
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const TABS: {key: Tab; label: string; Icon: any}[] = [
    {key: 'home', label: t('start'), Icon: Home},
    {key: 'stats', label: t('stats'), Icon: BarChart2},
    {key: 'servers', label: t('server'), Icon: Server},
    {key: 'profile', label: t('profile'), Icon: User},
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />

      {/* Header — respects status bar height */}
      <View style={[styles.header, {paddingTop: insets.top + 12}]}>
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
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'stats' && <StatsScreen />}
        {activeTab === 'servers' && <ServersScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Tab bar — respects gesture nav bar */}
      <View style={[styles.tabBar, {paddingBottom: insets.bottom + 6}]}>
        {TABS.map(({key, label, Icon}) => {
          const active = activeTab === key;
          const color = active ? '#E0E0E0' : '#3C3C3E';
          return (
            <TouchableOpacity
              key={key}
              style={styles.tabItem}
              onPress={() => setActiveTab(key)}
              activeOpacity={0.7}>
              <Icon size={22} color={color} strokeWidth={active ? 2.5 : 1.8} />
              <Text style={[styles.tabLabel, {color}]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  logo: {color: '#E0E0E0', fontSize: 22, fontWeight: '800', letterSpacing: -0.5},
  statusDot: {width: 8, height: 8, borderRadius: 4},
  screenArea: {flex: 1},

  // Home tab
  homeScroll: {flex: 1},
  homeContent: {paddingBottom: 24, gap: 0},
  buttonArea: {alignItems: 'center', paddingTop: 24, gap: 20, paddingBottom: 4},
  statusBlock: {alignItems: 'center', gap: 6},
  statusText: {fontSize: 20, fontWeight: '700', letterSpacing: -0.3},
  modeText: {color: '#3C3C3E', fontSize: 13, fontWeight: '500'},
  modeName: {fontWeight: '700'},
  errorText: {color: '#FF4444', fontSize: 12, marginTop: 4},
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
  dnsPillLabel: {color: '#444', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginRight: 2},
  dnsPillIp: {color: '#666', fontSize: 12, fontFamily: 'monospace'},
  dnsPillSep: {color: '#2C2C2E', fontSize: 14},

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#111',
    paddingTop: 10,
    backgroundColor: '#000',
  },
  tabItem: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4},
  tabLabel: {fontSize: 10, fontWeight: '600', letterSpacing: 0.3},
});

export default MainScreen;
