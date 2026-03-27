#!/usr/bin/env python3
"""Reset or create a local user password for GUTANGLE."""

import sys
import json
from datetime import datetime
from werkzeug.security import generate_password_hash
from database import get_db_connection


def reset_or_create_user(email: str, password: str, name: str = 'Test User') -> None:
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()

    password_hash = generate_password_hash(password)
    now = datetime.now().isoformat()

    if user:
        conn.execute(
            'UPDATE users SET password_hash = ?, last_login = ? WHERE email = ?',
            (password_hash, now, email),
        )
        conn.commit()
        conn.close()
        print(f'Password reset successful for: {email}')
        return

    user_id = f"USER-{int(datetime.now().timestamp())}-{abs(hash(email)) % 10000}"
    conn.execute(
        '''INSERT INTO users (user_id, full_name, email, mobile, age, password_hash, role, preferences, created_at, last_login)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (
            user_id,
            name,
            email,
            'N/A',
            0,
            password_hash,
            'patient',
            json.dumps({'language': 'en', 'theme': 'dark', 'alert_methods': ['sms', 'whatsapp', 'email']}),
            now,
            now,
        ),
    )
    conn.commit()
    conn.close()
    print(f'User created successfully: {email}')


if __name__ == '__main__':
    email = sys.argv[1] if len(sys.argv) > 1 else 'test@gutangle.com'
    password = sys.argv[2] if len(sys.argv) > 2 else 'test123'
    name = sys.argv[3] if len(sys.argv) > 3 else 'Test User'
    reset_or_create_user(email, password, name)
