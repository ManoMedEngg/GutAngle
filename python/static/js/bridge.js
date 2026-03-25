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
    
    // Typical format: EGG1,EGG2,ACCX,ACCY,ACCZ,BENDING,RESP
    const parts = rawLine.trim().split(',');
    if (parts.length < 5) return;

    const timestamp = Date.now();
    const data = {
        egg1: parseFloat(parts[0]) || 0,
        egg2: parseFloat(parts[1]) || 0,
        accX: parseFloat(parts[2]) || 0,
        accY: parseFloat(parts[3]) || 0,
        accZ: parseFloat(parts[4]) || 0,
        bending: parseFloat(parts[5]) || 0,
        resp: parseFloat(parts[6]) || 0
    };

    // Update Global State
    window.GutAngle.data = data;

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

// Simulation Layer for Demo/Local Testing
if (!window.AndroidBluetooth) {
    console.log("GUTANGLE: Simulation Mode Active");
    let phase = 0;
    setInterval(() => {
        phase += 0.1;
        const egg1 = 400 + Math.sin(phase) * 100 + (Math.random() * 20);
        const egg2 = 380 + Math.cos(phase * 0.8) * 120 + (Math.random() * 20);
        const accX = Math.sin(phase * 0.5) * 0.5;
        const accY = Math.cos(phase * 0.3) * 0.8;
        const accZ = 0.9 + Math.sin(phase * 0.2) * 0.1;
        const bending = 15 + Math.sin(phase * 0.4) * 10;
        const resp = 14 + Math.sin(phase * 0.2) * 4;

        // Simulate CSV packet from ESP32
        const mockPacket = `${egg1},${egg2},${accX},${accY},${accZ},${bending},${resp}`;
        window.onBluetoothData(mockPacket);
    }, 100); // 10Hz simulation
}

