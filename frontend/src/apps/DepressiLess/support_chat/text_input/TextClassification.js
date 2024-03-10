// TextClassification.js

import React, { useState } from 'react';
import {
  buttonStyle, containerStyle, inputContainerStyle, inputStyle,
} from '../../styles/Styles';

function TextClassification() {
  const [text, setText] = useState('');
  const [classification, setClassification] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/text_class/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    setClassification(data.classification);
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={inputContainerStyle}>
        <textarea
          id="textToClassify" // Adding an id attribute
          name="text" // Adding a name attribute for form submission
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to classify"
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Classify Text</button>
      </form>
      <p>
        Classification:
        {' '}
        {classification}
      </p>
    </div>
  );
}

export default TextClassification;
