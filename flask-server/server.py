from flask import Flask, request, send_from_directory, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from pydub import AudioSegment
import numpy as np
import soundfile as sf
from audiotsm import phasevocoder
from audiotsm.io.wav import WavReader, WavWriter
import librosa



app = Flask(__name__)
CORS(app)

@app.route('/api/save-audio', methods=['POST'])
def save_audio():
    file_name = request.args.get('file_name')
    if not file_name.endswith('.wav'):
        file_name += '.wav'
    file_path = os.path.join('audio', file_name)
    with open(file_path, 'wb') as f:
        f.write(request.data)
    return file_name


@app.route('/audio/<path:path>')
def serve_audio(path):
    return send_from_directory('audio', path, mimetype='audio/wav')

@app.route('/api/save-audio/pitch', methods=['POST'])
def save_audio2():
    file_name = request.form.get('file_name')
    if not file_name.endswith('.wav'):
        file_name += '.wav'
    pitch_shift = request.form.get('shift')
    audio_file = request.files['file']
    y, sr = librosa.load(audio_file, sr=None)
    y_shifted = librosa.effects.pitch_shift(y, sr=sr, n_steps=pitch_shift)
    file_path = os.path.join('audio', file_name)
    sf.write(file_path, y_shifted, sr)
    return file_name



if __name__ == '__main__':
    app.run()



