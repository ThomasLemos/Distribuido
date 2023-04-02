from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/save-audio', methods=['POST'])
def save_audio():
    with open('audio/recording.wav', 'wb') as f:
        f.write(request.data)
    return 'Audio saved successfully!'

if __name__ == '__main__':
    app.run()










