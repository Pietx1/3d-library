@echo off
setlocal
cd /d "%~dp0"
title Filament Label Studio - Druckdienst einrichten

echo ==============================================
echo   FILAMENT LABEL STUDIO - AUTOSTART EINRICHTEN
echo ==============================================
echo.
where python >nul 2>nul
if errorlevel 1 (
  echo Python wurde nicht gefunden. Bitte Python 3.10+ installieren und PATH aktivieren.
  pause
  exit /b 1
)

echo Installiere benoetigte Python-Pakete ...
python -m pip install --disable-pip-version-check -r requirements.txt
if errorlevel 1 (
  echo Paketinstallation fehlgeschlagen.
  pause
  exit /b 1
)

echo Erstelle Windows-Autostart ...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $folder='%~dp0'.TrimEnd(''); $pythonw=(Get-Command pythonw.exe -ErrorAction SilentlyContinue).Source; if(-not $pythonw){ throw 'pythonw.exe wurde nicht gefunden. Bitte Python mit pythonw installieren.' }; $startup=[Environment]::GetFolderPath('Startup'); $link=Join-Path $startup 'Filament Label Studio Druckdienst.lnk'; $ws=New-Object -ComObject WScript.Shell; $sc=$ws.CreateShortcut($link); $sc.TargetPath=$pythonw; $sc.Arguments=('""' + (Join-Path $folder 'bridge.py') + '""'); $sc.WorkingDirectory=$folder; $sc.Description='Lokaler Nelko P21 Druckdienst fuer die 3D Library'; $sc.Save(); Start-Process -FilePath $pythonw -ArgumentList ('""' + (Join-Path $folder 'bridge.py') + '""') -WorkingDirectory $folder"
if errorlevel 1 (
  echo Autostart konnte nicht eingerichtet werden.
  pause
  exit /b 1
)

echo.
echo Fertig! Der Druckdienst laeuft jetzt im Hintergrund und startet kuenftig mit Windows.
echo Du kannst dieses Fenster schliessen und Label Studio ueber die 3D Library oeffnen.
pause
endlocal
