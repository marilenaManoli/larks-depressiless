import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  containerStyle, wrapperStyle, buttonStyle, warningStyle, inputContainerStyle,
  radioGroupStyle,
} from '../styles/Styles';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function DepressionScreeningForm() {
  const navigate = useNavigate();

  const [responses, setResponses] = useState({
    lifestyleSmoking: '',
    lifestyleDiet: '',
    lifestyleExercise: '',
    socialEducation: '',
    socialSupport: '',
    symptomSeverity: '',
    symptomImpact: '',
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
    console.log('Questionnaire responses:', responses);

    try {
      const response = await axios.post(
        `${BASEURL}api/depressiLess/DepressionScreeningForm`,
        responses,
      );
      if (response.status === 201) {
        alert('Information submitted successfully!');
        navigate('/DepressiLess'); // Adjust the path as necessary
      } else {
        console.log('Failed to submit :', response);
      }
    } catch (error) {
      console.error('Failed to submit :', error);
      // Handle error and provide feedback to the user
    }
  };

  const smokingOptions = ['Never', 'Occasionally', 'Regularly'];
  const dietOptions = ['Balanced', 'Irregular', 'Unhealthy'];
  const exerciseOptions = ['Regular', 'Infrequent', 'None'];
  const educationOptions = ['Basic', 'Secondary', 'Higher'];
  const supportOptions = ['Strong', 'Moderate', 'Poor'];

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        <div style={warningStyle}>
          <h3 style={{ color: 'white' }}>
            {' '}
            Health and Lifestyle Evaluation
          </h3>
        </div>
        <form onSubmit={handleSubmit}>

          {/* Smoking, Alcohol, and Drug Use */}
          <div style={inputContainerStyle}>
            <p><strong>How often do you use tobacco, alcohol, or drugs?</strong></p>
            {smokingOptions.map((option) => (
              <label key={option} style={radioGroupStyle}>
                <input
                  type="radio"
                  name="lifestyleSmoking"
                  value={option}
                  checked={responses.lifestyleSmoking === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>

          {/* Diet and Exercise */}
          <div style={inputContainerStyle}>
            <p><strong>How would you describe your diet?</strong></p>
            {dietOptions.map((option) => (
              <label key={option} style={radioGroupStyle}>
                <input
                  type="radio"
                  name="lifestyleDiet"
                  value={option}
                  checked={responses.lifestyleDiet === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
            <p><strong>How often do you exercise?</strong></p>
            {exerciseOptions.map((option) => (
              <label key={option} style={radioGroupStyle}>
                <input
                  type="radio"
                  name="lifestyleExercise"
                  value={option}
                  checked={responses.lifestyleExercise === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>

          {/* Education Level and Social Supports */}
          <div style={inputContainerStyle}>
            <p><strong>What is your highest level of education?</strong></p>
            {educationOptions.map((option) => (
              <label key={option} style={radioGroupStyle}>
                <input
                  type="radio"
                  name="socialEducation"
                  value={option}
                  checked={responses.socialEducation === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
            <p><strong>How would you rate your social support?</strong></p>
            {supportOptions.map((option) => (
              <label key={option} style={radioGroupStyle}>
                <input
                  type="radio"
                  name="socialSupport"
                  value={option}
                  checked={responses.socialSupport === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>

          <input type="submit" value="Submit" style={buttonStyle} />
        </form>
      </div>
    </div>
  );
}

export default DepressionScreeningForm;
