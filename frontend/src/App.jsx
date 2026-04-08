import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyPage from './pages/VerifyPage'
import Dashboard from './pages/Dashboard'
import SignupModal from './components/SignupModal'

function App() {
  const [user, setUser] = useState(null)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  
  
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      const savedDarkMode = localStorage.getItem('darkMode') === 'true'
      
      if (storedUser && token && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser))
      }

      // Load dark mode preference
      setDarkMode(savedDarkMode)
      if (savedDarkMode) {
        document.body.classList.add('dark-mode')
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDarkModeChange = (isDark) => {
    setDarkMode(isDark)
    if (isDark) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setShowSignupModal(false)
  }

  const handleSignup = (userData) => {
    setUser(userData)
    setShowSignupModal(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setShowSignupModal(false)
  }

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/dashboard" /> : 
            <LoginPage 
              onLogin={handleLogin} 
              onSwitchToSignup={() => window.location.href = '/signup'}
              onSwitchToForgotPassword={() => window.location.href = '/forgot-password'}
            />
          } 
        />
        <Route 
          path="/signup" 
          element={
            user ? <Navigate to="/dashboard" /> : 
            <SignupPage 
              onSignup={handleSignup} 
              onSwitchToLogin={() => window.location.href = '/login'} 
            />
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            user ? <Navigate to="/dashboard" /> : 
            <ForgotPasswordPage onSwitchToLogin={() => window.location.href = '/login'} />
          } 
        />
        <Route 
          path="/reset-password/:token" 
          element={
            user ? <Navigate to="/dashboard" /> : 
            <ResetPasswordPage onSwitchToLogin={() => window.location.href = '/login'} />
          } 
        />
        <Route 
          path="/verify/:token" 
          element={
            user ? <Navigate to="/dashboard" /> : <VerifyPage />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <Dashboard 
                user={user} 
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUser}
                darkMode={darkMode}
                onDarkModeChange={handleDarkModeChange}
              />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
  )
}

export default App

