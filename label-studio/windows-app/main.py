from __future__ import annotations

import base64
import binascii
import json
import os
import threading
import time
from io import BytesIO
from pathlib import Path

import serial
from serial.tools import list_ports
from PIL import Image, ImageOps

import webview

APP_DIR = Path(__file__).resolve().parent
HEAD_DOTS = 96
LABEL_DOTS = 284
BAUD_RATE = 115200


def make_p21_job(png_data_url: str, density: int = 10, copies: int = 1) -> bytes:
    """Convert the website's 640x224 PNG to the P21 96x284 one-bit TSPL bitmap."""
    if not isinstance(png_data_url, str) or "," not in png_data_url:
        raise ValueError("Das Etikettenbild wurde nicht korrekt übertragen.")

    try:
        encoded = png_data_url.split(",", 1)[1]
        raw = base64.b64decode(encoded, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise ValueError("Das PNG-Etikett konnte nicht gelesen werden.") from exc

    try:
        with Image.open(BytesIO(raw)) as opened:
            source = opened.convert("RGB")
    except Exception as exc:
        raise ValueError("Das Etikettenbild ist beschädigt oder kein PNG.") from exc

    # The website export is horizontal 640x224 (40:14). Rotate to the P21
    # print-head axis, then resize to the same 96x284 working raster as v0.5/0.6.
    oriented = source.resize((320, 112), Image.Resampling.LANCZOS)
    oriented = oriented.transpose(Image.Transpose.ROTATE_90)
    oriented = oriented.resize((HEAD_DOTS, LABEL_DOTS), Image.Resampling.LANCZOS)
    gray = oriented.convert("L")
    pixels = gray.load()

    # P21 polarity from the latest inversion correction: white background=1,
    # black printed artwork=0. Bits are packed most-significant-bit first.
    packed = bytearray((HEAD_DOTS // 8) * LABEL_DOTS)
    row_bytes = HEAD_DOTS // 8
    for y in range(LABEL_DOTS):
        row_offset = y * row_bytes
        for byte_x in range(row_bytes):
            value = 0
            for bit in range(8):
                x = byte_x * 8 + bit
                if pixels[x, y] >= 170:  # white pixel
                    value |= 1 << (7 - bit)
            packed[row_offset + byte_x] = value

    density = max(0, min(15, int(density)))
    copies = max(1, min(20, int(copies)))
    header = (
        b"SIZE 14.0 mm,40.0 mm\r\n"
        b"GAP 5.0 mm,0.0 mm\r\n"
        b"DIRECTION 0,0\r\n"
        + f"DENSITY {density}\r\n".encode("ascii")
        + b"CLS\r\n"
        + f"BITMAP 0,0,12,{LABEL_DOTS},1,".encode("ascii")
    )
    return header + bytes(packed) + b"\r\n" + f"PRINT {copies}\r\n".encode("ascii")


class PrinterBridge:
    """Small Python API exposed to the HTML UI through pywebview."""

    def __init__(self):
        self._port = None
        self._port_name = None
        self._lock = threading.RLock()
        app_data = Path(os.environ.get("APPDATA", str(Path.home() / "AppData" / "Roaming")))
        self._settings_dir = app_data / "Filament Label Studio"
        self._settings_file = self._settings_dir / "settings.json"

    def load_settings(self):
        """Load dropdown options and the last used selections from a persistent JSON file."""
        try:
            if self._settings_file.exists():
                with self._settings_file.open("r", encoding="utf-8") as handle:
                    data = json.load(handle)
                if isinstance(data, dict):
                    return data
        except Exception:
            pass
        return {}

    def save_settings(self, data):
        """Persist user-defined dropdown values outside the WebView browser cache."""
        if not isinstance(data, dict):
            return {"ok": False, "error": "Ungültige Einstellungen."}
        try:
            self._settings_dir.mkdir(parents=True, exist_ok=True)
            temp_file = self._settings_file.with_suffix(".tmp")
            with temp_file.open("w", encoding="utf-8") as handle:
                json.dump(data, handle, ensure_ascii=False, indent=2)
            temp_file.replace(self._settings_file)
            return {"ok": True}
        except Exception as exc:
            return {"ok": False, "error": f"Einstellungen konnten nicht gespeichert werden: {exc}"}

    def list_ports(self):
        ports = []
        for item in list_ports.comports():
            ports.append({
                "device": item.device,
                "description": item.description or item.device,
            })
        return ports

    def connect(self, device: str):
        with self._lock:
            try:
                device = str(device or "").strip()
                if not device:
                    return {"ok": False, "error": "Bitte einen COM-Port auswählen."}
                if self._port and self._port.is_open and self._port_name == device:
                    return {"ok": True, "port": device}
                self._close_locked()
                port = serial.Serial(
                    port=device,
                    baudrate=BAUD_RATE,
                    timeout=3,
                    write_timeout=30,
                    bytesize=serial.EIGHTBITS,
                    parity=serial.PARITY_NONE,
                    stopbits=serial.STOPBITS_ONE,
                )
                self._port = port
                self._port_name = device
                return {"ok": True, "port": device}
            except Exception as exc:
                self._close_locked()
                return {"ok": False, "error": f"{device} konnte nicht geöffnet werden: {exc}"}

    def disconnect(self):
        with self._lock:
            self._close_locked()
        return {"ok": True}

    def _close_locked(self):
        if self._port is not None:
            try:
                self._port.close()
            except Exception:
                pass
        self._port = None
        self._port_name = None

    def print_label(self, png_data_url: str, density: int = 10, copies: int = 1):
        with self._lock:
            if self._port is None or not self._port.is_open:
                return {"ok": False, "error": "Der Nelko P21 ist nicht verbunden."}
            try:
                job = make_p21_job(png_data_url, density, copies)
                # The P21 reference implementation clears its pause state before every job.
                # Without this escape sequence the printer may stay paired/connected but ignore
                # the next bitmap transfer after a previous job or an idle pause.
                self._port.write(b"\x1b!o")
                self._port.flush()
                time.sleep(0.1)

                written_total = 0
                while written_total < len(job):
                    written = self._port.write(job[written_total:])
                    if not written:
                        raise IOError("Die Bluetooth-Verbindung hat die Druckdaten nicht vollständig angenommen.")
                    written_total += written
                self._port.flush()
                return {"ok": True, "port": self._port_name, "bytes": written_total}
            except Exception as exc:
                return {"ok": False, "error": f"Drucken fehlgeschlagen: {exc}"}

    def shutdown(self):
        with self._lock:
            self._close_locked()
        return {"ok": True}


def main():
    bridge = PrinterBridge()
    window = webview.create_window(
        "Filament Label Studio · Nelko P21",
        url=(APP_DIR / "index.html").as_uri(),
        js_api=bridge,
        width=820,
        height=980,
        min_size=(560, 720),
        resizable=True,
        background_color="#101114",
        text_select=False,
    )

    def on_closed():
        bridge.shutdown()

    window.events.closed += on_closed
    webview.start(gui="edgechromium", debug=False)


if __name__ == "__main__":
    main()
