import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ArrowDown, ArrowUp, Clock, Wifi, Signal} from 'lucide-react-native';
import {
  useTrafficStore,
  formatBytes,
  formatDuration,
  formatRate,
} from '../store/useTrafficStore';
import {useVpnStore} from '../store/useVpnStore';
import {getModeConfig} from '../constants/dnsModes';

// ─── Sparkline chart ──────────────────────────────────────────────────────────
interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({data, color, height = 40}) => {
  const max = Math.max(...data, 1);
  return (
    <View style={[styles.sparkline, {height}]}>
      {data.map((v, i) => {
        const barH = Math.max(2, (v / max) * height);
        return (
          <View
            key={i}
            style={[
              styles.sparkBar,
              {
                height: barH,
                backgroundColor:
                  i === data.length - 1
                    ? color
                    : color + Math.floor(((i + 1) / data.length) * 100)
                        .toString(16)
                        .padStart(2, '0'),
              },
            ]}
          />
        );
      })}
    </View>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accentColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  sub,
  accentColor,
}) => (
  <View style={[styles.card, {borderColor: accentColor + '22'}]}>
    <View style={[styles.cardIcon, {backgroundColor: accentColor + '18'}]}>
      {icon}
    </View>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={[styles.cardValue, {color: accentColor}]}>{value}</Text>
    {sub ? <Text style={styles.cardSub}>{sub}</Text> : null}
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
const StatsScreen: React.FC = () => {
  const {stats, rxHistory, txHistory, isPolling} = useTrafficStore();
  const {isActive, currentMode} = useVpnStore();
  const modeConfig = getModeConfig(currentMode);
  const accent = modeConfig.accentColor;

  const lastRxRate = rxHistory[rxHistory.length - 1] ?? 0;
  const lastTxRate = txHistory[txHistory.length - 1] ?? 0;
  const wifiRx = Math.max(0, stats.totalRxBytes - stats.mobileRxBytes);
  const wifiTx = Math.max(0, stats.totalTxBytes - stats.mobileTxBytes);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Statistiken</Text>
      <Text style={styles.subtitle}>
        {isPolling
          ? 'Live-Daten · aktualisiert jede Sekunde'
          : 'Aktiviere den Adblocker um Daten zu sehen'}
      </Text>

      {/* Session overview */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SESSION</Text>
        <View style={styles.bigCard}>
          <View style={styles.bigCardRow}>
            <View style={styles.bigStat}>
              <Text style={styles.bigStatLabel}>↓ Empfangen</Text>
              <Text style={[styles.bigStatValue, {color: accent}]}>
                {formatBytes(stats.sessionRxBytes)}
              </Text>
              <Text style={styles.bigStatRate}>{formatRate(lastRxRate)}</Text>
            </View>
            <View style={styles.bigStatDivider} />
            <View style={styles.bigStat}>
              <Text style={styles.bigStatLabel}>↑ Gesendet</Text>
              <Text style={[styles.bigStatValue, {color: '#A18CD1'}]}>
                {formatBytes(stats.sessionTxBytes)}
              </Text>
              <Text style={styles.bigStatRate}>{formatRate(lastTxRate)}</Text>
            </View>
          </View>

          {/* Sparklines */}
          <View style={styles.charts}>
            <View style={styles.chartRow}>
              <Text style={styles.chartLabel}>↓ Download</Text>
              <Sparkline data={rxHistory} color={accent} height={36} />
            </View>
            <View style={[styles.chartRow, {marginTop: 10}]}>
              <Text style={styles.chartLabel}>↑ Upload</Text>
              <Sparkline data={txHistory} color="#A18CD1" height={36} />
            </View>
          </View>

          {/* Uptime */}
          <View style={styles.uptimeRow}>
            <Clock size={14} color="#444" />
            <Text style={styles.uptimeText}>
              Laufzeit: {formatDuration(stats.sessionDurationSec)}
            </Text>
          </View>
        </View>
      </View>

      {/* Network breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>NETZWERK (SEIT BOOT)</Text>
        <View style={styles.cardGrid}>
          <StatCard
            icon={<Wifi size={18} color={accent} strokeWidth={2} />}
            label="WLAN Empf."
            value={formatBytes(wifiRx)}
            accentColor={accent}
          />
          <StatCard
            icon={<Wifi size={18} color="#A18CD1" strokeWidth={2} />}
            label="WLAN Send."
            value={formatBytes(wifiTx)}
            accentColor="#A18CD1"
          />
          <StatCard
            icon={<Signal size={18} color="#FA709A" strokeWidth={2} />}
            label="Mobil Empf."
            value={formatBytes(stats.mobileRxBytes)}
            accentColor="#FA709A"
          />
          <StatCard
            icon={<Signal size={18} color="#43E97B" strokeWidth={2} />}
            label="Mobil Send."
            value={formatBytes(stats.mobileTxBytes)}
            accentColor="#43E97B"
          />
        </View>
      </View>

      {/* Total since boot */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>GESAMT (SEIT BOOT)</Text>
        <View style={styles.totalRow}>
          <View style={styles.totalItem}>
            <ArrowDown size={16} color={accent} strokeWidth={2.5} />
            <Text style={[styles.totalValue, {color: accent}]}>
              {formatBytes(stats.totalRxBytes)}
            </Text>
            <Text style={styles.totalLabel}>Empfangen</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalItem}>
            <ArrowUp size={16} color="#A18CD1" strokeWidth={2.5} />
            <Text style={[styles.totalValue, {color: '#A18CD1'}]}>
              {formatBytes(stats.totalTxBytes)}
            </Text>
            <Text style={styles.totalLabel}>Gesendet</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalItem}>
            <ArrowDown size={16} color="#555" strokeWidth={2} />
            <Text style={styles.totalValueMuted}>
              {formatBytes(stats.totalRxBytes + stats.totalTxBytes)}
            </Text>
            <Text style={styles.totalLabel}>Gesamt</Text>
          </View>
        </View>
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          Daten stammen aus Android TrafficStats · Zählung seit Gerätestart
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  content: {paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 6},
  title: {
    color: '#E0E0E0',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {color: '#333', fontSize: 12, marginBottom: 10},

  section: {gap: 10, marginTop: 16},
  sectionLabel: {
    color: '#333',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },

  // Big session card
  bigCard: {
    backgroundColor: '#0D0D0D',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    gap: 16,
  },
  bigCardRow: {flexDirection: 'row', alignItems: 'flex-start'},
  bigStat: {flex: 1, gap: 4},
  bigStatDivider: {width: 1, height: 52, backgroundColor: '#1C1C1E', marginHorizontal: 16},
  bigStatLabel: {color: '#444', fontSize: 11, fontWeight: '600'},
  bigStatValue: {fontSize: 22, fontWeight: '800', letterSpacing: -0.5},
  bigStatRate: {color: '#333', fontSize: 11},

  // Sparkline
  charts: {gap: 0},
  chartRow: {},
  chartLabel: {color: '#333', fontSize: 10, fontWeight: '600', letterSpacing: 1, marginBottom: 4},
  sparkline: {flexDirection: 'row', alignItems: 'flex-end', gap: 2},
  sparkBar: {flex: 1, borderRadius: 2},

  uptimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#111',
  },
  uptimeText: {color: '#444', fontSize: 12},

  // Card grid
  cardGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  card: {
    width: '47.5%',
    backgroundColor: '#0D0D0D',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 6,
  },
  cardIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  cardLabel: {color: '#444', fontSize: 10, fontWeight: '700', letterSpacing: 1},
  cardValue: {fontSize: 16, fontWeight: '800'},
  cardSub: {color: '#333', fontSize: 10},

  // Total row
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#0D0D0D',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    padding: 18,
    alignItems: 'center',
  },
  totalItem: {flex: 1, alignItems: 'center', gap: 6},
  totalDivider: {width: 1, height: 40, backgroundColor: '#1C1C1E'},
  totalValue: {fontSize: 16, fontWeight: '800'},
  totalValueMuted: {color: '#666', fontSize: 16, fontWeight: '800'},
  totalLabel: {color: '#333', fontSize: 10, fontWeight: '600'},

  footerNote: {marginTop: 16, alignItems: 'center'},
  footerText: {color: '#222', fontSize: 10, textAlign: 'center', lineHeight: 16},
});

export default StatsScreen;
