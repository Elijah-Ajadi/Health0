import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import RegistrationShell from '../components/layout/RegistrationShell'

const HospitalRegistration = () => {
    const navigate = useNavigate()
    const [stage, setStage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    const [formData, setFormData] = useState({
        hospital_name: '',
        category: 'Private Enterprise',
        cac_number: '',
        tin: '',
        hefamaa_id: '',
        address: '',
        director_name: '',
        mdcn_number: '',
        director_license_expiry: '',
        admin_name: '',
        admin_email: '',
        admin_phone: '',
        username: '',
        password: '',
        cac_document: null,
        hefamaa_license: null,
        letter_of_intent: null,
        proof_of_address: null
    })

    const handleFileChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.files[0] })
    }

    const isStageValid = () => {
        if (stage === 1) return formData.hospital_name.trim() && formData.cac_number.trim() && formData.address.trim()
        if (stage === 2) return formData.hefamaa_license || formData.cac_document
        if (stage === 3) return formData.admin_name.trim() && formData.admin_email.trim() && formData.username.trim() && (formData.password?.length >= 8)
        if (stage === 4) return formData.cac_document !== null
        return false
    }

    const nextStage = () => {
        if (stage < 4) {
            setStage(prev => prev + 1)
            window.scrollTo(0, 0)
        } else {
            handleSubmit()
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError('')
        const data = new FormData()
        Object.keys(formData).forEach(key => {
            if (formData[key] instanceof File) {
                data.append(key, formData[key])
            } else if (formData[key]) {
                data.append(key, formData[key])
            }
        })
        try {
            await api.post('/hospital/signup/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
            navigate('/login', { state: { message: 'Institutional application submitted! Please wait for vetting.' } })
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.')
            setLoading(false)
        }
    }

    const steps = [
        { id: 1, label: 'Facility Info', icon: 'business' },
        { id: 2, label: 'Credentials & Security', icon: 'verified_user' },
        { id: 3, label: 'Admin Access', icon: 'admin_panel_settings' },
        { id: 4, label: 'Metadata & Files', icon: 'upload_file' }
    ]

    const renderDesktopSidebar = (
        <div className="flex flex-col h-full p-8 px-10">
            <div className="mb-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 ring-1 ring-primary/10">
                    <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
                </div>
                <h1 className="text-xl font-black text-primary tracking-tight font-headline">Health0</h1>
                <p className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-[0.2em] font-bold">Institutional Onboarding</p>
            </div>
            
            <nav className="flex-1 space-y-3">
                {steps.map((step) => (
                    <div key={step.id} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${stage === step.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}>
                        <span className="material-symbols-outlined">{step.icon}</span>
                        <span className="text-sm font-bold tracking-tight">{step.label}</span>
                    </div>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-outline-variant/20">
                <div className="p-4 rounded-2xl bg-surface-container-low mb-6 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Security Status</p>
                    <div className="flex items-center justify-center gap-2 text-emerald-600">
                        <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
                        <span className="text-[10px] font-bold">256-bit AES Active</span>
                    </div>
                </div>
                <button onClick={() => navigate('/')} className="w-full text-on-surface-variant hover:text-error text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Exit Portal
                </button>
            </div>
        </div>
    )

    return (
        <RegistrationShell
            stage={stage}
            totalStages={4}
            title={steps[stage - 1].label}
            onBack={() => setStage(prev => prev - 1)}
            desktopSidebar={renderDesktopSidebar}
            footer={
                <div className="space-y-4">
                    <button 
                        onClick={nextStage}
                        disabled={!isStageValid() || loading}
                        className={`w-full py-5 rounded-full font-headline font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${isStageValid() ? 'bg-gradient-to-r from-primary to-primary-container shadow-primary/20' : 'bg-surface-dim text-on-surface-variant cursor-not-allowed'}`}
                    >
                        {loading ? "Establishing Node..." : stage === 4 ? "Complete Onboarding" : "Continue"}
                        <span className="material-symbols-outlined">{stage === 4 ? "check_circle" : "arrow_forward"}</span>
                    </button>
                    {stage === 2 && (
                        <button onClick={() => setStage(3)} className="w-full py-2 text-on-surface-variant text-sm font-bold text-center">
                            Skip for now
                        </button>
                    )}
                </div>
            }
        >
            <AnimatePresence mode="wait">
                <motion.div 
                    key={stage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    {error && (
                        <div className="p-4 bg-error-container border border-error/10 rounded-2xl flex items-center gap-3 text-error text-sm font-bold shadow-subtle">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}

                    {/* Stage 1: Facility Info */}
                    {stage === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-lowest p-6 md:p-10 rounded-3xl shadow-subtle border border-outline-variant/10">
                            <InputField label="Hospital Name" placeholder="St. Jude Medical Center" value={formData.hospital_name} onChange={(e) => setFormData({...formData, hospital_name: e.target.value})} />
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Category</label>
                                <select className="w-full px-5 py-4 rounded-2xl bg-surface-container-low text-on-surface font-bold border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary/30 transition-all outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                    <option>Private Enterprise</option>
                                    <option>Public Institution</option>
                                    <option>Non-Profit Foundation</option>
                                </select>
                            </div>
                            <InputField label="CAC Number" placeholder="RC-XXXXXX" value={formData.cac_number} onChange={(e) => setFormData({...formData, cac_number: e.target.value})} />
                            <InputField label="TIN (Tax ID)" placeholder="XXXXXX-XXXX" value={formData.tin} onChange={(e) => setFormData({...formData, tin: e.target.value})} />
                            <div className="md:col-span-2">
                                <InputField label="Official Address" placeholder="Full institutional address..." rows="3" isTextArea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                            </div>
                        </div>
                    )}

                    {/* Stage 2: Credentials & Security */}
                    {stage === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UploadCard icon="badge" title="Medical License" description="State-issued certification for institutional medical practice." file={formData.hefamaa_license} onChange={(e) => handleFileChange(e, 'hefamaa_license')} uploadIcon="cloud_upload" hint="Drag file here" subHint="PDF, JPG up to 10MB" />
                            <UploadCard icon="description" title="Operating Permits" description="Regional health department clearance and facility permits." file={formData.cac_document} onChange={(e) => handleFileChange(e, 'cac_document')} uploadIcon="upload_file" hint="Click to browse" subHint="Multiple files accepted" />
                            <div className="md:col-span-2 bg-surface-container-low rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-subtle border border-outline-variant/10">
                                <div className="md:w-2/5 relative min-h-[200px]">
                                    <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Biometric scan" />
                                    <div className="absolute inset-0 bg-primary/10"></div>
                                </div>
                                <div className="md:w-3/5 p-8 flex flex-col justify-center">
                                    <h4 className="text-xl font-headline font-bold text-on-surface mb-2">Admin ID Verification</h4>
                                    <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">Biometric verification of the Administrative Lead is required to unlock clinical signing authority.</p>
                                    <button className="px-6 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all w-fit">Start Face & ID Scan</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stage 3: Admin Access */}
                    {stage === 3 && (
                        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl shadow-subtle border border-outline-variant/10 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField label="Admin Contact Name" placeholder="John Administrator" value={formData.admin_name} onChange={(e) => setFormData({...formData, admin_name: e.target.value})} />
                                <InputField label="Official Work Phone" placeholder="+234 800 000 0000" value={formData.admin_phone} onChange={(e) => setFormData({...formData, admin_phone: e.target.value})} />
                            </div>
                            <InputField label="Institutional Email" type="email" placeholder="admin@stjude.org" value={formData.admin_email} onChange={(e) => setFormData({...formData, admin_email: e.target.value})} />
                            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-outline-variant/10">
                                <InputField label="Preferred Username" placeholder="stjude_admin" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                                <InputField label="Access Password" type="password" placeholder="••••••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                            </div>
                        </div>
                    )}

                    {/* Stage 4: Metadata & Files */}
                    {stage === 4 && (
                        <div className="grid md:grid-cols-2 gap-6 bg-surface-container-lowest p-8 md:p-10 rounded-3xl shadow-subtle border border-outline-variant/10">
                            <FileUploadField label="CAC Document" onChange={(e) => handleFileChange(e, 'cac_document')} file={formData.cac_document} />
                            <FileUploadField label="HEFAMAA License" onChange={(e) => handleFileChange(e, 'hefamaa_license')} file={formData.hefamaa_license} />
                            <FileUploadField label="Letter of Intent" onChange={(e) => handleFileChange(e, 'letter_of_intent')} file={formData.letter_of_intent} />
                            <FileUploadField label="Proof of Address" onChange={(e) => handleFileChange(e, 'proof_of_address')} file={formData.proof_of_address} />
                        </div>
                    )}

                    {/* Desktop Footer (lg:flex) */}
                    <div className="hidden lg:flex items-center justify-between pt-10 border-t border-outline-variant/15">
                        <button onClick={() => setStage(prev => prev - 1)} disabled={stage === 1} className={`text-on-surface-variant font-bold hover:text-primary transition-colors flex items-center gap-2 ${stage === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            Back
                        </button>
                        <button 
                            onClick={nextStage}
                            disabled={!isStageValid() || loading}
                            className={`px-12 py-5 rounded-full font-headline font-bold text-white shadow-xl active:scale-95 transition-all flex items-center gap-3 ${isStageValid() ? 'bg-gradient-to-r from-primary to-primary-container shadow-primary/25' : 'bg-surface-dim text-on-surface-variant cursor-not-allowed'}`}
                        >
                            {loading ? "Establishing Node..." : stage === 4 ? "Complete Onboarding" : "Continue"}
                            <span className="material-symbols-outlined text-[20px]">{stage === 4 ? "check_circle" : "arrow_forward"}</span>
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </RegistrationShell>
    )
}

const InputField = ({ label, placeholder, value, onChange, type = "text", isTextArea = false, rows = "3" }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">{label}</label>
        {isTextArea ? (
            <textarea className="w-full px-5 py-4 rounded-2xl bg-surface-container-low text-on-surface font-bold border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-outline/50 resize-none outline-none" rows={rows} placeholder={placeholder} value={value} onChange={onChange} />
        ) : (
            <input type={type} className="w-full px-5 py-4 rounded-2xl bg-surface-container-low text-on-surface font-bold border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-outline/50 outline-none" placeholder={placeholder} value={value} onChange={onChange} />
        )}
    </div>
)

const FileUploadField = ({ label, onChange, file }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">{label}</label>
        <div className={`relative border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center gap-3 ${file ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/30 bg-surface/50'}`}>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onChange} />
            <span className={`material-symbols-outlined text-4xl ${file ? 'text-primary' : 'text-outline-variant'}`} style={file ? {fontVariationSettings: "'FILL' 1"} : {}}>
                {file ? 'description' : 'cloud_upload'}
            </span>
            <div className="text-center">
                <p className={`text-sm font-bold ${file ? 'text-primary' : 'text-on-surface-variant'}`}>{file ? file.name : "Select Document"}</p>
                <p className="text-[10px] text-outline mt-1 uppercase tracking-widest">PDF, JPG up to 10MB</p>
            </div>
            {file && <span className="absolute top-4 right-4 text-primary material-symbols-outlined text-xl">check_circle</span>}
        </div>
    </div>
)

const UploadCard = ({ icon, title, description, file, onChange, uploadIcon, hint, subHint }) => (
    <div className="group relative bg-surface-container-lowest rounded-3xl p-8 shadow-subtle border border-outline-variant/10 hover:border-primary/20 transition-all">
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-primary/5 rounded-2xl text-primary"><span className="material-symbols-outlined text-3xl">{icon}</span></div>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-widest">Mandatory</span>
        </div>
        <h4 className="text-xl font-headline font-bold text-on-surface mb-2">{title}</h4>
        <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{description}</p>
        <label className="block border-2 border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center bg-surface/50 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all cursor-pointer relative shadow-inner">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onChange} />
            {file ? (
                <>
                    <span className="material-symbols-outlined text-4xl text-primary mb-3" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
                    <p className="text-sm font-bold text-primary text-center break-all">{file.name}</p>
                    <p className="text-[10px] text-on-surface-variant mt-1">Verified ✓</p>
                </>
            ) : (
                <>
                    <span className="material-symbols-outlined text-4xl text-outline-variant mb-3 group-hover:text-primary transition-transform">{uploadIcon}</span>
                    <p className="text-sm font-bold text-on-surface-variant mb-1">{hint}</p>
                    <p className="text-[10px] text-outline uppercase tracking-widest">{subHint}</p>
                </>
            )}
        </label>
    </div>
)

export default HospitalRegistration
