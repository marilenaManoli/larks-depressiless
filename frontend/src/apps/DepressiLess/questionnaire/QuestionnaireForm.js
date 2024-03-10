// QuestionnaireForm.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  containerStyle, wrapperStyle, buttonStyle, warningStyle, inputContainerStyle, inputStyle,
} from '../styles/Styles';

function QuestionnaireForm() {
  const navigate = useNavigate();

  const [responses, setResponses] = useState({
    currentMood: '',
    recentExperiences: '',
    emotionalState: '',
    emotionalTriggers: '',
    copingMethods: '',
    safetyCheck: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponses((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Define the API endpoint
    const apiEndpoint = 'http://http://localhost:3000/api/questionnaire'; // Update with your actual API endpoint

    try {
      // Make a POST request to your backend API
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the Authorization header with the JWT token if your endpoint requires authentication
          // 'Authorization': `Bearer ${yourAuthTokenHere}`,
        },
        body: JSON.stringify(responses),
      });

      if (!response.ok) {
        // If the server response is not OK, throw an error
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Assuming the server response is JSON
      const data = await response.json();
      console.log(data); // Handle the response data as needed
      alert('Questionnaire submitted successfully!');
      // Navigate to the next form or page
      navigate('/DepressiLess/DepressionScreeningForm'); // Adjust the path as necessary
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert('Failed to submit questionnaire. Please try again.');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        <div style={warningStyle}>
          <h3 style={{ color: 'white' }}>
            {' '}
            Emotional Wellbeing Check-in
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <label htmlFor="currentMood">Can you describe your mood today in your own words?</label>
            <textarea
              id="currentMood"
              name="currentMood"
              value={responses.currentMood}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="recentExperiences">Are there any worries or challenges that you have been facing lately?</label>
            <textarea
              id="recentExperiences"
              name="recentExperiences"
              value={responses.recentExperiences}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="emotionalState">Have you noticed any changes in your feelings or behaviors that you would like to share?</label>
            <textarea
              id="emotionalState"
              name="emotionalState"
              value={responses.emotionalState}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="emotionalTriggers">What activities or interactions have brought you comfort or distress?</label>
            <textarea
              id="emotionalTriggers"
              name="emotionalTriggers"
              value={responses.emotionalTriggers}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="copingMethods">How have you been managing your emotions? What coping strategies have you tried?</label>
            <textarea
              id="copingMethods"
              name="copingMethods"
              value={responses.copingMethods}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="safetyCheck">Lastly, it is important for us to know: have you had any thoughts of harming yourself or others?</label>
            <textarea
              id="sefetyCheck"
              name="safetyCheck"
              value={responses.safetyCheck}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <input type="submit" value="Submit" style={buttonStyle} />
        </form>
      </div>
    </div>
  );
}

export default QuestionnaireForm;
