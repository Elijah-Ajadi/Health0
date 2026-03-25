import React from 'react'
import { motion } from 'framer-motion'
import { 
    LayoutDashboard, FolderSearch, BarChart4, ShieldCheck, 
    Bell, HelpCircle, LogOut, FileText, Image, FileSearch, 
    Activity, QrCode, ArrowRight, CheckCircle2, AlertTriangle, 
    Download, Zap, Mail, Truck, ChevronRight, Plus, Smartphone,
    Calendar, Pill, Search, MapPin, Grid2x2, Folder, Share, Shield
} from 'lucide-react'

// Note: Using Lucide icons instead of Material Symbols as per project standard
// Map: grid_view -> Grid2x2, folder -> Folder, insights -> BarChart4, share -> Share, shield -> Shield

const PatientDashboard = () => {
    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] selection:bg-[#dae2ff] antialiased overflow-x-hidden">
            <div className="flex min-h-screen">
                {/* --- DESKTOP VIEW LAYOUT (Visible md and up) --- */}
                <aside className="hidden md:flex flex-col h-screen w-64 bg-slate-50 sticky top-0 border-r border-slate-200/50 p-4 gap-2 z-50">
                    <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="w-10 h-10 bg-[#0040a1] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0040a1]/20">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-none font-headline tracking-tighter">Health Vault</h1>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Secure Clinical Environment</p>
                        </div>
                    </div>

                    <nav className="flex-1 flex flex-col gap-1">
                        <DesktopNavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                        <DesktopNavItem icon={<FolderSearch size={20} />} label="Records" />
                        <DesktopNavItem icon={<BarChart4 size={20} />} label="Analytics" />
                        <DesktopNavItem icon={<ShieldCheck size={20} />} label="Security" />
                    </nav>

                    <div className="mt-auto pt-4 border-t border-slate-200/50 flex flex-col gap-1">
                        <button className="w-full bg-[#0040a1] text-white py-3 rounded-xl font-bold text-sm mb-4 shadow-lg shadow-[#0040a1]/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                             Secure Upload
                        </button>
                        <DesktopNavItem icon={<HelpCircle size={18} />} label="Help Center" small />
                        <DesktopNavItem icon={<LogOut size={18} />} label="Logout" small />
                    </div>
                </aside>

                {/* --- MAIN CANVAS (Desktop) --- */}
                <main className="hidden md:flex flex-1 flex flex-col min-w-0">
                    {/* TopNavBar Desktop */}
                    <header className="fixed top-0 right-0 left-64 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-3 flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-extrabold tracking-tighter text-[#0040a1] font-headline uppercase italic">Clinical Edge</h2>
                        </div>
                        <div className="flex items-center gap-6">
                            {/* USER MENTIONED: Tab items commented out on desktop as per recent sync */}
                            {/* <div className="hidden lg:flex gap-8 items-center">
                                <DesktopTabItem label="Dashboard" active />
                                <DesktopTabItem label="Records" />
                                <DesktopTabItem label="Analytics" />
                                <DesktopTabItem label="Security" />
                            </div> */}
                            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                                <button className="p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-600 relative">
                                    <Bell size={20} />
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                                </button>
                                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                                    <img 
                                        alt="User profile" 
                                        className="w-full h-full object-cover" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvw5x3HE3cTi7ER4WdfxnuPY_sN3F3PV2RBXC3bLqUMc_A9jVTiwjqKzMjulxPe-3eb76ktbCD8m0rWF5yiVC1wJKwSg_6RuFS52Oflz0loBkF0xN2nIgwu-NjdL9bD4DJqIwKlAoY0vLVE3RlnlLLylV_LjnUE_Cj_fDed1V9cDOYU4wqQQvud2QJ1Yyb0zJ28P25XJ6ti3bNi9Nu8V-eTxxDbwqZ3RELYf57iYUnkEUBiRl-TcHQA9OefEa-utoBdPlLlDEtT1Y"
                                    />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Dashboard Content Desktop */}
                    <div className="mt-24 px-6 pb-12 w-full max-w-7xl mx-auto space-y-8">
                        {/* Hero Grid with Digital ID */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Main Header Area */}
                            <div className="lg:col-span-8 space-y-6">
                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">Morning, Olawale</p>
                                        <h1 className="text-3xl font-extrabold text-[#191c1d] tracking-tight mb-4 font-headline uppercase italic">Patient Profile: <span className="text-[#0040a1] not-italic">Clinical-772</span></h1>
                                        <div className="flex items-center gap-2 text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full w-fit border border-emerald-100">
                                            <CheckCircle2 size={14} className="fill-emerald-600 text-white" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Verified Patient</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/50 shadow-inner">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">KYC Status</p>
                                            <p className="text-sm font-bold text-[#0040a1]">NIN AUTHENTICATED</p>
                                        </div>
                                        <ShieldCheck className="text-emerald-500 w-8 h-8 fill-emerald-500/10" />
                                    </div>
                                </motion.div>

                                {/* Snapshot Summary */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <SummaryCard icon={<FileText size={24}/>} count="142" label="Documents" />
                                    <SummaryCard icon={<Image size={24}/>} count="28" label="Medical Images" />
                                    <SummaryCard icon={<FileSearch size={24}/>} count="12" label="Certified Reports" />
                                </div>
                            </div>

                            {/* Digital ID Sidebar Card */}
                            <div className="lg:col-span-4 space-y-6">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[#1a2332] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group h-full"
                                >
                                    <div className="relative z-10 flex flex-col gap-6 h-full justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Your Health0 ID</p>
                                                <h3 className="text-2xl font-mono font-bold tracking-tight">HV-092-118-X</h3>
                                                <p className="text-[10px] text-white/40 mt-1">Last Sync: Just now</p>
                                            </div>
                                            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                                                <QrCode size={32} />
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">NIN: 1234****901</p>
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]"></div>
                                        </div>
                                    </div>
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                                </motion.div>

                                {/* Priority Care */}
                                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Priority Care</p>
                                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                                    </div>
                                    <button className="w-full flex items-center gap-4 bg-slate-50 p-4 rounded-xl hover:bg-slate-100 transition-colors group border border-slate-100/50">
                                        <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
                                            <Activity size={24} />
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="text-sm font-bold text-slate-900 leading-tight">Life-Saver Snapshot</p>
                                            <p className="text-xs font-semibold text-rose-600">Blood Group O+, AA</p>
                                        </div>
                                        <ChevronRight className="text-slate-300 group-hover:translate-x-1 group-hover:text-[#0040a1] transition-all" size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Health Timeline Desktop */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Timeline Section */}
                            <section className="lg:col-span-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black tracking-tight text-[#191c1d] flex items-center gap-3 font-headline uppercase italic">
                                        <ChevronRight className="text-[#0040a1] rotate-90" />
                                        The Health Timeline
                                    </h2>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200 uppercase tracking-widest italic">Filters</button>
                                        <button className="px-4 py-2 bg-[#0040a1] text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity uppercase tracking-widest italic">Export All</button>
                                    </div>
                                </div>

                                <div className="relative pl-6 space-y-8">
                                    {/* Vertical Line */}
                                    <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100 ml-[-1px]"></div>
                                    
                                    <TimelineItem 
                                        date="Nov 12, 2025" 
                                        tag="Visited Hospital" 
                                        hospital="St. Jude Medical Research Center"
                                        type="primary"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-[#0040a1]">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0040a1] mb-1">Test Performed</p>
                                                <p className="text-sm font-bold">Advanced Lipid Panel</p>
                                                <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1 font-bold">
                                                    <CheckCircle2 size={12} />
                                                    Optimal Range Reached
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-slate-300">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Prescription</p>
                                                <p className="text-sm font-bold">Rosuvastatin Calcium (10mg)</p>
                                                <p className="text-[11px] text-slate-500 mt-2 font-medium italic">Take 1 daily at bedtime</p>
                                            </div>
                                        </div>
                                    </TimelineItem>

                                    <TimelineItem 
                                        date="Sep 15, 2025" 
                                        tag="Urgent Test Result" 
                                        hospital="Pathology Diagnostics Unit"
                                        type="alert"
                                    >
                                        <div className="bg-rose-50 p-5 rounded-xl border border-rose-100 mt-6 flex items-start gap-4">
                                            <AlertTriangle className="text-rose-600 mt-1" size={20} />
                                            <div>
                                                <p className="text-sm font-bold text-rose-900 uppercase">Allergy Screening: Positive</p>
                                                <p className="text-xs text-rose-700 mt-1 leading-relaxed">High reactivity detected for Sulfa-based compounds. Record updated to 'Critical Alert' status.</p>
                                            </div>
                                        </div>
                                        <button className="mt-4 w-full py-3 bg-rose-600 text-white text-[11px] font-bold rounded-lg shadow-lg shadow-rose-100 uppercase tracking-widest active:scale-95 transition-all">Notify Doctors</button>
                                    </TimelineItem>
                                </div>
                            </section>

                            {/* Sidebar Quick Actions Desktop */}
                            <section className="lg:col-span-4 space-y-6">
                                <div className="bg-[#0040a1]/5 border border-[#0040a1]/10 p-6 rounded-2xl h-full space-y-4">
                                    <h3 className="font-headline font-black text-slate-900 flex items-center gap-2 text-sm uppercase italic tracking-widest">
                                        <Zap className="text-[#0040a1] fill-[#0040a1]" size={20} />
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <ActionButton icon={<Mail size={20} />} title="Send to Email" subtitle="Secured PDF Attachment" />
                                        <ActionButton icon={<Truck size={20} />} title="Deliver Copy" subtitle="Physical Print Delivery" />
                                        
                                        <div className="bg-slate-900 p-5 rounded-2xl text-white shadow-xl shadow-slate-200 mt-6 overflow-hidden relative group">
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">USSD Request Auth</p>
                                                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                </div>
                                                <p className="text-3xl font-mono font-black text-white tracking-widest">*7006*0*82#</p>
                                                <p className="text-[10px] text-slate-400 mt-3 leading-relaxed font-label">Share this code with clinical providers for 24-hour temporary record access.</p>
                                            </div>
                                            <div className="absolute right-[-20px] bottom-[-20px] text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                                <Smartphone size={100} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>

                {/* --- MOBILE VIEW LAYOUT (Visible below md) --- */}
                <div className="md:hidden flex flex-col min-h-screen w-full">
                    {/* TopAppBar Mobile PWA */}
                    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center px-6 h-20 w-full pt-safe">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <h1 className="font-headline font-extrabold text-2xl tracking-tight text-on-surface">Morning, Alex</h1>
                                <div className="flex items-center gap-1.5 text-emerald-600">
                                    <ShieldCheck size={16} className="fill-emerald-500/20" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified Patient</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm ring-2 ring-primary/5">
                            <img 
                                alt="User Profile" 
                                className="w-full h-full object-cover" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQNAODqJbEASGsWCcD90ZQowfhn4av1d3K1ORojRfpULujPTaNkPp7rCtDcGUaLuQwPlTbR4Ek3oF-9XlFzH0r62UF2lL3RjWzqhW4kVCm6cziuN_div6_XprqiU6T_Z1n4zkkR5lIkJsytS2XkHu82AOQUF6xq70ohRKSbt4uo3g2wh-GJZHyCN0jbRu7r7IrDkUJ-LuIVynjPv3beH2Mg2HghJJRF7YJ94KEjp0pNAuXBVO9QF1hkWzAd4ZkuoAYY2QUSZHMgxI"
                            />
                        </div>
                    </header>

                    <main className="px-6 pt-2 pb-32 space-y-6 max-w-md mx-auto w-full">
                        {/* Health0 ID Card Mobile */}
                        <section>
                            <div className="bg-[#1d2939] rounded-[2rem] p-6 text-white relative shadow-xl overflow-hidden active:scale-[0.98] transition-transform">
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Your Health0 ID</p>
                                        <h2 className="font-headline font-extrabold text-2xl tracking-tight">HV-092-118-X</h2>
                                        <p className="text-white/40 text-[10px]">Last Sync: Just now</p>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                        <QrCode size={32} />
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/60 text-xs font-medium tracking-wide font-mono">NIN: 1234****901</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                            </div>
                        </section>

                        {/* Priority Care Section Mobile */}
                        <section className="space-y-3">
                            <h3 className="font-headline font-bold text-[11px] text-slate-500 uppercase tracking-widest italic">Priority Care</h3>
                            <button className="w-full flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-200">
                                    <Activity size={24} />
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="font-headline font-bold text-sm text-on-surface">Life-Saver Snapshot</h4>
                                    <p className="text-red-500 text-xs font-semibold uppercase tracking-tight">Blood Group O+, AA</p>
                                </div>
                                <ChevronRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
                            </button>
                        </section>

                        {/* Quick Actions Grid Mobile */}
                        <section>
                            <div className="grid grid-cols-2 gap-4">
                                <MobilePwaAction icon={<Calendar size={28} className="text-blue-600" />} label="Appointments" color="blue" />
                                <MobilePwaAction icon={<Pill size={28} className="text-purple-600" />} label="Medications" color="purple" />
                                <MobilePwaAction icon={<Search size={28} className="text-emerald-600" />} label="Find Doctor" color="emerald" />
                                <MobilePwaAction icon={<MapPin size={28} className="text-orange-600" />} label="Clinics Near Me" color="orange" />
                            </div>
                        </section>

                        {/* Activity History Mobile */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-headline font-bold text-lg text-on-background uppercase italic tracking-tighter">Recent Activity</h3>
                                <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer">View All</span>
                            </div>
                            <div className="space-y-4">
                                <MobilePwaHistoryItem 
                                    icon={<Activity size={18} />} 
                                    title="General Checkup" 
                                    location="St. Jude's Medical Center" 
                                    date="May 12" 
                                    color="blue" 
                                />
                                <MobilePwaHistoryItem 
                                    icon={<Pill size={18} />} 
                                    title="Pharmacy" 
                                    location="CVS Health #4092" 
                                    date="Apr 28" 
                                    color="slate" 
                                />
                            </div>
                        </section>
                    </main>

                    {/* BottomNavBar Mobile PWA */}
                    <nav className="bg-white/95 backdrop-blur-xl fixed bottom-0 w-full border-t border-slate-100 px-6 pb-8 pt-3 flex justify-between items-center z-50 rounded-t-[2.5rem] shadow-[0_-12px_32px_rgba(0,0,0,0.06)]">
                        <MobilePwaNavItem icon={<Grid2x2 size={28} />} active />
                        <MobilePwaNavItem icon={<Folder size={28} />} />
                        <MobilePwaNavItem icon={<BarChart4 size={28} />} />
                        <MobilePwaNavItem icon={<Share size={28} />} />
                        <MobilePwaNavItem icon={<Shield size={28} />} />
                    </nav>

                    {/* FAB Mobile PWA */}
                    <button className="fixed right-6 bottom-28 w-14 h-14 bg-[#0040a1] rounded-2xl shadow-xl flex items-center justify-center text-white active:scale-90 transition-transform z-40 border border-white/20">
                        <Plus size={32} />
                    </button>
                </div>
            </div>

            {/* Desktop FAB */}
            <button className="hidden md:flex fixed bottom-8 right-8 w-16 h-16 bg-[#0040a1] text-white rounded-2xl shadow-2xl items-center justify-center hover:scale-105 transition-transform active:scale-95 group z-[100] ring-4 ring-white border border-white/20">
                <Plus size={32} strokeWidth={2.5} />
                <span className="absolute right-20 px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-90 group-hover:scale-100 whitespace-nowrap shadow-2xl">
                    Add New Record
                </span>
            </button>
        </div>
    )
}

// --- SUB-COMPONENTS ---

const DesktopNavItem = ({ icon, label, active = false, small = false }) => (
    <a href="#" className={`flex items-center gap-3 px-4 ${small ? 'py-2.5' : 'py-3.5'} rounded-xl transition-all ${active ? 'bg-white text-[#0040a1] shadow-sm ring-1 ring-slate-100' : 'text-slate-500 hover:bg-slate-100'}`}>
        <span className={`${active ? 'text-[#0040a1]' : 'text-slate-400'}`}>{icon}</span>
        <span className={`${small ? 'text-xs' : 'text-sm'} font-bold tracking-tight font-headline`}>{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0040a1] ring-4 ring-[#0040a1]/20"></div>}
    </a>
)

const SummaryCard = ({ icon, count, label }) => (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl flex flex-col gap-3 border border-slate-100 shadow-sm transition-all">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner border border-blue-100/30">
            {icon}
        </div>
        <div>
            <span className="text-3xl font-black text-[#191c1d] font-headline leading-none">{count}</span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{label}</p>
        </div>
    </motion.div>
)

const ActionButton = ({ icon, title, subtitle }) => (
    <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all group hover:-translate-y-0.5">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-[#0040a1]/10 group-hover:text-[#0040a1] transition-colors">
                {icon}
            </div>
            <div className="text-left">
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">{title}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter italic">{subtitle}</p>
            </div>
        </div>
        <ChevronRight size={18} className="text-slate-300 group-hover:text-[#0040a1] transition-all translate-x-0 group-hover:translate-x-1" />
    </button>
)

const TimelineItem = ({ date, tag, hospital, children, type = "primary" }) => (
    <div className="relative pb-10 last:pb-0">
        <div className={`absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-4 flex items-center justify-center z-10 shadow-sm ${type === 'alert' ? 'border-[#822800] ring-8 ring-[#822800]/5' : 'border-[#0040a1] ring-8 ring-[#0040a1]/5'}`}>
        </div>
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:shadow-md transition-shadow ${type === 'alert' ? 'border-l-[6px] border-l-[#822800]' : ''}`}
        >
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{date}</span>
                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${type === 'alert' ? 'bg-[#822800]/10 text-[#822800] border-[#822800]/20' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{tag}</span>
                    </div>
                    <h3 className="text-xl font-black text-[#191c1d] font-headline italic uppercase tracking-tighter">{hospital}</h3>
                    {children}
                </div>
                <div className="flex flex-col gap-2 min-w-[140px]">
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0040a1] text-white text-[11px] font-black rounded-xl shadow-lg shadow-[#0040a1]/20 uppercase tracking-widest italic active:scale-95 transition-all">
                        <Download size={14} />
                        Download
                    </button>
                    <button className="w-full py-2.5 bg-white text-slate-700 text-[11px] font-black rounded-xl border border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-widest italic">
                        Share Report
                    </button>
                </div>
            </div>
        </motion.div>
    </div>
)

// --- MOBILE PWA SUB-COMPONENTS ---

const MobilePwaAction = ({ icon, label, color }) => {
    const bgColors = {
        blue: 'bg-blue-50',
        purple: 'bg-purple-50',
        emerald: 'bg-emerald-50',
        orange: 'bg-orange-50'
    }
    return (
        <button className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3 active:scale-[0.98] transition-all">
            <div className={`w-14 h-14 rounded-2xl ${bgColors[color]} flex items-center justify-center shadow-inner`}>
                {icon}
            </div>
            <span className="text-[11px] font-black text-on-surface uppercase tracking-widest font-headline leading-tight">{label}</span>
        </button>
    )
}

const MobilePwaHistoryItem = ({ icon, title, location, date, color }) => (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex gap-4 active:bg-slate-50 transition-colors group">
        <div className={`w-10 h-10 rounded-full ${color === 'blue' ? 'bg-[#0040a1] text-white' : 'bg-slate-100 text-slate-600'} flex items-center justify-center shrink-0 shadow-sm`}>
            {icon}
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <h4 className="font-headline font-bold text-sm text-slate-900">{title}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{date}</span>
            </div>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">{location}</p>
        </div>
        <ChevronRight className="text-slate-200 group-active:text-primary self-center" size={16} />
    </div>
)

const MobilePwaNavItem = ({ icon, active = false }) => (
    <a className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-[#0040a1] scale-110' : 'text-slate-400 opacity-60'}`} href="#">
        <div className={`${active ? 'bg-[#0040a1]/10 p-2 rounded-xl shadow-inner' : ''}`}>
            {icon}
        </div>
    </a>
)

export default PatientDashboard
