import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Shield, Users, Lock, Globe, Copy} from 'lucide-react-native';
import {DNS_MODES, DnsModeConfig} from '../constants/dnsModes';
import {useVpnStore} from '../store/useVpnStore';

const ModeIcon: React.FC<{icon: string; color: string}> = ({icon, color}) => {
  const props = {size: 20, color, strokeWidth: 2};
  switch (icon) {
    case 'shield':
      return <Shield {...props} />;
    case 'family':
      return <Users {...props} />;
    case 'lock':
      return <Lock {...props} />;
    case 'globe':
    default:
      return <Globe {...props} />;
  }
};

const ServerCard: React.FC<{
  config: DnsModeConfig;
  isActive: boolean;
  onActivate: () => void;
}> = ({config, isActive, onActivate}) => {
  const {label, subtitle, description, dns, accentColor, icon} = config;

  return (
    <View
      style={[
        styles.card,
        isActive && {borderColor: accentColor, borderWidth: 1.5},
      ]}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View
            style={[
              styles.iconBadge,
              {backgroundColor: accentColor + '20'},
            ]}>
            <ModeIcon icon={icon} color={accentColor} />
          </View>
          <View style={styles.cardTitles}>
            <Text style={[styles.cardLabel, {color: accentColor}]}>
              {label}
            </Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
        </View>
        {isActive ? (
          <View style={[styles.activeBadge, {borderColor: accentColor}]}>
            <Text style={[styles.activeBadgeText, {color: accentColor}]}>
              AKTIV
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.selectButton}
            onPress={onActivate}
            activeOpacity={0.7}>
            <Text style={styles.selectButtonText}>Wählen</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* DNS Servers */}
      <View style={styles.dnsSection}>
        <View style={styles.dnsSectionHeader}>
          <Text style={styles.dnsSectionLabel}>IPv4 DNS-Server</Text>
        </View>
        {dns.map((ip, i) => (
          <View key={i} style={styles.dnsRow}>
            <View style={[styles.dnsIndex, {backgroundColor: accentColor + '18'}]}>
              <Text style={[styles.dnsIndexText, {color: accentColor}]}>
                {i + 1}
              </Text>
            </View>
            <Text style={styles.dnsIp}>{ip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const ServersScreen: React.FC = () => {
  const {currentMode, setMode} = useVpnStore();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>DNS-Server</Text>
      <Text style={styles.subtitle}>
        Übersicht aller verfügbaren Modi und ihrer Server
      </Text>

      {DNS_MODES.map(config => (
        <ServerCard
          key={config.mode}
          config={config}
          isActive={currentMode === config.mode}
          onActivate={() => setMode(config.mode)}
        />
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerNote}>
          Alle Server werden von Quad9 / AdGuard / eigenen Anbietern betrieben.
          DNS-over-HTTPS wird via VPN-Schnittstelle genutzt.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 14,
  },
  title: {
    color: '#E0E0E0',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    color: '#444',
    fontSize: 13,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#0D0D0D',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitles: {
    gap: 2,
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: '#555',
    fontSize: 12,
    fontWeight: '500',
  },
  activeBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  selectButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectButtonText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    color: '#555',
    fontSize: 13,
    lineHeight: 20,
  },
  dnsSection: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  dnsSectionHeader: {
    marginBottom: 4,
  },
  dnsSectionLabel: {
    color: '#444',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  dnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dnsIndex: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dnsIndexText: {
    fontSize: 11,
    fontWeight: '800',
  },
  dnsIp: {
    color: '#888',
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  footer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  footerNote: {
    color: '#2C2C2E',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
});

export default ServersScreen;
