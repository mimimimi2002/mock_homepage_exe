# server.py
from http.server import HTTPServer, SimpleHTTPRequestHandler

def run(port=8000):
    server = HTTPServer(("127.0.0.1", port), SimpleHTTPRequestHandler)
    print(f"Serving on {port}")
    server.serve_forever()

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1])
    run(port)