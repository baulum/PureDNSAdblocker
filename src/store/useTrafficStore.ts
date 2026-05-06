import {create} from 'zustand';
import TrafficBridge, {TrafficStats} from '../native/TrafficBridge';

const EMPTY_STATS: TrafficStats = {
  totalRxBytes: 0,
  totalTxBytes: 0,
  mobileRxBytes: 0,
  mobileTxBytes: 0,
  sessionRxBytes: 0,
  sessionTxBytes: 0,
  sessionDurationSec: 0,
};

// Sparkline: 30 data points (one per second)
const HISTORY_SIZE = 30;

interface TrafficState {
  stats: TrafficStats;
  // bytes/sec rate history for chart (rx, tx alternating pair)
  rxHistory: number[];
  txHistory: number[];
  isPolling: boolean;
  _interval: ReturnType<typeof setInterval> | null;
  _prevRx: number;
  _prevTx: number;

  startPolling: () => void;
  stopPolling: () => void;
  reset: () => void;
}

export const useTrafficStore = create<TrafficState>((set, get) => ({
  stats: EMPTY_STATS,
  rxHistory: Array(HISTORY_SIZE).fill(0),
  txHistory: Array(HISTORY_SIZE).fill(0),
  isPolling: false,
  _interval: null,
  _prevRx: 0,
  _prevTx: 0,

  startPolling: () => {
    if (get().isPolling) return;
    TrafficBridge.startSession();

    const interval = setInterval(async () => {
      try {
        const stats = await TrafficBridge.getStats();
        const {_prevRx, _prevTx} = get();

        // Calculate byte rate since last poll
        const rxRate = Math.max(0, stats.sessionRxBytes - _prevRx);
        const txRate = Math.max(0, stats.sessionTxBytes - _prevTx);

        set(s => ({
          stats,
          _prevRx: stats.sessionRxBytes,
          _prevTx: stats.sessionTxBytes,
          rxHistory: [...s.rxHistory.slice(1), rxRate],
          txHistory: [...s.txHistory.slice(1), txRate],
        }));
      } catch (_) {
        // silently ignore polling errors
      }
    }, 1000);

    set({isPolling: true, _interval: interval});
  },

  stopPolling: () => {
    const {_interval} = get();
    if (_interval) clearInterval(_interval);
    TrafficBridge.stopSession();
    set({isPolling: false, _interval: null});
  },

  reset: () => {
    set({
      stats: EMPTY_STATS,
      rxHistory: Array(HISTORY_SIZE).fill(0),
      txHistory: Array(HISTORY_SIZE).fill(0),
      _prevRx: 0,
      _prevTx: 0,
    });
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatRate(bytesPerSec: number): string {
  if (bytesPerSec < 1024) return `${bytesPerSec} B/s`;
  if (bytesPerSec < 1024 * 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  return `${(bytesPerSec / 1024 / 1024).toFixed(1)} MB/s`;
}
