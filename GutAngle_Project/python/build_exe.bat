@echo off
echo ===================================================
echo   GUTANGLE Desktop Builder (.exe)
echo ===================================================
echo.

REM Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.8+!
    pause
    exit /b
)

echo [1/3] Installing/Updating dependencies...
pip install -r requirements_desktop.txt
if %errorlevel% neq 0 (
    echo [ERROR] Dependency installation failed!
    pause
    exit /b
)

echo [2/3] Cleaning up previous builds...
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist

echo [3/3] Generating Executable...
pyinstaller gutangle.spec
if %errorlevel% neq 0 (
    echo [ERROR] PyInstaller failed!
    pause
    exit /b
)

echo.
echo ===================================================
echo   BUILD SUCCESSFUL!
echo   Find your .exe in the 'dist' folder.
echo ===================================================
pause
