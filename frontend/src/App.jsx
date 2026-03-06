import { useState, useEffect } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import SignupModal from './components/SignupModal'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [user, setUser] = useState(null)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // App load hone ke baad check karo ke kya user pehle se logged in hai
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      const savedDarkMode = localStorage.getItem('darkMode') === 'true'
      
      if (storedUser && token && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser))
        setCurrentPage('dashboard')
      } else {
        // 5-7 seconds ke baad signup modal dikhao (naye users ke liye)
        const timer = setTimeout(() => {
          setShowSignupModal(true)
        }, 5500)
        
        return () => clearTimeout(timer)
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
      ) : (
        <LoginPage onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />
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

