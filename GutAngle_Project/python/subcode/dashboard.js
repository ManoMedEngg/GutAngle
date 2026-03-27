// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
        showView('login');
        return;
    }

    // ============================================
    // 1. INITIALIZE DASHBOARD
    // ============================================
    let eegChart = null;
    let lumbarChart = null;
    let sessionTimer = null;
    let sessionSeconds = 0;
    let isSessionActive = false;
    let isEegPaused = false;
    let currentSessionId = null;
    
    // User data from localStorage
    let currentUser = null;
    
    function initDashboard() {
        loadUserData();
        initializeCharts();
        setupEventListeners();
        updateDateTime();
        loadDefaultAlerts();
        loadDefaultPatients();
        simulateRealTimeData();
        
        // Start with dashboard page
        navigateToPage('dashboard');
    }
    
    function loadUserData() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            
            // Update UI with user data
            const userNameElement = document.getElementById('user-name');
            if (userNameElement && currentUser.name) {
                userNameElement.textContent = currentUser.name;
            }
            
            const userRoleElement = document.getElementById('user-role');
            if (userRoleElement) {
                userRoleElement.textContent = 'Clinician';
            }
        }
    }
    
    // ============================================
    // 2. CHART INITIALIZATION
    // ============================================
    function initializeCharts() {
        // EEG Chart
        const eegCtx = document.getElementById('eeg-chart').getContext('2d');
        eegChart = new Chart(eegCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 100}, (_, i) => i * 0.1),
                datasets: [
                    {
                        label: 'Channel Fp1',
                        data: Array.from({length: 100}, () => Math.random() * 100 - 50),
                        borderColor: '#00D4FF',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Channel Fp2',
                        data: Array.from({length: 100}, () => Math.random() * 100 - 50),
                        borderColor: '#FF6B6B',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Channel C3',
                        data: Array.from({length: 100}, () => Math.random() * 100 - 50),
                        borderColor: '#4ECDC4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Channel C4',
                        data: Array.from({length: 100}, () => Math.random() * 100 - 50),
                        borderColor: '#FFD166',
                        backgroundColor: 'rgba(255, 209, 102, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#888',
                            callback: function(value) {
                                return value + 's';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Time (seconds)',
                            color: '#888'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#888',
                            callback: function(value) {
                                return value + 'μV';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Amplitude (μV)',
                            color: '#888'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#888',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff'
                    }
                }
            }
        });
        
        // Lumbar Chart
        const lumbarCtx = document.getElementById('lumbar-chart').getContext('2d');
        lumbarChart = new Chart(lumbarCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 50}, (_, i) => i),
                datasets: [{
                    label: 'Lumbar Angle',
                    data: Array.from({length: 50}, () => 15 + Math.random() * 10),
                    borderColor: '#DC2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#888'
                        }
                    },
                    y: {
                        min: -10,
                        max: 45,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#888',
                            callback: function(value) {
                                return value + '°';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // ============================================
    // 3. REAL-TIME DATA SIMULATION
    // ============================================
    function simulateRealTimeData() {
        let timeIndex = 100;
        let lumbarIndex = 50;
        
        setInterval(() => {
            if (!isEegPaused && isSessionActive) {
                // Update EEG data
                eegChart.data.datasets.forEach(dataset => {
                    const lastValue = dataset.data[dataset.data.length - 1];
                    const newValue = lastValue + (Math.random() - 0.5) * 10;
                    dataset.data.push(newValue);
                    dataset.data.shift();
                });
                
                // Update labels
                eegChart.data.labels.push((timeIndex * 0.1).toFixed(1));
                eegChart.data.labels.shift();
                timeIndex++;
                
                // Update lumbar data
                const lastLumbarValue = lumbarChart.data.datasets[0].data[lumbarChart.data.datasets[0].data.length - 1];
                let newLumbarValue = lastLumbarValue + (Math.random() - 0.5) * 2;
                newLumbarValue = Math.max(-5, Math.min(40, newLumbarValue));
                
                lumbarChart.data.datasets[0].data.push(newLumbarValue);
                lumbarChart.data.datasets[0].data.shift();
                
                lumbarChart.data.labels.push(lumbarIndex.toString());
                lumbarChart.data.labels.shift();
                lumbarIndex++;
                
                // Update charts
                eegChart.update('none');
                lumbarChart.update('none');
                
                // Update spine visualization
                updateSpineAngle(newLumbarValue);
                
                // Update metrics
                updateMetrics(newLumbarValue);
                
                // Random alerts
                if (Math.random() < 0.02 && isSessionActive) {
                    generateRandomAlert();
                }
            }
        }, 100);
    }
    
    function updateSpineAngle(angle) {
        const spineElement = document.getElementById('spine-angle');
        const angleDisplay = document.getElementById('current-angle');
        const lumbarAngleElement = document.getElementById('lumbar-angle');
        
        if (spineElement && angleDisplay && lumbarAngleElement) {
            spineElement.style.transform = `rotate(${angle}deg)`;
            angleDisplay.textContent = `${angle.toFixed(1)}°`;
            lumbarAngleElement.textContent = `${angle.toFixed(1)}°`;
            
            // Update color based on angle
            if (angle > 30) {
                angleDisplay.style.color = '#ef4444';
                lumbarAngleElement.className = 'metric-value critical';
            } else if (angle > 20) {
                angleDisplay.style.color = '#f59e0b';
                lumbarAngleElement.className = 'metric-value warning';
            } else {
                angleDisplay.style.color = '#22c55e';
                lumbarAngleElement.className = 'metric-value safe';
            }
        }
    }
    
    function updateMetrics(lumbarAngle) {
        // Update EEG metrics randomly
        const eegQuality = document.getElementById('eeg-quality');
        if (eegQuality) {
            const quality = 85 + Math.random() * 14;
            eegQuality.textContent = `${quality.toFixed(1)}%`;
            eegQuality.className = quality > 90 ? 'metric-value good' : 
                                   quality > 80 ? 'metric-value warning' : 'metric-value critical';
        }
        
        // Update lumbar metrics
        const lumbarMax = document.getElementById('lumbar-max');
        if (lumbarMax) {
            const currentMax = parseFloat(lumbarMax.textContent);
            if (lumbarAngle > currentMax) {
                lumbarMax.textContent = `${lumbarAngle.toFixed(1)}°`;
            }
        }
        
        const lumbarFreq = document.getElementById('lumbar-freq');
        if (lumbarFreq) {
            lumbarFreq.textContent = `${(0.15 + Math.random() * 0.1).toFixed(2)} Hz`;
        }
    }
    
    // ============================================
    // 4. ALERT SYSTEM
    // ============================================
    function loadDefaultAlerts() {
        const alerts = [
            {
                id: 1,
                type: 'critical',
                title: 'EEG Signal Lost',
                message: 'Signal quality dropped below 20% for channel Fp1',
                time: '14:32',
                acknowledged: false
            },
            {
                id: 2,
                type: 'warning',
                title: 'Lumbar Angle >25°',
                message: 'Patient lumbar angle exceeded threshold for 2 minutes',
                time: '14:30',
                acknowledged: false
            },
            {
                id: 3,
                type: 'info',
                title: 'Artefact Detected',
                message: 'Muscle artefact detected in EEG signal - automatic filtering applied',
                time: '14:28',
                acknowledged: false
            }
        ];
        
        alerts.forEach(alert => addAlertToPanel(alert));
        
        // Update notification count
        updateNotificationCount();
    }
    
    function generateRandomAlert() {
        const alertTypes = [
            {
                type: 'critical',
                title: 'EEG Signal Lost',
                message: 'Signal quality dropped below threshold',
                icon: 'exclamation-circle'
            },
            {
                type: 'warning',
                title: 'Lumbar Angle Alert',
                message: 'Patient position exceeds recommended limit',
                icon: 'exclamation-triangle'
            },
            {
                type: 'info',
                title: 'Artefact Detected',
                message: 'Muscle artefact detected and filtered',
                icon: 'info-circle'
            }
        ];
        
        const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const newAlert = {
            id: Date.now(),
            type: alert.type,
            title: alert.title,
            message: alert.message,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            acknowledged: false
        };
        
        addAlertToPanel(newAlert);
        updateNotificationCount();
        
        // Send SMS/WhatsApp notification
        sendAlertNotification(newAlert);
    }
    
    function addAlertToPanel(alert) {
        const alertsList = document.getElementById('alerts-list');
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item ${alert.type}`;
        alertItem.dataset.id = alert.id;
        alertItem.innerHTML = `
            <div class="alert-icon">
                <i class="fas fa-${alert.type === 'critical' ? 'exclamation-circle' : 
                                   alert.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div class="alert-content">
                <div class="alert-title">
                    <strong>${alert.title}</strong>
                    <span class="alert-time">${alert.time}</span>
                </div>
                <p class="alert-message">${alert.message}</p>
                <div class="alert-actions">
                    <button class="btn-sm acknowledge-alert" data-id="${alert.id}">Acknowledge</button>
                    <button class="btn-sm snooze-alert" data-id="${alert.id}">Snooze</button>
                    ${alert.type === 'critical' ? '<button class="btn-sm escalate-alert" data-id="' + alert.id + '">Escalate</button>' : ''}
                </div>
            </div>
        `;
        
        alertsList.insertBefore(alertItem, alertsList.firstChild);
        
        // Add event listeners for alert buttons
        alertItem.querySelector('.acknowledge-alert').addEventListener('click', function() {
            acknowledgeAlert(alert.id);
        });
        
        alertItem.querySelector('.snooze-alert').addEventListener('click', function() {
            snoozeAlert(alert.id);
        });
        
        if (alert.type === 'critical') {
            alertItem.querySelector('.escalate-alert').addEventListener('click', function() {
                escalateAlert(alert.id);
            });
        }
    }
    
    function updateNotificationCount() {
        const alertItems = document.querySelectorAll('.alert-item:not(.acknowledged)');
        const notificationCount = document.getElementById('notification-count');
        if (notificationCount) {
            notificationCount.textContent = alertItems.length;
            notificationCount.style.display = alertItems.length > 0 ? 'flex' : 'none';
        }
    }
    
    function acknowledgeAlert(alertId) {
        const alertItem = document.querySelector(`.alert-item[data-id="${alertId}"]`);
        if (alertItem) {
            alertItem.classList.add('acknowledged');
            alertItem.style.opacity = '0.6';
            updateNotificationCount();
        }
    }
    
    function snoozeAlert(alertId) {
        const alertItem = document.querySelector(`.alert-item[data-id="${alertId}"]`);
        if (alertItem) {
            alertItem.style.display = 'none';
            setTimeout(() => {
                alertItem.style.display = 'flex';
            }, 300000); // 5 minutes
        }
    }
    
    function escalateAlert(alertId) {
        alert(`Alert ${alertId} escalated to supervisor.`);
    }
    
    function sendAlertNotification(alert) {
        // Simulate sending SMS/WhatsApp
        const alertModal = document.getElementById('alert-modal-overlay');
        const alertDetails = document.getElementById('alert-details-text');
        
        if (alertModal && alertDetails) {
            alertDetails.textContent = `${alert.title}: ${alert.message} at ${alert.time}`;
            alertModal.style.display = 'flex';
            
            // Auto-close after 5 seconds
            setTimeout(() => {
                alertModal.style.display = 'none';
            }, 5000);
        }
        
        // In production, this would integrate with:
        // 1. Twilio API for SMS
        // 2. WhatsApp Business API
        // 3. Firebase Cloud Messaging
    }
    
    // ============================================
    // 5. SESSION MANAGEMENT
    // ============================================
    function startSession() {
        if (!isSessionActive) {
            isSessionActive = true;
            sessionSeconds = 0;
            
            // Update UI
            const statusBadge = document.getElementById('session-status');
            const statusText = document.getElementById('session-status-text');
            if (statusBadge && statusText) {
                statusBadge.className = 'status-badge active';
                statusText.textContent = 'Active Session';
            }
            
            // Start timer
            sessionTimer = setInterval(() => {
                sessionSeconds++;
                const hours = Math.floor(sessionSeconds / 3600);
                const minutes = Math.floor((sessionSeconds % 3600) / 60);
                const seconds = sessionSeconds % 60;
                
                const durationElement = document.getElementById('session-duration');
                const kpiDuration = document.getElementById('kpi-duration');
                
                if (durationElement) {
                    durationElement.textContent = 
                        `${hours.toString().padStart(2, '0')}:` +
                        `${minutes.toString().padStart(2, '0')}:` +
                        `${seconds.toString().padStart(2, '0')}`;
                }
                
                if (kpiDuration) {
                    kpiDuration.textContent = 
                        `${hours.toString().padStart(2, '0')}:` +
                        `${minutes.toString().padStart(2, '0')}:` +
                        `${seconds.toString().padStart(2, '0')}`;
                }
            }, 1000);
            
            // Generate session ID
            currentSessionId = `SESS-${Date.now()}`;
            
            alert('New monitoring session started.');
        }
    }
    
    function pauseSession() {
        if (isSessionActive) {
            isSessionActive = false;
            clearInterval(sessionTimer);
            
            // Update UI
            const statusBadge = document.getElementById('session-status');
            const statusText = document.getElementById('session-status-text');
            if (statusBadge && statusText) {
                statusBadge.className = 'status-badge paused';
                statusText.textContent = 'Paused Session';
            }
            
            alert('Session paused.');
        }
    }
    
    function stopSession() {
        if (isSessionActive || sessionTimer) {
            isSessionActive = false;
            clearInterval(sessionTimer);
            sessionTimer = null;
            
            // Update UI
            const statusBadge = document.getElementById('session-status');
            const statusText = document.getElementById('session-status-text');
            if (statusBadge && statusText) {
                statusBadge.className = 'status-badge stopped';
                statusText.textContent = 'Stopped Session';
            }
            
            // Save session data
            saveSessionData();
            
            alert('Session stopped and data saved.');
        }
    }
    
    function saveSessionData() {
        if (currentSessionId) {
            const sessionData = {
                id: currentSessionId,
                duration: sessionSeconds,
                startTime: new Date(Date.now() - sessionSeconds * 1000).toISOString(),
                endTime: new Date().toISOString(),
                alerts: Array.from(document.querySelectorAll('.alert-item')).map(item => ({
                    type: item.classList.contains('critical') ? 'critical' : 
                          item.classList.contains('warning') ? 'warning' : 'info',
                    title: item.querySelector('strong').textContent,
                    time: item.querySelector('.alert-time').textContent
                }))
            };
            
            // Save to localStorage
            const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
            sessions.push(sessionData);
            localStorage.setItem('sessions', JSON.stringify(sessions));
            
            currentSessionId = null;
        }
    }
    
    // ============================================
    // 6. PATIENT MANAGEMENT
    // ============================================
    function loadDefaultPatients() {
        const patients = [
            { id: 'P-001', name: 'John Doe', age: 45, lastSession: '2024-01-15', status: 'active' },
            { id: 'P-002', name: 'Jane Smith', age: 32, lastSession: '2024-01-14', status: 'active' },
            { id: 'P-003', name: 'Robert Johnson', age: 58, lastSession: '2024-01-13', status: 'inactive' },
            { id: 'P-004', name: 'Emily Davis', age: 29, lastSession: '2024-01-12', status: 'active' }
        ];
        
        // Populate patient filter
        const patientFilter = document.getElementById('patient-filter');
        if (patientFilter) {
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = `${patient.name} (${patient.id})`;
                patientFilter.appendChild(option);
            });
        }
    }
    
    // ============================================
    // 7. NAVIGATION & PAGE MANAGEMENT
    // ============================================
    function navigateToPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Deactivate all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected page
        const pageElement = document.getElementById(`page-${pageName}`);
        if (pageElement) {
            pageElement.classList.add('active');
        }
        
        // Activate corresponding nav item
        const navItem = document.querySelector(`.nav-item[data-page="${pageName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
    }
    
    // ============================================
    // 8. EVENT LISTENERS SETUP
    // ============================================
    function setupEventListeners() {
        // Sidebar Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                const page = this.dataset.page;
                navigateToPage(page);
            });
        });
        
        // Session Controls
        const startSessionBtn = document.getElementById('start-session');
        const pauseSessionBtn = document.getElementById('pause-session');
        const stopSessionBtn = document.getElementById('stop-session');
        
        if (startSessionBtn) startSessionBtn.addEventListener('click', startSession);
        if (pauseSessionBtn) pauseSessionBtn.addEventListener('click', pauseSession);
        if (stopSessionBtn) stopSessionBtn.addEventListener('click', stopSession);
        
        // EEG Controls
        const pauseEegBtn = document.getElementById('pause-eeg');
        if (pauseEegBtn) {
            pauseEegBtn.addEventListener('click', function() {
                isEegPaused = !isEegPaused;
                this.innerHTML = isEegPaused ? 
                    '<i class="fas fa-play"></i>' : 
                    '<i class="fas fa-pause"></i>';
            });
        }
        
        // Zoom Controls
        const zoomInEeg = document.getElementById('zoom-in-eeg');
        const zoomOutEeg = document.getElementById('zoom-out-eeg');
        const eegTimeWindow = document.getElementById('eeg-time-window');
        
        if (zoomInEeg) {
            zoomInEeg.addEventListener('click', () => {
                // Implement zoom in logic
                console.log('Zoom in EEG');
            });
        }
        
        if (zoomOutEeg) {
            zoomOutEeg.addEventListener('click', () => {
                // Implement zoom out logic
                console.log('Zoom out EEG');
            });
        }
        
        if (eegTimeWindow) {
            eegTimeWindow.addEventListener('change', (e) => {
                console.log('Time window changed to:', e.target.value);
            });
        }
        
        // Alert Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                // Filter alerts
                filterAlerts(filter);
            });
        });
        
        // Quick Actions
        const exportDataBtn = document.getElementById('export-data');
        const addPatientBtn = document.getElementById('add-patient');
        const goSettingsBtn = document.getElementById('go-settings');
        
        if (exportDataBtn) exportDataBtn.addEventListener('click', exportData);
        if (addPatientBtn) addPatientBtn.addEventListener('click', showAddPatientModal);
        if (goSettingsBtn) goSettingsBtn.addEventListener('click', () => navigateToPage('settings'));
        
        // Notifications
        const notificationBtn = document.getElementById('notification-btn');
        const closeNotificationsBtn = document.getElementById('close-notifications');
        
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                document.getElementById('notifications-panel').classList.add('active');
            });
        }
        
        if (closeNotificationsBtn) {
            closeNotificationsBtn.addEventListener('click', () => {
                document.getElementById('notifications-panel').classList.remove('active');
            });
        }
        
        // User Menu
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userMenuDropdown = document.getElementById('user-menu-dropdown');
        const logoutLink = document.getElementById('logout-link');
        
        if (userMenuBtn && userMenuDropdown) {
            userMenuBtn.addEventListener('click', () => {
                userMenuDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuBtn.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                    userMenuDropdown.classList.remove('show');
                }
            });
        }
        
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
        
        // Sidebar logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
        
        // Voice Control
        const voiceToggleBtn = document.getElementById('voice-toggle');
        const closeVoiceBtn = document.getElementById('close-voice');
        
        if (voiceToggleBtn) {
            voiceToggleBtn.addEventListener('click', () => {
                document.getElementById('voice-control-overlay').style.display = 'flex';
            });
        }
        
        if (closeVoiceBtn) {
            closeVoiceBtn.addEventListener('click', () => {
                document.getElementById('voice-control-overlay').style.display = 'none';
            });
        }
        
        // Alert Modal
        const closeAlertModal = document.getElementById('close-alert-modal');
        const dismissAlert = document.getElementById('dismiss-alert');
        const viewAlert = document.getElementById('view-alert');
        
        if (closeAlertModal) {
            closeAlertModal.addEventListener('click', () => {
                document.getElementById('alert-modal-overlay').style.display = 'none';
            });
        }
        
        if (dismissAlert) {
            dismissAlert.addEventListener('click', () => {
                document.getElementById('alert-modal-overlay').style.display = 'none';
            });
        }
        
        if (viewAlert) {
            viewAlert.addEventListener('click', () => {
                document.getElementById('alert-modal-overlay').style.display = 'none';
                navigateToPage('history');
            });
        }
        
        // Settings Navigation
        document.querySelectorAll('.settings-nav li').forEach(item => {
            item.addEventListener('click', function() {
                const tab = this.dataset.tab;
                
                // Update active tab
                document.querySelectorAll('.settings-nav li').forEach(li => {
                    li.classList.remove('active');
                });
                this.classList.add('active');
                
                // Show selected tab
                document.querySelectorAll('.settings-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.getElementById(`tab-${tab}`).classList.add('active');
            });
        });
    }
    
    // ============================================
    // 9. UTILITY FUNCTIONS
    // ============================================
    function updateDateTime() {
        const dateElement = document.getElementById('current-date');
        const timeElement = document.getElementById('current-time');
        
        if (dateElement && timeElement) {
            const now = new Date();
            dateElement.textContent = now.toLocaleDateString();
            timeElement.textContent = now.toLocaleTimeString();
        }
        
        setInterval(updateDateTime, 1000);
    }
    
    function filterAlerts(filter) {
        const alerts = document.querySelectorAll('.alert-item');
        alerts.forEach(alert => {
            if (filter === 'all') {
                alert.style.display = 'flex';
            } else {
                if (alert.classList.contains(filter)) {
                    alert.style.display = 'flex';
                } else {
                    alert.style.display = 'none';
                }
            }
        });
    }
    
    function exportData() {
        const sessionData = {
            sessionId: currentSessionId || 'N/A',
            duration: sessionSeconds,
            startTime: currentSessionId ? new Date(Date.now() - sessionSeconds * 1000).toISOString() : 'N/A',
            endTime: new Date().toISOString(),
            patient: document.getElementById('current-patient').textContent,
            metrics: {
                eegQuality: document.getElementById('eeg-quality').textContent,
                lumbarAngle: document.getElementById('lumbar-angle').textContent,
                alerts: document.querySelectorAll('.alert-item:not(.acknowledged)').length
            }
        };
        
        // Create downloadable JSON
        const dataStr = JSON.stringify(sessionData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `gutangle-session-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Data exported successfully!');
    }
    
    function showAddPatientModal() {
        const modalHTML = `
            <div class="modal-overlay" id="add-patient-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Add New Patient</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="patient-form">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" id="patient-name" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Age</label>
                                    <input type="number" id="patient-age" min="1" max="120" required>
                                </div>
                                <div class="form-group">
                                    <label>Gender</label>
                                    <select id="patient-gender">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Contact Number</label>
                                <input type="tel" id="patient-contact" required>
                            </div>
                            <div class="form-group">
                                <label>Medical History</label>
                                <textarea id="patient-history" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary cancel">Cancel</button>
                        <button class="btn btn-primary save">Save Patient</button>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 4000;
            }
            .modal {
                background: var(--primary-grey);
                border-radius: 15px;
                width: 500px;
                max-width: 90%;
                border: 2px solid var(--primary-red);
            }
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h3 {
                color: white;
            }
            .close-modal {
                background: transparent;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            }
            .modal-body {
                padding: 20px;
            }
            .modal-footer {
                padding: 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                color: white;
                margin-bottom: 8px;
            }
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 10px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 8px;
                color: white;
            }
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: var(--primary-red);
            }
            .form-row {
                display: flex;
                gap: 15px;
            }
            .form-row .form-group {
                flex: 1;
            }
        `;
        document.head.appendChild(style);
        
        // Handle modal events
        const modal = modalContainer.querySelector('.modal-overlay');
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modalContainer);
            document.head.removeChild(style);
        });
        
        modal.querySelector('.cancel').addEventListener('click', () => {
            document.body.removeChild(modalContainer);
            document.head.removeChild(style);
        });
        
        modal.querySelector('.save').addEventListener('click', () => {
            const name = modal.querySelector('#patient-name').value;
            const age = modal.querySelector('#patient-age').value;
            
            if (name && age) {
                // Update current patient
                document.getElementById('current-patient').textContent = name;
                document.getElementById('current-patient-age').textContent = age;
                document.getElementById('current-patient-id').textContent = `P-${Date.now().toString().slice(-6)}`;
                
                alert('Patient added successfully!');
                document.body.removeChild(modalContainer);
                document.head.removeChild(style);
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
    
    function logout() {
        // Stop any active session
        if (isSessionActive || sessionTimer) {
            stopSession();
        }
        
        // Clear authentication
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        
        // Navigate to landing page
        showView('landing');
    }
    
    // ============================================
    // 10. INITIALIZE DASHBOARD
    // ============================================
    // Start with a demo session
    setTimeout(() => {
        if (!isSessionActive) {
            startSession();
        }
    }, 2000);
    
    initDashboard();
});
