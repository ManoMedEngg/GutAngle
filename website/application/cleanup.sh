#!/bin/bash
# GutAngle Project Cleanup Script
# Run this from: /home/manoj/Desktop/GUTANGLE_Project/GutAngle/
# Usage: bash cleanup.sh

set -e
ROOT="/home/manoj/Desktop/GUTANGLE_Project/GutAngle"
cd "$ROOT"

echo "=== GutAngle Cleanup Script ==="

# ---- DELETE: Large/unwanted root files ----
echo "Removing large unwanted files..."
rm -f  ngrok-v3-stable-linux-amd64.tgz
rm -f  gutangle.db
rm -f  create_test_user.py
rm -f  reset_user_password.py

# ---- DELETE: Old Python cache ----
echo "Removing __pycache__ directories..."
find . -type d -name __pycache__ -not -path "./.git/*" -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -not -path "./.git/*" -delete 2>/dev/null || true

# ---- DELETE: Old virtual environments in root ----
echo "Removing old venv directories..."
rm -rf venv .venv

# ---- DELETE: BME18_App (original old app, superseded by android_app) ----
if [ -d "BME18_App" ]; then
    echo "Removing old BME18_App folder..."
    rm -rf BME18_App
fi

# ---- DELETE: Old subcode folder ----
rm -rf subcode 2>/dev/null || true

# ---- DELETE: Android build cache ----
echo "Cleaning Gradle build cache..."
cd android_app && ./gradlew clean 2>/dev/null || true
cd "$ROOT"

# ---- WEBSITE: Copy required assets ----
echo "Copying website assets..."
mkdir -p website/img website/vdo website/apk
cp -f img/icon.png website/img/icon.png 2>/dev/null && echo "  ✓ icon.png" || echo "  ✗ icon.png not found, skipping"
cp -f vdo/bg.mp4   website/vdo/bg.mp4   2>/dev/null && echo "  ✓ bg.mp4"   || echo "  ✗ bg.mp4 not found, skipping"

# Copy APK if it has been built
APK="android_app/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK" ]; then
    cp -f "$APK" website/apk/GutAngle_Monitor.apk
    echo "  ✓ GutAngle_Monitor.apk"
else
    echo "  ✗ APK not built yet — run: cd android_app && PYTHONPATH=./hack ./gradlew assembleDebug"
fi

echo ""
echo "=== Cleanup complete! ==="
echo ""
echo "Project structure:"
echo "  website/    → Open index.html in browser"
echo "  android_app/ → Build with: PYTHONPATH=./hack ./gradlew assembleDebug"
echo ""
echo "To rebuild and install:"
echo "  cd android_app"
echo "  PYTHONPATH=\$(pwd)/hack ./gradlew assembleDebug"
echo "  adb install app/build/outputs/apk/debug/app-debug.apk"
