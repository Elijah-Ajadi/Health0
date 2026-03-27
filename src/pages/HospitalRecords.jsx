import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Card, Button, LoadingShimmer, EmptyState } from '../components/ui'

const RECORD_TYPE_ICONS = {
    PDF:      'picture_as_pdf',
    IMAGE:    'image',
    DOCUMENT: 'description',
    default:  'folder'
}

const HospitalRecords = () => {
    const navigate = useNavigate()
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await api.get('/records/')
                setRecords(res.data)
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load records.')
            } finally {
                setLoading(false)
            }
        }
        fetchRecords()
    }, [])

    const filtered = filter === 'ALL' ? records : records.filter(r => r.record_type === filter)

    return (
        <div className="space-y-10">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                        Clinical Ledger
                    </span>
                    <h1 className="text-4xl font-headline font-black text-on-surface tracking-tight italic uppercase mt-2">
                        Patient <span className="text-primary">Records</span>
                    </h1>
                    <p className="text-on-surface-variant font-medium mt-1">{records.length} total clinical documents</p>
                </div>
                <Button variant="primary" icon="upload_file" onClick={() => navigate('/upload')}>
                    Upload New Record
                </Button>
            </section>

            {/* Filter Pills */}
            <div className="flex gap-2 flex-wrap">
                {['ALL', 'PDF', 'IMAGE', 'DOCUMENT'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === type
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-surface-container text-on-surface-variant hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-error-container border border-error/10 rounded-2xl flex items-center gap-3 text-error text-sm font-bold">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
            )}

            {/* Records Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3,4,5,6].map(i => <LoadingShimmer key={i} height="h-40" rounded="rounded-3xl" />)}
                </div>
            ) : filtered.length > 0 ? (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((record, i) => (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                        >
                            <Card
                                className="group cursor-pointer hover:-translate-y-1 transition-transform"
                                onClick={() => navigate(`/record/${record.id}`)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>
                                            {RECORD_TYPE_ICONS[record.record_type] || RECORD_TYPE_ICONS.default}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                                            {record.title || 'Clinical Record'}
                                        </p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">
                                            {record.record_type} · {new Date(record.created_at).toLocaleDateString('en-GB')}
                                        </p>
                                        {record.description && (
                                            <p className="text-xs text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
                                                {record.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button variant="ghost" size="sm" icon="open_in_new" className="flex-1" onClick={(e) => { e.stopPropagation(); navigate(`/record/${record.id}`) }}>
                                        View
                                    </Button>
                                    {record.file && (
                                        <a
                                            href={record.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={e => e.stopPropagation()}
                                            className="flex-1"
                                        >
                                            <Button variant="surface" size="sm" icon="download" className="w-full">Download</Button>
                                        </a>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <EmptyState
                    icon="folder_open"
                    title="No Records Found"
                    message={filter !== 'ALL' ? `No ${filter} records uploaded yet.` : 'No clinical records have been uploaded to this ledger yet.'}
                    actionLabel="Upload First Record"
                    onAction={() => navigate('/upload')}
                />
            )}
        </div>
    )
}

export default HospitalRecords
