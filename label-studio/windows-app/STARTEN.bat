@echo off
setlocal
cd /d "%~dp0"
title Filament Label Studio - Nelko P21

echo ==========================================
echo   FILAMENT LABEL STUDIO - NELKO P21
echo ==========================================
echo.
echo Checking Python ...
where python >nul 2>nul
if errorlevel 1 goto no_python

echo Checking and installing required packages ...
python -m pip install --disable-pip-version-check -r requirements.txt
if errorlevel 1 goto install_failed

echo.
echo Starting Filament Label Studio ...
python main.py
if errorlevel 1 goto app_failed
goto end

:no_python
echo Python was not found in PATH.
echo Install Python 3.10 or newer and enable "Add Python to PATH".
pause
goto end

:install_failed
echo.
echo Package installation failed.
echo Check your internet connection and Python installation.
pause
goto end

:app_failed
echo.
echo The app could not be started.
echo If WebView2 is missing, install Microsoft Edge WebView2 Runtime.
pause

:end
endlocal
