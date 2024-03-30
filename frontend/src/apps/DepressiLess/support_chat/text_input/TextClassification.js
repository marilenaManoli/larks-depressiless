// TextClassification.js
/*
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { AuthTokenContext } from '../../../App'; // Make sure AuthTokenContext is properly imported
// import axios from 'axios';

import {
  buttonStyle, containerStyle, inputContainerStyle, inputStyle,
} from '../../styles/Styles';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function TextClassification() {
  // sconst navigate = useNavigate();
  const { token } = useContext(AuthTokenContext);
  const [text, setText] = useState('');
  const [classification, setClassification] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errors] = useState({});

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      setFeedbackMessage('Please enter some text to classify.');
      return;
    }

    try {
      const response = await fetch(`${BASEURL}/api/text_class/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setClassification(data.classification);
        setFeedbackMessage('Classification received successfully.');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      setFeedbackMessage(error.toString());
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={inputContainerStyle}>
        <textarea
          id="textToClassify"
          name="text"
          value={text}
          onChange={handleChange}
          placeholder="Enter text to classify"
          style={inputStyle}
        />
        {errors.text && <p style={{ color: 'red' }}>{errors.text}</p>}
        <button type="submit" style={buttonStyle}>Classify Text</button>
      </form>
      <p>
        Classification:
        {' '}
        {classification}
      </p>
      {feedbackMessage && <p>{feedbackMessage}</p>}
    </div>
  );
}

export default TextClassification;
*/
