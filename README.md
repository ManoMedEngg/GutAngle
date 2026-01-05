
<h1 align="center">GUTANGLE ༼ つ ◕_◕ ༽つ🍰🍔🍕/𖠣🦴</h1>

<p align="center">
  <img src="img/icon.png" alt="GutAngle Logo" width="240" style="border-radius: 80%; object-fit: cover;">
</p>


# 🧘‍♂️ GutAngle 🍕
### *Where Spinal Alignment Meets Gastric Wellness*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Raspberry Pi Pico 2 W](https://img.shields.io/badge/Platform-Raspberry_Pi_Pico_2_W-orange)](https://www.raspberrypi.com/)
[![Project-Type: Biomedical IoT](https://img.shields.io/badge/Type-Biomedical_Wearable_Devices-blue)](#)


<p align="center">
  Intelligent EEG/EMG Monitoring & Visualization Dashboard
</p>

---

## 🚀 Overview

GutAngle is a **web-based neurophysiology dashboard** designed to visualize EEG and EMG signals in real time, manage session history, and provide an accessible interface for clinicians, researchers, and students.  
It focuses on clear data presentation, dark‑theme ergonomics, and extensible components that can integrate with real hardware or simulated signal sources.

---

## ✨ Key Features

- 🎛️ **Interactive Dashboard** – Live EEG/EMG graphs, key metrics, and session controls in a single unified view.  
- 📊 **Signal Visualization** – Time‑series charts for EEG and EMG with configurable channels and refresh rates.  
- 🗂️ **History Management** – Session logs, past recordings, and summary statistics for retrospective analysis.  
- 🎨 **Customizable UI** – Dark theme with accent colors, adjustable brightness, and language options.  
- ♿ **Accessibility Ready** – Larger fonts, high‑contrast design, and planned voice‑control integration for older adults.  
- 🔌 **Modular Architecture** – Clean separation between UI, data layer, and device interfaces for easy extension.

---

## 🏗️ Architecture

GutAngle is structured as a **modular web application**:

- **Frontend**  
  - HTML for semantic structure  
  - CSS for dark‑theme layout, responsive grid, and component styling  
  - JavaScript for dynamic data updates, charts, and interaction logic  

- **Core Modules**  
  - `Landing / Auth` – Language selection, login & signup flows  
  - `Dashboard` – Live EEG/EMG views, KPI cards, alerts  
  - `History` – Session listing, filtering, and detailed graphs  
  - `Settings` – Theme, language, brightness, and future alert thresholds  

- **Integrations (Planned / Optional)**  
  - Device APIs for EEG/EMG acquisition  
  - Voice control via browser speech APIs or external assistants  
  - Export to CSV/JSON and interoperability with analysis tools

---

## 📦 Project Structure (Suggested)

> Adjust this section to match the actual folders/files in your repo.

```text
GutAngle/
├─ public/
│  ├─ icon.jpg          # Project logo (used in README & UI)
│  └─ index.html        # Entry point
├─ src/
│  ├─ assets/           # Images, icons, static assets
│  ├─ styles/           # Global and component stylesheets
│  ├─ components/       # Reusable UI components
│  ├─ pages/            # Landing, Dashboard, History, Settings
│  ├─ services/         # Data services, mock APIs, device hooks
│  └─ main.js           # App bootstrap
├─ tests/               # Unit / integration tests
├─ package.json         # Dependencies & scripts (if using Node tooling)
└─ README.md            # Project documentation
