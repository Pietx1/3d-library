from __future__ import annotations

import json
import logging
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from main import PrinterBridge

HOST = "127.0.0.1"
PORT = 8765
ALLOWED_ORIGINS = {"https://pietx1.github.io"}

app_data = Path(os.environ.get("APPDATA", str(Path.home() / "AppData" / "Roaming")))
log_dir = app_data / "Filament Label Studio"
log_dir.mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    filename=log_dir / "bridge.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    encoding="utf-8",
)
printer = PrinterBridge()


def status_payload() -> dict[str, Any]:
    ports = printer.list_ports()
    connected = bool(printer._port is not None and printer._port.is_open)
    return {
        "ok": True,
        "service": "Filament Label Studio Druckdienst",
        "connected": connected,
        "port": printer._port_name if connected else None,
        "ports": ports,
    }


class Handler(BaseHTTPRequestHandler):
    server_version = "FilamentLabelBridge/1.1"

    def log_message(self, fmt: str, *args: Any) -> None:
        logging.info(fmt, *args)

    def _origin_allowed(self) -> bool:
        return self.headers.get("Origin", "") in ALLOWED_ORIGINS

    def _send_json(self, code: int, payload: dict[str, Any]) -> None:
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        origin = self.headers.get("Origin", "")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.end_headers()
        self.wfile.write(raw)

    def do_OPTIONS(self) -> None:
        if not self._origin_allowed():
            self._send_json(403, {"ok": False, "error": "Nicht erlaubter Website-Ursprung."})
            return
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Access-Control-Max-Age", "600")
        self.send_header("Vary", "Origin")
        self.end_headers()

    def do_GET(self) -> None:
        if not self._origin_allowed():
            self._send_json(403, {"ok": False, "error": "Nicht erlaubter Website-Ursprung."})
            return
        if self.path != "/status":
            self._send_json(404, {"ok": False, "error": "Unbekannter Endpunkt."})
            return
        self._send_json(200, status_payload())

    def do_POST(self) -> None:
        if not self._origin_allowed():
            self._send_json(403, {"ok": False, "error": "Nicht erlaubter Website-Ursprung."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 12_000_000:
                raise ValueError("Ungültige Anfragegröße.")
            data = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(data, dict):
                raise ValueError("Ungültige Anfrage.")
            if self.path == "/connect":
                device = str(data.get("device") or "").strip()
                result = printer.connect(device)
                result["connected"] = bool(result.get("ok"))
                result["ports"] = printer.list_ports()
                self._send_json(200 if result.get("ok") else 503, result)
                return
            if self.path == "/print":
                png = data.get("pngDataUrl")
                if not isinstance(png, str):
                    raise ValueError("Etikettenbild fehlt.")
                result = printer.print_label(png, data.get("density", 10), data.get("copies", 1))
                result["connected"] = bool(printer._port is not None and printer._port.is_open)
                self._send_json(200 if result.get("ok") else 503, result)
                return
            self._send_json(404, {"ok": False, "error": "Unbekannter Endpunkt."})
        except Exception as exc:
            logging.exception("Fehler bei Anfrage %s", self.path)
            self._send_json(400, {"ok": False, "error": str(exc)})


def main() -> None:
    logging.info("Druckdienst wird gestartet.")
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    server.daemon_threads = True
    logging.info("Druckdienst hört auf http://%s:%s", HOST, PORT)
    try:
        server.serve_forever(poll_interval=0.5)
    except KeyboardInterrupt:
        logging.info("Druckdienst manuell beendet.")
    finally:
        server.server_close()
        printer.shutdown()
        logging.info("Druckdienst beendet.")


if __name__ == "__main__":
    main()
