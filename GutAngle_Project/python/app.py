#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GUTANGLE - A Smart Belt for Spine and Stomach Wellness
Flask Application with SQLite Database
Python 3 Compatible
"""

from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash, Response
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import sqlite3, json, os, queue, threading, time, math
from datetime import datetime
from database import init_db, get_db_connection
import io
from flask import send_file
try:
    from authlib.integrations.flask_client import OAuth
except ImportError:
    OAuth = None

# Helper for PyInstaller path resolution
def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

import sys
if getattr(sys, 'frozen', False):
    template_folder = resource_path('templates')
    static_folder = resource_path('static')
    app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)
else:
    app = Flask(__name__)

app.secret_key = 'gutangle-secret-key-2025-change-in-production'

# Serial Port Handling for Desktop Bluetooth
serial_inst = None
try:
    import serial
    import serial.tools.list_ports
except ImportError:
    serial = None

# ── Global belt data queue (written by Android BT bridge or serial) ──
belt_data_queue = queue.Queue(maxsize=200)
APP_PIN = '123456'          # Change this in production

def init_desktop_serial():
    global serial_inst
    if not serial: return
    
    # Simple background thread to read from a default or selected COM port
    def serial_reader():
        global serial_inst
        # This will be refined to allow user selection from UI
        pass
    
    # threading.Thread(target=serial_reader, daemon=True).start()

init_db()



# ============================================
# 1. AUTHENTICATION DECORATORS
# ============================================
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


# ============================================
# 2. ROUTES - LANDING PAGE
# ============================================
@app.route('/')
def index():
    """Landing page - Redirects to registration or PIN entry"""
    conn = get_db_connection()
    user_count = conn.execute('SELECT COUNT(*) FROM users').fetchone()[0]
    conn.close()
    
    if user_count == 0:
        return redirect(url_for('register'))
    
    if 'user_id' in session and session.get('pin_verified'):
        return redirect(url_for('dashboard'))
        
    return redirect(url_for('pin'))


# ============================================
# 2.5 OAUTH CONFIGURATION
# ============================================
oauth = OAuth(app) if OAuth else None

# Google Configuration
# REPLACE THESE WITH YOUR ACTUAL CREDENTIALS
app.config['GOOGLE_CLIENT_ID'] = os.environ.get('GOOGLE_CLIENT_ID', 'placeholder-google-client-id')
app.config['GOOGLE_CLIENT_SECRET'] = os.environ.get('GOOGLE_CLIENT_SECRET', 'placeholder-google-client-secret')

google = None
if oauth:
    google = oauth.register(
        name='google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        access_token_url='https://accounts.google.com/o/oauth2/token',
        access_token_params=None,
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        authorize_params={'prompt': 'select_account'},
        api_base_url='https://www.googleapis.com/oauth2/v1/',
        userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',  # This is only needed if using openid to fetch user info
        client_kwargs={'scope': 'openid email profile'},
    )

# GitHub Configuration
# REPLACE THESE WITH YOUR ACTUAL CREDENTIALS
app.config['GITHUB_CLIENT_ID'] = os.environ.get('GITHUB_CLIENT_ID', 'placeholder-github-client-id')
app.config['GITHUB_CLIENT_SECRET'] = os.environ.get('GITHUB_CLIENT_SECRET', 'placeholder-github-client-secret')

github = None
if oauth:
    github = oauth.register(
        name='github',
        client_id=app.config['GITHUB_CLIENT_ID'],
        client_secret=app.config['GITHUB_CLIENT_SECRET'],
        access_token_url='https://github.com/login/oauth/access_token',
        access_token_params=None,
        authorize_url='https://github.com/login/oauth/authorize',
        authorize_params=None,
        api_base_url='https://api.github.com/',
        client_kwargs={'scope': 'user:email'},
    )


# ============================================
# 3. ROUTES - AUTHENTICATION
# ============================================
@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login page"""
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        conn = get_db_connection()
        user = conn.execute(
            'SELECT * FROM users WHERE email = ?', (email,)
        ).fetchone()
        conn.close()
        
        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['user_id']
            session['user_name'] = user['full_name']
            session['user_email'] = user['email']
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password', 'error')
    
    return render_template('login.html')


@app.route('/login/google')
def login_google():
    if not google:
        flash('Google login is not available: authlib is not installed.', 'error')
        return redirect(url_for('login'))
    redirect_uri = url_for('authorize_google', _external=True)
    return google.authorize_redirect(redirect_uri)


@app.route('/login/google/callback')
def authorize_google():
    if not google:
        flash('Google login is not available: authlib is not installed.', 'error')
        return redirect(url_for('login'))
    token = google.authorize_access_token()
    user_info = google.get('userinfo').json()
    email = user_info['email']
    name = user_info.get('name', email.split('@')[0])
    
    # Check if user exists, if not create one
    _social_login_user(email, name, 'google')
    
    return redirect(url_for('dashboard'))


@app.route('/login/github')
def login_github():
    if not github:
        flash('GitHub login is not available: authlib is not installed.', 'error')
        return redirect(url_for('login'))
    redirect_uri = url_for('authorize_github', _external=True)
    return github.authorize_redirect(redirect_uri)


@app.route('/login/github/callback')
def authorize_github():
    if not github:
        flash('GitHub login is not available: authlib is not installed.', 'error')
        return redirect(url_for('login'))
    token = github.authorize_access_token()
    resp = github.get('user').json()
    email = resp.get('email')
    
    # GitHub email might be private, fetch it manually if needed
    if not email:
        emails = github.get('user/emails').json()
        for e in emails:
            if e['primary'] and e['verified']:
                email = e['email']
                break
                
    name = resp.get('name') or resp.get('login')
    
    _social_login_user(email, name, 'github')
    
    return redirect(url_for('dashboard'))


@app.route('/login/fake')
def login_fake():
    """Quick fake login for testing"""
    _social_login_user('fake@gutangle.com', 'Fake User', 'fake')
    return redirect(url_for('dashboard'))


def _social_login_user(email, name, provider):
    """Helper to handle social login user creation/login"""
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    
    if not user:
        # Create new user for social login
        user_id = f"USER-{int(datetime.now().timestamp())}-{abs(hash(email)) % 10000}"
        password_hash = generate_password_hash(f"{provider}_social_login_{datetime.now()}") # Random pass
        
        conn.execute(
            '''INSERT INTO users (user_id, full_name, email, mobile, age, password_hash, role, preferences, created_at, last_login)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (user_id, name, email, 'N/A', 0, password_hash, 'patient',
             json.dumps({'language': 'en', 'theme': 'dark', 'alert_methods': ['sms', 'whatsapp', 'email']}),
             datetime.now().isoformat(), datetime.now().isoformat())
        )
        conn.commit()
        
        session['user_id'] = user_id
        session['user_name'] = name
        session['user_email'] = email
    
    else:
        # User exists, just login
        session['user_id'] = user['user_id']
        session['user_name'] = user['full_name']
        session['user_email'] = user['email']
        
        # Update last login
        conn.execute('UPDATE users SET last_login = ? WHERE user_id = ?', 
                     (datetime.now().isoformat(), user['user_id']))
        conn.commit()
        
    conn.close()


@app.route('/register', methods=['GET', 'POST'])
def register():
    """First-time registration page"""
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        mobile = request.form.get('mobile')
        age = request.form.get('age')
        pin = request.form.get('pin')
        
        if not all([name, email, mobile, age, pin]):
            flash('ALL_FIELDS_REQUIRED', 'error')
            return render_template('registration.html')
            
        if len(pin) != 6:
            flash('PIN_MUST_BE_6_DIGITS', 'error')
            return render_template('registration.html')
            
        conn = get_db_connection()
        
        # Check if user already exists
        existing_user = conn.execute(
            'SELECT * FROM users WHERE email = ?', (email,)
        ).fetchone()
        
        if existing_user:
            flash('EMAIL_ALREADY_REGISTERED', 'error')
            conn.close()
            return render_template('registration.html')
        
        # Create new user
        # We store PIN as the password hash for subsequent logins
        password_hash = generate_password_hash(pin)
        user_id = f"GT-{int(datetime.now().timestamp())}-{abs(hash(email)) % 1000}"
        
        try:
            conn.execute(
                '''INSERT INTO users (user_id, full_name, email, mobile, age, password_hash, role, preferences, created_at, last_login)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (user_id, name, email, mobile, int(age), password_hash, 'patient',
                 json.dumps({'language': 'en', 'theme': 'green', 'alert_methods': ['sms', 'email']}),
                 datetime.now().isoformat(), datetime.now().isoformat())
            )
            conn.commit()
            conn.close()
            
            session['user_id'] = user_id
            session['user_name'] = name
            session['pin_verified'] = True
            
            flash('REGISTRATION_SUCCESSFUL', 'success')
            return redirect(url_for('dashboard'))
        except Exception as e:
            conn.close()
            flash(f'REGISTRATION_FAILED: {str(e)}', 'error')
            return render_template('registration.html')
            
    return render_template('registration.html')


@app.route('/logout')
def logout():
    """Logout"""
    session.clear()
    return redirect(url_for('index'))


# ============================================
# 4. ROUTES - DASHBOARD
# ============================================
@app.route('/dashboard')
@login_required
def dashboard():
    """Main dashboard"""
    conn = get_db_connection()
    
    # Get current user
    user = conn.execute(
        'SELECT * FROM users WHERE user_id = ?', (session['user_id'],)
    ).fetchone()
    
    # Get recent sessions
    sessions = conn.execute(
        '''SELECT * FROM sessions WHERE patient_id = ? 
           ORDER BY start_time DESC LIMIT 5''',
        (session['user_id'],)
    ).fetchall()
    
    # Get recent alerts
    alerts = conn.execute(
        '''SELECT * FROM alerts WHERE user_id = ? 
           ORDER BY timestamp DESC LIMIT 10''',
        (session['user_id'],)
    ).fetchall()
    
    conn.close()
    
    # Convert Row objects to dictionaries for template
    sessions_list = [dict(row) for row in sessions] if sessions else []
    alerts_list = [dict(row) for row in alerts] if alerts else []
    
    return render_template('dashboard.html', user=dict(user) if user else None, sessions=sessions_list, alerts=alerts_list)


# ============================================
# 5. API ROUTES - SESSIONS
# ============================================
@app.route('/api/sessions', methods=['GET'])
@login_required
def get_sessions():
    """Get all sessions"""
    conn = get_db_connection()
    sessions = conn.execute(
        'SELECT * FROM sessions WHERE patient_id = ? ORDER BY start_time DESC',
        (session['user_id'],)
    ).fetchall()
    conn.close()
    
    sessions_list = [dict(row) for row in sessions]
    return jsonify(sessions_list)


@app.route('/api/sessions', methods=['POST'])
@login_required
def create_session():
    """Create a new session"""
    data = request.json
    session_id = f"SESS-{int(datetime.now().timestamp())}-{abs(hash(str(datetime.now()))) % 10000}"
    
    conn = get_db_connection()
    conn.execute(
        '''INSERT INTO sessions (session_id, patient_id, clinician_id, start_time, data_type, notes, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)''',
        (session_id, session['user_id'], data.get('clinician_id', 'CLIN-001'),
         datetime.now().isoformat(), json.dumps(data.get('data_type', ['EEG', 'Lumbar'])),
         data.get('notes', ''), 'active')
    )
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'session_id': session_id})


# ============================================
# 6. API ROUTES - ALERTS
# ============================================
@app.route('/api/alerts', methods=['GET'])
@login_required
def get_alerts():
    """Get all alerts"""
    conn = get_db_connection()
    alerts = conn.execute(
        'SELECT * FROM alerts WHERE user_id = ? ORDER BY timestamp DESC',
        (session['user_id'],)
    ).fetchall()
    conn.close()
    
    alerts_list = [dict(row) for row in alerts]
    return jsonify(alerts_list)


# ============================================
# 6.5 API ROUTES - READINGS
# ============================================
@app.route('/api/readings', methods=['GET'])
@login_required
def get_readings():
    """Get EEG/Lumbar readings for current user only"""
    try:
        limit = int(request.args.get('limit', 120))
    except ValueError:
        limit = 120
    limit = max(1, min(limit, 1000))

    conn = get_db_connection()
    readings = conn.execute(
        '''SELECT reading_id, session_id, eeg_fp1, eeg_fp2, eeg_c3, eeg_c4, lumbar_angle, captured_at
           FROM readings
           WHERE user_id = ?
           ORDER BY captured_at DESC
           LIMIT ?''',
        (session['user_id'], limit)
    ).fetchall()
    conn.close()

    readings_list = [dict(row) for row in reversed(readings)]
    return jsonify(readings_list)


@app.route('/api/readings', methods=['POST'])
@login_required
def create_reading():
    """Store one EEG/Lumbar reading for current user only"""
    data = request.json or {}
    required_fields = ['eeg_fp1', 'eeg_fp2', 'eeg_c3', 'eeg_c4', 'lumbar_angle']

    if not all(field in data for field in required_fields):
        return jsonify({'success': False, 'error': 'Missing required reading fields'}), 400

    try:
        eeg_fp1 = float(data['eeg_fp1'])
        eeg_fp2 = float(data['eeg_fp2'])
        eeg_c3 = float(data['eeg_c3'])
        eeg_c4 = float(data['eeg_c4'])
        lumbar_angle = float(data['lumbar_angle'])
    except (TypeError, ValueError):
        return jsonify({'success': False, 'error': 'Reading values must be numeric'}), 400

    reading_id = f"READ-{int(datetime.now().timestamp())}-{abs(hash(str(datetime.now()))) % 10000}"
    session_id = data.get('session_id')
    captured_at = datetime.now().isoformat()

    conn = get_db_connection()
    conn.execute(
        '''INSERT INTO readings (
               reading_id, user_id, session_id, eeg_fp1, eeg_fp2, eeg_c3, eeg_c4, lumbar_angle, captured_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (reading_id, session['user_id'], session_id, eeg_fp1, eeg_fp2, eeg_c3, eeg_c4, lumbar_angle, captured_at)
    )
    conn.commit()
    conn.close()

    return jsonify({'success': True, 'reading_id': reading_id, 'captured_at': captured_at})


# ============================================
# 7. API ROUTES - PATIENTS
# ============================================
@app.route('/api/patients', methods=['GET'])
@login_required
def get_patients():
    """Get all patients"""
    conn = get_db_connection()
    patients = conn.execute('SELECT * FROM patients ORDER BY created_at DESC').fetchall()
    conn.close()
    
    patients_list = [dict(row) for row in patients]
    return jsonify(patients_list)


@app.route('/api/patients', methods=['POST'])
@login_required
def create_patient():
    """Create a new patient"""
    data = request.json
    patient_id = f"PAT-{int(datetime.now().timestamp())}-{abs(hash(data.get('name', ''))) % 10000}"
    
    conn = get_db_connection()
    conn.execute(
        '''INSERT INTO patients (patient_id, name, age, gender, contact_number, medical_history, created_at, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
        (patient_id, data.get('name'), data.get('age'), data.get('gender'),
         data.get('contact'), data.get('history', ''), datetime.now().isoformat(), 'active')
    )
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'patient_id': patient_id})


# ============================================
# 8. ROUTES - HISTORY PAGE
# ============================================
@app.route('/history')
@login_required
def history():
    """Session history page"""
    return render_template('history.html')


# ============================================
# 9. ROUTES - SETTINGS PAGE
# ============================================
@app.route('/settings')
@login_required
def settings():
    """Settings page"""
    conn = get_db_connection()
    user = conn.execute(
        'SELECT * FROM users WHERE user_id = ?', (session['user_id'],)
    ).fetchone()
    conn.close()
    
    return render_template('settings.html', user=user)



@app.route('/qr')
def generate_qr():
    return "QR code generation disabled for Android build.", 200


# ============================================
# NEW: PIN / BLUETOOTH / HOME ROUTES
# ============================================
@app.route('/pin')
def pin():
    """6-digit PIN entry screen"""
    return render_template('pin.html', error='')


@app.route('/verify_pin', methods=['POST'])
def verify_pin():
    """Verify the 6-digit PIN against registered user."""
    data = request.get_json(silent=True) or {}
    entered = str(data.get('pin', ''))
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users LIMIT 1').fetchone() # Get the first (only) user
    conn.close()
    
    if user and check_password_hash(user['password_hash'], entered):
        session['user_id'] = user['user_id']
        session['user_name'] = user['full_name']
        session['pin_verified'] = True
        return jsonify({'success': True})
        
    return jsonify({'success': False, 'error': 'INCORRECT_IDENTITY_PIN'})


@app.route('/verify_id', methods=['POST'])
def verify_id():
    """Verify the Personal ID (GUT-xxxxxx) for recovery."""
    data = request.get_json(silent=True) or {}
    entered_id = str(data.get('personal_id', '')).strip().upper()
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE user_id = ?', (entered_id,)).fetchone()
    conn.close()
    
    if user:
        session['user_id'] = user['user_id']
        session['user_name'] = user['full_name']
        session['pin_verified'] = True
        return jsonify({'success': True})
        
    return jsonify({'success': False, 'error': 'INVALID_PERSONAL_ID'})


@app.route('/bluetooth')
def bluetooth():
    """Bluetooth device scan screen"""
    return render_template('bluetooth.html')


@app.route('/api/bt_devices')
def bt_devices():
    """Desktop: List available COM ports if running on desktop, else fall back to JSON."""
    if serial:
        ports = serial.tools.list_ports.comports()
        device_list = []
        for p in ports:
            # Map COM port to a similar structure as Android devices
            device_list.append({
                'name': f"{p.description} ({p.device})",
                'address': p.device
            })
        return jsonify({'devices': device_list})
    
    # Fallback/Android logic
    try:
        devices_file = resource_path('bt_devices.json')
        if os.path.exists(devices_file):
            with open(devices_file) as f:
                devices = json.load(f)
        else:
            devices = []
    except Exception:
        devices = []
    return jsonify({'devices': devices})


@app.route('/api/bt_connect', methods=['POST'])
def bt_connect():
    """Desktop: Initiate serial connection to the selected COM port."""
    global serial_inst
    data = request.get_json(silent=True) or {}
    port = data.get('address')
    
    if serial and port:
        try:
            # Close existing connection if any
            if serial_inst and serial_inst.is_open:
                serial_inst.close()
            
            # Start new connection (9600 is standard for many HC-05/ESP32 default serial)
            serial_inst = serial.Serial(port, 115200, timeout=1)
            
            # Start background thread to feed the queue
            def serial_to_queue():
                while serial_inst and serial_inst.is_open:
                    try:
                        line = serial_inst.readline().decode('utf-8').strip()
                        if line:
                            belt_data_queue.put(line)
                    except Exception:
                        break
            
            threading.Thread(target=serial_to_queue, daemon=True).start()
            return jsonify({'success': True, 'message': f'Connected to {port}'})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
            
    # Fallback/Android logic
    session['bt_device'] = data
    return jsonify({'success': True, 'device': data})


@app.route('/api/belt_push', methods=['POST'])
def belt_push():
    """Receive a line of CSV from the Android BT service and enqueue it."""
    data = request.get_json(silent=True) or {}
    line = data.get('data', '')
    if line:
        try:
            belt_data_queue.put_nowait(line)
        except queue.Full:
            belt_data_queue.get_nowait()   # drop oldest
            belt_data_queue.put_nowait(line)
    return jsonify({'ok': True})


@app.route('/api/belt_stream')
def belt_stream():
    """Server-Sent Events stream delivering belt CSV lines to the browser."""
    def generate():
        phase = [0.0]
        while True:
            try:
                line = belt_data_queue.get(timeout=0.3)
                yield f'data: {line}\n\n'
            except queue.Empty:
                # Simulation disabled per user request
                # yield f'data: 0,0,0,0,0,0\n\n' 
                time.sleep(0.5)
                continue
    return Response(generate(), mimetype='text/event-stream',
                    headers={'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no'})


@app.route('/home')
def home():
    """Real-time sensor dashboard (PIN protected)"""
    return render_template('home.html')


# ============================================
# 10. RUN APPLICATION
# ============================================
def start_server():
    app.run(host='127.0.0.1', port=5000, threaded=True)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)

