import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import DepressiLess from './DepressiLess';

// Mock setup
jest.mock('axios'); // Assuming axios is used for API calls

describe('DepressiLess Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders the correct user email', async () => {
    const testEmail = 'test@example.com';
    render(
      <MemoryRouter>
        <DepressiLess />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText(testEmail)).toBeInTheDocument();
    }, { timeout: 10000 }); // Increased timeout
  });

  // Example of a test with increased timeout and error handling
  test('navigates to UserInfoForm page on clicking User Profile link', async () => {
    render(
      <MemoryRouter>
        <DepressiLess />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByAltText('User Profile'));
    await waitFor(() => {
      expect(screen.getByText(/user information form/i)).toBeInTheDocument();
    }, { timeout: 10000 }); // Increased timeout
  });

  test('navigates to QuestionnaireForm page on clicking Fill Questionnaire link', async () => {
    render(
      <MemoryRouter>
        <DepressiLess />
      </MemoryRouter>,
    );
    const questionnaireLink = screen.getByAltText('Fill Questionnaire');
    fireEvent.click(questionnaireLink);
    await waitFor(() => {
      expect(screen.getByText(/questionnaire form/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('navigates to ChatSupport page on clicking Chat with Support link', async () => {
    render(
      <MemoryRouter>
        <DepressiLess />
      </MemoryRouter>,
    );
    const chatSupportLink = screen.getByAltText('Chat with Support');
    fireEvent.click(chatSupportLink);
    await waitFor(() => {
      expect(screen.getByText(/chat support/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('navigates to OnlineResources page on clicking Online Resources link', async () => {
    render(
      <MemoryRouter>
        <DepressiLess />
      </MemoryRouter>,
    );
    const onlineResourcesLink = screen.getByAltText('Online Resources');
    fireEvent.click(onlineResourcesLink);
    await waitFor(() => {
      expect(screen.getByText(/online resources/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('navigates to TermsOfService page on clicking Terms of Service link', async () => {
    render(
      <MemoryRouter>
        <DepressiLess />
      </MemoryRouter>,
    );
    const termsOfServiceLink = screen.getByText(/read terms of service and privacy policy/i);
    fireEvent.click(termsOfServiceLink);
    await waitFor(() => {
      expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
