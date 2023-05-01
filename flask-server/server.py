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

@app.route('/api/save-audio/time-stretch', methods=['POST'])
def save_audio3():
    file_name = request.form.get('file_name')
    if not file_name.endswith('.wav'):
        file_name += '.wav'
    time_stretch = request.form.get('stretch')
    audio_file = request.files['file']
    y, sr = librosa.load(audio_file, sr=None)
    
    y_stretched = librosa.effects.time_stretch(y, rate=float(time_stretch))
    file_path = os.path.join('audio', file_name)
    sf.write(file_path, y_stretched, sr)
    return file_name

@app.route('/api/save-audio/trim', methods=['POST'])
def save_audio4():
    file_name = request.form.get('file_name')
    if not file_name.endswith('.wav'):
        file_name += '.wav'
    top_db = request.form.get('top_db')
    audio_file = request.files['file']
    y, sr = librosa.load(audio_file, sr=None)

    y_trimmed, index = librosa.effects.trim(y, top_db=int(top_db))
    file_path = os.path.join('audio', file_name)
    sf.write(file_path, y_trimmed, sr)
    return file_name

@app.route('/api/save-audio/preemphasis', methods=['POST'])
def save_audio5():
    file_name = request.form.get('file_name')
    if not file_name.endswith('.wav'):
        file_name += '.wav'
    coefficient = request.form.get('coefficient')
    audio_file = request.files['file']
    y, sr = librosa.load(audio_file, sr=None)
    
    y_preemphasized = librosa.effects.preemphasis(y, coef=float(coefficient))
    file_path = os.path.join('audio', file_name)
    sf.write(file_path, y_preemphasized, sr)
    return file_name

@app.route('/api/save-audio/harmonic', methods=['POST'])
def save_audio6():
    file_name = request.form.get('file_name')
    if not file_name.endswith('.wav'):
        file_name += '.wav'
    harmonic = request.form.get('harmonic')
    print(harmonic)
    audio_file = request.files['file']
    y, sr = librosa.load(audio_file, sr=None)

    y_harmonic = librosa.effects.harmonic(y, margin=float(harmonic))
    file_path = os.path.join('audio', file_name)
    sf.write(file_path, y_harmonic, sr)
    return file_name

@app.route('/api/save-audio/percussive', methods=['POST'])
def save_audio7():
    file_name = request.form.get('file_name')
    if not file_name.endswith('.wav'):
        file_name += '.wav'
    percussive = request.form.get('percussive')
    audio_file = request.files['file']
    y, sr = librosa.load(audio_file, sr=None)
    
    y_percussive = librosa.effects.percussive(y, margin=float(percussive))
    file_path = os.path.join('audio', file_name)
    sf.write(file_path, y_percussive, sr)
    return file_name


if __name__ == '__main__':
    app.run()



