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
        fetch('/api/save-audio', { method: 'POST', body: audioBlob });
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

  return (
    <div className="container">
      <button className={recording ? 'stop-button' : 'record-button'} onClick={handleRecordButtonClick}>
      </button>
      <audio ref={audioRef} controls className="audioposition"/>
      <p className="message">{status}</p>
    </div>
  );
}

export default App;












