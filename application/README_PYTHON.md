# GUTANGLE - Python Flask Web Application

A Python 3 compatible web application for the GUTANGLE A Smart Belt for Spine and Stomach Wellness using Flask and SQLite database.

## Features

- ✅ **Flask Web Framework** - Lightweight and Python 3 compatible
- ✅ **SQLite Database** - Local database storage for users, sessions, alerts, and patients
- ✅ **User Authentication** - Signup and login functionality with password hashing
- ✅ **Dashboard Interface** - Real-time monitoring dashboard (uses existing HTML/CSS/JS)
- ✅ **Session Management** - Track monitoring sessions
- ✅ **API Endpoints** - RESTful API for sessions, alerts, and patients

## Requirements

- Python 3.6 or higher
- pip (Python package manager)

## Installation

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Initialize the database:**
```bash
python database.py
```

This will create a `gutangle.db` SQLite database file with all necessary tables.

## Running the Application

1. **Start the Flask development server:**
```bash
python app.py
```

2. **Access the application:**
   - Open your web browser and navigate to: `http://localhost:5000`
   - The landing page will be displayed
   - Click "Enter Dashboard" to go to login/signup page

## Project Structure

```
GutAngle/
├── app.py                 # Main Flask application
├── database.py            # Database setup and utilities
├── gutangle.db           # SQLite database (created after initialization)
├── requirements.txt       # Python dependencies
├── templates/            # HTML templates
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   └── dashboard.html
└── static/              # Static files (CSS, JS, images)
    ├── css/
    ├── js/
    ├── img/
    └── vdo/
```

## Database Schema

The SQLite database includes the following tables:

- **users** - User accounts (email, password_hash, preferences, etc.)
- **sessions** - Monitoring sessions (session_id, patient_id, start_time, etc.)
- **alerts** - Alert records (alert_id, type, severity, timestamp, etc.)
- **patients** - Patient information (patient_id, name, age, medical_history, etc.)

## API Endpoints

- `GET /api/sessions` - Get all sessions for the logged-in user
- `POST /api/sessions` - Create a new session
- `GET /api/alerts` - Get all alerts for the logged-in user
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create a new patient

## Usage

1. **Sign Up:**
   - Navigate to `/signup` or click "Sign up" on the login page
   - Fill in the registration form (name, email, mobile, age, password)
   - Submit the form to create an account

2. **Login:**
   - Navigate to `/login` or click "Sign in"
   - Enter your email and password
   - You'll be redirected to the dashboard upon successful login

3. **Dashboard:**
   - After login, you'll see the main dashboard
   - The dashboard uses the existing HTML/CSS/JS from the original design
   - All static files (CSS, JS, images) are served from the `static/` directory

## Development Notes

- The application uses Flask sessions for authentication
- Passwords are hashed using Werkzeug's security functions
- The database connection is managed through `database.py`
- Static files are served from the `static/` directory
- Templates use Jinja2 templating engine (included with Flask)

## Security Considerations

⚠️ **Important:** This is a development version. For production:

1. Change the `SECRET_KEY` in `app.py` to a secure random value
2. Use environment variables for sensitive configuration
3. Implement proper password reset functionality
4. Add CSRF protection
5. Use HTTPS in production
6. Implement proper error handling and logging
7. Add database backup strategies

## Troubleshooting

- **Database errors:** Make sure to run `python database.py` first to initialize the database
- **Port already in use:** Change the port in `app.py` (default is 5000)
- **Static files not loading:** Ensure files are in the `static/` directory with correct paths
- **Template errors:** Check that all templates are in the `templates/` directory

## License

Same as the main GUTANGLE project.

## Developer

Developed By Manoj | Biomedical Engineering
