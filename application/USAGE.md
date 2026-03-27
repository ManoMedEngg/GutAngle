# GUTANGLE - How to Access Dashboard

## Quick Solution

A test user has been created! You can now login with:

**Email:** `test@gutangle.com`  
**Password:** `test123`

## Steps to Access Dashboard

1. **Start the Flask application:**
   ```bash
   python app.py
   ```

2. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```

3. **Click "Enter Dashboard" button** on the landing page

4. **You'll be taken to the login page.** Login with:
   - Email: `test@gutangle.com`
   - Password: `test123`

5. **After successful login, you'll be redirected to the dashboard!**

## Alternative: Create Your Own Account

If you want to create your own account:

1. **On the login page, click "Sign up"** (top right tab)
2. **Fill in the registration form:**
   - Full name
   - Mobile number
   - Email ID
   - Age
   - Password
3. **Submit the form**
4. **You'll be redirected to login page**
5. **Login with your credentials**
6. **Access the dashboard!**

## Create More Test Users

If you need to create more test users, run:

```bash
python create_test_user.py
```

This script creates a test user with:
- Email: `test@gutangle.com`
- Password: `test123`

## Troubleshooting

**Issue: "Invalid email or password"**
- Make sure you're using the correct email and password
- If you just signed up, make sure to use the credentials you registered with
- Try the test user: `test@gutangle.com` / `test123`

**Issue: "Can't access dashboard"**
- Make sure you're logged in first
- The dashboard requires authentication
- If you see a login page, you need to login first

**Issue: Database errors**
- Make sure the database is initialized: `python database.py`
- Check that `gutangle.db` file exists

## Notes

- The dashboard requires authentication (login)
- You must have an account to access the dashboard
- Session-based authentication is used (you stay logged in until you logout)
- All data is stored in SQLite database (`gutangle.db`)

Enjoy using GUTANGLE! 🚀
