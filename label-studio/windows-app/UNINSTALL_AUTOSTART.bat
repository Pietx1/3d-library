@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -Command "$link=Join-Path ([Environment]::GetFolderPath('Startup')) 'Filament Label Studio Druckdienst.lnk'; if(Test-Path $link){Remove-Item $link -Force}; Write-Host 'Autostart-Eintrag entfernt.'"
pause
endlocal
