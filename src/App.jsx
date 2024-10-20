import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Routes from './Routes.jsx'
import NavBar from './components/NavBar'
import { Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          <NavBar />
          <main className="main-content">
            <Container>
              <Routes />
            </Container>
          </main>
          <footer className="app-footer">
            <Container>
              <p>&copy; 2024 Ranner. All rights reserved.</p>
            </Container>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
