# 3D Library

The existing 3D Library remains the main application at the repository root. Filament Label Studio is integrated as a second area at `/label-studio/` and linked from the Library navigation.

## Label Studio
The browser editor builds and exports 40 × 14 mm label PNGs. It uses PLA+ as the first material, removes the general “Andere” entry, and has enlarged typography: manufacturer 38 px, material 42 px, finish 25 px, color 34 px.

The browser version exports PNG; it cannot access the Windows Bluetooth COM port directly. For direct Bluetooth Classic SPP printing to a Nelko P21, use the separate Windows app with its local Python/pywebview print bridge. The complete local project package supplied with this update contains that app under `label-studio/windows-app/`.

## Project layout
```text
/
├── 3D Library: index.html, style.css, script.js, sw.js
└── label-studio/
    ├── browser Label Studio
    └── windows-app/ (in the supplied merged project ZIP)
```
