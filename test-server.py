#!/usr/bin/env python3
"""
Local test server for BizDynamix site with API proxy to VPS backend.
Serves HTML on http://localhost:8000 and proxies /api/chat to the VPS.
"""

import http.server
import socketserver
import urllib.request
import json
import sys
from pathlib import Path

PORT = 8888
VPS_API_URL = "http://localhost:4000"  # Change to VPS IP if testing remotely

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/api/chat":
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            try:
                # Forward to local backend (or VPS)
                req = urllib.request.Request(
                    f"{VPS_API_URL}/api/chat",
                    data=body,
                    headers={'Content-Type': 'application/json'}
                )
                with urllib.request.urlopen(req, timeout=30) as response:
                    response_data = response.read()
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(response_data)
            except Exception as e:
                print(f"Error proxying request: {e}", file=sys.stderr)
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = json.dumps({"error": str(e), "reply": "Backend error"}).encode()
                self.wfile.write(error_response)
        else:
            super().do_POST()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == "__main__":
    # Change to the project directory
    Path('/Users/edwinbrooks/Projects/WEBSITES/BDX').cwd() if hasattr(Path, 'cwd') else None
    
    handler = ProxyHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"🚀 Server running at http://localhost:{PORT}/")
        print(f"📡 API proxy: {VPS_API_URL}/api/chat")
        print(f"🌐 Open: http://localhost:{PORT}/index.html")
        print(f"💬 Test the chat widget - it will proxy to backend")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✋ Server stopped")
