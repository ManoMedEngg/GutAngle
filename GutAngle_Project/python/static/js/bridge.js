/*
    GUTANGLE REAL-TIME BRIDGE
    Connects Android Bluetooth Service to Web Dashboard
*/

window.GutAngle = {
    data: {
        eeg: [],
        lumbar: [],
        accel: { x: 0, y: 0, z: 0 },
        resp: 0
    },
    config: {
        maxPoints: 100
    }
};

// Handle Incoming Bluetooth Data
window.onBluetoothData = function(rawLine) {
    if (!rawLine) return;
    
    // ESP32 Format: Stomach, Flex, Pitch(X), Roll(Y), Yaw(Z), BPM
    const parts = rawLine.trim().split(',');
    if (parts.length < 6) return;

    const data = {
        stomach: parseFloat(parts[0]) || 0,
        flex: parseFloat(parts[1]) || 0,
        lumbarX: parseFloat(parts[2]) || 0,
        lumbarY: parseFloat(parts[3]) || 0,
        lumbarZ: parseFloat(parts[4]) || 0,
        bpm: parseFloat(parts[5]) || 0
    };

    // Update Global State
    window.GutAngle.data = data;

    // Monitor for Alerts
    if (data.bpm > 100 || data.flex > 45) {
        if (window.Android && window.Android.playAlert) {
            window.Android.playAlert();
        }
        if (window.Android && window.Android.showNotification) {
            window.Android.showNotification("GUTANGLE ALERT", `Warning: ${data.bpm > 100 ? 'High BPM' : 'Abnormal Spine Angle'}`);
        }
    }

    // Trigger UI Update
    if (window.updateDashboardUI) {
        window.updateDashboardUI(data);
    }
};

// Handle Bluetooth Status Changes
window.onBluetoothStatus = function(status) {
    const btText = document.getElementById('bt-text');
    const btIcon = document.getElementById('bt-icon');
    
    if (btText) btText.textContent = status;
    
    if (btIcon) {
        if (status.toLowerCase().includes('connected')) {
            btIcon.style.color = 'var(--accent-cyan)';
            btIcon.classList.add('fa-spin');
        } else {
            btIcon.style.color = '#6c757d';
            btIcon.classList.remove('fa-spin');
        }
    }
};

// Interface for Web -> Java (Bluetooth Send)
window.sendToBelt = function(command) {
    if (window.AndroidBluetooth && window.AndroidBluetooth.sendBluetooth) {
        window.AndroidBluetooth.sendBluetooth(command);
    } else {
        console.log("Mock Bluetooth Send:", command);
    }
};

// Simulation Layer - DISABLED per user request (Only real ESP32 data should plot)
/*
if (!window.AndroidBluetooth) {
    console.log("GUTANGLE: Simulation Mode Available but Inactive");
}
*/

