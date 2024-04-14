import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import axios from 'axios';
import UserMedicalHistory from './UserMedicalHistory';
import { AuthTokenContext } from '../../../App';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: { userId: '123' },
  }),
}));

const tokenValue = {
  token: 'fake-token',
};

const renderUserMedicalHistory = () => render(
  <BrowserRouter>
    <AuthTokenContext.Provider value={tokenValue}>
      <Routes>
        <Route path="/" element={<UserMedicalHistory />} />
      </Routes>
    </AuthTokenContext.Provider>
  </BrowserRouter>,
);

describe('UserMedicalHistory Component', () => {
  afterEach(() => {
    axios.post.mockClear();
  });

  it('renders UserMedicalHistory component and submits with valid input', async () => {
    axios.post.mockResolvedValueOnce({
      data: { id: '123', userId: '456' },
      status: 201,
    });

    renderUserMedicalHistory();

    fireEvent.change(screen.getByLabelText(/Have you ever been diagnosed with any medical conditions or diseases?/), { target: { value: 'No' } });
    fireEvent.change(screen.getByLabelText(/Are there any medical conditions or diseases that run in your family?/), { target: { value: 'None' } });
    fireEvent.change(screen.getByLabelText(/Are you currently taking any medications?/), { target: { value: 'No' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/ }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_PROD}/api/depressiLess/UserMedicalHistory`,
        {
          pastMedicalHistory: 'No',
          familyMedicalHistory: 'None',
          medicationHistory: 'No',
          user_id: '123', // Ensured by mocked useLocation
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
