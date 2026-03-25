<p align="center">
  <img src="python/img/icon.png" width="180" height="180" style="border-radius: 50%; box-shadow: 0 0 25px rgba(0, 255, 136, 0.4);">
</p>

# 🧬 GutAngle: The Cyber-Medical IoMT Evolution 🛰️

**GutAngle** is a next-generation, clinical-grade neurophysiology and biometry platform. It transforms raw sensor data from wearable IoMT devices into a high-fidelity, high-security monitoring experience.

---

## 🚀 Key Innovations 🌟

### 📱 Android-Native "Tile" Dashboard 📟
- **Responsive Nexus Grid**: A stacked, touch-first architecture with **Bottom Navigation** for effortless one-handed control 🖐️.
- **Real-time EGG Hardware Sync**: Calibrated ±0.8μV signal scaling for precise stomach activity visualization 📈.

### 🧪 Cyber-Medical Aesthetic 🎨
- **Glassmorphism UI**: Sleek, transparent components with real-time backdrop-blur 🌫️.
- **Neon-Glow Interface**: A high-contrast **Electric Crimson** and **Cyber Cyan** palette optimized for low-light clinical environments 🩺.
- **Micro-Animations**: Hardware-accelerated transitions and scan-lines for a buttery-smooth "Native-App" feel ⚡.

### 🔐 Multi-Layer Security 🛡️
- **Guided Registration**: Seamless onboarding for Name, Age, and Contact Biometrics 📂.
- **Hashed 6-Digit PIN**: Rapid, secure access for recurring sessions ⌨️.
- **Personal ID Recovery**: Entropy-based ID generation for emergency bypass 🔑.

---

## 🛠️ Architecture & Setup ⚙️

### 📦 Prerequisites
*   **Python 3.11+** (Chaquopy 15.0+ Compatible) 🐍
*   **Android SDK 33+** (For Native WebView Bridge) 🤖
*   **SQLite3** (Local Data Persistence) 📁

### ⚙️ Installation & Deployment
1.  **Clone the Nexus**:
    ```bash
    git clone https://github.com/ManoMedEngg/GutAngle.git
    cd GutAngle
    ```
2.  **Initialize Python Backend**:
    ```bash
    pip install flask flask-cors werkzeug
    python3 python/database.py
    ```
3.  **Deploy Android App**:
    - Open the `android_app` folder in Android Studio.
    - Click **Build > Assemble Debug** or use the CLI:
    ```bash
    ./gradlew assembleDebug
    ```

---

## 📂 Project Structure 🗄️

- `android_app/`: The primary Kotlin-based Hybrid WebView container 🤖.
- `python/`: The Flask-based Cyber-Medical engine & templates 🐍.
- `python/img/icon.png`: The official project branding mascot 🎨.

---

## 🤝 Contribution & Research 🔬
*Developed as part of the GutAngle IoMT wearable research project, focusing on non-invasive bio-signal acquisition and ergonomic posture correction.*

**GutAngle Team** | 🛠️ *Engineering the Future of Health* 🧬
