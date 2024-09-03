import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Routes from './Routes.jsx'
import NavBar from './components/NavBar'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
