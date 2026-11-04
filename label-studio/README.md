# Filament Label Studio

Browser editor for 40 × 14 mm filament labels. Create and export a PNG, or print directly to a Nelko P21 when the local Windows print bridge is running. PLA+ is first; the generic “Andere” material entry has been removed. Label typography was increased: manufacturer 38 px, material 42 px, finish 25 px and color 34 px.

## Direct printing from GitHub Pages

1. On the Windows PC, open `windows-app/INSTALL_AUTOSTART.bat` once.
2. This installs the local print bridge, starts it in the background and configures it to start with Windows.
3. Close the separate `windows-app/STARTEN.bat` desktop window if it is open, so it does not occupy the Bluetooth COM port.
4. Open the 3D Library in the browser, choose Label Studio and use **Etikett direkt drucken**.

The local bridge listens only on `127.0.0.1` and only accepts browser requests from `https://pietx1.github.io`. It automatically tries COM5 or a Bluetooth port whose description contains Nelko/P21. If the browser asks for local-network access, allow it for the 3D Library site.

The PC must be on and the bridge must be running. On phones or other computers without their own bridge, PNG export remains available.

To remove the Windows auto-start entry, run `windows-app/UNINSTALL_AUTOSTART.bat`.
