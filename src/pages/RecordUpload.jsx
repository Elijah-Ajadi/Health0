import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Button, Input } from '../components/ui'

const RecordUpload = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [dragActive, setDragActive] = useState(false)
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')
    const [uploadProgress, setUploadProgress] = useState(0)
    const [formData, setFormData] = useState({
        patient_nin: '',
        title: '',
        record_type: 'DOCUMENT',
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
        if (!file) return
        setLoading(true)
        setError('')
        setUploadProgress(0)

        try {
            const data = new FormData()
            data.append('file', file)
            data.append('title', formData.title || file.name)
            data.append('record_type', formData.record_type)
            data.append('description', formData.description)

            // If uploading for a specific patient (hospital role), include NIN
            if (user?.role === 'HOSPITAL' && formData.patient_nin) {
                data.append('patient_nin', formData.patient_nin)
            }

            await api.post('/records/', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    setUploadProgress(percent)
                }
            })
            setIsSuccess(true)
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Upload failed. Please try again.')
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
                        The clinical record has been securely synchronized with the patient's health vault.
                    </p>
                    <div className="space-y-4">
                        <Button variant="primary" size="lg" className="w-full" onClick={() => { setIsSuccess(false); setFile(null); setUploadProgress(0) }}>
                            Upload Another Record
                        </Button>
                        <Button variant="surface" className="w-full" onClick={() => navigate('/dashboard')}>
                            Return to Portal
                        </Button>
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
                    {error && (
                        <div className="p-4 bg-error-container border border-error/10 rounded-2xl flex items-center gap-3 text-error text-sm font-bold">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}
                    <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-subtle border border-outline-variant/10 space-y-6">
                        {/* Hospital uploads for a specific patient */}
                        {user?.role === 'HOSPITAL' && (
                            <Input
                                label="Target Patient NIN (11 Digits)"
                                icon="fingerprint"
                                placeholder="Search by identity number..."
                                value={formData.patient_nin}
                                onChange={(e) => setFormData({...formData, patient_nin: e.target.value.replace(/\D/g, '').slice(0, 11)})}
                            />
                        )}
                        <Input
                            label="Record Title"
                            icon="edit"
                            placeholder="e.g. Blood Test Results — Jan 2025"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Record Classification</label>
                            <select
                                className="w-full px-6 py-5 rounded-2xl bg-surface-container-low text-on-surface font-bold border-2 border-transparent focus:border-primary/20 transition-all outline-none"
                                value={formData.record_type}
                                onChange={(e) => setFormData({...formData, record_type: e.target.value})}
                            >
                                <option value="DOCUMENT">General Document</option>
                                <option value="PDF">PDF Report</option>
                                <option value="IMAGE">Medical Image</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Clinical Observations</label>
                            <textarea
                                className="w-full px-6 py-5 rounded-2xl bg-surface-container-low text-on-surface font-bold border-2 border-transparent focus:border-primary/20 transition-all outline-none placeholder:text-on-surface-variant/40 resize-none"
                                rows="4"
                                placeholder="Enter detailed report summary..."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>
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
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png,.dcm" />

                        {!file ? (
                            <>
                                <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                    <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                                </div>
                                <h3 className="text-lg font-black text-on-surface uppercase italic mb-2">Drop Clinical File</h3>
                                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                                    PDFs, medical images (JPG, PNG) up to 50MB.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                    <span className="material-symbols-outlined text-5xl">description</span>
                                </div>
                                <h3 className="text-lg font-black text-on-surface uppercase italic mb-1 break-all px-4">{file.name}</h3>
                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-4">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB — Ready
                                </p>
                                <button onClick={(e) => { e.preventDefault(); setFile(null) }} className="text-error font-black text-[10px] uppercase tracking-widest hover:underline">Remove File</button>
                            </>
                        )}
                    </label>

                    {/* Upload progress bar */}
                    {loading && uploadProgress > 0 && (
                        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}

                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={handleUpload}
                        disabled={!file || loading}
                        icon={loading ? 'sync' : 'verified'}
                        iconPosition="right"
                    >
                        {loading ? `Uploading ${uploadProgress}%...` : 'Synchronize Record'}
                    </Button>
                    <p className="text-[10px] text-center text-on-surface-variant font-bold uppercase tracking-widest opacity-60">
                        Stored securely via Django Media Storage
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RecordUpload
