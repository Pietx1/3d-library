from __future__ import annotations
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from main import PrinterBridge

HOST = "127.0.0.1"
PORT = 8765
ALLOWED_ORIGINS = {"https://pietx1.github.io"}
printer = PrinterBridge()

def auto_connect() -> dict[str, Any]:
    ports = printer.list_ports()
    candidate = next((p for p in ports if p["device"].upper() == "COM5"), None)
    if candidate is None:
        candidate = next((p for p in ports if "nelko" in p["description"].lower() or "p21" in p["description"].lower()), None)
    if candidate is None:
        return {"ok": False, "connected": False, "error": "Kein Nelko-Bluetooth-COM-Port gefunden."}
    result = printer.connect(candidate["device"])
    return {**result, "connected": bool(result.get("ok")), "port": candidate["device"] if result.get("ok") else None}

def status_payload() -> dict[str, Any]:
    ports = printer.list_ports()
    connected = bool(printer._port is not None and printer._port.is_open)
    return {"ok": True, "connected": connected, "port": printer._port_name if connected else None, "ports": ports}

class Handler(BaseHTTPRequestHandler):
    server_version = "FilamentLabelBridge/1.0"
    def log_message(self, fmt: str, *args: Any) -> None:
        return
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
            self._send_json(403, {"ok": False, "error": "Diese Website darf den lokalen Druckdienst nicht verwenden."})
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
            if length <= 0 or length > 12000000:
                raise ValueError("Ungültige Anfragegröße.")
            data = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(data, dict):
                raise ValueError("Ungültige Anfrage.")
            if self.path == "/connect":
                device = str(data.get("device") or "").strip()
                if not device:
                    result = auto_connect()
                else:
                    result = printer.connect(device)
                    result["connected"] = bool(result.get("ok"))
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
            self._send_json(400, {"ok": False, "error": str(exc)})

def main() -> None:
    auto_connect()
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    server.daemon_threads = True
    try:
        server.serve_forever(poll_interval=0.5)
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        printer.shutdown()

if __name__ == "__main__":
    main()
