import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        setStatus('Audio recorded successfully!');
        const fileName = window.prompt('Please enter a file name', 'recording.wav');
        if (fileName) {
          fetch(`/api/save-audio?file_name=${fileName}`, { method: 'POST', body: audioBlob })
            .then(response => response.text())
            .then(fileName => setStatus(`Audio saved successfully as ${fileName}!`))
            .catch(() => setStatus('Error saving audio file'));

        }
      });

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
      setStatus('Recording...');
    }).catch(error => {
      console.log(error);
      setStatus('Cannot access microphone');
    });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleRecordButtonClick = () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      audioRef.current.src = reader.result;
      setStatus('Audio file loaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container">
      <button className={recording ? 'stop-button' : 'record-button'} onClick={handleRecordButtonClick}>
      </button>
      <audio ref={audioRef} controls className="audioposition" />
      <label htmlFor="fileInput">Select a WAV file</label>
      <input id="fileInput" type="file" accept="audio/wav" className="file-input" onChange={handleFileSelect} />
      <p className="message">{status}</p>
    </div>
  );
}

export default App;















