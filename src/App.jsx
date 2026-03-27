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
import RecordsList from './pages/RecordsList'
import ProfileSettings from './pages/ProfileSettings'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import HospitalPatients from './pages/HospitalPatients'
import HospitalRecords from './pages/HospitalRecords'
import HospitalPatientDetail from './pages/HospitalPatientDetail'
import ErrorPage from './pages/ErrorPage'
import NotFoundPage from './pages/NotFoundPage'

// Context
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

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
                            {/* 404 Fallback */}
                            <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                ) : user ? (
                    <AppShell>
                        <Routes location={location} key="protected">
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <DashboardSwitcher />
                                </ProtectedRoute>
                            } />
                            <Route path="/records" element={
                                <ProtectedRoute allowedRoles={['PATIENT', 'HOSPITAL']}>
                                    <RecordsList />
                                </ProtectedRoute>
                            } />
                            <Route path="/settings" element={
                                <ProtectedRoute>
                                    <ProfileSettings />
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
                            {/* Hospital specific pages */}
                            <Route path="/hospital/patients" element={
                                <ProtectedRoute allowedRoles={['HOSPITAL']}>
                                    <HospitalPatients />
                                </ProtectedRoute>
                            } />
                            <Route path="/hospital/records" element={
                                <ProtectedRoute allowedRoles={['HOSPITAL']}>
                                    <HospitalRecords />
                                </ProtectedRoute>
                            } />
                            <Route path="/hospital/patient/:id" element={
                                <ProtectedRoute allowedRoles={['HOSPITAL']}>
                                    <HospitalPatientDetail />
                                </ProtectedRoute>
                            } />
                            {/* 404 Fallback */}
                                {/* 404 Fallback */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </AppShell>
                ) : (
                    <Navigate to="/login" replace />
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
                <ToastProvider>
                    <AppContent />
                </ToastProvider>
            </AuthProvider>
        </Router>
    )
}

export default App
