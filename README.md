# 3D Library + Filament Label Studio

This package contains both applications in one project folder. The 3D Library remains the main app at the repository root. Label Studio is available from the Library sidebar and at `label-studio/`.

## Start the website

For local use, open the folder through a static web server (for example VS Code Live Server) and open `index.html`. The Library's existing GitHub Pages hosting also works when the same files are uploaded together.

## Label Studio

The browser editor creates and exports labels as PNG. PLA+ is first, “Andere” is removed, and the label text sizes are increased. Browser printing sends no Bluetooth data directly.

## Nelko P21 direct printing on Windows

For Bluetooth Classic SPP direct printing, open `label-studio/windows-app/` and double-click `STARTEN.bat`. Requirements: Windows 10/11, Python 3.10 or newer (Add Python to PATH), Microsoft Edge WebView2 Runtime, a paired Nelko P21 and its outgoing Bluetooth COM port. First start installs packages from `requirements.txt`; select COM5 or the correct outgoing port in the app.

Windows custom dropdown options and the last selections are stored outside this folder in `%APPDATA%\Filament Label Studio\settings.json`.
