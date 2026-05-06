package com.purednsadblocker

import android.content.Intent
import android.net.VpnService
import android.os.ParcelFileDescriptor
import android.util.Log

class DnsVpnService : VpnService() {

    private var vpnInterface: ParcelFileDescriptor? = null
    private var dns1: String = ""
    private var dns2: String = ""

    companion object {
        const val ACTION_START = "com.purednsadblocker.START_VPN"
        const val ACTION_STOP = "com.purednsadblocker.STOP_VPN"
        const val ACTION_UPDATE = "com.purednsadblocker.UPDATE_VPN"
        const val EXTRA_DNS1 = "dns1"
        const val EXTRA_DNS2 = "dns2"
        private const val TAG = "DnsVpnService"
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        intent?.let {
            when (it.action) {
                ACTION_START -> {
                    dns1 = it.getStringExtra(EXTRA_DNS1) ?: ""
                    dns2 = it.getStringExtra(EXTRA_DNS2) ?: ""
                    setupVpn()
                }
                ACTION_UPDATE -> {
                    val newDns1 = it.getStringExtra(EXTRA_DNS1) ?: ""
                    val newDns2 = it.getStringExtra(EXTRA_DNS2) ?: ""
                    if (newDns1 != dns1 || newDns2 != dns2) {
                        dns1 = newDns1
                        dns2 = newDns2
                        setupVpn()
                    }
                }
                ACTION_STOP -> stopVpn()
            }
        }
        return START_STICKY
    }

    private fun setupVpn() {
        if (dns1.isEmpty() || dns2.isEmpty()) return

        try {
            vpnInterface?.close()

            val builder = Builder()
                .setSession("PureDNS")
                .addAddress("10.0.0.2", 32)
                .addDnsServer(dns1)
                .addDnsServer(dns2)
                // Note: We deliberately do not add routes here.
                // This allows the system to use the configured DNS servers 
                // while routing other traffic normally over the active connection.

            vpnInterface = builder.establish()
            Log.d(TAG, "VPN established with DNS: $dns1, $dns2")
        } catch (e: Exception) {
            Log.e(TAG, "Error setting up VPN", e)
        }
    }

    private fun stopVpn() {
        try {
            vpnInterface?.close()
            vpnInterface = null
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping VPN", e)
        }
        stopSelf()
    }

    override fun onDestroy() {
        stopVpn()
        super.onDestroy()
    }
}
