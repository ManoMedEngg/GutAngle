#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Database Setup and Utilities for GUTANGLE
SQLite Database Schema
"""

import sqlite3
import json
from datetime import datetime

DATABASE = 'gutangle.db'


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
