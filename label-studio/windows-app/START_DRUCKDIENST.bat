@echo off
setlocal
cd /d "%~dp0"
title Filament Label Studio - Druckdienst (Diagnose)
echo ==============================================
echo   FILAMENT LABEL STUDIO - LOKALER DRUCKDIENST
echo ==============================================
echo.
echo Dieses Fenster muss offen bleiben, solange du direkt drucken willst.
echo.
where python
if errorlevel 1 (
  echo Python wurde nicht gefunden. Bitte Python 3.10+ installieren und PATH aktivieren.
  pause
  exit /b 1
)
echo.
echo Starte Druckdienst. Fehlermeldungen bleiben hier sichtbar.
echo Zum Beenden STRG+C druecken.
echo.
python bridge.py
echo.
echo Der Druckdienst wurde beendet. Oben steht ggf. der Grund.
pause
endlocal
