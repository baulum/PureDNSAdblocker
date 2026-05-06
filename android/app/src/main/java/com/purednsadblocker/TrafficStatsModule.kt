package com.purednsadblocker

import android.net.TrafficStats
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class TrafficStatsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var sessionRxBaseline: Long = -1L
    private var sessionTxBaseline: Long = -1L
    private var sessionStartMs: Long = 0L

    override fun getName(): String = "TrafficStatsModule"

    /** Call when the VPN session starts to capture the baseline. */
    @ReactMethod
    fun startSession() {
        sessionRxBaseline = TrafficStats.getTotalRxBytes()
        sessionTxBaseline = TrafficStats.getTotalTxBytes()
        sessionStartMs = System.currentTimeMillis()
    }

    /** Call when the VPN session ends. */
    @ReactMethod
    fun stopSession() {
        sessionRxBaseline = -1L
        sessionTxBaseline = -1L
        sessionStartMs = 0L
    }

    /**
     * Returns a map with:
     *  totalRxBytes, totalTxBytes   — since device boot
     *  mobileRxBytes, mobileTxBytes — mobile data only
     *  sessionRxBytes, sessionTxBytes — since VPN start
     *  sessionDurationSec           — seconds since VPN start
     */
    @ReactMethod
    fun getStats(promise: Promise) {
        val totalRx = TrafficStats.getTotalRxBytes().takeIf { it != TrafficStats.UNSUPPORTED.toLong() } ?: 0L
        val totalTx = TrafficStats.getTotalTxBytes().takeIf { it != TrafficStats.UNSUPPORTED.toLong() } ?: 0L
        val mobileRx = TrafficStats.getMobileRxBytes().takeIf { it != TrafficStats.UNSUPPORTED.toLong() } ?: 0L
        val mobileTx = TrafficStats.getMobileTxBytes().takeIf { it != TrafficStats.UNSUPPORTED.toLong() } ?: 0L

        val sessionRx = if (sessionRxBaseline >= 0) maxOf(0L, totalRx - sessionRxBaseline) else 0L
        val sessionTx = if (sessionTxBaseline >= 0) maxOf(0L, totalTx - sessionTxBaseline) else 0L
        val sessionDuration = if (sessionStartMs > 0L) (System.currentTimeMillis() - sessionStartMs) / 1000L else 0L

        val result = Arguments.createMap().apply {
            putDouble("totalRxBytes", totalRx.toDouble())
            putDouble("totalTxBytes", totalTx.toDouble())
            putDouble("mobileRxBytes", mobileRx.toDouble())
            putDouble("mobileTxBytes", mobileTx.toDouble())
            putDouble("sessionRxBytes", sessionRx.toDouble())
            putDouble("sessionTxBytes", sessionTx.toDouble())
            putDouble("sessionDurationSec", sessionDuration.toDouble())
        }
        promise.resolve(result)
    }
}
