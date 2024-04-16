// DepressiLess.js

import React from 'react';
import { Link } from 'react-router-dom';

import userProfileLogo from '../../images/userinformation-logo.png';
import supportChatLogo from '../../images/supportchat-logo.png';
import questionnaireLogo from '../../images/questionnaire-logo.png';
import onlineResourcesLogo from '../../images/onlineresources-logo.png';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#E2E9F9',
};

const wrapperStyle = {
  border: '2px solid #DBE5FB',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  backgroundColor: '#FFFFFF',
};

const iconContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  maxWidth: '500px',
  marginTop: '3rem',
  marginBottom: '6rem',
};

const buttonStyle = {
  width: '215px',
  height: '200px',
  border: 'none',
  borderRadius: '10px',
  margin: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  cursor: 'pointer',
  transition: 'transform 0.2s',
};

const termsButtonStyle = {
  width: 'auto',
  height: '50px',
  padding: '0 10px',
  border: 'none',
  borderRadius: '10px',
  margin: '0 20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  backgroundColor: '#CCCCCC',
  color: 'black',
  textDecoration: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1rem',
  marginTop: '40px',
};

function DepressiLess() {
  const userEmail = sessionStorage.getItem('email')
    ? sessionStorage.getItem('email').substring(1, sessionStorage.getItem('email').length - 1)
    : 'User';

  return (
    <div className="DepressiLess" style={containerStyle}>
      <div style={wrapperStyle}>
        <div>
          <h1>
            Welcome
            <span style={{ fontStyle: 'italic' }}>{userEmail}</span>
            !
          </h1>
          <h3>We are here to support you.</h3>
        </div>

        <div style={iconContainerStyle}>
          <Link to="/depressiless/UserInfoForm">
            <img src={userProfileLogo} alt="User Profile" style={buttonStyle} />
          </Link>
          <Link to="/depressiless/QuestionnaireForm">
            <img src={questionnaireLogo} alt="Fill Questionnaire" style={buttonStyle} />
          </Link>
          <Link to="/depressiless/ChatSupport">
            <img src={supportChatLogo} alt="Chat with Support" style={buttonStyle} />
          </Link>
          <Link to="/depressiless/OnlineResources">
            <img src={onlineResourcesLogo} alt="Online Resources" style={buttonStyle} />
          </Link>
          <Link to="/DepressiLess/TermsOfService" style={termsButtonStyle}>
            Read Terms of Service and Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DepressiLess;
