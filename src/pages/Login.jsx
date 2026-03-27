import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Lock, 
    User, 
    ArrowRight, 
    ShieldCheck, 
    HelpCircle,
    Eye,
    EyeOff,
    AlertCircle
} from 'lucide-react';
import { Button, Card, Input } from '../components/ui';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(identifier, password);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface text-on-surface selection:bg-secondary-fixed min-h-screen font-body antialiased flex flex-col">
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 h-14 md:h-20 flex items-center">
                <div className="flex justify-between items-center px-4 md:px-6 w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-1.5 md:gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo_initial.png" alt="Health0 Logo" className="w-7 h-7 md:w-8 md:h-8 rounded-lg shadow-sm" />
                        <span className="text-lg md:text-xl font-black tracking-tighter md:tracking-tight text-primary font-headline">Health0</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-surface-container-lowest p-8 md:p-12 rounded-[2.5rem] shadow-[0_12px_48px_rgba(25,28,29,0.06)] border border-outline-variant/10">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/5 rounded-2xl mb-6 ring-1 ring-primary/10">
                                <ShieldCheck className="text-primary w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Clinical Access</h1>
                            <p className="text-on-surface-variant text-sm mt-2">Welcome back to your digital sanctuary.</p>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-medium"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <Input 
                                label="Identifier"
                                icon="person"
                                placeholder="Username, Email or NIN"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />

                            <div className="space-y-2">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] ml-1">Password</label>
                                    <Link to="#" className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline underline-offset-4">Forgot?</Link>
                                </div>
                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/40 group-focus-within:text-primary transition-colors">lock</span>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl pl-16 pr-12 py-4 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-on-surface placeholder:text-on-surface-variant/40" 
                                        placeholder="••••••••••••" 
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button 
                                        type="button" 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>

                            <Button 
                                variant="primary" 
                                size="lg" 
                                icon="login" 
                                className="w-full"
                                type="submit"
                                disabled={loading || !identifier || !password}
                            >
                                {loading ? 'Authorizing...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-10 text-center space-y-4">
                            <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                                Don't have a medical identity? <br className="md:hidden" />
                                <Link to="/patient/register" className="text-primary font-extrabold hover:underline underline-offset-4 ml-1">Begin Enrollment</Link>
                            </p>
                            <div className="pt-2 border-t border-outline-variant/5">
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Are you a Medical Institution?</p>
                                <Link to="/hospital/register" className="text-primary font-bold text-xs hover:underline underline-offset-4">Register Your Facility</Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            <footer className="py-8 text-center opacity-40 mt-auto">
                <p className="text-xs text-on-surface-variant font-medium">© 2024 Health0. Secure Clinical Data Management.</p>
            </footer>
        </div>
    );
};

export default Login;
