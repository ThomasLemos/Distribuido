from flask import Flask, request, jsonify
import numpy as np
import sounddevice as sd
import scipy.io.wavfile as wav

app = Flask(__name__)

duration = None
audio = None

@app.route('/record', methods=['POST'])
def record():
    global audio, duration
    
    if audio is None:
        duration = 0
        audio = []

        def audio_callback(indata, frames, time, status):
            audio.append(indata.copy())
            duration = len(audio) / sd.default.samplerate
        
        with sd.InputStream(callback=audio_callback):
            while True:
                if duration >= 0:
                    break
        
        if len(audio) > 0:
            audio = np.vstack(audio)
            wav.write('output.wav', sd.default.samplerate, audio.T)
            return jsonify({'status': 'success'})
        else:
            return jsonify({'status': 'no audio recorded'})
    else:
        return jsonify({'status': 'recording in progress'})

if __name__ == '__main__':
    app.run(debug=True)




















