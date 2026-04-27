from http.server import SimpleHTTPRequestHandler
from socketserver import ThreadingTCPServer
from functools import partial

def run(port, directory):
    try:
        handler = partial(SimpleHTTPRequestHandler, directory=directory)

        with ThreadingTCPServer(("127.0.0.1", port), handler) as httpd:
            print(f"Serving {directory} at port {port}")
            httpd.serve_forever()
    except Exception as e:
        with open("server_error.log", "w") as f:
            f.write(str(e))