import React, { useState } from 'react';

function App() {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(5);

  // Function to handle starting the audio recording
  const startRecording = async () => {
    try {
      // Send POST request to Flask endpoint to start recording
      const response = await fetch('/start-recording', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duration }),
      });

      // Update recording state to true
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Function to handle stopping the audio recording
  const stopRecording = async () => {
    try {
      // Send POST request to Flask endpoint to stop recording
      const response = await fetch('/stop-recording', {
        method: 'POST',
      });

      // Update recording state to false
      setRecording(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  return (
    <div>
      <h1>Record Audio</h1>

      <div>
        <label htmlFor="duration-input">Duration (seconds):</label>
        <input
          type="number"
          id="duration-input"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
        />
      </div>

      {!recording && (
        <button onClick={startRecording}>Start Recording</button>
      )}

      {recording && (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
    </div>
  );
}

export default App;



