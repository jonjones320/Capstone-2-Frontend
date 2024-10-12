import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('Starting application...');

const root = document.getElementById('root');
console.log('Root element found:', root);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)

console.log('Application rendered');