import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import axios from 'axios';
import UserInfoForm from './UserInfoForm';
import { AuthTokenContext } from '../../../App';

jest.mock('axios');

const tokenValue = {
  token: 'fake-token',
};

const renderUserInfoForm = () => render(
  <BrowserRouter>
    <AuthTokenContext.Provider value={tokenValue}>
      <UserInfoForm />
    </AuthTokenContext.Provider>
  </BrowserRouter>,
);

describe('UserInfoForm Component', () => {
  afterEach(() => {
    axios.post.mockClear();
  });

  it('renders UserInfoForm component and submits with valid input', async () => {
    axios.post.mockResolvedValueOnce({
      data: { id: '123' }, // Mocking the response to match your API's response
      status: 201,
    });

    renderUserInfoForm();

    fireEvent.change(screen.getByLabelText(/Name:/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Gender:/), { target: { value: 'Male' } });
    fireEvent.change(screen.getByLabelText(/Sex at Birth:/), { target: { value: 'Male' } });
    fireEvent.change(screen.getByLabelText(/Age:/), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Nationality:/), { target: { value: 'USA' } });
    fireEvent.change(screen.getByLabelText(/Sexual Orientation:/), { target: { value: 'Straight' } });

    fireEvent.click(screen.getByText(/Submit/));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_PROD}api/depressiLess/UserInfoForm`, // Ensure this URL matches your environment setup
        {
          name: 'John Doe',
          genderIdentity: 'Male',
          sexAssignedAtBirth: 'Male',
          age: 30,
          nationality: 'USA',
          sexualOrientation: 'Straight',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token',
          },
        },
      );
    });

    // Optionally verify navigation after successful submission
    // expect(mockedNavigateFunction).toHaveBeenCalledWith('/NextRouteAfterSuccess');
  });

  it('displays error messages for empty form fields', async () => {
    renderUserInfoForm();

    fireEvent.click(screen.getByText(/Submit/));

    await waitFor(() => {
      expect(screen.getByText(/Name is required/)).toBeInTheDocument();
      expect(screen.getByText(/Gender Identity is required/)).toBeInTheDocument();
      expect(screen.getByText(/Sex assigned at birth is required/)).toBeInTheDocument();
      expect(screen.getByText(/Valid age is required/)).toBeInTheDocument();
      expect(screen.getByText(/Nationality is required/)).toBeInTheDocument();
    });
  });

  it('does not submit the form with invalid input', async () => {
    renderUserInfoForm();

    fireEvent.change(screen.getByLabelText(/Name:/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Age:/), { target: { value: 'abc' } });

    fireEvent.click(screen.getByText(/Submit/));

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('displays error message for invalid age', async () => {
    renderUserInfoForm();

    fireEvent.change(screen.getByLabelText(/Age:/), { target: { value: '-5' } });

    fireEvent.click(screen.getByText(/Submit/));

    await waitFor(() => {
      expect(screen.getByText(/Valid age is required/)).toBeInTheDocument();
    });
  });

  it('handles API error response', async () => {
    axios.post.mockRejectedValueOnce(new Error('Failed to submit'));

    renderUserInfoForm();

    // Fill out the form with valid input
    fireEvent.change(screen.getByLabelText(/Name:/), { target: { value: 'John Doe' } });
    // Fill out other fields...

    fireEvent.click(screen.getByText(/Submit/));

    await waitFor(() => {
      expect(screen.getByText(/Failed to submit information/)).toBeInTheDocument();
    });
  });

  // Add more tests as needed...
});
