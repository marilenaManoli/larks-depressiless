// UserInfoForm.js

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import axios from 'axios';
import PropTypes from 'prop-types';
import { AuthTokenContext } from '../../../App';
import StepIndicator from '../common_components/StepIndicator';
import {
  containerWithStepsStyle, formContainerStyle,
  buttonStyle, inputContainerStyle, inputStyle,
  modalBackdropStyle, modalStyle, modalHeaderStyle,
  modalContentStyle, modalFooterStyle,
  proceedButtonStyle, cancelButtonStyle, baseButtonStyle,
} from '../styles/Styles';

const BASEURL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;

function PrivacyModal({ onProceed, onCancel }) {
  return (
    <div style={modalBackdropStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2>Privacy Notice and Data Usage Acknowledgement</h2>
        </div>
        <div style={modalContentStyle}>
          <p>Your privacy matters to us.</p>
          <p>
            The information you provide on this page is solely collected for the purpose of diagnosing
            the user within this application. Please rest assured that your data will not be used for any
            other purposes.
          </p>
          <p>
            We are committed to protecting your privacy and ensuring the confidentiality of your
            information. If you have any concerns or questions regarding your privacy or data usage,
            please do not hesitate to contact us.
          </p>
          <p>
            By proceeding, you acknowledge and consent to the collection and use of your information
            as described above.
          </p>
        </div>

        <div style={modalFooterStyle}>
          <button type="button" onClick={onProceed} style={proceedButtonStyle}>Proceed</button>
          <button type="button" onClick={onCancel} style={cancelButtonStyle}>Cancel</button>
          {/* Add a link or button to navigate to the Terms of Service page */}
          <Link to="/DepressiLess/TermsOfService" style={baseButtonStyle}>Read Terms of Service and Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

PrivacyModal.propTypes = {
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

function UserInfoForm() {
  const navigate = useNavigate();
  const { token } = useContext(AuthTokenContext);
  const [showModal, setShowModal] = useState(false);
  const [userInformation, setUserInfo] = useState({
    name: '',
    genderIdentity: '',
    sexAssignedAtBirth: '',
    age: '',
    nationality: '',
    sexualOrientation: '',
  });
  const [errors, setErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};
    if (!userInformation.name.trim()) {
      newErrors.name = 'Name is required';
      formIsValid = false;
    }
    if (!userInformation.genderIdentity.trim()) {
      newErrors.gender_identity = 'Gender Identity is required';
      formIsValid = false;
    }
    if (!userInformation.sexAssignedAtBirth.trim()) {
      newErrors.sex_assigned_at_birth = 'Sex assigned at birth is required';
      formIsValid = false;
    }
    if (!userInformation.age.trim() || Number.isNaN(Number(userInformation.age)) || Number(userInformation.age) <= 0) {
      newErrors.age = 'Valid age is required';
      formIsValid = false;
    }
    if (!userInformation.nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
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

    // Prepare data for submission
    // const formattedData = JSON.stringify({
    //   name: userInfo.name,
    //   genderIdentity: userInfo.genderIdentity,
    //   sexAssignedAtBirth: userInfo.sexAssignedAtBirth,
    //   age: parseInt(userInfo.age, 10),
    //   nationality: userInfo.nationality,
    //   sexualOrientation: userInfo.sexualOrientation,
    // });

    await axios
      .post(
        `${BASEURL}api/depressiLess/UserInfoForm`,
        {
          name: userInformation.name,
          genderIdentity: userInformation.genderIdentity,
          sexAssignedAtBirth: userInformation.sexAssignedAtBirth,
          age: parseInt(userInformation.age, 10),
          nationality: userInformation.nationality,
          sexualOrientation: userInformation.sexualOrientation,
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
          sessionStorage.setItem('userId', response.data.id);
          console.log('UserId saved in sessionStorage:', sessionStorage.getItem('userId'));
          navigate('/DepressiLess/UserMentalHealthHistory', { state: { userId: response.data.id } });
        } else {
          console.log('Failed to receive userId:', response);
        }
      });

    // try {
    // const response = await fetch(`${BASEURL}api/depressiless/UserInfoForm`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: formattedData,
    //   credentials: 'include',
    // });
    // console.log(response);

    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Network response was not ok');
    // }

    // const data = await response.json();
    // console.log('Submission successful:', data);
    //   setFeedbackMessage('Information submitted successfully!');
    //   navigate('/DepressiLess/ContactInfoForm'); // Adjust the navigate path as necessary
    // } catch (error) {
    //   console.error('Failed to submit information:', error);
    //   setFeedbackMessage('Failed to submit information. Please try again.');
    // }
  };

  const handleModalProceed = () => {
    setShowModal(false);
  };

  const handleModalCancel = () => {
    navigate('/DepressiLess');
  };

  return (
    <div style={containerWithStepsStyle}>
      <StepIndicator currentStep={0} />
      {showModal && <PrivacyModal onProceed={handleModalProceed} onCancel={handleModalCancel} />}
      <div style={formContainerStyle}>
        {/* Display feedbackMessage to the user */}
        {feedbackMessage && (
          <div style={{
            padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '20px', borderRadius: '4px',
          }}
          >
            {feedbackMessage}
          </div>
        )}
        <h3>Personal Information:</h3>
        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userInformation.name}
              onChange={handleChange}
              autoComplete="off"
              style={inputStyle}
            />
            {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="genderIdentity">Gender:</label>
            <input
              type="text"
              id="genderIdentity"
              name="genderIdentity"
              value={userInformation.genderIdentity}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.genderIdentity && <div style={{ color: 'red' }}>{errors.genderIdentity}</div>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="sexAssignedAtBirth">Sex at Birth:</label>
            <input
              type="text"
              id="sexAssignedAtBirth"
              name="sexAssignedAtBirth"
              value={userInformation.sexAssignedAtBirth}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.sexAssignedAtBirth && <div style={{ color: 'red' }}>{errors.sexAssignedAtBirth}</div>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="age">Age:</label>
            <input
              type="integer"
              id="age"
              name="age"
              value={userInformation.age}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.age && <div style={{ color: 'red' }}>{errors.age}</div>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="nationality">Nationality:</label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={userInformation.nationality}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.nationality && <div style={{ color: 'red' }}>{errors.nationality}</div>}
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="sexualOrientation">Sexual Orientation:</label>
            <input
              type="text"
              id="sexualOrientation"
              name="sexualOrientation"
              value={userInformation.sexualOrientation}
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

export default UserInfoForm;
