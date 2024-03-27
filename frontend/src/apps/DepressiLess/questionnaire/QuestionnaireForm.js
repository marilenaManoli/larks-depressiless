// QuestionnaireForm.js

import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthTokenContext } from '../../../App';
import {
  containerStyle, wrapperStyle, buttonStyle, warningStyle, inputContainerStyle, inputStyle,
} from '../styles/Styles';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function QuestionnaireForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AuthTokenContext);

  const [responses, setResponses] = useState({
    currentMood: '',
    recentExperiences: '',
    emotionalState: '',
    emotionalTriggers: '',
    copingMethods: '',
    safetyCheck: '',
    user_id: location.state?.userId,
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Received userId:', location.state?.userId);
    setResponses((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};

    if (!responses.currentMood
      || !responses.recentExperiences
      || !responses.emotionalState
      || !responses.emotionalTriggers
      || !responses.copingMethods
      || !responses.safetyCheck) {
      newErrors.form = 'All fields are required.';
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFeedbackMessage('Please correct the errors before submitting.');
      return;
    }

    await axios
      .post(
        `${BASEURL}api/depressiLess/QuestionnaireForm`,
        {
          currentMood: responses.currentMood,
          recentExperiences: responses.recentExperiences,
          emotionalState: responses.emotionalState,
          emotionalTriggers: responses.emotionalTriggers,
          copingMethods: responses.copingMethods,
          safetyCheck: responses.safetyCheck,
          user_id: responses.user_id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 201) {
          console.log('Submission successful:', response.data);
          console.log('Navigating with userId:', response.data.id);
          setFeedbackMessage('Information was successfully submitted.');
          setTimeout(() => {
            navigate('/DepressiLess/DepressionScreeningForm', { state: { userId: response.data.id } });
          }, 1000);
        } else {
          console.log('Submission response not successful:', response);
          setFeedbackMessage('Failed to submit. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Submission error:', error.response || error);
        if (error.response && error.response.data.errors) {
          console.error('Validation errors:', error.response.data.errors);
          setFeedbackMessage('Failed to submit. Please correct the errors and try again.');
          // Optionally, display the error messages to the user
          setErrors(error.response.data.errors);
        } else {
          setFeedbackMessage('Failed to submit. Please try again.');
        }
      });
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
            {errors.currentMood && <p style={{ color: 'red' }}>{errors.currentMood}</p>}
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
            {errors.recentExperiences && <p style={{ color: 'red' }}>{errors.recentExperiences}</p>}
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
            {errors.emotionalState && <p style={{ color: 'red' }}>{errors.emotionalState}</p>}
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
            {errors.emotionalTriggers && <p style={{ color: 'red' }}>{errors.emotionalTriggers}</p>}
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
            {errors.copingMethods && <p style={{ color: 'red' }}>{errors.copingMethods}</p>}
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
            {errors.sefetyCheck && <p style={{ color: 'red' }}>{errors.sefetyCheck}</p>}
          </div>
          <input type="submit" value="Submit" style={buttonStyle} />
        </form>
        {feedbackMessage && <p>{feedbackMessage}</p>}
      </div>
    </div>
  );
}

export default QuestionnaireForm;
