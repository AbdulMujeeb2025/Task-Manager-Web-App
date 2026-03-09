import { useState, useEffect } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import Dashboard from './pages/Dashboard'
import SignupModal from './components/SignupModal'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [user, setUser] = useState(null)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [resetToken, setResetToken] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState(null)

  // Check URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    
    // Check for verification success
    if (params.get('verified') === 'true') {
      setVerificationStatus('success')
    }
    
    // Check for reset token in URL
    const path = window.location.pathname
    if (path.startsWith('/reset-password/')) {
      const token = path.split('/reset-password/')[1]
      if (token) {
        setResetToken(token)
        setCurrentPage('reset-password')
      }
    }
    
    // Check for verification token in URL
    if (path.startsWith('/verify/')) {
      // Verification is handled by backend redirect
    }
  }, [])

  // App load hone ke baad check karo ke kya user pehle se logged in hai
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      const savedDarkMode = localStorage.getItem('darkMode') === 'true'
      
      if (storedUser && token && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser))
        setCurrentPage('dashboard')
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
    setCurrentPage('dashboard')
    setShowSignupModal(false)
  }

  const handleSignup = (userData) => {
    setUser(userData)
    setCurrentPage('dashboard')
    setShowSignupModal(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCurrentPage('login')
    setShowSignupModal(false)
  }

  const handleSwitchToSignup = () => {
    setCurrentPage('signup')
    setShowSignupModal(false)
  }

  const handleSwitchToLogin = () => {
    setCurrentPage('login')
    setShowSignupModal(false)
    setVerificationStatus(null)
  }

  const handleSwitchToForgotPassword = () => {
    setCurrentPage('forgot-password')
  }

  return (
    <>
      {user && currentPage === 'dashboard' ? (
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
          darkMode={darkMode}
          onDarkModeChange={handleDarkModeChange}
        />
      ) : currentPage === 'signup' ? (
        <SignupPage onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} />
      ) : currentPage === 'forgot-password' ? (
        <ForgotPasswordPage onSwitchToLogin={handleSwitchToLogin} />
      ) : currentPage === 'reset-password' ? (
        <ResetPasswordPage token={resetToken} onSwitchToLogin={handleSwitchToLogin} />
      ) : (
        <LoginPage 
          onLogin={handleLogin} 
          onSwitchToSignup={handleSwitchToSignup}
          onSwitchToForgotPassword={handleSwitchToForgotPassword}
          verificationStatus={verificationStatus}
        />
      )}
      
      {showSignupModal && !user && (
        <SignupModal 
          onClose={() => setShowSignupModal(false)} 
          onSignupSuccess={handleSignup}
        />
      )}
    </>
  )
}

export default App

