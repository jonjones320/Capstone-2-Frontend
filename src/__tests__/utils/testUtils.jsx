import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

export function renderWithContext(ui, { route = '/', user = null } = {}) {
  window.history.pushState({}, 'Test page', route);

  return render(
    <AuthProvider initialUser={user}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
}