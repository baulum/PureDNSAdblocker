import {create} from 'zustand';
import {DnsMode, getModeConfig} from '../constants/dnsModes';
import NativeVpnBridge from '../native/VpnBridge';

interface VpnState {
  isActive: boolean;
  isLoading: boolean;
  currentMode: DnsMode;
  error: string | null;
  toggleVpn: () => Promise<void>;
  setMode: (mode: DnsMode) => void;
}

export const useVpnStore = create<VpnState>((set, get) => ({
  isActive: false,
  isLoading: false,
  currentMode: 'Normal',
  error: null,

  toggleVpn: async () => {
    const {isActive, currentMode} = get();
    set({isLoading: true, error: null});

    try {
      if (isActive) {
        NativeVpnBridge.stopVpn();
        set({isActive: false, isLoading: false});
      } else {
        const config = getModeConfig(currentMode);
        const success = await NativeVpnBridge.startVpn(config.dns[0], config.dns[1]);
        if (success) {
          set({isActive: true, isLoading: false});
        } else {
          set({isLoading: false, error: 'VPN permission denied'});
        }
      }
    } catch (e: any) {
      set({
        isLoading: false,
        error: e?.message ?? 'Unknown error',
      });
    }
  },

  setMode: (mode: DnsMode) => {
    const {isActive} = get();
    set({currentMode: mode});
    if (isActive) {
      const config = getModeConfig(mode);
      NativeVpnBridge.updateDns(config.dns[0], config.dns[1]);
    }
  },
}));
