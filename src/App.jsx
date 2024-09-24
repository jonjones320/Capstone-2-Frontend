import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Routes from './Routes.jsx'
import NavBar from './components/NavBar'
import { Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Container>
          <Routes />
        </Container>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
