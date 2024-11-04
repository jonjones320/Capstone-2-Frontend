import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// Custom render with providers.
const defaultAuthContext = {
  currentUser: null,
  login: jest.fn(),
  logout: jest.fn()
};

// Helper to find alert messages.
export const findAlertMessage = async (message) => {
  const alert = await screen.findByRole('alert');
  return alert.textContent.includes(message);
};

// Helper to wait for loading state to clear.
export const waitForLoadingToFinish = async () => {
  try {
    await screen.queryByRole('status');
  } catch (error) {
    // Loading element was never present or has already disappeared.
  }
};

export function renderWithContext(ui, { 
  authContext = defaultAuthContext,
  ...renderOptions 
} = {}) {
  function Wrapper({ children }) {
    return (
      <AuthContext.Provider value={authContext}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthContext.Provider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}