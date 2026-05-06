import {NativeModules} from 'react-native';

const {TrafficStatsModule} = NativeModules;

export interface TrafficStats {
  totalRxBytes: number;
  totalTxBytes: number;
  mobileRxBytes: number;
  mobileTxBytes: number;
  sessionRxBytes: number;
  sessionTxBytes: number;
  sessionDurationSec: number;
}

const TrafficBridge = {
  startSession: (): void => {
    TrafficStatsModule?.startSession?.();
  },

  stopSession: (): void => {
    TrafficStatsModule?.stopSession?.();
  },

  getStats: (): Promise<TrafficStats> => {
    if (TrafficStatsModule?.getStats) {
      return TrafficStatsModule.getStats();
    }
    return Promise.resolve({
      totalRxBytes: 0,
      totalTxBytes: 0,
      mobileRxBytes: 0,
      mobileTxBytes: 0,
      sessionRxBytes: 0,
      sessionTxBytes: 0,
      sessionDurationSec: 0,
    });
  },
};

export default TrafficBridge;
