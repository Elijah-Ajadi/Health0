import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Layout & Components
import AppShell from './components/layout/AppShell'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import PatientRegistration from './pages/PatientRegistration'
import HospitalRegistration from './pages/HospitalRegistration'
import PatientDashboard from './pages/PatientDashboard'
import HospitalDashboard from './pages/HospitalDashboard'
import AdminDashboard from './pages/AdminDashboard'
import RecordDetail from './pages/RecordDetail'
import RecordUpload from './pages/RecordUpload'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'

// Context
import { AuthProvider, useAuth } from './context/AuthContext'

const AppContent = () => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-primary/20"></div>
                    <p className="font-headline font-bold text-on-surface">Synchronizing Vitals...</p>
                </div>
            </div>
        )
    }

    const isPublicPage = [
        '/', 
        '/login', 
        '/patient/register', 
        '/hospital/register'
    ].includes(location.pathname)

    return (
        <div className="min-h-screen bg-surface selection:bg-primary/10 selection:text-primary antialiased">
            <AnimatePresence mode="wait">
                {isPublicPage ? (
                    <Routes location={location} key="public">
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/patient/register" element={<PatientRegistration />} />
                        <Route path="/hospital/register" element={<HospitalRegistration />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                ) : (
                    <AppShell>
                        <Routes location={location} key="protected">
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <DashboardSwitcher />
                                </ProtectedRoute>
                            } />
                            <Route path="/record/:id" element={
                                <ProtectedRoute>
                                    <RecordDetail />
                                </ProtectedRoute>
                            } />
                            <Route path="/upload" element={
                                <ProtectedRoute allowedRoles={['HOSPITAL']}>
                                    <RecordUpload />
                                </ProtectedRoute>
                            } />
                            {/* Fallback for authenticated users */}
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </AppShell>
                )}
            </AnimatePresence>
        </div>
    )
}

const DashboardSwitcher = () => {
    const { user } = useAuth()
    
    switch(user?.role) {
        case 'HOSPITAL':
            return <HospitalDashboard />
        case 'ADMIN':
            return <AdminDashboard />
        case 'PATIENT':
        default:
            return <PatientDashboard />
    }
}

function App() {
    return (
        <Router 
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    )
}

export default App
