// Dashboard Functionality (User-Scoped Readings)
document.addEventListener('DOMContentLoaded', function () {
    let eegChart = null;
    let lumbarChart = null;
    let pollTimer = null;
    let streamTimer = null;
    let sessionTimer = null;
    let sessionSeconds = 0;
    let isSessionActive = false;
    let currentSessionId = null;
    let streamPhase = 0;

    function initDashboard() {
        applyCurrentUserToHeader();
        initializeCharts();
        setupEventListeners();
        updateDateTime();
        loadReadings();
        startReadingsPolling();
        startLiveWaves();
    }

    function applyCurrentUserToHeader() {
        const header = document.querySelector('.top-bar');
        if (!header) return;

        const userName = header.dataset.userName || 'User';
        const userId = header.dataset.userId || 'N/A';
        const userAge = header.dataset.userAge || 'N/A';

        const patientName = document.getElementById('current-patient');
        const patientId = document.getElementById('current-patient-id');
        const patientAge = document.getElementById('current-patient-age');

        if (patientName) patientName.textContent = userName;
        if (patientId) patientId.textContent = userId;
        if (patientAge) patientAge.textContent = userAge;
    }

    function initializeCharts() {
        const eegCtx = document.getElementById('eeg-chart');
        const lumbarCtx = document.getElementById('lumbar-chart');
        if (!eegCtx || !lumbarCtx) return;

        eegChart = new Chart(eegCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: 'Channel Fp1', data: [], borderColor: '#00D4FF', borderWidth: 2, tension: 0.25 },
                    { label: 'Channel Fp2', data: [], borderColor: '#FF6B6B', borderWidth: 2, tension: 0.25 },
                    { label: 'Channel C3', data: [], borderColor: '#4ECDC4', borderWidth: 2, tension: 0.25 },
                    { label: 'Channel C4', data: [], borderColor: '#FFD166', borderWidth: 2, tension: 0.25 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        ticks: { color: '#888' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        ticks: {
                            color: '#888',
                            callback: function (value) { return value + 'μV'; }
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                },
                plugins: { legend: { labels: { color: '#888' } } }
            }
        });

        lumbarChart = new Chart(lumbarCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Lumbar Angle',
                    data: [],
                    borderColor: '#DC2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderWidth: 2,
                    tension: 0.25,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        ticks: { color: '#888' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        min: -10,
                        max: 45,
                        ticks: {
                            color: '#888',
                            callback: function (value) { return value + '°'; }
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    async function loadReadings() {
        try {
            const res = await fetch('/api/readings?limit=100', { credentials: 'same-origin' });
            if (!res.ok) return;

            const readings = await res.json();
            renderReadings(readings);
        } catch (err) {
            console.error('Failed to load readings', err);
        }
    }

    function renderReadings(readings) {
        if (!eegChart || !lumbarChart) return;

        const labels = readings.map((r) => formatTime(r.captured_at));
        eegChart.data.labels = labels;
        eegChart.data.datasets[0].data = readings.map((r) => Number(r.eeg_fp1));
        eegChart.data.datasets[1].data = readings.map((r) => Number(r.eeg_fp2));
        eegChart.data.datasets[2].data = readings.map((r) => Number(r.eeg_c3));
        eegChart.data.datasets[3].data = readings.map((r) => Number(r.eeg_c4));
        eegChart.update('none');

        lumbarChart.data.labels = labels;
        lumbarChart.data.datasets[0].data = readings.map((r) => Number(r.lumbar_angle));
        lumbarChart.update('none');

        if (readings.length > 0) {
            const latest = readings[readings.length - 1];
            updateMetricsFromReading(latest);
        }
    }

    function updateMetricsFromReading(reading) {
        const lumbarAngle = Number(reading.lumbar_angle);
        const eegValues = [Number(reading.eeg_fp1), Number(reading.eeg_fp2), Number(reading.eeg_c3), Number(reading.eeg_c4)];
        const amplitude = eegValues.reduce((sum, val) => sum + Math.abs(val), 0) / eegValues.length;

        const angleDisplay = document.getElementById('current-angle');
        const lumbarAngleElement = document.getElementById('lumbar-angle');
        const lumbarMax = document.getElementById('lumbar-max');
        const eegAmplitude = document.getElementById('eeg-amplitude');

        if (angleDisplay) angleDisplay.textContent = `${lumbarAngle.toFixed(1)}°`;
        if (lumbarAngleElement) {
            lumbarAngleElement.textContent = `${lumbarAngle.toFixed(1)}°`;
            lumbarAngleElement.className = `metric-value ${getLumbarStatusClass(lumbarAngle)}`;
        }
        if (eegAmplitude) eegAmplitude.textContent = `${amplitude.toFixed(1)} μV`;

        if (lumbarMax) {
            const currentMax = parseFloat(lumbarMax.textContent) || lumbarAngle;
            if (lumbarAngle > currentMax) lumbarMax.textContent = `${lumbarAngle.toFixed(1)}°`;
        }

        updateSpineVisualization(lumbarAngle);
    }

    function getLumbarStatusClass(angle) {
        if (angle >= 28) return 'critical';
        if (angle >= 18) return 'warning';
        return 'safe';
    }

    function updateSpineVisualization(angle) {
        const spine = document.getElementById('spine-angle');
        const angleDisplay = document.getElementById('current-angle');
        if (spine) {
            spine.style.transform = `rotate(${Math.max(-10, Math.min(40, angle))}deg)`;
        }

        if (angleDisplay) {
            angleDisplay.style.color = angle >= 28 ? '#ef4444' : angle >= 18 ? '#f59e0b' : '#22c55e';
        }
    }

    function startLiveWaves() {
        if (!eegChart || !lumbarChart) return;
        clearInterval(streamTimer);

        streamTimer = setInterval(() => {
            streamPhase += 0.14;
            const now = new Date();
            const label = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            const fp1 = 28 * Math.sin(streamPhase * 1.2) + 8 * Math.sin(streamPhase * 4.8) + (Math.random() - 0.5) * 6;
            const fp2 = 24 * Math.sin(streamPhase * 1.25 + 0.8) + 7 * Math.sin(streamPhase * 4.5) + (Math.random() - 0.5) * 6;
            const c3 = 20 * Math.sin(streamPhase * 1.05 + 1.6) + 6 * Math.sin(streamPhase * 3.8) + (Math.random() - 0.5) * 5;
            const c4 = 22 * Math.sin(streamPhase * 1.1 + 2.2) + 6 * Math.sin(streamPhase * 4.1) + (Math.random() - 0.5) * 5;

            const lumbarAngle = 14 + 6 * Math.sin(streamPhase * 0.45) + 2.5 * Math.sin(streamPhase * 1.2) + (Math.random() - 0.5) * 1.2;

            appendPoint(label, fp1, fp2, c3, c4, lumbarAngle);
            updateDynamicMetrics(fp1, fp2, c3, c4, lumbarAngle);
        }, 200);
    }

    function appendPoint(label, fp1, fp2, c3, c4, lumbarAngle) {
        const maxPoints = 120;

        eegChart.data.labels.push(label);
        eegChart.data.datasets[0].data.push(fp1);
        eegChart.data.datasets[1].data.push(fp2);
        eegChart.data.datasets[2].data.push(c3);
        eegChart.data.datasets[3].data.push(c4);

        if (eegChart.data.labels.length > maxPoints) {
            eegChart.data.labels.shift();
            eegChart.data.datasets.forEach((d) => d.data.shift());
        }
        eegChart.update('none');

        lumbarChart.data.labels.push(label);
        lumbarChart.data.datasets[0].data.push(lumbarAngle);
        if (lumbarChart.data.labels.length > maxPoints) {
            lumbarChart.data.labels.shift();
            lumbarChart.data.datasets[0].data.shift();
        }
        lumbarChart.update('none');
    }

    function updateDynamicMetrics(fp1, fp2, c3, c4, lumbarAngle) {
        const reading = {
            eeg_fp1: fp1,
            eeg_fp2: fp2,
            eeg_c3: c3,
            eeg_c4: c4,
            lumbar_angle: lumbarAngle
        };
        updateMetricsFromReading(reading);

        const eegQuality = document.getElementById('eeg-quality');
        const eegNoise = document.getElementById('eeg-noise');
        const eegBand = document.getElementById('eeg-dominant-band');
        const lumbarFreq = document.getElementById('lumbar-freq');

        const quality = 88 + Math.random() * 11;
        if (eegQuality) {
            eegQuality.textContent = `${quality.toFixed(1)}%`;
            eegQuality.className = `metric-value ${quality >= 95 ? 'good' : quality >= 90 ? 'warning' : 'critical'}`;
        }
        if (eegNoise) eegNoise.textContent = `${(1.2 + Math.random() * 2.3).toFixed(1)}%`;
        if (eegBand) eegBand.textContent = 'Gastric Slow Wave (2-4 cpm)';
        if (lumbarFreq) lumbarFreq.textContent = `${(0.15 + Math.random() * 0.15).toFixed(2)} Hz`;
    }

    function formatTime(isoTime) {
        const dt = new Date(isoTime);
        return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function startReadingsPolling() {
        clearInterval(pollTimer);
        pollTimer = setInterval(loadReadings, 5000);
    }

    async function startSession() {
        if (isSessionActive) return;

        try {
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ data_type: ['EEG', 'Lumbar'], notes: 'Started from dashboard' })
            });

            if (!res.ok) return;
            const data = await res.json();

            currentSessionId = data.session_id;
            isSessionActive = true;
            sessionSeconds = 0;

            const statusBadge = document.getElementById('session-status');
            const statusText = document.getElementById('session-status-text');
            if (statusBadge && statusText) {
                statusBadge.className = 'status-badge active';
                statusText.textContent = 'Active Session';
            }

            clearInterval(sessionTimer);
            sessionTimer = setInterval(() => {
                sessionSeconds += 1;
                const hours = Math.floor(sessionSeconds / 3600);
                const minutes = Math.floor((sessionSeconds % 3600) / 60);
                const seconds = sessionSeconds % 60;
                const text = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                const durationElement = document.getElementById('session-duration');
                const kpiDuration = document.getElementById('kpi-duration');
                if (durationElement) durationElement.textContent = text;
                if (kpiDuration) kpiDuration.textContent = text;
            }, 1000);
        } catch (err) {
            console.error('Failed to start session', err);
        }
    }

    function exportData() {
        const payload = {
            exported_at: new Date().toISOString(),
            session_id: currentSessionId,
            eeg: eegChart ? eegChart.data.datasets.map((d) => ({ channel: d.label, values: d.data })) : [],
            lumbar: lumbarChart ? lumbarChart.data.datasets[0].data : []
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gutangle-readings-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function setupEventListeners() {
        const startSessionBtn = document.getElementById('start-session');
        const exportDataBtn = document.getElementById('export-data');
        if (startSessionBtn) startSessionBtn.addEventListener('click', startSession);
        if (exportDataBtn) exportDataBtn.addEventListener('click', exportData);
    }

    function updateDateTime() {
        const dateElement = document.getElementById('current-date');
        const timeElement = document.getElementById('current-time');

        const tick = () => {
            const now = new Date();
            if (dateElement) dateElement.textContent = now.toLocaleDateString();
            if (timeElement) timeElement.textContent = now.toLocaleTimeString();
        };

        tick();
        setInterval(tick, 1000);
    }

    initDashboard();
});
