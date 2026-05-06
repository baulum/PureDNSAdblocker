import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ArrowDown, ArrowUp, Clock} from 'lucide-react-native';
import {
  useTrafficStore,
  formatBytes,
  formatDuration,
  formatRate,
} from '../store/useTrafficStore';

interface MiniStatsStripProps {
  accentColor: string;
}

const MiniStatsStrip: React.FC<MiniStatsStripProps> = ({accentColor}) => {
  const {stats, rxHistory, txHistory} = useTrafficStore();

  const lastRxRate = rxHistory[rxHistory.length - 1] ?? 0;
  const lastTxRate = txHistory[txHistory.length - 1] ?? 0;

  return (
    <View style={styles.strip}>
      {/* Download */}
      <View style={styles.stat}>
        <ArrowDown size={13} color={accentColor} strokeWidth={2.5} />
        <View>
          <Text style={[styles.statValue, {color: accentColor}]}>
            {formatBytes(stats.sessionRxBytes)}
          </Text>
          <Text style={styles.statRate}>{formatRate(lastRxRate)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Upload */}
      <View style={styles.stat}>
        <ArrowUp size={13} color="#A18CD1" strokeWidth={2.5} />
        <View>
          <Text style={[styles.statValue, {color: '#A18CD1'}]}>
            {formatBytes(stats.sessionTxBytes)}
          </Text>
          <Text style={styles.statRate}>{formatRate(lastTxRate)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Uptime */}
      <View style={styles.stat}>
        <Clock size={13} color="#555" strokeWidth={2} />
        <View>
          <Text style={styles.statValueMuted}>
            {formatDuration(stats.sessionDurationSec)}
          </Text>
          <Text style={styles.statRate}>Laufzeit</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    borderRadius: 16,
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    gap: 0,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#1C1C1E',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  statValueMuted: {
    color: '#888',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  statRate: {
    color: '#333',
    fontSize: 10,
    marginTop: 1,
  },
});

export default MiniStatsStrip;
