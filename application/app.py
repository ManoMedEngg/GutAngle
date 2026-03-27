#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GUTANGLE - A Smart Belt for Spine and Stomach Wellness
Flask Application with SQLite Database
Python 3 Compatible
"""

from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import sqlite3
import json
import os
from datetime import datetime
from database import init_db, get_db_connection
import qrcode
import io
from flask import send_file
try:
    from authlib.integrations.flask_client import OAuth
except ImportError:
    OAuth = None

app = Flask(__name__)
app.secret_key = 'gutangle-secret-key-2025-change-in-production'

# Initialize database
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
    """Landing page"""
    return render_template('index.html')


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


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    """Signup page"""
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        mobile = request.form.get('mobile')
        age = request.form.get('age')
        password = request.form.get('password')
        
        if not all([name, email, mobile, age, password]):
            flash('All fields are required', 'error')
            return render_template('login.html')
        
        conn = get_db_connection()
        
        # Check if user already exists
        existing_user = conn.execute(
            'SELECT * FROM users WHERE email = ?', (email,)
        ).fetchone()
        
        if existing_user:
            flash('Email already registered', 'error')
            conn.close()
            return render_template('login.html')
        
        # Create new user
        password_hash = generate_password_hash(password)
        user_id = f"USER-{int(datetime.now().timestamp())}-{abs(hash(email)) % 10000}"
        
        try:
            conn.execute(
                '''INSERT INTO users (user_id, full_name, email, mobile, age, password_hash, role, preferences, created_at, last_login)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (user_id, name, email, mobile, int(age), password_hash, 'patient',
                 json.dumps({'language': 'en', 'theme': 'dark', 'alert_methods': ['sms', 'whatsapp', 'email']}),
                 datetime.now().isoformat(), datetime.now().isoformat())
            )
            conn.commit()
            conn.close()
            
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            conn.close()
            flash(f'Registration failed: {str(e)}', 'error')
            return render_template('login.html')
    
    return render_template('login.html')


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
    url = "https://abcd1234.ngrok.io"  # Replace with your actual ngrok URL
    img = qrcode.make(url)
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png')


# ============================================
# 10. RUN APPLICATION
# ============================================
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
