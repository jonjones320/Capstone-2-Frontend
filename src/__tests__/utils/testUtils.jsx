import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

// Custom render with router and auth context
export function renderWithContext(ui, { route = '/', user = null, state = {} } = {}) {
  window.history.pushState(state, 'Test page', route);

  return render(
    <AuthProvider initialUser={user}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
}

// Helper to find alert messages
export const findAlertMessage = async (message) => {
  const alert = await screen.findByRole('alert');
  return alert.textContent.includes(message);
};

// Helper to wait for loading state to clear
export const waitForLoadingToFinish = async () => {
  try {
    await screen.findByRole('status');
    await screen.queryByRole('status');
  } catch (error) {
    // Loading element was never present or has already disappeared
  }
};