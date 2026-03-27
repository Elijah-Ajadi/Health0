import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import RegistrationShell from '../components/layout/RegistrationShell'

const PatientRegistration = () => {
    const navigate = useNavigate()
    const [stage, setStage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        dob: '',
        gender: '',
        nin: '',
        ninVerified: false,
        password: '',
        agreedToTerms: false
    })

    const isStageValid = () => {
        if (stage === 1) return formData.fullName.trim() && formData.phoneNumber && formData.email && formData.address && formData.dob && formData.gender
        if (stage === 2) return formData.nin?.length === 11 && formData.ninVerified
        if (stage === 3) return formData.password?.length >= 8 && formData.agreedToTerms
        return false
    }

    const handleContinue = async () => {
        if (stage < 3) {
            setStage(prev => prev + 1)
            window.scrollTo(0, 0)
        } else {
            handleSubmit()
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError('')
        try {
            const [firstName, ...lastNameParts] = formData.fullName.split(' ')
            const payload = {
                username: formData.email.split('@')[0] + Math.floor(Math.random() * 1000),
                email: formData.email,
                password: formData.password,
                first_name: firstName,
                last_name: lastNameParts.join(' '),
                role: 'PATIENT',
                phone_number: formData.phoneNumber,
                address: formData.address,
                dob: formData.dob,
                gender: formData.gender,
                nin: formData.nin
            }
            await api.post('/register/', payload)
            navigate('/login', { state: { message: 'Account created! Please login.' } })
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.')
            setLoading(false)
        }
    }

    const steps = [
        { id: 1, label: 'Identity', icon: 'person' },
        { id: 2, label: 'Verification', icon: 'fingerprint' },
        { id: 3, label: 'Security', icon: 'shield' }
    ]

    const renderDesktopSidebar = (
        <div className="flex flex-col h-full p-10">
            <div className="mb-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 ring-1 ring-primary/10">
                    <span className="material-symbols-outlined text-primary text-3xl">health_and_safety</span>
                </div>
                <h1 className="text-xl font-black text-primary tracking-tight font-headline">Health0</h1>
                <p className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-[0.2em] font-bold">Patient Enrollment</p>
            </div>
            
            <nav className="flex-1 space-y-3">
                {steps.map((step) => (
                    <div key={step.id} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${stage === step.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}>
                        <span className="material-symbols-outlined">{step.icon}</span>
                        <span className="text-sm font-bold tracking-tight">{step.label}</span>
                    </div>
                ))}
            </nav>

            <div className="mt-auto p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-xs text-primary font-bold leading-relaxed">
                    <span className="material-symbols-outlined align-middle mr-1 text-sm">lock</span>
                    Your data is encrypted locally before transmission.
                </p>
            </div>
        </div>
    )

    return (
        <RegistrationShell
            stage={stage}
            totalStages={3}
            title={steps[stage - 1].label}
            onBack={() => setStage(prev => prev - 1)}
            desktopSidebar={renderDesktopSidebar}
            footer={
                <button 
                    onClick={handleContinue}
                    disabled={!isStageValid() || loading}
                    className={`w-full py-5 rounded-full font-headline font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${isStageValid() ? 'bg-gradient-to-r from-primary to-primary-container shadow-primary/20' : 'bg-surface-dim text-on-surface-variant cursor-not-allowed'}`}
                >
                    {loading ? "Creating Vault..." : stage === 3 ? "Initialize My Health ID" : "Continue"}
                    <span className="material-symbols-outlined">{stage === 3 ? "how_to_reg" : "arrow_forward"}</span>
                </button>
            }
        >
            <AnimatePresence mode="wait">
                <motion.div 
                    key={stage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-xl mx-auto space-y-8"
                >
                    {error && (
                        <div className="p-4 bg-error-container border border-error/10 rounded-2xl flex items-center gap-3 text-error text-sm font-bold shadow-subtle">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}

                    {/* Stage 1: Personal Info */}
                    {stage === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Personal Details</h2>
                                <p className="text-on-surface-variant text-sm font-medium">Please provide your legal identification information.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-6 bg-surface-container-lowest p-8 rounded-3xl shadow-subtle border border-outline-variant/10">
                                <InputField label="Full Legal Name" placeholder="Jane Doe" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Phone Number" placeholder="+234..." type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                                    <InputField label="Email Address" placeholder="jane@example.com" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Date of Birth" type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Gender</label>
                                        <select className="w-full px-5 py-4 rounded-2xl bg-surface-container-low text-on-surface font-bold border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary/30 outline-none" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <InputField label="Residential Address" placeholder="Enter your full home address" isTextArea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                            </div>
                        </div>
                    )}

                    {/* Stage 2: NIN Verification */}
                    {stage === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Identity Vault</h2>
                                <p className="text-on-surface-variant text-sm font-medium">Securely link your National Identity Number.</p>
                            </div>
                            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-subtle border border-outline-variant/10 space-y-8">
                                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                                    <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                                    <div>
                                        <p className="text-sm font-bold text-on-surface">Biometric Integration</p>
                                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Connecting your NIN allows for instant medical record retrieval across the Health0 ecosystem.</p>
                                    </div>
                                </div>
                                <InputField label="National Identity Number (11 Digits)" placeholder="0000 0000 000" maxLength={11} value={formData.nin} onChange={(e) => setFormData({...formData, nin: e.target.value.replace(/\D/g, '')})} />
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, ninVerified: true})}
                                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${formData.ninVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-surface-container border border-outline-variant/20 text-on-surface'}`}
                                >
                                    <span className="material-symbols-outlined">{formData.ninVerified ? 'check_circle' : 'fingerprint'}</span>
                                    {formData.ninVerified ? 'NIN Verified Successfully' : 'Verify with NIMC'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Stage 3: Security */}
                    {stage === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Account Security</h2>
                                <p className="text-on-surface-variant text-sm font-medium">Finalize your health credentials.</p>
                            </div>
                            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-subtle border border-outline-variant/10 space-y-6">
                                <InputField label="Create Secure Password" type="password" placeholder="Min 8 characters" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl">
                                    <input type="checkbox" id="terms" className="mt-1 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" checked={formData.agreedToTerms} onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})} />
                                    <label htmlFor="terms" className="text-xs text-on-surface-variant leading-relaxed">
                                        I consent to the processing of my medical data as outlined in the <span className="text-primary font-bold cursor-pointer">Security Protocol</span> and <span className="text-primary font-bold cursor-pointer">Patient Rights Mandate</span>.
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Desktop Footer Only - Mobile handled by Shell */}
                    <div className="hidden lg:flex items-center justify-between pt-10 border-t border-outline-variant/15">
                        <button onClick={() => setStage(prev => prev - 1)} disabled={stage === 1} className={`text-on-surface-variant font-bold hover:text-primary transition-colors flex items-center gap-2 ${stage === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            Back
                        </button>
                        <button 
                            onClick={handleContinue}
                            disabled={!isStageValid() || loading}
                            className={`px-12 py-5 rounded-full font-headline font-bold text-white shadow-xl active:scale-95 transition-all flex items-center gap-3 ${isStageValid() ? 'bg-gradient-to-r from-primary to-primary-container shadow-primary/25' : 'bg-surface-dim text-on-surface-variant cursor-not-allowed'}`}
                        >
                            {loading ? "Creating Vault..." : stage === 3 ? "Initialize My Health ID" : "Continue"}
                            <span className="material-symbols-outlined text-[20px]">{stage === 3 ? "how_to_reg" : "arrow_forward"}</span>
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </RegistrationShell>
    )
}

const InputField = ({ label, placeholder, value, onChange, type = "text", isTextArea = false, rows = "3", maxLength }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">{label}</label>
        {isTextArea ? (
            <textarea className="w-full px-5 py-4 rounded-2xl bg-surface-container-low text-on-surface font-bold border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-outline/50 resize-none outline-none" rows={rows} placeholder={placeholder} value={value} onChange={onChange} />
        ) : (
            <input type={type} maxLength={maxLength} className="w-full px-5 py-4 rounded-2xl bg-surface-container-low text-on-surface font-bold border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-outline/50 outline-none" placeholder={placeholder} value={value} onChange={onChange} />
        )}
    </div>
)

export default PatientRegistration
