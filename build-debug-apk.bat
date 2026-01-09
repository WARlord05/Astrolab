@echo off
REM Build Debug APK Automation Script
REM This script builds the web project, syncs with Android, and creates a Debug APK

echo.
echo ========================================
echo   Astrolab Debug APK Builder
echo ========================================
echo.

REM Step 1: Build web project
echo [1/3] Building web project...
echo.
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Web build failed!
    pause
    exit /b 1
)
echo.
echo [1/3] Web build completed successfully!
echo.

REM Step 2: Sync with Android
echo [2/3] Syncing with Android...
echo.
call npx cap sync android
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)
echo.
echo [2/3] Android sync completed successfully!
echo.

REM Step 3: Build Debug APK
echo [3/3] Building Debug APK...
echo.
cd android
call .\gradlew assembleDebug
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Gradle build failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo.
echo [3/3] Debug APK built successfully!
echo.

REM Success message
echo.
echo ========================================
echo   BUILD COMPLETE!
echo ========================================
echo.
echo APK Location:
echo   %cd%\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Ready to install and test on emulator/device!
echo.
pause
