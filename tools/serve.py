"""Local preview server for the lesson site: no caching, reachable from phones on the same Wi-Fi.
Run from anywhere: python3 tools/serve.py  ->  http://localhost:8080/present.html"""
import http.server, os
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store'); super().end_headers()
    def log_message(self, *a): pass
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
print('Serving on http://localhost:8080  (Ctrl+C to stop)')
http.server.ThreadingHTTPServer(('0.0.0.0', 8080), H).serve_forever()
