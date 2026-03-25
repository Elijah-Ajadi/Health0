import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PatientDashboard from './pages/PatientDashboard'
import HospitalDashboard from './pages/HospitalDashboard'
import AdminDashboard from './pages/AdminDashboard'
import RecordDetail from './pages/RecordDetail'
import RecordUpload from './pages/RecordUpload'
import LandingPage from './pages/LandingPage'
import Signup from './pages/Signup'
import { BottomNav } from './components/ui'

const AppContent = () => {
  const [activeTab, setActiveTab] = React.useState('home')
  const location = useLocation()
  const role = localStorage.getItem('role') || 'patient'
  
  const isFullWidthPage = location.pathname === '/' || location.pathname === '/signup' || location.pathname === '/dashboard'

  const renderDashboard = () => {
    switch(role) {
      case 'hospital': return <HospitalDashboard />
      case 'admin': return <AdminDashboard />
      default: return <PatientDashboard />
    }
  }
  
  return (
    <div className={!isFullWidthPage ? "app-container" : "min-h-screen"}>
      <main className={!isFullWidthPage ? "main-content p-0" : ""}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={renderDashboard()} 
            />
            <Route path="/record/:id" element={<RecordDetail />} />
            <Route path="/upload" element={<RecordUpload />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {!isFullWidthPage && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  )
}

function App() {
  return (
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppContent />
    </Router>
  )
}

export default App
