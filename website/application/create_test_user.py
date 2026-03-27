#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to create a test user for GUTANGLE
Run this to create a test account for login
"""

from database import get_db_connection
from werkzeug.security import generate_password_hash
from datetime import datetime
import json

def create_test_user():
    """Create a test user"""
    conn = get_db_connection()
    
    # Test user credentials
    email = "test@gutangle.com"
    password = "test123"
    name = "Test User"
    mobile = "+91 9876543210"
    age = 30
    
    # Check if user already exists
    existing = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    
    if existing:
        print(f"User {email} already exists!")
        conn.close()
        return
    
    # Create user
    password_hash = generate_password_hash(password)
    user_id = f"USER-{int(datetime.now().timestamp())}-{abs(hash(email)) % 10000}"
    
    try:
        conn.execute(
            '''INSERT INTO users (user_id, full_name, email, mobile, age, password_hash, role, preferences, created_at, last_login)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (user_id, name, email, mobile, age, password_hash, 'patient',
             json.dumps({'language': 'en', 'theme': 'dark', 'alert_methods': ['sms', 'whatsapp', 'email']}),
             datetime.now().isoformat(), datetime.now().isoformat())
        )
        conn.commit()
        conn.close()
        
        print("=" * 50)
        print("Test user created successfully!")
        print("=" * 50)
        print(f"Email: {email}")
        print(f"Password: {password}")
        print("=" * 50)
        print("\nYou can now login with these credentials.")
        
    except Exception as e:
        conn.close()
        print(f"Error creating user: {e}")

if __name__ == '__main__':
    create_test_user()
