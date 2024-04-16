// SpeechRec.js

import React, { useState, useRef } from 'react';
import {
  buttonStyle, containerStyle,
} from '../../styles/Styles';

function SpeechRec() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = []; // Reset audioChunks on each new recording

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop the recording
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav; codecs=opus' });
        const formData = new FormData();
        formData.append('file', audioBlob);

        fetch('http://127.0.0.1:5000/transcribe', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            setTranscript(data.transcribedText);
          })
          .catch((error) => {
            console.error('Error transcribing audio:', error);
          });

        setIsRecording(false);
      };
    }
  };

  return (
    <div style={containerStyle}>
      <button type="button" onClick={startRecording} style={buttonStyle} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </button>
      <button type="button" onClick={stopRecording} style={buttonStyle} disabled={!isRecording}>
        {isRecording ? 'Stop Recording' : 'Not Recording'}
      </button>
      <p>
        Transcript:
        {transcript}
      </p>
    </div>
  );
}

export default SpeechRec;
