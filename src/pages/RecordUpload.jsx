import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const RecordUpload = () => {
    const navigate = useNavigate()
    const [dragActive, setDragActive] = useState(false)
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [formData, setFormData] = useState({
        patient_nin: '',
        category: 'Radiology Report',
        description: ''
    })

    const handleDrag = (e) => {
        e.preventDefault()
        setDragActive(e.type === "dragenter" || e.type === "dragover")
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    const handleUpload = async () => {
        setLoading(true)
        const data = new FormData()
        data.append('file', file)
        data.append('patient_nin', formData.patient_nin)
        data.append('category', formData.category)
        data.append('description', formData.description)

        try {
            await api.post('/records/upload/', data)
            setIsSuccess(true)
        } catch (err) {
            console.error('Upload failed:', err)
        } finally {
            setLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center p-12 bg-surface-container-lowest rounded-[3rem] shadow-modal border border-outline-variant/10"
                >
                    <div className="bg-emerald-500 text-white w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                        <span className="material-symbols-outlined text-5xl">task_alt</span>
                    </div>
                    <h2 className="text-3xl font-headline font-black text-on-surface uppercase italic mb-4">Ledger Updated</h2>
                    <p className="text-on-surface-variant font-medium mb-12 leading-relaxed">
                        The clinical record has been encrypted and securely synchronized with the patient's global health vault.
                    </p>
                    <div className="space-y-3">
                        <button 
                            onClick={() => { setIsSuccess(false); setFile(null); }}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            Upload Another Record
                        </button>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-4 text-on-surface-variant font-bold text-sm hover:underline"
                        >
                            Return to Portal
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* ─── HEADER ─── */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => navigate(-1)} className="p-2 -ml-3 text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-2xl">arrow_back</span>
                        </button>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">Clinical Input</span>
                    </div>
                    <h1 className="text-4xl font-headline font-black text-on-surface tracking-tight italic uppercase">New <span className="text-primary italic">Health Record</span></h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* ─── FORM (LEFT) ─── */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-subtle border border-outline-variant/10 space-y-6">
                        <InputField 
                            label="Target Patient NIN (11 Digits)" 
                            placeholder="Search by identity number..." 
                            value={formData.patient_nin}
                            onChange={(e) => setFormData({...formData, patient_nin: e.target.value.replace(/\D/g, '').slice(0, 11)})}
                        />
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Record Classification</label>
                            <select 
                                className="w-full px-6 py-5 rounded-2xl bg-surface-container-low text-on-surface font-bold border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option>Radiology Report</option>
                                <option>Blood Analysis</option>
                                <option>Surgery Summary</option>
                                <option>Vaccination Record</option>
                                <option>General Consultation</option>
                            </select>
                        </div>
                        <InputField 
                            label="Clinical Observations / Description" 
                            placeholder="Enter detailed report summary..." 
                            isTextArea 
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                </div>

                {/* ─── DROPZONE (RIGHT) ─── */}
                <div className="lg:col-span-5 space-y-6">
                    <label 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`block h-full min-h-[300px] relative border-2 border-dashed rounded-[2.5rem] transition-all cursor-pointer group flex flex-col items-center justify-center p-10 text-center ${
                            dragActive ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/40'
                        }`}
                    >
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                        
                        {!file ? (
                            <>
                                <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                    <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                                </div>
                                <h3 className="text-lg font-black text-on-surface uppercase italic mb-2">Drop Clinical File</h3>
                                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                                    Drag and drop PDFs or medical images (DICOM, JPG) up to 50MB.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                    <span className="material-symbols-outlined text-5xl">description</span>
                                </div>
                                <h3 className="text-lg font-black text-on-surface uppercase italic mb-1 break-all px-4">{file.name}</h3>
                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-4">Ready for Encryption</p>
                                <button onClick={(e) => { e.preventDefault(); setFile(null); }} className="text-error font-black text-[10px] uppercase tracking-widest hover:underline">Remove File</button>
                            </>
                        )}
                    </label>

                    <button 
                        onClick={handleUpload}
                        disabled={!file || !formData.patient_nin || loading}
                        className={`w-full py-5 rounded-2xl font-headline font-black text-white shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${
                            file && formData.patient_nin && !loading ? 'bg-gradient-to-r from-primary to-primary-container shadow-primary/30' : 'bg-surface-dim text-on-surface-variant cursor-not-allowed'
                        }`}
                    >
                        {loading ? 'Encrypting Node...' : 'Synchronize Record'}
                        <span className="material-symbols-outlined">{loading ? 'sync' : 'verified'}</span>
                    </button>
                    <p className="text-[10px] text-center text-on-surface-variant font-bold uppercase tracking-widest opacity-60">
                        AES-256 Multi-layer Encryption Active
                    </p>
                </div>
            </div>
        </div>
    )
}

const InputField = ({ label, placeholder, value, onChange, type = "text", isTextArea = false, rows = "3" }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">{label}</label>
        {isTextArea ? (
            <textarea className="w-full px-6 py-5 rounded-2xl bg-surface-container-low text-on-surface font-bold border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline/40 resize-none outline-none" rows={rows} placeholder={placeholder} value={value} onChange={onChange} />
        ) : (
            <input type={type} className="w-full px-6 py-5 rounded-2xl bg-surface-container-low text-on-surface font-bold border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline/40 outline-none" placeholder={placeholder} value={value} onChange={onChange} />
        )}
    </div>
)

export default RecordUpload
