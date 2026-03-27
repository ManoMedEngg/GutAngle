
# GutAngle Project — Folder Guide

## 📂 `website/`
Static website for public distribution. Open `index.html` in any browser.

- **Landing Page** — Features, about, contact
- **Download APK** — Login required → auto-downloads the APK
- **APK is located at** → `website/apk/GutAngle_Monitor.apk`

> To link the real APK: copy the built file from
> `android_app/app/build/outputs/apk/debug/app-debug.apk`
> to `website/apk/GutAngle_Monitor.apk`

---

## 📂 `android_app/` (Application)
Android app built with Java + Chaquopy (Python 3.8) + Flask.

**App Flow:**
1. Launch → **PIN Screen** (default: `123456`)
2. Enter PIN → **Connect GutBelt** (Bluetooth scan)
3. Select device → **Live Dashboard**

**Signals plotted in real-time:**
| Signal | Sensor | Unit |
|---|---|---|
| Electrogastrography (EGG) | EGG sensor | mV |
| Respiration Rate | EGG sensor | rpm |
| Bending Angle | Flex sensor | degrees |
| X, Y, Z Acceleration | IMU sensor | g |

**Alert thresholds:**
| Signal | Warning | Critical |
|---|---|---|
| EGG | > 500 mV | > 800 mV |
| Resp Rate | < 8 or > 30 rpm | < 5 or > 40 rpm |
| Bending | > 30° | > 45° |
| Accel | > 1.5g | > 2.5g |

**Build commands:**
```bash
cd android_app
PYTHONPATH=./hack ./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

**Supports Android 7.0 – 12 (API 24 – 31)**
