
// GUTANGLE NEXUS DASHBOARD LOGIC
let eegChart = null;
let maxPoints = 150;
let eegBuffer = [];
let isSessionActive = false;
let sessionStartTime = null;

function initNexus() {
    initCharts();
    setupNexusEvents();
    startClock();
}

function initCharts() {
    const ctx = document.getElementById('eeg-chart');
    if (!ctx) return;

    eegChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(maxPoints).fill(''),
            datasets: [
                {
                    label: 'Sync Stream',
                    data: Array(maxPoints).fill(0),
                    borderColor: '#00F2FF',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: {
                        target: 'origin',
                        above: 'rgba(0, 242, 255, 0.05)'
                    }
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: { display: false },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10 } },
                    suggestedMin: -50,
                    suggestedMax: 50
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Called by bridge.js
window.updateDashboardUI = function(data) {
    if (!eegChart) return;

    // Update Chart (Stomach Activity / EGG)
    eegChart.data.datasets[0].data.push(data.stomach);
    eegChart.data.datasets[0].data.shift();
    eegChart.update('none');

    // Update Raw Metrics
    updateMetric('egg-rms-val', Math.abs(data.stomach).toFixed(2));
    updateMetric('resp-val', Math.abs(data.bpm).toFixed(0));
    updateMetric('lumbar-angle-val', data.flex.toFixed(1));
    
    // Animate Spine
    // We use lumbarX (Pitch) as the primary visual tilt, 
    // but the bending metric shows the Flex sensor value.
    updateSpine(data.lumbarX);

    // Alert Logic
    if (data.flex > 30 || Math.abs(data.lumbarX) > 45) {
        addEvent('CRITICAL', 'Hyper-flexion or Poor Posture detected');
        updateMetric('alert-val', '1', '#FF003C');
    } else {
        updateMetric('alert-val', '0', 'white');
    }
};

function updateMetric(id, val, color) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = val;
    if (color) el.style.color = color;
}

function updateSpine(angle) {
    const path = document.getElementById('spine-svg-path');
    if (!path) return;
    
    // Map angle (0-45) to SVG Quad Curve control point
    // Neutral: M50,180 Q50,90 50,20
    const cx = 50 + (angle * 1.5); // Tilt control point
    const tx = 50 + (angle * 0.5); // Tilt tip
    path.setAttribute('d', `M50,180 Q${cx},90 ${tx},20`);
    
    const status = document.getElementById('tilt-status');
    if (status) {
        if (angle > 30) {
            status.textContent = 'CRITICAL';
            status.style.color = '#FF003C';
        } else if (angle > 15) {
            status.textContent = 'WARNING';
            status.style.color = '#FFAA00';
        } else {
            status.textContent = 'NOMINAL';
            status.style.color = '#00FF00';
        }
    }
}

function addEvent(type, msg) {
    const feed = document.getElementById('event-feed');
    if (!feed) return;

    // Remove placeholder
    if (feed.innerText.includes('Waiting')) feed.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'glass-panel';
    div.style.padding = '10px';
    div.style.fontSize = '0.75rem';
    div.style.borderLeft = `3px solid ${type === 'CRITICAL' ? '#FF003C' : '#00F2FF'}`;
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <strong style="color:${type === 'CRITICAL' ? '#FF003C' : '#00F2FF'}">${type}</strong>
            <span style="opacity:0.5">${new Date().toLocaleTimeString()}</span>
        </div>
        <div>${msg}</div>
    `;
    feed.prepend(div);

    if (feed.children.length > 5) feed.removeChild(feed.lastChild);
}

function setupNexusEvents() {
    const startBtn = document.getElementById('start-session-btn');
    if (startBtn) {
        startBtn.onclick = () => {
            isSessionActive = !isSessionActive;
            startBtn.textContent = isSessionActive ? 'End Session' : 'Initialize Optima';
            if (isSessionActive) {
                sessionStartTime = Date.now();
                addEvent('SYSTEM', 'Bio-Sync Session Initiated');
            } else {
                addEvent('SYSTEM', 'Data Stream Finalized');
            }
        };
    }
}

function startClock() {
    // Hidden in this design but useful for logic
}

window.initNexus = initNexus;

