"""Serve only generated files on the loopback interface."""
import argparse
import functools
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

BASE = Path(__file__).resolve().parents[1]
LEGACY = json.loads((BASE / 'templates/legacy-routes.json').read_text())


class Handler(SimpleHTTPRequestHandler):
    def send_head(self):
        if unquote(urlsplit(self.path).path) in LEGACY and not Path(self.translate_path(self.path)).exists():
            self.path = '/index.html'
        return super().send_head()


parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8769)
args = parser.parse_args()
server = ThreadingHTTPServer(('127.0.0.1', args.port), functools.partial(Handler, directory=str(BASE / 'dist')))
print(f'本地预览：http://127.0.0.1:{args.port}/', flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
