import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui'

const ErrorPage = ({ code = '404', title, message, suggestion }) => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const displayTitle = title || 'Page Not Found'
    const displayMessage = message || 'This page does not exist in the clinical registry.'
    const displaySuggestion = suggestion || 'The route you entered may be misspelled or restricted to a different role.'
    const homeRoute = '/dashboard'

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-lg w-full text-center"
            >
                {/* Code graphic */}
                <div className="relative mb-8 inline-block">
                    <span className="text-[160px] font-headline font-black text-primary/5 leading-none select-none absolute inset-0 flex items-center justify-center">
                        {code}
                    </span>
                    <div className="relative z-10 py-10 px-6">
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings:"'FILL' 1"}}>
                                search_off
                            </span>
                        </div>
                        <div className="text-6xl font-headline font-black text-primary italic">{code}</div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl font-headline font-black text-on-surface uppercase italic tracking-tighter mb-3">
                    {displayTitle}
                </h1>
                <p className="text-on-surface-variant font-medium leading-relaxed mb-2">
                    {displayMessage}
                </p>
                <p className="text-xs text-on-surface-variant/60 font-bold uppercase tracking-widest mb-10">
                    {displaySuggestion}
                </p>

                {/* Actions */}
                <div className="flex gap-3 justify-center flex-wrap">
                    {user && (
                        <Button variant="primary" size="lg" icon="home" onClick={() => navigate(homeRoute)}>
                            Back to Dashboard
                        </Button>
                    )}
                    <Button variant="surface" size="lg" icon="arrow_back" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                    {!user && (
                        <Button variant="primary" size="lg" icon="login" onClick={() => navigate('/login')}>
                            Go to Login
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default ErrorPage
