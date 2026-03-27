#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Database Setup and Utilities for GUTANGLE
SQLite Database Schema
"""

import sqlite3
import json
import os
import shutil
from os.path import dirname, join
from datetime import datetime

DATABASE = 'gutangle.db'

# Path Resolution for Desktop (.exe) and Android
if "FILESDIR" in os.environ:
    # Android (Chaquopy)
    db_dir = os.environ["FILESDIR"]
    DATABASE = join(db_dir, 'gutangle.db')
else:
    # Desktop (Windows/Linux)
    # Store DB in user's home/AppData directory if running as a frozen app
    import sys
    if getattr(sys, 'frozen', False):
        # We are running in a bundle (e.g. PyInstaller)
        # Use AppData/Local (Windows) or ~/.local/share (Linux)
        if os.name == 'nt': # Windows
            base_dir = os.getenv('LOCALAPPDATA', os.path.expanduser('~'))
        else: # Linux/Mac
            base_dir = os.path.expanduser('~')
        
        app_data_dir = join(base_dir, 'GutAngle')
        os.makedirs(app_data_dir, exist_ok=True)
        DATABASE = join(app_data_dir, 'gutangle.db')
    else:
        # Running from source, use current directory
        DATABASE = join(dirname(__file__), 'gutangle.db')

# Ensure the database exists or copy it from bundled assets if it doesn't
if not os.path.exists(DATABASE):
    # Try to find the bundled template DB
    asset_db_path = join(dirname(__file__), 'gutangle.db')
    if os.path.exists(asset_db_path):
        print(f"DATABASE: Copying initial DB from {asset_db_path} to {DATABASE}")
        shutil.copy2(asset_db_path, DATABASE)
    else:
        print(f"DATABASE: Creating new empty database at {DATABASE}")

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database tables"""
    conn = get_db_connection()
    
    # Users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            mobile TEXT,
            age INTEGER,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'patient',
            preferences TEXT,
            devices_linked TEXT,
            created_at TEXT,
            last_login TEXT
        )
    ''')
    
    # Sessions table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            session_id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL,
            clinician_id TEXT,
            start_time TEXT NOT NULL,
            end_time TEXT,
            data_type TEXT,
            eeg_data TEXT,
            lumbar_data TEXT,
            alerts_generated TEXT,
            notes TEXT,
            tags TEXT,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (patient_id) REFERENCES users (user_id)
        )
    ''')
    
    # Alerts table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            alert_id TEXT PRIMARY KEY,
            session_id TEXT,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            severity TEXT NOT NULL,
            details TEXT,
            timestamp TEXT NOT NULL,
            acknowledged INTEGER DEFAULT 0,
            notification_sent TEXT,
            FOREIGN KEY (session_id) REFERENCES sessions (session_id),
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    ''')

    # Readings table (user-scoped physiological samples)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS readings (
            reading_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            session_id TEXT,
            eeg_fp1 REAL NOT NULL,
            eeg_fp2 REAL NOT NULL,
            eeg_c3 REAL NOT NULL,
            eeg_c4 REAL NOT NULL,
            lumbar_angle REAL NOT NULL,
            captured_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (user_id),
            FOREIGN KEY (session_id) REFERENCES sessions (session_id)
        )
    ''')
    
    # Patients table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            patient_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            contact_number TEXT,
            medical_history TEXT,
            created_at TEXT NOT NULL,
            last_session TEXT,
            status TEXT DEFAULT 'active'
        )
    ''')
    
    conn.commit()
    conn.close()
    
    print("Database initialized successfully!")


if __name__ == '__main__':
    init_db()
