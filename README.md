# 3D Library

The existing 3D Library remains the main application at the repository root. Filament Label Studio is integrated as a second area at `/label-studio/` and linked from the Library navigation.

## Label Studio
The browser editor builds and exports 40 × 14 mm label PNGs. PLA+ is the first material, the general “Andere” entry is removed, and label typography is enlarged: manufacturer 38 px, material 42 px, finish 25 px, color 34 px.

For direct Bluetooth Classic SPP printing to a Nelko P21 on Windows, download and extract `label-studio/Filament-Label-Studio-Windows-v1.4.zip`, then run `STARTEN.bat`. Requirements: Windows 10/11, Python 3.10 or newer, Microsoft Edge WebView2 Runtime, a paired P21 and its outgoing Bluetooth COM port. Browser-only mode exports PNG and cannot access the COM port directly.

Windows label settings remain outside the repository in `%APPDATA%\Filament Label Studio\settings.json`.
