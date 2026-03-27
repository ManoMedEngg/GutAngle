# GUTANGLE Python Flask Application - Quick Start Guide

## What Has Been Created

I've created a complete Python Flask web application based on your existing GUTANGLE UI design with SQLite database support. The application includes:

### ✅ Core Files Created:
1. **app.py** - Main Flask application with routes and authentication
2. **database.py** - SQLite database setup and utilities
3. **requirements.txt** - Python dependencies
4. **templates/** - HTML templates (index, login, dashboard, history, settings)
5. **static/** - Static files (CSS, JS, images, videos) - copied from existing structure
6. **gutangle.db** - SQLite database (created when you run database.py)

## Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Initialize Database
```bash
python database.py
```

This creates the SQLite database with all necessary tables.

### Step 3: Run the Application
```bash
python app.py
```

The application will start on `http://localhost:5000`

## Using the Application

1. **Landing Page**: Visit `http://localhost:5000` to see the landing page
2. **Login**: Click "Enter Dashboard" → Login with test credentials:
   - Email: `test@gutangle.com`
   - Password: `test123`
3. **Dashboard**: After login, you'll be redirected to the dashboard!

**OR Create Your Own Account:**
1. Click "Enter Dashboard" → Click "Sign up" tab
2. Fill in the registration form
3. Submit and login with your credentials
4. Access the dashboard!

## Features Implemented

✅ **User Authentication**
- Signup with email, name, mobile, age, password
- Login with email and password
- Password hashing for security
- Session management

✅ **Database (SQLite)**
- Users table (user accounts)
- Sessions table (monitoring sessions)
- Alerts table (alert records)
- Patients table (patient information)

✅ **Pages**
- Landing page (index.html)
- Login/Signup page (login.html)
- Dashboard (dashboard.html)
- History page (history.html)
- Settings page (settings.html)

✅ **API Endpoints**
- `/api/sessions` - GET/POST sessions
- `/api/alerts` - GET alerts
- `/api/patients` - GET/POST patients

✅ **UI Design**
- Uses your existing CSS/JS files
- Dark theme with red accents
- Responsive design
- All static assets (images, videos) included

## Project Structure

```
GutAngle/
├── app.py                    # Flask application
├── database.py              # Database setup
├── requirements.txt          # Python dependencies
├── gutangle.db              # SQLite database (auto-generated)
├── templates/               # HTML templates
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── history.html
│   └── settings.html
└── static/                  # Static files
    ├── css/                 # Your existing CSS files
    ├── js/                  # Your existing JS files
    ├── img/                 # Images
    └── vdo/                 # Videos
```

## Notes

- **Python 3 Compatible**: Works with Python 3.6+
- **SQLite Database**: Local database file (gutangle.db)
- **Flask Framework**: Lightweight and easy to deploy
- **Existing UI**: Uses your existing HTML/CSS/JS design
- **Production Ready**: Basic structure for production deployment

## Next Steps (Optional Enhancements)

1. Add more API endpoints as needed
2. Implement real-time data updates (WebSockets)
3. Add data export functionality (CSV/PDF)
4. Enhance security (CSRF protection, rate limiting)
5. Add unit tests
6. Deploy to production server

## Troubleshooting

- **Port 5000 in use**: Change port in `app.py` (line 218)
- **Database errors**: Run `python database.py` to reinitialize
- **Static files not loading**: Check that files are in `static/` directory
- **Template errors**: Verify all templates are in `templates/` directory

## Support

For issues or questions, refer to `README_PYTHON.md` for detailed documentation.

Enjoy your GUTANGLE Python Flask application! 🚀
