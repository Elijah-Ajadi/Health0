import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
    HelpCircle, 
    Shield, 
    BadgeCheck, 
    Lock, 
    Fingerprint, 
    Hospital, 
    ShieldHalf, 
    Network,
    ArrowRight,
    MapPin,
    Mail,
    Phone,
    User,
    CheckCircle2,
    Activity,
    ShieldCheck,
    Eye,
    EyeOff
} from 'lucide-react'

const Signup = () => {
    const navigate = useNavigate()
    const [stage, setStage] = useState(1)
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        nin: '',
        ninVerified: false,
        password: '',
        showPassword: false,
        twoFactorEnabled: true,
        agreedToTerms: false
    });

    const getPasswordStrength = (pass) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 8) score++;
        if (pass.length >= 12) score++;
        if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score++;
        return score; // 0: None, 1: Weak, 2: Medium, 3: Strong
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleContinue = () => {
        if (stage < 3) {
            setStage(prev => prev + 1)
            window.scrollTo(0, 0)
        } else {
            console.log('Final Submission:', formData)
            navigate('/dashboard')
        }
    }

    const handleBack = () => {
        if (stage > 1) {
            setStage(prev => prev - 1)
            window.scrollTo(0, 0)
        }
    }

    return (
        <div className="bg-surface text-on-surface selection:bg-secondary-fixed min-h-screen font-body antialiased">
            {/* TopAppBar Shared Component */}
            <header className="fixed md:sticky top-0 w-full z-50 bg-white/80 md:bg-white/70 backdrop-blur-xl border-b border-slate-200/50 h-14 md:h-20 flex items-center">
                <div className="flex justify-between items-center px-4 md:px-6 w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-1.5 md:gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo_initial.png" alt="Health0 Logo" className="w-7 h-7 md:w-8 md:h-8 rounded-lg shadow-sm" />
                        <span className="text-lg md:text-xl font-black tracking-tighter md:tracking-tight text-primary font-headline">Health0</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-4">
                        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors active:scale-95 active:bg-surface-container">
                            <HelpCircle size={18} className="md:hidden" />
                            <HelpCircle size={20} className="hidden md:block" />
                        </button>
                        <button className="hidden md:flex p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors active:scale-95">
                            <Shield size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-20 md:pt-6 pb-40 md:pb-24">
                <div className="flex flex-col gap-6 md:gap-8">
                    {/* Mobile Optimized Header & Intro */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 md:space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[9px] md:text-[10px] font-bold tracking-widest uppercase shadow-sm">
                            <BadgeCheck size={14} className="text-primary" />
                            Verified Health Access
                        </div>
                        <h1 className="text-2xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tight font-headline">
                            {stage === 2 ? "Verify Your Identity" : "Begin your journey to "}
                            <span className="text-primary">{stage === 2 ? "" : "secure care."}</span>
                        </h1>
                        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-md">
                            {stage === 2 ? "Secure verification through the national identification registry is required for clinical access." : <>Join <strong>Health0</strong> and experience a clinical platform where your identity and health data are protected.</>}
                        </p>
                    </motion.div>

                    {/* Horizontal Stepper (Mobile & Desktop) */}
                    <div className="bg-surface-container-low p-4 md:p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                        <div className="flex items-center justify-between relative max-w-md mx-auto px-4 md:px-0">
                            {/* Progress Bar Background */}
                            <div className="absolute top-4 left-0 w-full h-0.5 bg-outline-variant/30 -z-0"></div>
                            
                            {/* Step 1 */}
                            <div className="relative z-10 flex flex-col items-center gap-2 bg-surface-container-low px-2">
                                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs transition-all ${stage >= 1 ? 'bg-primary text-white ring-4 ring-primary/10' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                                    {stage > 1 ? '✓' : '1'}
                                </div>
                                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${stage >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>Details</span>
                            </div>

                            {/* Step 2 */}
                            <div className={`relative z-10 flex flex-col items-center gap-2 bg-surface-container-low px-2 transition-opacity ${stage >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                                <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${stage >= 2 ? 'bg-primary text-white ring-4 ring-primary/10 border-transparent shadow-md' : 'bg-surface-container-highest text-on-surface-variant border-outline-variant/50'}`}>
                                    {stage > 2 ? '✓' : '2'}
                                </div>
                                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${stage >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>Identity</span>
                            </div>

                            {/* Step 3 */}
                            <div className={`relative z-10 flex flex-col items-center gap-2 bg-surface-container-low px-2 transition-opacity ${stage >= 3 ? 'opacity-100' : 'opacity-50'}`}>
                                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs border transition-all ${stage >= 3 ? 'bg-primary text-white ring-4 ring-primary/10 border-transparent' : 'bg-surface-container-highest text-on-surface-variant border-outline-variant/50'}`}>
                                    3
                                </div>
                                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${stage >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>Finish</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
                        {/* Right Column: Registration Card (Higher priority on mobile mobile) */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-7 order-1 lg:order-2"
                        >
                            <div className="bg-surface-container-lowest rounded-3xl shadow-[0_12px_48px_rgba(25,28,29,0.06)] border border-outline-variant/10 overflow-hidden">
                                <div className="p-6 md:p-12 lg:p-16">
                                    <div className="hidden md:flex flex-col md:flex-row justify-between md:items-center gap-4 mb-12">
                                        <div>
                                            <h2 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">
                                                {stage === 1 && "Personal Details"}
                                                {stage === 2 && "Identity Verification"}
                                                {stage === 3 && "Finalization"}
                                            </h2>
                                            <p className="text-on-surface-variant text-sm mt-1">
                                                {stage === 1 && "Please provide accurate information for clinical accuracy."}
                                                {stage === 2 && "Authenticate your identity via the global KYC network."}
                                                {stage === 3 && "Set your secure access credentials."}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                                                Step {stage} of 3
                                            </span>
                                        </div>
                                    </div>

                                    <form className="space-y-6 md:space-y-8" onSubmit={(e) => e.preventDefault()}>
                                        {stage === 1 && (
                                            <div className="space-y-6 md:space-y-8">
                                                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                                    <SignupField 
                                                        label="Full Legal Name" 
                                                        placeholder="Johnathan Doe" 
                                                        icon={User}
                                                        value={formData.fullName}
                                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                                    />
                                                    <div className="space-y-2.5">
                                                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] ml-1">Phone Number</label>
                                                        <div className="relative group">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-on-surface-variant text-sm border-r border-outline-variant/30 pr-3 group-focus-within:border-primary/50 transition-colors">
                                                                <span className="font-bold">+234</span>
                                                            </div>
                                                            <input 
                                                                className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary rounded-2xl pl-20 pr-4 py-4 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-slate-300" 
                                                                placeholder="800 000 0000" 
                                                                type="tel"
                                                                value={formData.phoneNumber}
                                                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <SignupField 
                                                    label="Email Address" 
                                                    placeholder="j.doe@example.com" 
                                                    type="email" 
                                                    icon={Mail}
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                />

                                                <div className="space-y-2.5">
                                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] ml-1">Residential Address</label>
                                                    <div className="relative group">
                                                        <MapPin className="absolute left-4 top-4 text-slate-300 transition-colors group-focus-within:text-primary pointer-events-none" size={20} />
                                                        <textarea 
                                                            className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none font-medium placeholder:text-slate-300" 
                                                            placeholder="Street address, City, State" 
                                                            rows="3"
                                                            value={formData.address}
                                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {stage === 2 && (
                                            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="space-y-2.5">
                                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] md:tracking-[0.2em] ml-1" htmlFor="nin">National Identification Number (NIN)</label>
                                                    <div className="relative group">
                                                        <input 
                                                            className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono text-lg tracking-[0.3em] placeholder:tracking-normal placeholder:font-body md:text-xl placeholder:text-sm" 
                                                            id="nin" 
                                                            placeholder="Enter 11-digit number" 
                                                            type="tel"
                                                            maxLength="11"
                                                            pattern="\d*"
                                                            value={formData.nin || ''}
                                                            onChange={(e) => setFormData({...formData, nin: e.target.value.replace(/\D/g, '')})}
                                                        />
                                                        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                                                            <Fingerprint size={24} className="md:w-7 md:h-7" />
                                                        </div>
                                                    </div>
                                                    <p className="text-[9px] md:text-[10px] text-on-surface-variant/60 font-medium ml-1 flex items-center gap-1.5 leading-relaxed">
                                                        <Shield size={10} />
                                                        Secure verification via national registry. Encrypted with AES-256 bit protocols.
                                                    </p>
                                                </div>

                                                {/* KYC Provider Branding - Compact for Mobile */}
                                                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 flex items-center justify-between shadow-sm">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-1.5">Verification Provider</span>
                                                        <div className="flex items-center gap-1 md:gap-1.5">
                                                            <span className="text-xs md:text-base font-black text-[#001847] tracking-tight">interswitch</span>
                                                            <span className="text-xs md:text-base font-black text-primary px-1.5 bg-primary/10 rounded">KYC</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 md:gap-2 text-primary bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-outline-variant/5">
                                                        <BadgeCheck size={14} className="md:w-4 md:h-4" />
                                                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Secure</span>
                                                    </div>
                                                </div>

                                                <div className="hidden md:flex bg-surface-container-low p-6 rounded-3xl border-2 border-dashed border-outline-variant/20 flex-col items-center justify-center text-center gap-4">
                                                    {!formData.ninVerified ? (
                                                        <button 
                                                            className={`px-12 py-4 rounded-2xl font-headline font-extrabold text-sm tracking-tight transition-all active:scale-95 shadow-xl shadow-primary/5 ${formData.nin?.length === 11 ? 'bg-primary text-white hover:shadow-primary/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                                            onClick={() => {
                                                                if (formData.nin?.length === 11) {
                                                                    setFormData({...formData, ninVerified: true})
                                                                }
                                                            }}
                                                            disabled={formData.nin?.length !== 11}
                                                        >
                                                            Verify NIN Details
                                                        </button>
                                                    ) : (
                                                        <motion.div 
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="flex items-center gap-3 text-primary bg-white px-6 py-3 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5"
                                                        >
                                                            <CheckCircle2 size={24} />
                                                            <span className="font-bold tracking-tight">Identity Successfully Verified</span>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {stage === 3 && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                                {/* Password Section */}
                                                <div className="space-y-4 pt-2">
                                                    <div className="flex justify-between items-end">
                                                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] ml-1">Secure Password</label>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${passwordStrength === 3 ? 'text-primary' : passwordStrength === 2 ? 'text-amber-600' : 'text-rose-500'}`}>
                                                            {passwordStrength === 3 ? 'Strong' : passwordStrength === 2 ? 'Medium' : passwordStrength === 1 ? 'Weak' : ''}
                                                        </span>
                                                    </div>
                                                    <div className="relative group">
                                                        <input 
                                                            className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary rounded-2xl px-6 py-4.5 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-slate-300" 
                                                            placeholder="••••••••••••" 
                                                            type={formData.showPassword ? "text" : "password"}
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                        />
                                                        <button 
                                                            type="button" 
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors focus:outline-none"
                                                            onClick={() => setFormData({...formData, showPassword: !formData.showPassword})}
                                                        >
                                                            {formData.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                        </button>
                                                    </div>
                                                    {/* Strength Bars */}
                                                    <div className="flex gap-2 h-1.5 px-0.5">
                                                        <div className={`flex-grow rounded-full transition-all duration-500 ${passwordStrength >= 1 ? (passwordStrength === 1 ? 'bg-rose-500' : passwordStrength === 2 ? 'bg-amber-500' : 'bg-primary') : 'bg-slate-100'}`}></div>
                                                        <div className={`flex-grow rounded-full transition-all duration-500 ${passwordStrength >= 2 ? (passwordStrength === 2 ? 'bg-amber-500' : 'bg-primary') : 'bg-slate-100'}`}></div>
                                                        <div className={`flex-grow rounded-full transition-all duration-500 ${passwordStrength >= 3 ? 'bg-primary' : 'bg-slate-100'}`}></div>
                                                    </div>
                                                    <p className="text-[11px] text-on-surface-variant/70 italic ml-1">Required: 12+ characters, including numbers and symbols for maximum security.</p>
                                                </div>

                                                {/* 2FA Toggle Card */}
                                                <div className="p-5 md:p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 flex items-center justify-between group shadow-sm">
                                                    <div className="flex gap-4 items-center">
                                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-outline-variant/5">
                                                            <Shield size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-on-surface font-headline tracking-tight">Enable Two-Factor (2FA)</h4>
                                                            <p className="text-[11px] text-on-surface-variant/70 leading-tight">Recommended for clinical integrity accounts.</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            checked={formData.twoFactorEnabled} 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            onChange={() => setFormData({...formData, twoFactorEnabled: !formData.twoFactorEnabled})}
                                                        />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                                    </label>
                                                </div>

                                                {/* T&C Checkbox */}
                                                <div className="flex gap-4 px-1 group cursor-pointer" onClick={() => setFormData({...formData, agreedToTerms: !formData.agreedToTerms})}>
                                                    <div className="pt-0.5">
                                                        <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${formData.agreedToTerms ? 'bg-primary border-primary' : 'bg-white border-outline-variant group-hover:border-primary'}`}>
                                                            {formData.agreedToTerms && <CheckCircle2 size={14} className="text-white" />}
                                                        </div>
                                                    </div>
                                                    <label className="text-[12px] md:text-sm text-on-surface-variant leading-relaxed select-none cursor-pointer">
                                                        I acknowledge that I have read and agree to the <a className="text-primary font-bold underline underline-offset-4 decoration-primary/20 hover:decoration-primary transition-shadow" href="#" onClick={(e) => e.stopPropagation()}>Privacy Policy</a> and <a className="text-primary font-bold underline underline-offset-4 decoration-primary/20 hover:decoration-primary transition-shadow" href="#" onClick={(e) => e.stopPropagation()}>Clinical Terms of Service</a>.
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {/* Desktop-only back/continue buttons - Hidden on mobile if STICKY BAR is present */}
                                        <div className="hidden md:flex pt-8 flex-col sm:flex-row gap-6 items-center">
                                            {stage > 1 && (
                                                <button 
                                                    className="w-full sm:w-auto px-10 py-5 border-2 border-outline-variant/30 text-on-surface font-headline font-bold text-lg rounded-2xl active:scale-95 transition-all hover:bg-surface-container-low" 
                                                    type="button"
                                                    onClick={handleBack}
                                                >
                                                    Back
                                                </button>
                                            )}
                                            <button 
                                                className={`w-full sm:w-auto flex-1 px-12 py-5 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-extrabold text-lg rounded-2xl active:scale-95 transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 group ${stage === 2 && !formData.ninVerified ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`} 
                                                type="button"
                                                onClick={handleContinue}
                                                disabled={stage === 2 && !formData.ninVerified}
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    {stage === 3 ? "Complete Registration" : stage === 2 ? "Continue to Finalization" : "Continue to Verification"}
                                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </button>
                                        </div>

                                        {stage === 1 && (
                                            <p className="hidden md:block text-[11px] text-on-surface-variant text-center sm:text-left leading-relaxed font-medium">
                                                By continuing, you agree to our <br className="hidden sm:block"/><a className="text-primary font-bold underline underline-offset-4 decoration-primary/30" href="#">Terms</a> and <a className="text-primary font-bold underline underline-offset-4 decoration-primary/30" href="#">Privacy Policy</a>.
                                            </p>
                                        )}
                                    </form>
                                </div>
                            </div>

                            {/* Trusted By section - Scaled for Mobile */}
                            <div className={`mt-10 md:mt-16 flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-30 ${stage > 1 ? 'hidden lg:flex' : ''}`}>
                                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] w-full text-center mb-2 md:mb-6">Official Clinical Partners</p>
                                <PartnerLogo icon={Hospital} name="MediLog" small />
                                <PartnerLogo icon={ShieldHalf} name="SecurHealth" small />
                                <PartnerLogo icon={Network} name="HealthNet" small />
                            </div>
                        </motion.div>

                        {/* Left Column: Context / Info / Bento (Below form on mobile) */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1"
                        >
                            {stage === 1 ? (
                                <div className="space-y-4 md:space-y-6">
                                    <div className="hidden lg:block space-y-6">
                                        <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tight font-headline">
                                            The foundation of your <span className="text-primary">medical vault.</span>
                                        </h2>
                                        <p className="text-lg text-on-surface-variant leading-relaxed max-w-md font-medium">
                                            Your primary contact information allows clinics to reach you securely and ensures your records are always identifiable.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 md:p-5 bg-white/60 backdrop-blur-sm border border-outline-variant/15 rounded-2xl shadow-sm">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-container/10 text-primary flex items-center justify-center rounded-xl shrink-0">
                                            <Lock size={22} className="md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-primary">Secure & Encrypted</p>
                                            <p className="text-xs md:text-sm text-on-surface-variant leading-tight font-medium">AES-256 bank-grade encryption</p>
                                        </div>
                                    </div>
                                </div>
                            ) : stage === 2 ? (
                                <div className="grid grid-cols-1 gap-3 md:gap-4">
                                    {/* Info Card 1 - Compact for Mobile */}
                                    <div className="bg-surface-container-lowest md:bg-surface-container-low p-4 md:p-6 rounded-xl md:rounded-3xl border border-outline-variant/10 shadow-sm flex gap-3 md:flex-col items-start transition-all hover:shadow-md">
                                        <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 bg-primary/5 md:bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center text-primary">
                                            <ShieldCheck size={18} className="md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-headline font-bold md:font-extrabold text-xs md:text-xl text-on-surface mb-1 md:mb-2 tracking-tight">Purpose of NIN</h3>
                                            <p className="text-[11px] md:text-sm text-on-surface-variant leading-relaxed font-medium">
                                                Matches your profile with authorized clinical records to prevent identity theft and ensure only you can access history.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Info Card 2 - Alert Style / Mobile Compact */}
                                    <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl md:rounded-3xl shadow-sm md:shadow-md md:shadow-slate-200/50 border-l-4 border-primary flex gap-3 md:block items-start">
                                        <div className="shrink-0 w-8 h-8 md:hidden bg-blue-50 rounded-lg flex items-center justify-center text-primary">
                                            <Shield size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start md:mb-1.5 pt-1">
                                                <h4 className="text-[10px] md:text-sm font-bold text-primary uppercase tracking-tight md:tracking-widest">Bank-Grade Protection</h4>
                                                <Lock className="hidden md:block text-primary" size={20} />
                                            </div>
                                            <p className="text-[11px] md:text-xs text-on-surface-variant leading-relaxed font-medium">
                                                Encrypted with AES-256 bit protocols. Your NIN is used only for one-time verification.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Visual Element - Hidden on very small screens or refined */}
                                    <div className="relative h-32 md:h-48 rounded-xl md:rounded-[2rem] overflow-hidden group border border-outline-variant/10 shadow-sm">
                                        <img 
                                            alt="Security Illustration" 
                                            className="w-full h-full object-cover grayscale opacity-20 group-hover:opacity-40 transition-opacity duration-700" 
                                            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                                        <div className="absolute bottom-4 md:bottom-6 left-6 md:left-8">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Shield size={12} className="md:w-3.5 md:h-3.5" />
                                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60">Protocol V4.2 Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                 <div className="grid grid-cols-1 gap-3 md:gap-6">
                                    {/* Info Card - High Security */}
                                    <div className="bg-primary text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-primary/20 flex flex-col gap-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center ring-1 ring-white/30">
                                            <Shield size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-headline font-extrabold text-xl mb-3">Clinical Grade Security</h3>
                                            <p className="text-white/80 text-sm leading-relaxed font-medium">
                                                Your account is being configured with AES-256 bit encryption protocols, the global standard for protecting sensitive medical identities.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                            <span className="text-[10px] uppercase tracking-widest font-black text-white/60">Verified Environment Secure</span>
                                        </div>
                                    </div>

                                    {/* Trust Grid */}
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-4 p-4 md:p-5 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-10 h-10 bg-slate-50 text-primary flex items-center justify-center rounded-xl border border-slate-100">
                                                <Fingerprint size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">Identity</p>
                                                <p className="text-xs font-bold text-on-surface">Verified via interswitch KYC</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 md:p-5 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-10 h-10 bg-slate-50 text-primary flex items-center justify-center rounded-xl border border-slate-100">
                                                <Lock size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">Compliance</p>
                                                <p className="text-xs font-bold text-on-surface">HIPAA & GDPR Standards</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Mobile-Optimized Bottom Action Bar - Sticky for one-handed use */}
            {(stage === 2 || stage === 3) && (
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-surface-container-high p-4 z-[60] safe-area-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
                    <div className="max-w-lg mx-auto flex flex-col gap-3">
                        {stage === 2 ? (
                            !formData.ninVerified ? (
                                <button 
                                    className={`w-full h-12 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${formData.nin?.length === 11 ? 'bg-primary text-white shadow-blue-500/20' : 'bg-slate-100 text-slate-400 opacity-60'}`}
                                    onClick={() => {
                                        if (formData.nin?.length === 11) {
                                            setFormData({...formData, ninVerified: true})
                                        }
                                    }}
                                    disabled={formData.nin?.length !== 11}
                                >
                                    Verify NIN
                                    <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button 
                                    className="w-full h-12 bg-primary text-white rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-500/20"
                                    onClick={handleContinue}
                                >
                                    Continue to Finalization
                                    <ArrowRight size={18} />
                                </button>
                            )
                        ) : (
                            <button 
                                className={`w-full h-12 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${formData.password?.length >= 8 && formData.agreedToTerms ? 'bg-primary text-white shadow-blue-500/20' : 'bg-slate-100 text-slate-400 opacity-60'}`}
                                onClick={handleContinue}
                                disabled={formData.password?.length < 8 || !formData.agreedToTerms}
                            >
                                <span className="flex items-center gap-2">
                                    <Lock size={16} />
                                    Create Account
                                </span>
                            </button>
                        )}
                        <p className="text-[9px] text-center text-slate-400 font-medium tracking-tight uppercase">© 2024 Digital Sanctuary Security Suite</p>
                    </div>
                </div>
            )}
            
            {/* Standard BottomNavBar for Stage 1 / Global Navigation */}
            {stage === 1 && (
                <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-4 bg-white/90 backdrop-blur-xl border-t border-slate-200/50 z-50 rounded-t-[2.5rem] shadow-[0_-12px_48px_rgba(25,28,29,0.08)]">
                    <MobileNavItem icon={Activity} label="Progress" active />
                    <MobileNavItem icon={ShieldCheck} label="Security" />
                    <MobileNavItem icon={Fingerprint} label="Identity" />
                    <MobileNavItem icon={HelpCircle} label="Support" />
                </nav>
            )}

            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -right-[10%] w-[80%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
                <div className="absolute top-[60%] -left-[10%] w-[60%] h-[40%] bg-secondary-container/10 rounded-full blur-[80px]"></div>
            </div>
            
            <footer className="py-8 text-center opacity-40">
                <p className="text-xs text-on-surface-variant font-medium">© 2024 Digital Sanctuary. Clinical Data Management System.</p>
            </footer>
        </div>
    )
}

const SignupField = ({ label, placeholder, type = 'text', icon: Icon, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] ml-1">{label}</label>
        <div className="relative group">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-primary pointer-events-none" size={20} />}
            <input 
                className={`w-full bg-surface-container-low border-2 border-transparent focus:border-primary rounded-2xl ${Icon ? 'pl-12' : 'px-4'} pr-4 py-4 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium placeholder:text-slate-300`} 
                placeholder={placeholder} 
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
)

const PartnerLogo = ({ icon: Icon, name, small }) => (
    <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all cursor-pointer">
        <Icon size={small ? 24 : 28} className="text-slate-500 group-hover:text-primary transition-colors" />
        <span className={`font-headline font-black tracking-tighter text-slate-600 group-hover:text-on-surface transition-colors ${small ? 'text-base' : 'text-xl'}`}>{name}</span>
    </div>
)

const MobileNavItem = ({ icon: Icon, label, active }) => (
    <div className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 transition-all duration-300 ${active ? 'bg-primary/10 text-primary scale-105' : 'text-slate-400 opacity-60'}`}>
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[9px] font-black uppercase tracking-widest mt-2">{label}</span>
    </div>
)

export default Signup
