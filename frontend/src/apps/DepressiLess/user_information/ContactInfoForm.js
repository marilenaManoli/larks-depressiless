import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../common_components/StepIndicator';
import {
  containerWithStepsStyle, formContainerStyle, buttonStyle, inputContainerStyle, inputStyle,
} from '../styles/Styles';

function ContactInfoForm() {
  const navigate = useNavigate();

  const [contactInfo, setContactInfo] = useState({
    address: '',
    phoneNumber: '',
    email: '',
    // Add more fields as necessary
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://http://localhost:3000/api/contactinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(contactInfo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      alert('Contact information submitted successfully!');
      navigate('/DepressiLess/UserMedicalHistory');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      alert('Failed to submit contact information. Please try again.');
    }
  };

  return (
    <div style={containerWithStepsStyle}>
      <StepIndicator currentStep={1} />
      {' '}
      {/* Step 1 for Contact Information */}
      <div style={formContainerStyle}>
        <h3>Contact Information:</h3>
        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <label htmlFor="address">Home Address:</label>
            <input type="text" id="address" name="address" value={contactInfo.address} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input type="text" id="phoneNumber" name="phoneNumber" value={contactInfo.phoneNumber} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={contactInfo.email} onChange={handleChange} style={inputStyle} />
          </div>
          <input type="submit" value="Submit" style={buttonStyle} />
        </form>
      </div>
    </div>
  );
}

export default ContactInfoForm;
