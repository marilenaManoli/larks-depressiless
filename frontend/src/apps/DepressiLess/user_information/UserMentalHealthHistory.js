import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import StepIndicator from '../common_components/StepIndicator';
import { AuthTokenContext } from '../../../App';
import {
  containerWithStepsStyle, formContainerStyle, buttonStyle, inputContainerStyle, inputStyle,
} from '../styles/Styles';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function UserMentalHealthHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = React.useContext(AuthTokenContext);

  // Initialize user_id from sessionStorage or location state
  const initialUserId = location.state?.userId || sessionStorage.getItem('userId');
  const [mentalHealthInfo, setMentalHealthInfo] = useState({
    psychiatricHistory: '',
    stressLevels: '',
    copingMechanisms: '',
    user_id: initialUserId, // Initialize with user_id
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Ensure the user ID is updated if it changes in the location state
    const userIdFromLocation = location.state?.userId;
    console.log('UserId at start of Mental Health History:', initialUserId);
    if (userIdFromLocation && userIdFromLocation !== mentalHealthInfo.user_id) {
      setMentalHealthInfo((info) => ({ ...info, user_id: userIdFromLocation }));
    }
  }, [location.state, mentalHealthInfo.user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentalHealthInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};
    if (!mentalHealthInfo.psychiatricHistory.trim() || !mentalHealthInfo.stressLevels.trim() || !mentalHealthInfo.copingMechanisms.trim()) {
      newErrors.form = 'All fields are required.';
      formIsValid = false;
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting Mental Health History with userId:', mentalHealthInfo.user_id);
    if (!validateForm()) {
      setFeedbackMessage('Please correct the errors before submitting.');
      return;
    }

    try {
      const response = await axios.post(
        `${BASEURL}/api/depressiLess/UserMentalHealthHistory`,
        mentalHealthInfo,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        console.log('Submission successful:', response.data);
        setFeedbackMessage('Information was successfully submitted.');
        navigate('/DepressiLess/UserMedicalHistory', { state: { userId: mentalHealthInfo.user_id } });
      }
    } catch (error) {
      console.error('Submission error:', error.response || error);
      setFeedbackMessage('Failed to submit mental health history. Please try again.');
    }
  };

  return (
    <div style={containerWithStepsStyle}>
      <StepIndicator currentStep={1} />
      <div style={formContainerStyle}>
        <h3>Mental Health History:</h3>
        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <label htmlFor="psychiatricHistory">Have you previously been diagnosed with any mental health conditions? </label>
            <input
              type="text"
              id="psychiatricHistory"
              name="psychiatricHistory"
              value={mentalHealthInfo.psychiatricHistory}
              onChange={handleChange}
              style={inputStyle}
              placeholder="If yes, can you please specify?"
            />
            {errors.psychiatricHistory && <p style={{ color: 'red' }}>{errors.psychiatricHistory}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="stressLevels">Can you describe how stressful situations typically feel like to you? </label>
            <input
              type="text"
              id="stressLevels"
              name="stressLevels"
              value={mentalHealthInfo.stressLevels}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Have you noticed any common patterns? Describe them."
            />
            {errors.stressLevels && <p style={{ color: 'red' }}>{errors.stressLevels}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="copingMechanisms">Are there specific strategies or activities that you find helpful in managing stress?</label>
            <input
              type="text"
              id="copingMechanisms"
              name="copingMechanisms"
              value={mentalHealthInfo.copingMechanisms}
              onChange={handleChange}
              style={inputStyle}
              placeholder="If yes, what are they?"
            />
            {errors.copingMechanisms && <p style={{ color: 'red' }}>{errors.copingMechanisms}</p>}
          </div>
          <input type="submit" value="Submit" style={buttonStyle} />
        </form>
        {feedbackMessage && <p>{feedbackMessage}</p>}
      </div>
    </div>
  );
}

export default UserMentalHealthHistory;
