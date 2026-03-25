# GutAngle: Smart Belt for Spine and Stomach Wellness

**GutAngle** is a clinical-grade neurophysiology platform designed for real-time EEG and lumbar monitoring. It features a modern, bio-centric "Cyber-Medical" aesthetic with a specialized focus on accessibility and data security.

## 🚀 Key Features

*   **Real-time Monitoring**: High-precision visualization of EEG signals and lumbar angles.
*   **Unified Authentication**:
    *   **First-Time Setup**: Guided registration for Name, Mobile, Email, and Age.
    *   **Secure 6-Digit PIN**: streamlined access for subsequent logins with hashed PIN security.
*   **Premium Aesthetics**:
    *   **Green & Cyan Theme**: A high-contrast, premium interface designed for clinical environments.
    *   **Glassmorphism & HUD Design**: Sleek, modern components with micro-animations.
*   **Data Management**: HIPAA-ready data handling with structured session history and export features.

## 🛠️ Setup & Installation

### Prerequisites
*   Python 3.10+
*   SQLite3

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/ManoMedEngg/GutAngle.git
    cd GutAngle/python
    ```
2.  Install dependencies:
    ```bash
    pip install flask flask-cors werkzeug
    ```
3.  Initialize the database:
    ```bash
    python3 database.py
    ```
4.  Launch the application:
    ```bash
    python3 app.py
    ```

## 🔐 Security & Personal ID
Upon first-time entry, the system generates a unique **Personal ID** for the patient. Subsequent logins only require the user's **6-digit PIN**, ensuring both security and ease of use for clinical monitoring.

## 🎨 Theme
The interface utilizes a sophisticated **Green (#00FF88)** and **Cyan (#00F2FF)** palette, optimized for professional medical dashboards.

---
*Developed as part of the GutAngle IoMT wearable research project.*
