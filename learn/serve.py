"""只在本机提供 learn/dist 的预览：python3 learn/serve.py [--port 8770]"""
import argparse
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8770)
args = parser.parse_args()
handler = functools.partial(SimpleHTTPRequestHandler, directory=str(Path(__file__).resolve().parent / 'dist'))
server = ThreadingHTTPServer(('127.0.0.1', args.port), handler)
print(f'学习站预览：http://127.0.0.1:{args.port}/', flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
