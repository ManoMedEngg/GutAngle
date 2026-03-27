<h1 align="center">GUTANGLE - A Smart Belt for Spine and Stomach Wellness</h1>

<p align="center">
  <img src="img/icon.png" alt="GutAngle Logo" width="240" style="border-radius: 80%; object-fit: cover;">
</p>

# 🧠🔬 GutAngle Dashboard
### *Where Brain Activity Meets Spinal Alignment*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Web](https://img.shields.io/badge/Platform-Web_Application-blue)](https://developer.mozilla.org/)
[![Project-Type: Biomedical IoT](https://img.shields.io/badge/Type-Biomedical_Monitoring_Platform-green)](#)

<p align="center">
  Intelligent EEG/Lumbar Monitoring & Visualization Dashboard
</p>

---

## 📋 Overview

GutAngle is a **production-ready web-based neurophysiology platform** designed to visualize EEG and lumbar position signals in real time. It provides clinical-grade monitoring, data analysis, and accessibility features for older adults, all wrapped in a sophisticated dark-theme interface.

---

## ✨ Key Features

- 🖥️ **Interactive Dashboard** – Live EEG/Lumbar graphs, key metrics, and session controls in a unified view
- 📊 **Signal Visualization** – Time‑series charts for EEG (4 channels) and lumbar position with configurable settings
- 🕰️ **History Management** – Session logs, past recordings, and summary statistics for retrospective analysis
- 🎨 **Customizable UI** – Dark theme with red accents, adjustable brightness, and 9 language options
- ♿ **Accessibility Ready** – Larger fonts, high‑contrast design, voice‑control integration, and keyboard navigation
- 🔒 **Secure Integration** – Supabase backend with user authentication and data encryption
- 📱 **Responsive Design** – Optimized for desktop (1920×1080) with graceful adaptation to tablet and mobile
- 🔔 **Alert System** – Real-time alerts with SMS & WhatsApp notifications for critical events

---

## 🏗️ Architecture

### Frontend Stack
- **HTML5** – Semantic structure and accessibility
- **CSS3** – Dark theme layout, responsive grid, and component styling
- **JavaScript (ES6+)** – Dynamic data updates, charts, and interaction logic
- **Chart.js** – Real-time data visualization
- **Supabase JS** – Backend integration and real-time subscriptions

### Backend Stack
- **Supabase** – PostgreSQL database with Row Level Security
- **Authentication** – User registration and JWT-based sessions
- **Storage** – Secure file storage for session data
- **Realtime** – WebSocket connections for live updates

### Core Modules
1. **Landing/Auth** – Multi-language support, login & signup flows
2. **Dashboard** – Live monitoring, KPI cards, alerts panel
3. **History** – Session listing, filtering, and detailed analysis
4. **Settings** – Theme, language, alerts, accessibility, and integration
5. **Patient Management** – Patient records and session assignment

---

## 📁 Project Structure

```text
GutAngle/
├── index.html              # Main HTML file
├── style.css              # Landing & login page styles
├── dashboard.css          # Dashboard-specific styles
├── script.js              # Landing & login functionality
├── dashboard.js           # Dashboard functionality
├── database.js            # Supabase integration
├── img/
│   └── icon.png          # Project logo
├── vdo/
│   ├── bg.mp4            # Background video
│   └── explain.mp4       # Demo video
└── README.md             # Project documentation