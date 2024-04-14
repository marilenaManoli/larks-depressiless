import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import QuestionnaireForm from './QuestionnaireForm';

const mock = new MockAdapter(axios);
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('QuestionnaireForm Tests', () => {
  beforeEach(() => {
    mock.resetHandlers();
    sessionStorage.clear();
  });

  it('submits the form data correctly', async () => {
    sessionStorage.setItem('userId', '37');
    mock.onPost(`${process.env.REACT_APP_DEV}/api/depressiLess/QuestionnaireForm`).reply(201, {});

    render(<QuestionnaireForm />);
    // Fill all the fields in the form
    fireEvent.change(screen.getByLabelText(/worries or challenges/i), { target: { value: 'Testing challenges' } });
    fireEvent.change(screen.getByLabelText(/changes in your feelings or behaviors/i), { target: { value: 'Testing emotional state' } });
    fireEvent.change(screen.getByLabelText(/comfort or distress/i), { target: { value: 'Testing triggers' } });
    fireEvent.change(screen.getByLabelText(/managing your emotions/i), { target: { value: 'Testing coping methods' } });
    fireEvent.change(screen.getByLabelText(/thoughts of harming yourself or others/i), { target: { value: 'Testing safety' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/DepressiLess/DepressionScreeningForm', { state: { userId: '37' } });
    });
  });

  it('handles server errors on submission', async () => {
    sessionStorage.setItem('userId', '37');
    mock.onPost(`${process.env.REACT_APP_DEV}/api/depressiLess/QuestionnaireForm`).networkError();

    render(<QuestionnaireForm />);
    // Fill all the fields in the form
    fireEvent.change(screen.getByLabelText(/worries or challenges/i), { target: { value: 'Testing challenges' } });
    fireEvent.change(screen.getByLabelText(/changes in your feelings or behaviors/i), { target: { value: 'Testing emotional state' } });
    fireEvent.change(screen.getByLabelText(/comfort or distress/i), { target: { value: 'Testing triggers' } });
    fireEvent.change(screen.getByLabelText(/managing your emotions/i), { target: { value: 'Testing coping methods' } });
    fireEvent.change(screen.getByLabelText(/thoughts of harming yourself or others/i), { target: { value: 'Testing safety' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please check your connection and try again/i)).toBeInTheDocument();
    });
  });
});
