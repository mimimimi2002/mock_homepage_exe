import sys
from PyQt6.QtWidgets import (
    QApplication, QWidget, QPushButton, QVBoxLayout,
    QFileDialog, QLabel, QMessageBox
)
from PyQt6.QtCore import Qt
import os
import shutil
import subprocess
import socket
import webbrowser
import traceback
import time
import platform


class UploadApp(QWidget):
    def __init__(self):
        super().__init__()
        self.server_process = None

        self.setWindowTitle('モックホームページを立ち上げ')
        self.layout = QVBoxLayout()

        self.btn_upload = QPushButton('フォルダを選択', self)
        self.btn_upload.clicked.connect(self.open_file_dialog)
        self.layout.addWidget(self.btn_upload)

        self.label_file = QLabel('dataフォルダが選択されていません', self)
        self.label_file.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.label_file.setTextInteractionFlags(
            Qt.TextInteractionFlag.TextSelectableByMouse
        )
        self.layout.addWidget(self.label_file)

        self.setLayout(self.layout)
        self.resize(500, 300)
        self.setStyleSheet("background-color: #FFF3E0;")

    # ========= パス =========

    def get_external_base_path(self):
        if getattr(sys, 'frozen', False):
            return os.path.dirname(sys.executable)
        return os.path.dirname(os.path.abspath(__file__))

    def get_internal_base_path(self):
        if hasattr(sys, '_MEIPASS'):
            return sys._MEIPASS
        return os.path.dirname(os.path.abspath(__file__))

    # ========= メイン =========

    def open_file_dialog(self):
        data_folder_path = QFileDialog.getExistingDirectory(self, "dataフォルダを選択")
        if not data_folder_path:
            return

        self.label_file.setText(f'選択: {data_folder_path}')

        try:
            # ========= ファイルチェック =========
            files = [
                os.path.join(data_folder_path, "judge_data", "updated_judge.xlsx"),
                os.path.join(data_folder_path, "judge_data", "judge_data.json"),
                os.path.join(data_folder_path, "judge_data", "option_count.json"),
                os.path.join(data_folder_path, "judge_data", "option_data.json"),
                os.path.join(data_folder_path, "image"),
            ]

            missing = [f for f in files if not os.path.exists(f)]
            if missing:
                self.show_error(["以下が見つかりません:\n" + "\n".join(missing)])
                return

            # ========= パス =========
            external_base = self.get_external_base_path()
            internal_base = self.get_internal_base_path()

            external_mock = os.path.join(external_base, "homepage_mock")
            internal_mock = os.path.join(internal_base, "homepage_mock")

            # ========= 初回コピー =========
            if not os.path.exists(external_mock):
                shutil.copytree(internal_mock, external_mock)

            print("external_mock", external_mock)
            print("files:", os.listdir(external_mock))

            # ========= data更新 =========
            dest_data = os.path.join(external_mock, "data")

            if os.path.exists(dest_data):
                shutil.rmtree(dest_data, ignore_errors=True)

            shutil.copytree(data_folder_path, dest_data)

            # ========= サーバー再起動 =========
            self.stop_server()

            port = self.find_free_port()
            server_path = os.path.join(external_mock, "server.exe") if platform.system() == "Windows" else os.path.join(external_mock, "server")
            print("server_path", server_path)
            print("exists:", os.path.exists(server_path))


            self.server_process = subprocess.Popen(
                [server_path, str(port)],
                cwd=external_mock,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            # ========= 即クラッシュ検出 =========
            time.sleep(0.5)

            if self.server_process.poll() is not None:
                out, err = self.server_process.communicate()
                raise RuntimeError(
                    "HTTPサーバーが起動直後にクラッシュしました\n\n"
                    f"STDOUT:\n{out}\n\n"
                    f"STDERR:\n{err}"
                )

            # ========= 起動確認 =========
            if not self.wait_for_server(port):
                out, err = self.server_process.communicate()
                raise RuntimeError(
                    f"サーバー起動待機に失敗しました（ポート未開放）\n\n"
                    f"PORT: {port}\n\n"
                    f"STDOUT:\n{out}\n\n"
                    f"STDERR:\n{err}"
                )
            url = f"http://localhost:{port}/homepage.html"
            webbrowser.open(url)

            self.label_file.setText(f"サーバー起動中\n{url}")

        except Exception:
            QMessageBox.critical(self, "エラー", traceback.format_exc())

    # ========= サーバー制御 =========

    def stop_server(self):
        if self.server_process:
            try:
                self.server_process.terminate()
                self.server_process.wait(timeout=2)
            except:
                pass
            self.server_process = None

    # ========= ユーティリティ =========

    def show_error(self, messages):
        QMessageBox.critical(self, "エラー", "\n\n".join(messages))

    def is_port_in_use(self, port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(("localhost", port)) == 0

    def find_free_port(self, start=8000):
        port = start
        while self.is_port_in_use(port):
            port += 1
        return port

    def wait_for_server(self, port, timeout=5):
        start = time.time()
        while time.time() - start < timeout:
            if self.is_port_in_use(port):
                return True
            time.sleep(0.1)
        return False

    def closeEvent(self, event):
        self.stop_server()
        event.accept()


# ========= 起動 =========

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = UploadApp()
    window.show()
    sys.exit(app.exec())