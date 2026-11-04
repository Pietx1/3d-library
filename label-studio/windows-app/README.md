# Filament Label Studio – Windows + Nelko P21

## Was ist neu?
Diese App verwendet die ursprüngliche HTML-/CSS-/JavaScript-Oberfläche von Filament Label Studio v1.1.
Das Design wird nicht mehr mit Tkinter nachgebaut.

- Original Website-Layout, Dropdowns, Plus-Dialoge und Etikettenvorschau
- Eigene Hersteller, Materialien, Farben und Ausführungen bleiben im lokalen Browser-Speicher erhalten
- Direktdruck auf den Nelko P21 über Bluetooth-SPP / COM-Port
- COM5 wird beim Start automatisch bevorzugt und verbunden, wenn Windows den Port meldet
- Über den Status oben rechts lässt sich ein anderer COM-Port auswählen
- Die Website erzeugt das 640 × 224 PNG; Python überträgt dieses konkrete Bild an den Drucker

## Start
1. ZIP in einen neuen Ordner entpacken.
2. `STARTEN.bat` doppelklicken.
3. Beim ersten Start werden `pywebview`, `pyserial` und `Pillow` installiert.
4. Die App öffnet sich in einem eigenen Windows-Fenster.
5. Wenn COM5 nicht automatisch verbunden wird, oben rechts auf den Druckerstatus klicken und den ausgehenden P21-Port auswählen.

## Voraussetzungen
- Windows 10/11
- Python 3.10 oder neuer
- Microsoft Edge WebView2 Runtime (auf vielen Windows-Systemen bereits vorhanden)
- Nelko P21 gekoppelt; ausgehender Bluetooth-COM-Port verfügbar

## Druckhinweis
P21-Profil: 14 × 40 mm, 96 × 284 Druckpunkte, TSPL `DIRECTION 0,0`.
Die Bitmap-Polarität ist auf die letzte Korrektur eingestellt: weißer Hintergrund und schwarze Druckelemente.
Bitte beim ersten Start genau ein Testetikett drucken und bei Bedarf die Schwarz-Weiß-Polarität oder Dichte anhand des Ausdrucks prüfen.

## Lizenzhinweis
Die Druckübertragung folgt dem öffentlich dokumentierten P21-/TSPL-Ansatz und der getesteten Implementierung von TylerCode/Fyne-P21-Print:
https://github.com/TylerCode/Fyne-P21-Print
Die MIT-Lizenznotiz des Projekts liegt in `LICENSE-Fyne-P21-Print.txt`.


## Version 1.1 – Windows-Startdatei korrigiert

- `STARTEN.bat` wurde mit Windows-kompatiblen CRLF-Zeilenenden neu erstellt.
- Die Startdatei enthält nur ASCII-Zeichen, um Probleme mit der CMD-Codepage zu vermeiden.
- Python wird vor der Installation geprüft; Fehler erhalten eine klare Meldung.


## Version 1.2 – größere Schrift

- Schrift im echten Druckbild vergrößert: Material und Farbe sind deutlich größer.
- Schriftstärke von extrem fett auf normales Bold reduziert, damit die Innenräume von A, P, B und R beim Thermodruck besser offen bleiben.
- Lange Farbbezeichnungen werden weiterhin auf maximal drei Zeilen angepasst.
- Die Windows-Oberfläche und Etikettenvorschau sind auf größeren Monitoren breiter.
- Bluetooth-Verbindung, COM-Port-Suche und TSPL-Druckübertragung wurden nicht geändert.


## Version 1.3 – Drucken und dauerhafte Einstellungen

- Vor jedem Druck wird der P21-Pausezustand mit derselben ESC-Sequenz wie in der funktionierenden P21-Referenz aufgehoben.
- Der Druckauftrag wird vollständig übertragen; Teilschreibvorgänge werden erneut geschrieben.
- Eigene Hersteller, Materialien, Farben und Ausführungen werden zusätzlich in `%APPDATA%\Filament Label Studio\settings.json` gespeichert.
- Die zuletzt gewählten Werte werden ebenfalls gespeichert und beim nächsten Start wiederhergestellt.
- Bei einer frischen Installation ist PLA+ automatisch vorausgewählt.
- Bereits vorhandene lokale Website-Einträge werden beim ersten App-Start in die JSON-Datei übernommen, sofern der WebView-Speicher sie noch enthält.


## Speicherung in Windows v1.3

Eigene Dropdown-Einträge und die zuletzt ausgewählten Werte werden unter
`%APPDATA%\Filament Label Studio\settings.json` gespeichert. Die Daten liegen
damit außerhalb des entpackten Programmordners und bleiben beim Schließen und
bei einem Update erhalten. Auf einem neuen PC müssen sie separat übertragen
oder später über die 3D Library zentral synchronisiert werden.

Bei einer frischen Installation wird `PLA+` vorausgewählt. Eine bereits
gespeicherte Materialauswahl wird weiterhin wiederhergestellt.


## Version 1.4 – größere Schrift und PLA+ Standard

- Hersteller: 38 px Ausgangsgröße (vorher 35).
- Material: 42 px (vorher 38).
- Ausführung, z. B. „Basic“: 25 px (vorher 19).
- Farbbezeichnung, z. B. „Black“: 34 px (vorher 28).
- Die Druckgrafik und die Bildschirmvorschau verwenden die gleichen größeren Schriftproportionen.
- PLA+ steht im Material-Dropdown an erster Stelle und wird bei der Migration der alten PLA-Standardauswahl einmalig vorausgewählt.
- Der allgemeine Material-Eintrag „Andere“ wurde entfernt. Neue Materialien können über das Plus hinzugefügt werden.


## Integration in die 3D Library

Dieser Ordner ist der Label-Studio-Bereich des gemeinsamen Repositories `pietx1/3d-library`. Über die Library-Navigation ist er unter `label-studio/` erreichbar.

- Im Browser (z. B. GitHub Pages) können Etiketten erstellt und als PNG gespeichert werden.
- Für den Bluetooth-Direktdruck auf den Nelko P21 muss die Windows-Version über `STARTEN.bat` gestartet werden. Sie nutzt `pywebview` und den Python-Druckdienst in `main.py`.
- Die Weboberfläche und der Windows-Druckdienst verwenden dieselben Dateien.

Die Windows-Einstellungen bleiben unter `%APPDATA%\Filament Label Studio\settings.json` gespeichert und liegen damit außerhalb des Repository-Ordners.
