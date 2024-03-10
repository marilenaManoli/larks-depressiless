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

const messageStyle = {
  color: '#4A4A4A',
  backgroundColor: '#E2E9F9',
  padding: '20px 40px',
  borderRadius: '20px',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  margin: '20px 0',
  textAlign: 'center',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  width: 'auto',
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

function DepressiLess() {
  const userEmail = sessionStorage.getItem('email')
    ? sessionStorage.getItem('email').substring(1, sessionStorage.getItem('email').length - 1)
    : 'User';

  return (
    <div className="DepressiLess" style={containerStyle}>
      <div style={wrapperStyle}>
        <div style={messageStyle}>
          <h1>
            Welcome
            {' '}
            <span style={{ fontStyle: 'italic' }}>{userEmail}</span>
            {' '}
            !
          </h1>
          <h3>
            We are here to support you.
          </h3>
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
          <Link to="/depressiless/online-resources">
            <img src={onlineResourcesLogo} alt="Online Resources" style={buttonStyle} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DepressiLess;
