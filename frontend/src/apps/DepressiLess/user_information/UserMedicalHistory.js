import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import StepIndicator from '../common_components/StepIndicator';
import { AuthTokenContext } from '../../../App'; // Import AuthTokenContext
import {
  containerWithStepsStyle, formContainerStyle, buttonStyle, inputContainerStyle, inputStyle,
} from '../styles/Styles';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function UserMedicalHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = React.useContext(AuthTokenContext);

  // Initial user_id from sessionStorage or location state
  const initialUserId = location.state?.userId || sessionStorage.getItem('userId');
  const [medicalHistoryInfo, setMedicalHistoryInfo] = useState({
    pastMedicalHistory: '',
    familyMedicalHistory: '',
    medicationHistory: '',
    user_id: initialUserId, // Initialize with user_id
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const userIdFromLocation = location.state?.userId;
    console.log('UserId at start of Medical History:', initialUserId);
    if (userIdFromLocation && userIdFromLocation !== medicalHistoryInfo.user_id) {
      setMedicalHistoryInfo((info) => ({ ...info, user_id: userIdFromLocation }));
    }
    // Also update sessionStorage to ensure it's always current
    sessionStorage.setItem('userId', userIdFromLocation);
  }, [location.state?.userId, medicalHistoryInfo.user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicalHistoryInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};
    if (!medicalHistoryInfo.pastMedicalHistory || !medicalHistoryInfo.familyMedicalHistory || !medicalHistoryInfo.medicationHistory) {
      newErrors.form = 'All fields are required.';
      formIsValid = false;
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting Medical History with userId:', medicalHistoryInfo.user_id);
    if (!validateForm()) {
      setFeedbackMessage('Please correct the errors before submitting.');
      return;
    }

    try {
      const response = await axios.post(
        `${BASEURL}/api/depressiLess/UserMedicalHistory`,
        medicalHistoryInfo,
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
        navigate('/DepressiLess/QuestionnaireForm', { state: { userId: response.data.userId } });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFeedbackMessage('Failed to submit medical history. Please try again.');
    }
  };

  return (
    <div style={containerWithStepsStyle}>
      <StepIndicator currentStep={2} />
      <div style={formContainerStyle}>
        <h3>
          Medical History:
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <label htmlFor="pastMedicalHistory">Have you ever been diagnosed with any medical conditions or diseases?</label>
            <input
              type="text"
              id="pastMedicalHistory"
              name="pastMedicalHistory"
              value={medicalHistoryInfo.pastMedicalHistory}
              onChange={handleChange}
              style={inputStyle}
              placeholder="If yes, please list them"
            />
            {errors.pastMedicalHistory && <p style={{ color: 'red' }}>{errors.pastMedicalHistory}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="familyMedicalHistory">Are there any medical conditions or diseases that run in your family?</label>
            <input
              type="text"
              id="familyMedicalHistory"
              name="familyMedicalHistory"
              value={medicalHistoryInfo.familyMedicalHistory}
              onChange={handleChange}
              style={inputStyle}
              placeholder="If yes, specify your relation to those family members"
            />
            {errors.familyMedicalHistory && <p style={{ color: 'red' }}>{errors.familyMedicalHistory}</p>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="medicationHistory">Are you currently taking any medications?</label>
            <input
              type="text"
              id="medicationHistory"
              name="medicationHistory"
              value={medicalHistoryInfo.medicationHistory}
              onChange={handleChange}
              style={inputStyle}
              placeholder="If yes, please provide details"
            />
            {errors.medicationHistory && <p style={{ color: 'red' }}>{errors.medicationHistory}</p>}
          </div>
          <input type="submit" value="Submit" style={buttonStyle} />
        </form>
        {feedbackMessage && <p>{feedbackMessage}</p>}
      </div>
    </div>
  );
}

export default UserMedicalHistory;
