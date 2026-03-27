import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Card, Button, LoadingShimmer, EmptyState } from '../components/ui'
import { useNavigate } from 'react-router-dom'

const PatientDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await api.get('/records/')
                setRecords(res.data)
            } catch (err) {
                console.error('Failed to fetch records:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchRecords()
    }, [])

    if (loading) {
        return (
            <div className="space-y-8 lg:space-y-12 pb-12">
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
                        {[1, 2, 3].map(i => <LoadingShimmer key={i} height="h-48" rounded="rounded-[2rem]" />)}
                    </div>
                    <div className="lg:col-span-4 space-y-6">
                        <LoadingShimmer height="h-96" rounded="rounded-[2.5rem]" />
                    </div>
                </div>
            </div>
        )
    }

    const patientName = user?.first_name || 'Patient'
    const patientID = `HV-${user?.id?.toString().padStart(3, '0')}-${user?.patient_profile?.nin?.slice(-4) || 'X'}`

    return (
        <div className="space-y-8 lg:space-y-12 pb-12">
            {/* ─── WELCOME HEADER ─── */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">Verified Ledger</span>
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-3 py-1">{patientID}</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-headline font-black text-on-surface tracking-tight leading-none">
                        Welcome back, <span className="text-primary italic">{patientName}</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <Button variant="primary" icon="qr_code_2" className="flex-1 md:flex-initial">Digital ID</Button>
                    <Button variant="surface" icon="ios_share" className="flex-1 md:flex-initial">Transfer</Button>
                </div>
            </section>

            {/* ─── QUICK STATS BENTO ─── */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card icon="folder_shared" title={records.length} subtitle="Medical Records" />
                <Card icon="emergency" title="Stable" subtitle="Vitals Status" />
                <Card icon="verified" title={user?.patient_profile?.nin_verified ? '✓ Verified' : 'Pending'} subtitle="Identity Status" />
                <Card icon="history" title="Live" subtitle="Sync Status" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* ─── HEALTH TIMELINE (LEFT) ─── */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-headline font-black text-on-surface italic uppercase tracking-tighter">Clinical Timeline</h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/records')}>View All Entries</Button>
                    </div>

                    {records.length > 0 ? (
                        <div className="space-y-0 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/20">
                            {records.map((record) => (
                                <TimelineEntry key={record.id} record={record} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="Database Clear"
                            message="Your encrypted health history will appear here once registered by a clinical node."
                            actionLabel="Upload Record"
                            onAction={() => navigate('/upload')}
                        />
                    )}
                </div>

                {/* ─── EMERGENCY SNAPSHOT (RIGHT) ─── */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="p-8 bg-error text-white rounded-[2.5rem] shadow-xl shadow-error/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>emergency</span>
                                <h3 className="font-headline font-black text-2xl tracking-tighter uppercase italic">SOS Snapshot</h3>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between border-b border-white/20 pb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Blood Group</span>
                                    <span className="text-lg font-black">{user?.patient_profile?.blood_group || 'Not Set'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Allergies</span>
                                    <span className="text-sm font-bold truncate max-w-[150px]">{user?.patient_profile?.allergies || 'None Logged'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Conditions</span>
                                    <span className="text-sm font-bold truncate max-w-[150px]">{user?.patient_profile?.confirmed_health_conditions || 'Healthy'}</span>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full bg-white text-error hover:bg-white/90" size="lg">
                                Generate Emergency Token
                            </Button>
                        </div>
                    </div>
                    <Card className="space-y-6">
                        <h4 className="font-headline font-black text-on-surface text-xl uppercase tracking-tight">Active Prescriptions</h4>
                        <div className="space-y-4">
                            <PrescriptionItem name="Ventolin Inhaler" dosage="2 puffs every 4hrs" />
                            <PrescriptionItem name="Vitamin C" dosage="1000mg Daily" />
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-6">Refill Request</Button>
                    </Card>
                </aside>
            </div>
        </div>
    )
}

const TimelineEntry = ({ record }) => {
    const navigate = useNavigate()
    return (
        <div className="relative pl-10 pb-8 last:pb-0 group">
            <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10 shadow-sm z-10 active:scale-125 transition-transform" />
            <Card
                className="group-hover:border-primary/20 -translate-y-1 group-hover:-translate-y-2"
                onClick={() => navigate(`/record/${record.id}`)}
            >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                                {new Date(record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/10">{record.record_type || 'Record'}</span>
                        </div>
                        <h3 className="text-xl font-headline font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">{record.title || 'Clinical Record'}</h3>
                        <p className="text-sm text-on-surface-variant font-medium max-w-md">{record.description || 'Uploaded clinical document.'}</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

const PrescriptionItem = ({ name, dosage }) => (
    <div className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl border border-outline-variant/5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">pill</span>
        </div>
        <div>
            <p className="text-sm font-bold text-on-surface leading-none">{name}</p>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">{dosage}</p>
        </div>
        <span className="material-symbols-outlined ml-auto text-outline-variant text-[18px]">chevron_right</span>
    </div>
)

export default PatientDashboard
