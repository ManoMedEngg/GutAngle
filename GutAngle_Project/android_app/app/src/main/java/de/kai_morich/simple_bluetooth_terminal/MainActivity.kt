package de.kai_morich.simple_bluetooth_terminal

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.bluetooth.BluetoothAdapter
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.ServiceConnection
import android.content.pm.PackageManager
import android.bluetooth.BluetoothDevice
import android.media.RingtoneManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import android.view.View
import android.view.Window
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.NotificationCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.chaquo.python.Python
import com.chaquo.python.android.AndroidPlatform
import androidx.core.app.ActivityCompat
import java.io.File
import java.util.*
import org.json.JSONArray
import org.json.JSONObject

class MainActivity : AppCompatActivity(), ServiceConnection, SerialListener {

    private lateinit var webView: WebView
    private var service: SerialService? = null
    private var connected = false
    private val ESP32_MAC = "D4:E9:F4:A8:9C:0E"
    private val TAG = "GutAngle_Main"
    private val discoveredDevices = mutableSetOf<Pair<String, String>>()

    private val bluetoothReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            when(intent.action) {
                BluetoothDevice.ACTION_FOUND -> {
                    val device: BluetoothDevice? = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                    device?.let {
                        val name = it.name ?: "Unknown"
                        val address = it.address
                        discoveredDevices.add(name to address)
                        updateDeviceJson()
                    }
                }
            }
        }
    }

    private var appModule: com.chaquo.python.PyObject? = null

    private fun updateDeviceJson() {
        Thread {
            try {
                val jsonArray = JSONArray()
                discoveredDevices.forEach { (name, address) ->
                    val obj = JSONObject()
                    obj.put("name", name)
                    obj.put("address", address)
                    jsonArray.put(obj)
                }
                
                val py = Python.getInstance()
                if (appModule == null) {
                    appModule = py.getModule("app")
                }
                val os = py.getModule("os")
                val appFilePath = appModule?.get("__file__")?.toString() ?: ""
                val pythonDir = os?.get("path")?.callAttr("dirname", appFilePath)?.toString() ?: ""
                
                if (pythonDir.isNotEmpty()) {
                    val file = File(pythonDir, "bt_devices.json")
                    file.writeText(jsonArray.toString())
                    Log.d(TAG, "Updated bt_devices.json at $pythonDir with ${discoveredDevices.size} devices")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to update device JSON: ${e.message}")
            }
        }.start()
    }

    inner class WebAppInterface {
        @JavascriptInterface
        fun playAlert() { runOnUiThread { triggerNativeAlert() } }
        @JavascriptInterface
        fun sendBluetooth(data: String) { runOnUiThread { send(data) } }
        @JavascriptInterface
        fun showNotification(title: String, msg: String) { runOnUiThread { sendNativeNotification(title, msg) } }
        @JavascriptInterface
        fun startBluetoothScan() {
            runOnUiThread {
                val adapter = BluetoothAdapter.getDefaultAdapter()
                if (adapter != null) {
                    if (ActivityCompat.checkSelfPermission(this@MainActivity, Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
                        checkAndRequestPermissions()
                    }
                    adapter.startDiscovery()
                    Toast.makeText(this@MainActivity, "Scanning for devices...", Toast.LENGTH_SHORT).show()
                    
                    // The devices are usually found via a BroadcastReceiver. 
                    // For the sake of this bridge, we'll assume the Python side polls /api/bt_devices.
                    // We should register a receiver or update a shared list.
                }
            }
        }
        @JavascriptInterface
        fun connectToDevice(address: String) {
            runOnUiThread {
                val adapter = BluetoothAdapter.getDefaultAdapter()
                if (adapter != null) {
                    try {
                        val device = adapter.getRemoteDevice(address)
                        service?.connect(SerialSocket(applicationContext, device))
                        Toast.makeText(this@MainActivity, "Connecting to ${device.name ?: address}...", Toast.LENGTH_SHORT).show()
                    } catch (e: Exception) {
                        Log.e(TAG, "Connection failed: ${e.message}")
                    }
                }
            }
        }
        @JavascriptInterface
        fun logPythonError(error: String) { 
            runOnUiThread { 
                Log.e(TAG, "PYTHON_EXCEPTION: $error")
                Toast.makeText(this@MainActivity, "Python error: $error", Toast.LENGTH_LONG).show()
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.hide(WindowInsetsCompat.Type.systemBars())
        controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            window.attributes.layoutInDisplayCutoutMode = 
                WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
        }

        // Initialize Python & Start Flask Server
        try {
            if (!Python.isStarted()) {
                Python.start(AndroidPlatform(this))
                Log.d(TAG, "Python started successfully")
            }
            
            Thread {
                try {
                    Log.d(TAG, "Starting Flask server thread...")
                    val py = Python.getInstance()
                    val module = py.getModule("app")
                    module.callAttr("start_server")
                    Log.d(TAG, "Flask start_server called")
                } catch (e: Exception) {
                    Log.e(TAG, "Flask server crash: ${e.message}")
                    runOnUiThread { Toast.makeText(this, "Flask Error: ${e.message}", Toast.LENGTH_LONG).show() }
                    e.printStackTrace()
                }
            }.start()
        } catch (e: Exception) {
            Log.e(TAG, "Python start failed: ${e.message}")
            Toast.makeText(this, "Python Error: ${e.message}", Toast.LENGTH_LONG).show()
        }

        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        webView.apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = true
            settings.loadWithOverviewMode = true
            settings.useWideViewPort = true
            setLayerType(View.LAYER_TYPE_HARDWARE, null)
            
            webViewClient = object : WebViewClient() {
                override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                    if (request?.isForMainFrame == true) {
                        Log.w(TAG, "WebView Error: ${error?.description}")
                        Handler(Looper.getMainLooper()).postDelayed({ 
                            view?.loadUrl("http://127.0.0.1:5000/pin") 
                        }, 2000)
                    }
                }
            }
            addJavascriptInterface(WebAppInterface(), "AndroidBluetooth")
            
            // Wait 10 seconds for Flask to settle (large datasets take time to load)
            Handler(Looper.getMainLooper()).postDelayed({
                loadUrl("http://127.0.0.1:5000/pin")
                Toast.makeText(this@MainActivity, "Connecting to GutAngle...", Toast.LENGTH_SHORT).show()
            }, 10000)
        }

        checkAndRequestPermissions()
        bindService(Intent(this, SerialService::class.java), this, Context.BIND_AUTO_CREATE)
    }

    private fun checkAndRequestPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val permissions = mutableListOf<String>()
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                permissions.add(Manifest.permission.BLUETOOTH_SCAN)
                permissions.add(Manifest.permission.BLUETOOTH_CONNECT)
            } else {
                permissions.add(Manifest.permission.BLUETOOTH)
                permissions.add(Manifest.permission.BLUETOOTH_ADMIN)
                permissions.add(Manifest.permission.ACCESS_FINE_LOCATION)
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) permissions.add(Manifest.permission.POST_NOTIFICATIONS)
            
            val needed = permissions.filter { checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED }
            if (needed.isNotEmpty()) requestPermissions(needed.toTypedArray(), 1)
        }
        
        val filter = IntentFilter(BluetoothDevice.ACTION_FOUND)
        registerReceiver(bluetoothReceiver, filter)
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(bluetoothReceiver)
    }

    override fun onServiceConnected(name: ComponentName, binder: IBinder) {
        service = (binder as SerialService.SerialBinder).service
        service?.attach(this)
        // Autoconnect removed to allow manual selection via UI
    }

    override fun onServiceDisconnected(name: ComponentName) { service = null }

    private fun triggerNativeAlert() {
        val notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
        val r = RingtoneManager.getRingtone(applicationContext, notification)
        if (!r.isPlaying) r.play()
        Timer().schedule(object : TimerTask() { override fun run() { r.stop() } }, 1500)
    }

    private fun sendNativeNotification(title: String, msg: String) {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "gutangle_alerts"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            manager.createNotificationChannel(NotificationChannel(channelId, "GutAngle Alerts", NotificationManager.IMPORTANCE_HIGH))
        }
        val builder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(msg)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
        manager.notify(Random().nextInt(), builder.build())
    }

    override fun onSerialConnect() { connected = true; injectJs("if(window.onBluetoothStatus) window.onBluetoothStatus('Connected');") }
    override fun onSerialConnectError(e: Exception?) { connected = false; injectJs("if(window.onBluetoothStatus) window.onBluetoothStatus('Failed');") }
    override fun onSerialRead(data: ByteArray) { injectJs("if(window.onBluetoothData) window.onBluetoothData('${String(data).replace("'", "\\'")}');") }
    override fun onSerialRead(datas: ArrayDeque<ByteArray>?) { datas?.forEach { onSerialRead(it) } }
    override fun onSerialIoError(e: Exception?) { connected = false; injectJs("if(window.onBluetoothStatus) window.onBluetoothStatus('Disconnected');") }

    private fun send(str: String) { if (connected) service?.write("${str}\r\n".toByteArray()) }
    private fun injectJs(js: String) { runOnUiThread { webView.evaluateJavascript(js, null) } }
}
