from flask import Flask, request, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/save-audio', methods=['POST'])
def save_audio():
    file_name = request.args.get('file_name')
    file_path = os.path.join('audio', file_name)
    with open(file_path, 'wb') as f:
        f.write(request.data)
    return file_name


@app.route('/audio/<path:path>')
def serve_audio(path):
    return send_from_directory('audio', path)

if __name__ == '__main__':
    app.run()













