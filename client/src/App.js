import React, { useState, useRef } from 'react';
import './App.css';

function Component1() {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [selectedAudioSrc, setSelectedAudioSrc] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const selectedAudioRef = useRef(null);

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
        setAudioSrc(audioUrl);
        setStatus('Audio recorded successfully!');
        const fileName = window.prompt('Please enter a file name', 'recording');
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
      const audioUrl = reader.result;
      setSelectedAudioSrc(audioUrl);
      setStatus('Audio file loaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container">
      <button className={recording ? 'stop-button' : 'record-button'} onClick={handleRecordButtonClick}>
      </button>
      <audio ref={audioRef} controls className="top audioposition" src={audioSrc} />
      <audio ref={selectedAudioRef} controls className="audioposition" src={selectedAudioSrc} />
      <label htmlFor="fileInput">Select a WAV file</label>
      <input id="fileInput" type="file" accept="audio/wav" className="file-input" onChange={handleFileSelect} />
      <p className="message">{status}</p>
    </div>
  );
}

function Component2() {
  const [status, setStatus] = useState('');
  const [selectedAudioSrc, setSelectedAudioSrc] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const selectedAudioRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const audioUrl = reader.result;
      setSelectedAudioSrc(audioUrl);
      setSelectedFileName(file.name);
      setStatus('Audio file loaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const newPitch = () => {
    if (!selectedAudioSrc) {
      setStatus('Please select an audio file first.');
      return;
    }

    fetch(selectedAudioSrc)
      .then(response => response.blob())
      .then(audioBlob => {
        const fileName = window.prompt('Please enter a file name', selectedFileName.replace('.wav', ''));
        if (fileName) {
          let pitchShift = window.prompt('Please enter the pitch shift value', '0');
          pitchShift = Number(pitchShift);
          if (isNaN(pitchShift)) {
            setStatus('Invalid pitch shift value. Please enter a valid number.');
            return;
          }
          const formData = new FormData();
          formData.append('file_name', fileName + '_pitch_' + pitchShift);
          formData.append('shift', pitchShift);
          formData.append('file', audioBlob);
          fetch('/api/save-audio/pitch', { method: 'POST', body: formData })
            .then(response => response.text())
            .then(fileName => setStatus(`Audio saved successfully as ${fileName}!`))
            .catch(() => setStatus('Error saving audio file'));
        }
      })
      .catch(() => setStatus('Error loading audio file'));
  };

  const newTimeStretch = () => {
    if (!selectedAudioSrc) {
      setStatus('Please select an audio file first.');
      return;
    }

    fetch(selectedAudioSrc)
      .then(response => response.blob())
      .then(audioBlob => {
        const fileName = window.prompt('Please enter a file name', selectedFileName.replace('.wav', ''));
        if (fileName) {
          let pitchShift = window.prompt('Please enter the new duration value', '0');
          pitchShift = parseFloat(pitchShift);
          if (isNaN(pitchShift)) {
            setStatus('Invalid pitch shift value. Please enter a valid number.');
            return;
          }
          const formData = new FormData();
          formData.append('file_name', fileName + '_time-stretch_' + pitchShift);
          formData.append('stretch', pitchShift);
          formData.append('file', audioBlob);
          fetch('/api/save-audio/time-stretch', { method: 'POST', body: formData })
            .then(response => response.text())
            .then(fileName => setStatus(`Audio saved successfully as ${fileName}!`))
            .catch(() => setStatus('Error saving audio file'));
        }
      })
      .catch(() => setStatus('Error loading audio file'));
  };


  return (
    <div>
      <audio ref={selectedAudioRef} controls className="audioposition" src={selectedAudioSrc} />
      <label htmlFor="fileInput">Select a WAV file</label>
      <input id="fileInput" type="file" accept="audio/wav" className="file-input2" onChange={handleFileSelect} />
      <div>{status}</div>
      <div className="button-container">
        <button onClick={newPitch}>Pitch</button>
      </div>
      <div className="button-container">
        <button onClick={newTimeStretch}>Duração</button>
      </div>
    </div>
  );
}

function App() {
  const [showComponent1, setShowComponent1] = useState(true);

  const handleButtonClick = () => {
    setShowComponent1(!showComponent1);
  };

  return (
    <div className="App">
      <div className="button-wrapper">
        <button onClick={handleButtonClick}>{showComponent1 ? 'Editar som' : 'Gravar'}</button>
      </div>
      {showComponent1 ? <Component1 /> : <Component2 />}
    </div>
  );
}

export default App;
