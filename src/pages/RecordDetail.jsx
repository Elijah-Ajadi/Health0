import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Download, Share2, MapPin, ShieldCheck, CheckCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Input } from '../components/ui'

const RecordDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [showDelivery, setShowDelivery] = React.useState(false)
  const [deliverySent, setDeliverySent] = React.useState(false)

  // Mock data for the record
  const record = {
    id: id,
    type: 'Radiology Report',
    hospital: 'City General Hospital',
    department: 'Medical Imaging',
    date: 'March 22, 2026',
    time: '14:30 PM',
    doctor: 'Dr. Sarah Connor',
    status: 'Verified',
    hash: '0x74d...3f21',
    notes: 'Patient shows minor inflammation in the lower lumbar region. Recommended follow-up in 3 months.'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6"
    >
      <header className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2 aspect-square">
          <ChevronLeft size={24} />
        </Button>
        <h2 className="text-xl m-0">Record Details</h2>
      </header>

      <section className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="min-w-0">
            <h3 className="text-2xl mb-1 truncate">{record.type}</h3>
            <p className="text-slate-500 flex items-center gap-1.5 text-sm">
              <MapPin size={14} className="text-primary" /> {record.hospital}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <ShieldCheck size={28} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Date</p>
            <p className="font-bold text-slate-900">{record.date}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Doctor</p>
            <p className="font-bold text-slate-900 truncate">{record.doctor}</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">CLINICAL NOTES</p>
          <div className="bg-slate-50 p-4 rounded-2xl text-slate-700 leading-relaxed border border-slate-100/50 italic">
            "{record.notes}"
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-slate-100">
          <Button variant="primary" className="flex-1" onClick={() => setShowDelivery(true)}>
            <Download size={18} /> Request Delivery
          </Button>
          <Button variant="outline" className="w-[54px] aspect-square p-0 shrink-0">
            <Share2 size={18} />
          </Button>
        </div>
      </section>

      <section className="bg-primary/5 rounded-2xl p-4 border border-primary/10 overflow-hidden">
        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 shadow-sm">BLOCKCHAIN VERIFIED</p>
        <p className="text-xs font-mono text-slate-500 break-all m-0 bg-white/50 p-2 rounded-lg border border-primary/5">Hash: {record.hash}</p>
      </section>

      <AnimatePresence>
        {showDelivery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center z-[100] px-0"
            onClick={() => setShowDelivery(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-[500px] bg-white rounded-t-[32px] p-8 pb-12 shadow-2xl"
            >
              {!deliverySent ? (
                <>
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8"></div>
                  <h3 className="text-2xl mb-2 text-center">Request Record Delivery</h3>
                  <p className="text-slate-500 mb-8 text-center px-4">
                    How would you like to receive your secure health record?
                  </p>
                  
                  <div className="mb-8">
                    <div className="bg-primary-light/50 border-2 border-primary rounded-2xl p-4 flex items-center gap-4">
                      <div className="bg-primary text-white p-2.5 rounded-full">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 m-0">Secure Email Link</p>
                        <p className="text-xs text-slate-500 m-0 leading-tight">Access link expires in 24 hours</p>
                      </div>
                    </div>
                  </div>

                  <Input label="Destinaton Email" placeholder="e.g. hello@domain.com" />
                  
                  <Button 
                    variant="primary" 
                    className="w-full py-4 text-lg mt-4 shadow-xl shadow-primary/20"
                    onClick={() => setDeliverySent(true)}
                  >
                    Send to Email
                  </Button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="bg-emerald-100 text-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl mb-2">Request Sent!</h3>
                  <p className="text-slate-500 mb-10 px-6">
                    Check your inbox for the secure access link to your records.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => setShowDelivery(false)}>
                    Dismiss
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default RecordDetail
