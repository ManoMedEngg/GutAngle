import threading
import webview
import sys
import os
import time
from app import app, start_server, init_db

def run_flask():
    # Run Flask server in a separate thread
    # We use 127.0.0.1 for local security
    app.run(host='127.0.0.1', port=5000, threaded=True, debug=False)

if __name__ == '__main__':
    # Initialize DB before launching
    init_db()
    
    # Start Flask in background
    t = threading.Thread(target=run_flask)
    t.daemon = true
    t.start()
    
    # Wait a moment for Flask to wake up
    time.sleep(1)
    
    # Create webview window
    # We use a premium dark theme for the window if supported
    window = webview.create_window(
        'GUTANGLE - Nexus Dashboard', 
        'http://127.0.0.1:5000',
        width=1280,
        height=800,
        min_size=(1024, 768),
        background_color='#0a0a0a'
    )
    
    # Start the webview loop
    webview.start()
    
    # When window closes, exit the whole process
    sys.exit(0)
