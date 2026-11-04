# Filament Label Studio – Windows-Druckdienst

## Direktdruck aus der 3D Library

Die GitHub-Pages-Website kann nicht selbst auf den Bluetooth-COM-Port zugreifen. Dafür läuft auf dem eigenen Windows-PC ein lokaler Druckdienst. Er bindet ausschließlich an `127.0.0.1` und akzeptiert Browser-Anfragen nur von `https://pietx1.github.io`.

## Einrichtung

1. Den Nelko P21 in Windows per Bluetooth koppeln.
2. `INSTALL_AUTOSTART.bat` einmal doppelklicken. Das installiert die Python-Pakete und richtet den Windows-Autostart ein.
3. Falls Label Studio den Dienst danach nicht findet, `START_DRUCKDIENST.bat` doppelklicken. Das schwarze Fenster offen lassen. Fehlermeldungen werden dort sichtbar.
4. In Label Studio auf **COM-Ports neu suchen** klicken.
5. Den ausgehenden Bluetooth-COM-Port auswählen und **Verbinden** anklicken.
6. Sobald der Status grün ist, **Etikett direkt drucken** verwenden.

## COM-Port finden

Windows kann für Bluetooth mehrere COM-Ports anzeigen. In Label Studio werden die erkannten Ports samt Beschreibung angezeigt. Wenn mehrere Ports vorhanden sind, den **ausgehenden** Bluetooth-COM-Port des Nelko P21 auswählen. Die Auswahl COM5 ist nur ein Vorschlag und nicht garantiert richtig.

Wenn kein passender Port erscheint:
- Windows-Einstellungen → Bluetooth und Geräte → Geräte öffnen und prüfen, ob der P21 gekoppelt ist.
- Im Geräte-Manager unter **Anschlüsse (COM & LPT)** nachsehen, welche Bluetooth-Ports vorhanden sind.
- Prüfen, ob eine andere App den Port bereits geöffnet hat.

## Protokoll und Autostart

Der Druckdienst schreibt ein Protokoll nach `%APPDATA%\Filament Label Studio\bridge.log`. `UNINSTALL_AUTOSTART.bat` entfernt den automatischen Windows-Start.

Der PC muss eingeschaltet sein und der lokale Dienst laufen. Auf Handy oder anderen PCs ohne eigenen lokalen Druckdienst bleibt PNG-Export verfügbar. Der Dienst lauscht nur auf dem eigenen Rechner und nicht im WLAN/Internet.
