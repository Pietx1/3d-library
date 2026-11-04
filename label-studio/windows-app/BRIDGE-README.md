# Filament Label Studio – Windows-Druckdienst

## Direktdruck aus der 3D Library

Die GitHub-Pages-Website kann aus Sicherheitsgründen nicht selbst auf den Bluetooth-COM-Port zugreifen. Dafür läuft auf dem eigenen Windows-PC ein kleiner lokaler Druckdienst. Er bindet ausschließlich an `127.0.0.1` und akzeptiert Browser-Anfragen ausschließlich von `https://pietx1.github.io`.

### Einmalige Einrichtung

1. Den Nelko P21 in Windows per Bluetooth koppeln und den ausgehenden COM-Port sicherstellen.
2. `INSTALL_AUTOSTART.bat` im Ordner `windows-app` doppelklicken.
3. Die Einrichtung installiert die benötigten Pakete, startet den Dienst und legt einen Autostart-Eintrag für Windows an.
4. Die bisherige separate Label-Studio-Windows-App (`STARTEN.bat`) schließen, damit sie den Bluetooth-COM-Port nicht gleichzeitig belegt.
5. Danach die 3D Library im Browser öffnen und Label Studio verwenden.

Der Dienst versucht beim Start automatisch COM5 oder einen Port mit „Nelko“/„P21“ in der Beschreibung zu verbinden. Wenn der Drucker später eingeschaltet wird, kann er über den Druck-Button erneut verbunden werden.

### Bedienung

- In Label Studio zeigt die Statuszeile, ob der lokale Druckdienst und der Nelko P21 verbunden sind.
- `Etikett direkt drucken` überträgt das erzeugte Etikett direkt an den P21.
- `Etikett als PNG exportieren` bleibt als zusätzliche Exportmöglichkeit verfügbar.
- `UNINSTALL_AUTOSTART.bat` entfernt den automatischen Windows-Start. Der Dienst kann dann weiterhin manuell gestartet werden, indem `bridge.py` mit Python ausgeführt wird.

### Hinweise

- Der PC muss eingeschaltet sein und der lokale Druckdienst laufen.
- Der Druckdienst ist nur auf diesem PC verfügbar. Auf Handy oder einem anderen PC wird weiterhin PNG-Export angeboten, sofern dort kein eigener Druckdienst eingerichtet ist.
- Bei der ersten Browser-Anfrage kann Windows/Chrome eine Berechtigung für den Zugriff auf lokale Netzwerkgeräte anzeigen. Dies für `pietx1.github.io` erlauben.
- Der Dienst lauscht nicht im WLAN oder Internet, sondern nur auf dem eigenen Rechner.
