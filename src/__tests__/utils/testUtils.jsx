import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
  return waitFor(() => {
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
};

export function renderWithContext(ui, { 
  route = '/', 
  user = null,
  authContext = { ...defaultAuthContext, currentUser: user },
  ...renderOptions 
} = {}) {
  window.history.pushState({}, 'Test page', route);
  
  function Wrapper({ children }) {
    return (
      <AuthContext.Provider value={authContext}>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthContext.Provider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}