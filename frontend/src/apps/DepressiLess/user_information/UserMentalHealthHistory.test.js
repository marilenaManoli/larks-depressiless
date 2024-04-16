// UserMentalHealthHistory.test.js

import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserMentalHealthHistory from './UserMentalHealthHistory';
import { AuthTokenContext } from '../../../App';

// Mocking Axios
jest.mock('axios');
const mockedAxios = axios;

// Mocking useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mocking AuthTokenContext
const tokenValue = {
  token: 'fake-token',
};

// Function to render UserMentalHealthHistory with context
const renderUserMentalHealthHistory = () => render(
  <BrowserRouter>
    <AuthTokenContext.Provider value={tokenValue}>
      <Routes>
        <Route path="/" element={<UserMentalHealthHistory />} />
      </Routes>
    </AuthTokenContext.Provider>
  </BrowserRouter>,
);

describe('UserMentalHealthHistory Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders UserMentalHealthHistory component and submits with valid input', async () => {
    renderUserMentalHealthHistory();

    fireEvent.change(screen.getByLabelText(/diagnosed with any mental health conditions/i), {
      target: { value: 'Test psychiatric history' },
    });
    fireEvent.change(screen.getByLabelText(/stressful situations typically feel like to you/i), {
      target: { value: 'Test stress levels' },
    });
    fireEvent.change(screen.getByLabelText(/specific strategies or activities/i), {
      target: { value: 'Test coping mechanisms' },
    });

    fireEvent.click(screen.getByText(/Submit/));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('api/depressiLess/UserMentalHealthHistory'),
        {
          psychiatricHistory: 'Test psychiatric history',
          stressLevels: 'Test stress levels',
          copingMechanisms: 'Test coping mechanisms',
          user_id: expect.any(String),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenValue.token}`,
          },
        },
      );
    });
  });
});
