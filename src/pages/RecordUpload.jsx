import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, CloudUpload, File, X, Info, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/ui'

const RecordUpload = () => {
  const navigate = useNavigate()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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

  const handleUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      setIsSuccess(true)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-6"
      >
        <div className="bg-emerald-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl mb-3 font-bold">Successfully Verified!</h2>
        <p className="text-slate-500 mb-12 leading-relaxed">
          The health record has been encrypted and securely added to the patient's digital vault.
        </p>
        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={() => { setIsSuccess(false); setFile(null); }}>
            Upload Another
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Done
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <header className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2 aspect-square">
          <ChevronLeft size={24} />
        </Button>
        <h2 className="text-xl m-0">New Health Record</h2>
      </header>

      <section className="space-y-4">
        <Input label="Patient Hash / Identifier" placeholder="e.g. 0x74...3f" />
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-500">Record Classification</label>
          <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer">
            <option>Radiology Report</option>
            <option>Blood Analysis</option>
            <option>Surgery Summary</option>
            <option>Vaccination Record</option>
            <option>Other</option>
          </select>
        </div>
      </section>

      <section 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`bg-white rounded-2xl p-10 text-center border-2 border-dashed transition-all ${
          dragActive ? 'border-primary bg-primary-light/30' : 'border-slate-100'
        }`}
      >
        {!file ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mb-4">
              <CloudUpload size={32} />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">Upload Laboratory Data</h4>
            <p className="text-sm text-slate-500 mb-6">PDF, JPEG, DICOM or standard images</p>
            <Button variant="outline" className="text-xs">Browse Documents</Button>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 text-left border border-slate-200">
            <div className="bg-primary text-white p-3 rounded-xl">
              <File size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 truncate m-0">{file.name}</p>
              <p className="text-xs text-slate-400 m-0 font-bold tracking-tight">{(file.size / 1024 / 1024).toFixed(2)} MB • READY</p>
            </div>
            <button onClick={() => setFile(null)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        )}
      </section>

      <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 text-amber-800 text-sm border border-amber-100 shadow-sm shadow-amber-500/5">
        <Info size={24} className="shrink-0 text-amber-600" />
        <p className="m-0 leading-relaxed font-medium">All uploaded records are automatically encrypted. Private keys are never stored on central servers.</p>
      </div>

      <Button 
        variant="primary" 
        className="py-4 text-lg shadow-xl shadow-primary/20 mt-2" 
        disabled={!file || isUploading}
        onClick={handleUpload}
      >
        {isUploading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Encrypting...
          </div>
        ) : 'Confirm & Send to Vault'}
      </Button>
    </motion.div>
  )
}

export default RecordUpload
