from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
from functools import partial

def run(port, directory):
    handler = partial(SimpleHTTPRequestHandler, directory=directory)

    with TCPServer(("127.0.0.1", port), handler) as httpd:
        print(f"Serving {directory} at port {port}")
        httpd.serve_forever()