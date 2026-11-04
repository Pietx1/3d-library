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

echo Pruefe pythonw.exe ...
where pythonw >nul 2>nul
if errorlevel 1 (
  echo pythonw.exe wurde nicht gefunden. Starte stattdessen START_DRUCKDIENST.bat manuell.
  pause
  exit /b 1
)

echo Erstelle Windows-Autostart ...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $folder='%~dp0'.TrimEnd([char]92); $pythonw=(Get-Command pythonw.exe -ErrorAction Stop).Source; $startup=[Environment]::GetFolderPath('Startup'); $link=Join-Path $startup 'Filament Label Studio Druckdienst.lnk'; $ws=New-Object -ComObject WScript.Shell; $sc=$ws.CreateShortcut($link); $sc.TargetPath=$pythonw; $sc.Arguments=('"' + (Join-Path $folder 'bridge.py') + '"'); $sc.WorkingDirectory=$folder; $sc.Description='Lokaler Nelko P21 Druckdienst fuer die 3D Library'; $sc.Save(); Start-Process -FilePath $pythonw -ArgumentList ('"' + (Join-Path $folder 'bridge.py') + '"') -WorkingDirectory $folder"
if errorlevel 1 (
  echo Autostart konnte nicht eingerichtet werden.
  echo Du kannst den Dienst mit START_DRUCKDIENST.bat manuell starten.
  pause
  exit /b 1
)

echo.
echo Fertig! Der Dienst wurde gestartet und fuer den Windows-Autostart eingerichtet.
echo Wenn die Website den Dienst nicht findet, starte START_DRUCKDIENST.bat und lies die Fehlermeldung.
pause
endlocal
