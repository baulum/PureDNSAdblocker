package com.purednsadblocker

import android.app.Activity
import android.content.Intent
import android.net.VpnService
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class VpnModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var vpnPromise: Promise? = null
    private var pendingDns1: String = ""
    private var pendingDns2: String = ""

    private val activityEventListener: ActivityEventListener = object : BaseActivityEventListener() {
        // Correct override signature for BaseActivityEventListener
        override fun onActivityResult(
            activity: Activity,
            requestCode: Int,
            resultCode: Int,
            data: Intent?,
        ) {
            if (requestCode == VPN_REQUEST_CODE) {
                if (resultCode == Activity.RESULT_OK) {
                    startVpnService(pendingDns1, pendingDns2)
                    vpnPromise?.resolve(true)
                } else {
                    vpnPromise?.reject("VPN_PERMISSION_DENIED", "User denied VPN permission")
                }
                vpnPromise = null
            }
        }
    }

    init {
        reactContext.addActivityEventListener(activityEventListener)
    }

    override fun getName(): String = "VpnModule"

    @ReactMethod
    fun startVpn(dns1: String, dns2: String, promise: Promise) {
        val intent = VpnService.prepare(reactApplicationContext)
        if (intent != null) {
            // OS needs user permission — store args and launch dialog
            pendingDns1 = dns1
            pendingDns2 = dns2
            vpnPromise = promise
            // getCurrentActivity() is the correct accessor in ReactContextBaseJavaModule
            getCurrentActivity()?.startActivityForResult(intent, VPN_REQUEST_CODE)
                ?: promise.reject("NO_ACTIVITY", "No foreground activity available")
        } else {
            // Permission already granted
            startVpnService(dns1, dns2)
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun updateDns(dns1: String, dns2: String) {
        val intent = Intent(reactApplicationContext, DnsVpnService::class.java).apply {
            action = DnsVpnService.ACTION_UPDATE
            putExtra(DnsVpnService.EXTRA_DNS1, dns1)
            putExtra(DnsVpnService.EXTRA_DNS2, dns2)
        }
        reactApplicationContext.startService(intent)
    }

    @ReactMethod
    fun stopVpn() {
        val intent = Intent(reactApplicationContext, DnsVpnService::class.java).apply {
            action = DnsVpnService.ACTION_STOP
        }
        reactApplicationContext.startService(intent)
    }

    private fun startVpnService(dns1: String, dns2: String) {
        val intent = Intent(reactApplicationContext, DnsVpnService::class.java).apply {
            action = DnsVpnService.ACTION_START
            putExtra(DnsVpnService.EXTRA_DNS1, dns1)
            putExtra(DnsVpnService.EXTRA_DNS2, dns2)
        }
        reactApplicationContext.startService(intent)
    }

    companion object {
        private const val VPN_REQUEST_CODE = 0x0F
    }
}
