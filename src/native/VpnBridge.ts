import {NativeModules} from 'react-native';

const {VpnModule} = NativeModules;

/**
 * Typed bridge to the native Android VpnModule.
 * On non-Android platforms or in tests, all calls are no-ops.
 */
const NativeVpnBridge = {
  startVpn: (dns1: string, dns2: string): Promise<boolean> => {
    if (VpnModule?.startVpn) {
      return VpnModule.startVpn(dns1, dns2);
    }
    return Promise.resolve(false);
  },

  stopVpn: (): void => {
    if (VpnModule?.stopVpn) {
      VpnModule.stopVpn();
    }
  },

  updateDns: (dns1: string, dns2: string): void => {
    if (VpnModule?.updateDns) {
      VpnModule.updateDns(dns1, dns2);
    }
  },
};

export default NativeVpnBridge;
