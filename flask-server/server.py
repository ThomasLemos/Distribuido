from flask import Flask, request, jsonify
import soundfile as sf
import numpy as np
import sounddevice as sd

app = Flask(__name__)

def record_audio(duration):
    # Record audio using sounddevice library
    fs = 44100  # Sample rate
    frames = int(duration * fs)  # Number of frames
    recording = sd.rec(frames, samplerate=fs, channels=1)

    # Wait until recording is finished
    sd.wait()

    # Save recording to WAV file
    sf.write('audio/recorded_audio.wav', recording, fs)

def stop_recording():
    # Stop recording by stopping the sounddevice stream
    sd.stop()

@app.route('/start-recording', methods=['POST'])
def start_recording():
    # Get duration of recording in seconds from client request
    duration = request.json['duration']

    # Start recording audio
    record_audio(duration)

    return jsonify({'message': 'Audio recording started.'})

@app.route('/stop-recording', methods=['POST'])
def end_recording():
    # Stop recording audio
    stop_recording()

    return jsonify({'message': 'Audio recording stopped.'})

if __name__ == '__main__':
    app.run()



