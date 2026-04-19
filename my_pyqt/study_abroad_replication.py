import sys
from PyQt6.QtWidgets import QApplication, QWidget, QPushButton, QVBoxLayout, QFileDialog, QLabel, QMessageBox
from PyQt6.QtCore import Qt
import os
import shutil
import subprocess
import socket
import webbrowser
import traceback

class UploadApp(QWidget):
    def __init__(self):
        super().__init__()
        self.server_process = None
        self.setWindowTitle('モックホームページを立ち上げ')
        self.layout = QVBoxLayout()

        # ボタン
        self.btn_upload = QPushButton('フォルダを選択', self)
        self.btn_upload.clicked.connect(self.open_file_dialog)
        self.layout.addWidget(self.btn_upload)

        # ラベル
        self.label_file = QLabel('dataフォルダが選択されていません', self)
        self.label_file.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.label_file.setTextInteractionFlags(
            Qt.TextInteractionFlag.TextSelectableByMouse
        )
        self.layout.addWidget(self.label_file)

        self.setLayout(self.layout)
        self.resize(500, 300)
        self.setStyleSheet("background-color: #FFF3E0;")

    # ========= パス関連 =========

    def get_external_base_path(self):
        """書き込み先（exe外）"""
        if getattr(sys, 'frozen', False):
            return os.path.dirname(sys.executable)
        return os.path.dirname(os.path.abspath(__file__))

    def get_internal_base_path(self):
        """読み込み元（exe内 or 通常）"""
        if hasattr(sys, '_MEIPASS'):
            return sys._MEIPASS
        return os.path.dirname(os.path.abspath(__file__))

    # ========= メイン処理 =========

    def open_file_dialog(self):
        data_folder_path = QFileDialog.getExistingDirectory(self, "dataフォルダを選択")
        if not data_folder_path:
            return

        self.label_file.setText(f'選択: {data_folder_path}')

        # 必須ファイルチェック
        files = [
            os.path.join(data_folder_path, "judge_data", "updated_judge.xlsx"),
            os.path.join(data_folder_path, "judge_data", "judge_data.json"),
            os.path.join(data_folder_path, "judge_data", "option_count.json"),
            os.path.join(data_folder_path, "judge_data", "option_data.json"),
            os.path.join(data_folder_path, "image"),
        ]

        missing_files = [f for f in files if not os.path.exists(f)]

        if missing_files:
            self.show_error(["以下のファイルが見つかりません:\n" + "\n".join(missing_files)])
            return

        try:
            # ========= パス準備 =========
            external_base = self.get_external_base_path()
            internal_base = self.get_internal_base_path()

            external_mock = os.path.join(external_base, "homepage_mock")
            internal_mock = os.path.join(internal_base, "homepage_mock")

            # ========= 初回：テンプレートコピー =========
            if not os.path.exists(external_mock):
                shutil.copytree(internal_mock, external_mock)

            # ========= data上書き =========
            dest_data = os.path.join(external_mock, "data")

            if os.path.exists(dest_data):
                shutil.rmtree(dest_data)

            shutil.copytree(data_folder_path, dest_data)

            # ========= サーバー起動 =========
            if self.server_process:
                self.server_process.terminate()
                self.server_process.wait()

            port = self.find_free_port()

            self.server_process = subprocess.Popen(
                ["python", "-m", "http.server", str(port)],
                cwd=external_mock
            )

            url = f"http://localhost:{port}/homepage.html"
            if self.wait_for_server(port):
                webbrowser.open(url)
                self.label_file.setText(
                    f"サーバーを起動しました。\n{url}"
                )
            else:
                QMessageBox.critical(self, "エラー", "サーバーの起動に失敗しました", e)

                self.label_file.setText(
                    f"サーバーの起動に失敗しました。\n{url}"
                )

        except Exception as e:
            QMessageBox.critical(self, "エラー", traceback.format_exc())


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

    def closeEvent(self, event):
        if self.server_process:
            self.server_process.terminate()
            self.server_process.wait()
        event.accept()

    def wait_for_server(self, port, timeout=5):
      import time
      start = time.time()
      while time.time() - start < timeout:
          if self.is_port_in_use(port):
              return True
          time.sleep(0.1)
      return False

# ========= 起動 =========

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = UploadApp()
    window.show()
    sys.exit(app.exec())