import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

// Custom render with providers
export function renderWithContext(ui, { route = '/', user = null, state = {} } = {}) {
  window.history.pushState(state, 'Test page', route);
  
  const Wrapper = ({ children }) => (
    <AuthProvider initialUser={user}>
      <BrowserRouter>{children}</BrowserRouter>
    </AuthProvider>
  );

  return render(ui, { wrapper: Wrapper });
}

// Helper to find alert messages
export const findAlertMessage = async (message, { screen }) => {
  const alert = await screen.findByRole('alert');
  return alert.textContent.includes(message);
};

// Helper to wait for loading state to clear
export const waitForLoadingToFinish = async ({ screen }) => {
  try {
    await screen.findByRole('status');
    await screen.queryByRole('status');
  } catch (error) {
    // Loading element was never present or has already disappeared
  }
};