import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Card, Button, Input, LoadingShimmer, EmptyState } from '../components/ui'
import { useNavigate } from 'react-router-dom'

const HospitalDashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(true)

    const profile = user?.hospital_profile || {}
    const isPending = profile.status === 'PENDING'

    useEffect(() => {
        if (!isPending) {
            fetchAnalytics()
        } else {
            setLoading(false)
        }
    }, [isPending])

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/hospital/analytics/')
            setStats(res.data)
        } catch (err) {
            console.error('Failed to fetch analytics:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery) return
        try {
            const res = await api.get(`/hospital/search/?q=${searchQuery}`)
            setSearchResults(res.data)
        } catch (err) {
            console.error('Search failed:', err)
        }
    }

    if (loading) {
        return (
            <div className="space-y-8 lg:space-y-12">
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <LoadingShimmer width="w-32" height="h-6" />
                        <LoadingShimmer width="w-64" height="h-12" />
                    </div>
                </section>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <LoadingShimmer key={i} height="h-32" rounded="rounded-3xl" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-8 space-y-6">
                        <LoadingShimmer height="h-24" rounded="rounded-3xl" />
                        <LoadingShimmer height="h-96" rounded="rounded-[2.5rem]" />
                    </div>
                    <div className="lg:col-span-4 space-y-6">
                        <LoadingShimmer height="h-96" rounded="rounded-[2.5rem]" />
                    </div>
                </div>
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] p-6 text-center">
                <Card variant="glass" className="max-w-2xl w-full p-12">
                    <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
                        <span className="material-symbols-outlined text-5xl text-primary animate-pulse">pending_actions</span>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full border-4 border-surface"></div>
                    </div>
                    <h1 className="text-4xl font-headline font-black text-on-surface uppercase italic tracking-tighter mb-4 leading-none">Vetting Chain <span className="text-primary italic">Active</span></h1>
                    <p className="text-on-surface-variant font-medium leading-relaxed mb-10 max-w-md mx-auto">
                        Welcome, <strong>{profile.hospital_name}</strong>. Our clinical integrity team is currently validating your institutional credentials.
                    </p>
                    <div className="bg-surface-container-low/50 rounded-3xl p-8 border border-outline-variant/10 mb-10 text-left space-y-6">
                        <StatusStep label="Identity Secured" complete />
                        <StatusStep label="Credential Validation" active />
                        <StatusStep label="Node Registry Sync" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-12 italic">Estimated synchronization: 24-48 Hours</p>
                    <Button variant="ghost" size="sm" icon="logout" onClick={logout} className="mx-auto">
                        Terminate Session
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8 lg:space-y-12">
            {/* ─── PROVIDER HEADER ─── */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">Clinical Node Active</span>
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-3 py-1">Facility ID: {profile.hefamaa_id || 'LAG-000'}</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-headline font-black text-on-surface tracking-tight leading-none italic uppercase">
                        Portal <span className="text-primary tracking-tighter">Control</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <Button variant="primary" icon="person_add" className="flex-1 md:flex-initial" onClick={() => navigate('/hospital/register')}>Register Patient</Button>
                    <Button variant="surface" icon="upload_file" className="flex-1 md:flex-initial">Bulk Import</Button>
                </div>
            </section>

            {/* ─── CLINICAL METRICS ─── */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card icon="groups" title={stats?.total_patients || '0'} subtitle="Identity Registry" />
                <Card icon="description" title={stats?.total_records || '0'} subtitle="Active Records" />
                <Card icon="verified" title="100%" subtitle="Global Trust" />
                <Card icon="schedule" title={stats?.pending_appointments || '0'} subtitle="Pending Tasks" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* ─── PATIENT DISCOVERY (LEFT) ─── */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-headline font-black text-on-surface italic uppercase tracking-tighter">Patient Discovery</h2>
                        <button className="text-primary font-bold text-xs uppercase tracking-widest hover:underline" onClick={() => navigate('/hospital/patients')}>Access Registry</button>
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-3">
                        <Input 
                            placeholder="Universal Search (NIN, ID, or Legal Name)..."
                            icon="search"
                            className="flex-1 mb-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type="submit" variant="surface" className="px-8 italic">Probe Vault</Button>
                    </form>

                    <div className="space-y-4">
                        {searchResults.length > 0 ? searchResults.map(patient => (
                            <Card 
                                key={patient.id}
                                icon="fingerprint"
                                title={`${patient.user.first_name} ${patient.user.last_name}`}
                                subtitle={`Clinical Ledger ID: ${patient.nin}`}
                                onClick={() => navigate(`/patient/${patient.id}/records`)}
                                className="group"
                            >
                                <Button variant="ghost" size="sm" icon="chevron_right" iconPosition="right" className="ml-auto">
                                    Access Records
                                </Button>
                            </Card>
                        )) : searchQuery && (
                            <EmptyState 
                                icon="manage_search"
                                title="Identity not found"
                                message="No entry matches that NIN or Hospital ID in the global registry."
                                actionLabel="Clear Search"
                                onAction={() => setSearchQuery('')}
                            />
                        )}
                    </div>
                </div>

                {/* ─── SECURE TOOLS (RIGHT) ─── */}
                <aside className="lg:col-span-4 space-y-8">
                    <Card variant="dark" className="p-10 space-y-8 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-headline font-black text-2xl uppercase italic mb-8 tracking-tighter">Secured Entry</h3>
                            <div className="space-y-4">
                                <SecureTool icon="history_edu" label="Clinical Note" ext=".pdf, .docs" />
                                <SecureTool icon="radiology" label="Diagnostic Image" ext=".dcm, .jpg" />
                                <SecureTool icon="lab_research" label="Laboratory Result" ext=".hl7, .pdf" />
                            </div>
                            <p className="text-[10px] font-bold text-surface/40 uppercase tracking-[0.15em] mt-10 leading-relaxed font-body">All uploads are locally encrypted (AES-256) before global ledger synchronization.</p>
                        </div>
                        <span className="absolute right-[-40px] bottom-[-40px] material-symbols-outlined text-surface/5 text-[180px] rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">shield</span>
                    </Card>

                    <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 space-y-6">
                        <h4 className="font-headline font-black text-primary text-xl uppercase tracking-tight italic">System Status</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-primary/10">
                                <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">Global Sync</span>
                                <span className="text-emerald-500 font-bold text-xs uppercase">Operational</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-primary/10">
                                <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">Trust Store</span>
                                <span className="text-emerald-500 font-bold text-xs uppercase">Verified</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">Latency</span>
                                <span className="text-on-surface font-bold text-xs uppercase">12ms</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

const StatusStep = ({ label, complete, active }) => (
    <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${complete ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : active ? 'border-primary text-primary animate-pulse' : 'border-outline-variant/30 text-outline-variant'}`}>
            {complete ? <span className="material-symbols-outlined text-[18px]">check</span> : <div className="w-2 h-2 rounded-full bg-current opacity-30" />}
        </div>
        <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${complete ? 'text-on-surface' : active ? 'text-primary' : 'text-on-surface-variant opacity-50'}`}>{label}</span>
    </div>
)


const SecureTool = ({ icon, label, ext }) => (
    <button className="w-full bg-white/5 hover:bg-white/10 p-5 rounded-3xl border border-white/10 flex items-center justify-between group transition-all">
        <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>{icon}</span>
            </div>
            <div className="text-left leading-none">
                <p className="text-xs font-black uppercase tracking-[0.1em] italic mb-1.5">{label}</p>
                <p className="text-[10px] text-white/30 font-mono font-bold">{ext}</p>
            </div>
        </div>
        <span className="material-symbols-outlined text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
    </button>
)

export default HospitalDashboard
