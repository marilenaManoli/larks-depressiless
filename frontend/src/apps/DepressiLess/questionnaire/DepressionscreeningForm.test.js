import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import DepressionScreeningForm from './DepressionScreeningForm';

jest.mock('axios');

describe('DepressionScreeningForm', () => {
  test('submits the form successfully', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });

    render(<DepressionScreeningForm />);

    // Fill out the form
    fireEvent.click(screen.getByLabelText('Regularly')); // Example: Select 'Regularly' for smoking
    fireEvent.click(screen.getByLabelText('Balanced')); // Example: Select 'Balanced' for diet
    fireEvent.click(screen.getByLabelText('Regular')); // Example: Select 'Regular' for exercise
    fireEvent.click(screen.getByLabelText('Higher')); // Example: Select 'Higher' for education
    fireEvent.click(screen.getByLabelText('Strong')); // Example: Select 'Strong' for social support

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the submission to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('api/depressiLess/DepressionScreeningForm'), {
        lifestyleSmoking: 'Regularly',
        lifestyleDiet: 'Balanced',
        lifestyleExercise: 'Regular',
        socialEducation: 'Higher',
        socialSupport: 'Strong',
        symptomSeverity: '',
        symptomImpact: '',
        safetyCheck: '',
      });
    });

    // Ensure alert is shown
    expect(window.alert).toHaveBeenCalledWith('Questionnaire submitted successfully!');
  });

  test('handles form submission failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Submission failed'));

    render(<DepressionScreeningForm />);

    // Fill out the form (similar to the previous test)

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the submission to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    // Ensure appropriate error handling
    expect(window.alert).not.toHaveBeenCalledWith('Questionnaire submitted successfully!');
    expect(window.console.error).toHaveBeenCalledWith(expect.any(Error));
    // You can also check for error feedback shown to the user
  });
});
