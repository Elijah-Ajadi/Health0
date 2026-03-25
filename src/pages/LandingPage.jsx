import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
    Search, Bell, Settings, ShieldCheck, Sparkles, Shield, BarChart3, 
    UserSearch, Activity, Globe, FileText, ArrowRight, CheckCircle2,
    Mail, Smartphone, Truck, Zap, Download, RefreshCw, Lock
} from 'lucide-react'

const LandingPage = () => {
    const navigate = useNavigate()

    const handleLogin = (role) => {
        localStorage.setItem('role', role)
        if (role === 'patient') {
            navigate('/signup')
        } else {
            navigate('/dashboard')
        }
    }

    return (
        <div className="bg-surface font-body text-on-background antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
            {/* Desktop Navigation Bar */}
            <nav className="hidden md:block bg-white/85 backdrop-blur-md font-headline font-semibold text-sm sticky top-0 z-50 shadow-[0px_4px_20px_rgba(0,64,161,0.04)] h-16">
                <div className="flex justify-between items-center w-full px-8 h-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                           <img src="/logo_initial.png" alt="Health0 Logo" className="w-10 h-10 rounded-xl" />
                           <span className="text-xl font-black text-primary">Health0</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Bar */}
            <header className="md:hidden bg-white/85 backdrop-blur-md shadow-[0_4px_20px_rgba(0,64,161,0.04)] sticky top-0 z-50 flex justify-between items-center px-6 h-16 w-full">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <ShieldCheck className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-blue-800 font-extrabold tracking-tighter font-headline text-xl">Health0</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-slate-100/50 transition-colors scale-95 active:scale-90">
                        <Bell className="text-slate-500 w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden">
                        <img 
                            alt="User Profile Avatar" 
                            className="w-full h-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1CG4trg2VUgwDIXtuMvySZUYof654XPXY9ah9ReVMUgG4Te5MHzKE49hPdS8lO8sJUPlvAcP-8EDJDn-RfK-gFsPJBU7m5wz8vrQxYt2rF3bLpxvL1vMDrSSOHqp8Zh8xOi2PjkncxMLFg9_8qBWFKH5_YaU-8O68EOlJJ5_3UzklWUuRPQ1MStuS1RrAJxM-ZQ5JzWMQ-SVMWcca6AWGOFzT0rxbWq8MpckNKuo7gyRFrUZIiLO1PUIVKHjD7iCf0E088byK5Hk"
                        />
                    </div>
                </div>
            </header>

            {/* Desktop Layout */}
            <main className="hidden md:block max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-24">
                {/* Hero Section */}
                <motion.header 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <h1 className="font-headline text-5xl lg:text-7xl font-extrabold tracking-tight text-on-background max-w-4xl leading-[1.1]">
                        The Centralized Infrastructure for <span className="text-primary">Global Health Records.</span>
                    </h1>
                </motion.header>

                {/* Split View Layout */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
                    {/* Left Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold tracking-wider uppercase">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Clinical Standard
                        </div>
                        <h2 className="font-headline text-4xl font-bold leading-tight text-on-background">A Digital Sanctuary for Modern Clinicians.</h2>
                        <p className="text-on-surface-variant text-lg leading-relaxed font-light">
                            We've eliminated the friction of legacy systems. Health0 provides an architectural serenity that reduces cognitive load, allowing doctors to focus on what matters most: patient outcomes. 
                        </p>
                        <div className="space-y-4 pt-4">
                            <Pillar icon={Sparkles} title="Intelligent Automation" description="Automated coding and clinical documentation support." />
                            <Pillar icon={Shield} title="Sovereign Data" description="Patient-owned encrypted vaults with immutable logs." />
                        </div>
                        <div className="flex flex-wrap gap-4 pt-8">
                            <button 
                                className="bg-primary signature-gradient text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                                onClick={() => handleLogin('patient')}
                            >
                                Create Patient Vault
                            </button>
                            <button 
                                className="bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-semibold hover:bg-surface-container-highest transition-all"
                                onClick={() => handleLogin('hospital')}
                            >
                                Onboard Your Hospital
                            </button>
                        </div>
                    </motion.div>

                    {/* Right: Interface Preview */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7 relative group"
                    >
                        <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
                        <div className="relative bg-surface-container-lowest rounded-[1.5rem] shadow-[0px_12px_40px_rgba(25,28,30,0.06)] overflow-hidden border border-outline-variant/10">
                            {/* Mockup Header */}
                            <div className="h-12 bg-surface-container-low flex items-center px-6 gap-2">
                                <div className="w-3 h-3 rounded-full bg-error/20"></div>
                                <div className="w-3 h-3 rounded-full bg-tertiary/20"></div>
                                <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                                <div className="ml-4 h-6 w-1/3 bg-surface-container rounded-full"></div>
                            </div>
                            {/* Mockup Content */}
                            <div className="p-8">
                                <img 
                                    alt="Health Vault Interface Preview" 
                                    className="w-full rounded-lg shadow-sm" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcVe3xd43So40hlwuy_Bkz3iA8OlxnpYHlhBXTM6-gRVvFs0q8hTbWyur7vGFtG6i4lESndvIj4AHZ8sWGSm7yjCQaIQE_xtNalBiqloLTw-wTN8cd2iyC9vz1Gg1tUX-OoOUeZB42yMhja37Pt6MF6jbZnCmyBZy2q1R8N09Gr5K0SHo45Q6Oh_cNUMcM3J8fv4SxjOUKGQDOjrLxUATcldRm0DV6w6mhb7iA7tMtklkGqub9tmsbKyiYFtHlCLBz-30OVbdoqCI"
                                />
                            </div>
                        </div>
                        {/* Floating Insight Card */}
                        <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-outline-variant/10 glass-effect hidden md:block z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                                    <BarChart3 className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Real-time Insight</p>
                                    <p className="font-bold text-on-surface text-sm">System Integrity 99.9%</p>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[99.9%]"></div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Trust Logos */}
                <section className="mb-32">
                    <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-10">Trusted by Global Medical Authorities</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="font-headline text-2xl font-black text-slate-800 tracking-tighter">INTERSWITCH KYC</span>
                        <span className="font-headline text-2xl font-black text-slate-800 tracking-tighter underline decoration-primary decoration-4">MEDILOG</span>
                        <span className="font-headline text-2xl font-black text-slate-800 tracking-tighter italic">SECURHEALTH</span>
                        <span className="font-headline text-2xl font-black text-slate-800 tracking-tighter border-2 border-slate-800 px-2">HEALTHNET</span>
                    </div>
                </section>

                {/* Features Pillar Grid */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="font-headline text-4xl font-extrabold mb-4 text-on-background">Precision Pillars</h2>
                        <p className="text-on-surface-variant max-w-2xl mx-auto">Scalable infrastructure designed for the three critical actors in the healthcare ecosystem.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PillarCard 
                            icon={UserSearch} 
                            title="Patient Vaults" 
                            description="Universal accessibility to clinical history. One vault, owned by the patient, accessible anywhere in the world with instant consent mapping."
                            checks={["Biometric Auth Integration", "Offline QR Access"]}
                        />
                        <PillarCard 
                            icon={Activity} 
                            title="Clinical Workflow" 
                            description="A high-performance command center for departments. Streamline admissions, diagnostics, and prescriptions without redundant data entry."
                            popular
                            checks={["Auto-ICD 11 Coding", "Real-time Ward Sync"]}
                        />
                        <PillarCard 
                            icon={ShieldCheck} 
                            title="Global Security" 
                            description="Enterprise-grade security infrastructure. Monitor system integrity and compliance through an immutable administrative ledger."
                            checks={["AES-256 Quantum-Ready", "GDPR & HIPAA Locked"]}
                        />
                    </div>
                </section>

                {/* Final CTA Banner */}
                <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.8 }}
                    className="bg-slate-900 rounded-[2rem] p-12 lg:p-24 text-center text-white relative overflow-hidden mb-32 outline-none"
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0040a1_0%,_transparent_50%)]"></div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="font-headline text-4xl text-white lg:text-6xl font-bold mb-8">Ready to Scale Your Care?</h2>
                        <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">Join over 400 hospitals already leveraging the <strong>Health0</strong> decentralized infrastructure for better clinical precision.</p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button 
                                className="bg-white text-slate-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all active:scale-95"
                                onClick={() => handleLogin('hospital')}
                            >
                                Start Onboarding
                            </button>
                            <button className="border border-slate-700 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all active:scale-95">Request Demo</button>
                        </div>
                    </div>
                </motion.section>
            </main>

            {/* Mobile Layout */}
            <main className="md:hidden max-w-5xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <section className="text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/30 text-primary font-medium text-xs mb-8 uppercase tracking-widest font-headline"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified by Interswitch
                    </motion.div>
                    <h2 className="font-headline font-extrabold text-4xl text-on-background tracking-tight leading-[1.1] mb-6">
                        Your health records.<br/>Unified. <span className="text-primary">Verified.</span> Secure.
                    </h2>
                    <p className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Welcome to Your Digital Sanctuary. One vault for all clinical documents, accessible instantly from anywhere in the world.
                    </p>
                    <div className="flex flex-col gap-4 items-center">
                        <button 
                            className="bg-primary text-white w-full px-8 py-4 rounded-full font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 h-14 active:scale-95 transition-transform"
                            onClick={() => handleLogin('patient')}
                        >
                            Start Your Health Vault
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button 
                            className="bg-surface-container-lowest text-primary border border-outline-variant/30 w-full px-8 py-4 rounded-full font-semibold h-14 active:scale-95 transition-transform"
                            onClick={() => handleLogin('hospital')}
                        >
                            Hospital Access
                        </button>
                    </div>
                </section>

                {/* Bento Grid Features */}
                <section className="flex flex-col gap-6 mb-24">
                    {/* Feature 1: Secure Storage */}
                    <div className="bg-surface-container-lowest rounded-[3rem] p-8 shadow-[0_4px_20px_rgba(0,64,161,0.04)] flex flex-col justify-between overflow-hidden relative group">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="font-headline text-2xl font-bold mb-3">Secure Storage</h3>
                            <p className="text-on-surface-variant leading-relaxed mb-6">
                                Military-grade encryption for your Documents, PDFs, and medical Images. Your privacy is non-negotiable.
                            </p>
                        </div>
                        <div className="flex gap-3 relative z-10">
                            <span className="px-3 py-1 rounded-lg bg-surface-container text-xs font-medium text-on-surface-variant">PDF</span>
                            <span className="px-3 py-1 rounded-lg bg-surface-container text-xs font-medium text-on-surface-variant">DICOM</span>
                            <span className="px-3 py-1 rounded-lg bg-surface-container text-xs font-medium text-on-surface-variant">JPEG</span>
                        </div>
                    </div>

                    {/* Feature 2: Access Anywhere */}
                    <div className="bg-primary-container text-white rounded-[3rem] p-8 shadow-xl flex flex-col justify-between overflow-hidden relative">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="font-headline text-2xl font-bold mb-3">Access Anywhere</h3>
                            <p className="text-blue-100 leading-relaxed translate-y-[-4px]">
                                Never lose a record again. Retrieve your files via Email, Delivery, or even USSD in low-data areas.
                            </p>
                        </div>
                        <div className="mt-8 relative z-10 flex -space-x-3">
                            {[Mail, Smartphone, Truck].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-container bg-surface-container-highest flex items-center justify-center">
                                    <Icon className="text-primary w-4 h-4" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Feature 3: Trust Bar */}
                    <div className="bg-surface-container-low rounded-[3rem] py-10 px-8 flex flex-col items-center text-center gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                                <ShieldCheck className="w-8 h-8 text-primary opacity-80" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-on-background uppercase tracking-widest font-headline">Verified Security</p>
                                <p className="text-xs text-on-surface-variant">Powered by Interswitch Enterprise Grade Security</p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-outline-variant/30"></div>
                        <div className="flex flex-col items-center">
                            <p className="text-3xl font-headline font-extrabold text-primary">50+</p>
                            <p className="text-sm text-on-surface-variant">Trusted Clinical Partners</p>
                        </div>
                        <div className="flex -space-x-2">
                           {[1, 2, 3].map((i) => (
                               <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                   <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Partner" />
                               </div>
                           ))}
                           <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-white bg-secondary-container text-[10px] font-bold text-primary">+47</div>
                        </div>
                    </div>
                </section>

                {/* Social Proof Section */}
                <section className="mb-24 flex flex-col items-center">
                    <div className="w-full h-[350px] rounded-[3rem] overflow-hidden relative mb-12 shadow-2xl">
                        <img 
                            alt="Hospital Interior" 
                            className="w-full h-full object-cover" 
                            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8">
                            <div className="max-w-xl">
                                <p className="text-white text-lg font-light italic mb-4 leading-relaxed">
                                    "Health0 has fundamentally changed how we manage patient transitions. The security and ease of record sharing is unprecedented."
                                </p>
                                <p className="text-white/80 text-sm font-semibold">— Dr. Arinze Okoro, CMO</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PWA / Mobile Callout */}
                <section className="bg-surface-container-lowest rounded-[3rem] p-10 text-center shadow-sm border border-outline-variant/10">
                    <h3 className="font-headline text-2xl font-extrabold mb-4">Install Your Health Vault</h3>
                    <p className="text-on-surface-variant mb-8 leading-relaxed text-sm">
                        Add Health0 to your home screen for instant access. No heavy downloads, just pure performance and absolute security.
                    </p>
                    <div className="flex flex-col gap-6 opacity-70">
                        <div className="flex items-center justify-center gap-3">
                            <Download className="w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Installable PWA</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <Zap className="w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">High Performance</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <RefreshCw className="w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Offline Access</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Shared Footer (Responsive) */}
            <footer className="bg-surface-container-lowest md:bg-surface-container-low border-t md:border-t-0 border-outline-variant/10 pt-16 md:pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Desktop Footer Content */}
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
                        <div className="lg:col-span-2">
                            <span className="text-2xl font-headline font-extrabold text-primary mb-6 block">Health0</span>
                            <p className="text-on-surface-variant text-sm mb-6 max-w-xs leading-relaxed">The decentralized infrastructure layer for global health records. Built for hospitals, owned by patients.</p>
                            <div className="flex items-center gap-4">
                                <span className="bg-surface-container-low p-2 rounded-lg text-on-surface-variant"><Globe className="w-5 h-5" /></span>
                                <span className="bg-surface-container-low p-2 rounded-lg text-on-surface-variant"><FileText className="w-5 h-5" /></span>
                            </div>
                        </div>
                        <FooterCol title="Platform" links={["Vault Interface", "Clinician Tools", "API for Developers", "Enterprise Scaling"]} />
                        <FooterCol title="Security" links={["AES-256 Protocol", "HIPAA Compliance", "Data Residency", "SLA Guarantees"]} />
                        <FooterCol title="Company" links={["Our Vision", "Careers", "Partners", "Newsroom"]} />
                        <FooterCol title="Support" links={["Help Center", "Priority Support", "Status Page", "Contact Hub"]} />
                    </div>

                    {/* Mobile Footer Content */}
                    <div className="md:hidden text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <ShieldCheck className="text-white w-3.5 h-3.5" />
                            </div>
                            <h1 className="text-on-background font-extrabold tracking-tighter font-headline text-lg">Health0</h1>
                        </div>
                        <p className="text-on-surface-variant text-xs mb-8">© 2026 <strong>Health0</strong> Global. All rights reserved. Your privacy is our priority.</p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <a className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest" href="#privacy">Privacy</a>
                            <a className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest" href="#terms">Terms</a>
                            <a className="text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest" href="#support">Support</a>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col md:flex-row justify-between items-center pt-10 border-t border-outline-variant/10">
                        <div className="flex items-center gap-8 mb-4 md:mb-0">
                            <p className="text-xs text-on-surface-variant">© 2026 <strong>Health0</strong> Global. All rights reserved.</p>
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold text-on-surface">AES-256 CERTIFIED</span>
                            </div>
                        </div>
                        <div className="flex gap-8 text-xs font-semibold text-on-surface-variant">
                            <a className="hover:text-on-surface" href="#privacy">Privacy Policy</a>
                            <a className="hover:text-on-surface" href="#terms">Terms</a>
                            <a className="hover:text-on-surface" href="#legal">Legal</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

const Pillar = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-4">
        <Icon className="text-primary w-5 h-5 mt-1" />
        <div>
            <p className="font-semibold text-on-surface">{title}</p>
            <p className="text-sm text-on-surface-variant">{description}</p>
        </div>
    </div>
)

const PillarCard = ({ icon: Icon, title, description, checks, popular }) => (
    <div className="bg-surface-container-lowest p-10 rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow group relative">
        {popular && (
            <div className="absolute top-0 right-0 p-4">
                <span className="bg-primary text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">Popular</span>
            </div>
        )}
        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="font-headline text-2xl font-bold mb-4 text-on-background">{title}</h3>
        <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">{description}</p>
        <ul className="space-y-3">
            {checks.map((check, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-on-surface font-medium">
                    <CheckCircle2 className="text-primary w-4 h-4" />
                    {check}
                </li>
            ))}
        </ul>
    </div>
)

const FooterCol = ({ title, links }) => (
    <div>
        <h4 className="font-bold text-on-surface mb-6">{title}</h4>
        <ul className="space-y-4 text-sm text-on-surface-variant">
            {links.map((link, idx) => (
                <li key={idx}><a className="hover:text-primary transition-colors" href={`#${link.toLowerCase().replace(/\s/g, '-')}`}>{link}</a></li>
            ))}
        </ul>
    </div>
)

export default LandingPage
