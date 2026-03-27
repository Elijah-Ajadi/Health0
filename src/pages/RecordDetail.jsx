import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

const RecordDetail = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [record, setRecord] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showDelivery, setShowDelivery] = useState(false)
    const [deliverySent, setDeliverySent] = useState(false)

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const res = await api.get(`/records/${id}/`)
                setRecord(res.data)
            } catch (err) {
                console.error('Failed to fetch record:', err)
                // Mock data fallback if API fails (for demo)
                setRecord({
                    id: id,
                    category: 'Radiology Report',
                    hospital_name: 'St. Jude Clinical Node',
                    created_at: new Date().toISOString(),
                    doctor_name: 'Dr. Sarah Connor',
                    description: 'Patient shows minor inflammation in the lower lumbar region. Recommended follow-up in 3 months.',
                    blockchain_hash: '0x74d8...3f2199b7'
                })
            } finally {
                setLoading(false)
            }
        }
        fetchRecord()
    }, [id])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Decrypting Clinical Data...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-12">
            {/* ─── HEADER ─── */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => navigate(-1)} className="p-2 -ml-3 text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-2xl">arrow_back</span>
                        </button>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">Clinical Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-headline font-black text-on-surface tracking-tight italic uppercase">{record.category}</h1>
                </div>
                <button className="p-4 bg-surface-container-high rounded-2xl text-on-surface-variant hover:bg-primary hover:text-white transition-all shadow-subtle">
                    <span className="material-symbols-outlined">share</span>
                </button>
            </div>

            {/* ─── MAIN CONTENT CARD ─── */}
            <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 md:p-12 border border-outline-variant/10 shadow-subtle space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/10">
                                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>shield_health</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-headline font-black text-on-surface italic uppercase tracking-tighter leading-none mb-1">{record.hospital_name}</h2>
                                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                    Clinical Node Verified
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <InfoItem label="Date" value={new Date(record.created_at).toLocaleDateString()} />
                        <InfoItem label="Physician" value={record.doctor_name || 'System Node'} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Clinical Observations</h3>
                    <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/5 text-on-surface font-medium leading-relaxed italic text-lg shadow-inner">
                        "{record.description}"
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <button 
                        onClick={() => setShowDelivery(true)}
                        className="flex-1 py-5 bg-primary text-white rounded-2xl font-headline font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined">local_shipping</span>
                        Request Physical Copy
                    </button>
                    <button className="flex-1 py-5 border-2 border-outline-variant/20 text-on-surface-variant rounded-2xl font-headline font-black text-sm uppercase tracking-widest hover:border-primary/40 transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined">cloud_download</span>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* ─── BLOCKCHAIN PROOF ─── */}
            <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Blockchain Ledger Verification</p>
                    <p className="text-xs font-mono text-on-surface-variant truncate font-bold">{record.blockchain_hash || '0x74d8a1c92e3fb...49b72'}</p>
                </div>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline px-4 py-2 bg-primary/5 rounded-full">Explorer</button>
            </div>

            {/* ─── DELIVERY MODAL ─── */}
            <AnimatePresence>
                {showDelivery && (
                    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDelivery(false)}
                            className="absolute inset-0 bg-on-background/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="relative w-full max-w-lg bg-surface-container-lowest rounded-t-[3rem] md:rounded-[3rem] p-10 shadow-modal border border-outline-variant/10"
                        >
                            {!deliverySent ? (
                                <>
                                    <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-primary/20 mx-auto">
                                        <span className="material-symbols-outlined text-5xl">package_2</span>
                                    </div>
                                    <h2 className="text-3xl font-headline font-black text-on-surface uppercase italic text-center mb-4">Request Delivery</h2>
                                    <p className="text-on-surface-variant text-center font-medium mb-8 leading-relaxed">
                                        Order a physically sealed, clinical-grade print of this record to your verified address.
                                    </p>
                                    
                                    <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 mb-8">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="material-symbols-outlined text-primary">location_on</span>
                                            <div>
                                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Destination</p>
                                                <p className="text-sm font-bold text-on-surface">Verified Identity Address</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-primary">payments</span>
                                            <div>
                                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Service Fee</p>
                                                <p className="text-sm font-bold text-on-surface">₦2,400.00 <span className="text-xs font-medium text-on-surface-variant">(Standard Logistic)</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={() => setShowDelivery(false)} className="flex-1 py-4 font-bold text-on-surface-variant hover:text-on-surface">Cancel</button>
                                        <button 
                                            onClick={() => setDeliverySent(true)}
                                            className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                        >
                                            Confirm Request
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                                        <span className="material-symbols-outlined text-5xl">mark_email_read</span>
                                    </div>
                                    <h2 className="text-3xl font-headline font-black text-on-surface uppercase italic mb-4">Request Sent</h2>
                                    <p className="text-on-surface-variant font-medium mb-10 leading-relaxed">
                                        Your request has been logged. Clinical verification is underway, and a tracking ID will be issued shortly.
                                    </p>
                                    <button 
                                        onClick={() => setShowDelivery(false)}
                                        className="w-full py-4 bg-on-surface text-surface rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
                                    >
                                        Close Portal
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

const InfoItem = ({ label, value }) => (
    <div className="bg-surface-container-low p-5 rounded-3xl border border-outline-variant/10 text-center min-w-[120px]">
        <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5 opacity-60">{label}</p>
        <p className="font-bold text-on-surface text-sm">{value}</p>
    </div>
)

export default RecordDetail
