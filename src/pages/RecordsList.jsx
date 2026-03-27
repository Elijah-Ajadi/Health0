import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, Button, Input, LoadingShimmer, EmptyState } from '../components/ui'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

const RecordsList = ({ patientId = null, title = "Clinical Database" }) => {
    const navigate = useNavigate()
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchRecords()
    }, [patientId])

    const fetchRecords = async () => {
        try {
            const endpoint = patientId ? `/api/records/?patient=${patientId}` : '/api/records/'
            const res = await api.get(endpoint)
            setRecords(res.data)
        } catch (err) {
            console.error('Failed to fetch records:', err)
        } finally {
            setLoading(false)
        }
    }

    const filteredRecords = records.filter(record => {
        const matchesFilter = filter === 'ALL' || record.record_type === filter
        const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            record.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const categories = [
        { id: 'ALL', label: 'Universal', icon: 'apps' },
        { id: 'DOCUMENT', label: 'Reports', icon: 'description' },
        { id: 'IMAGE', label: 'Scans', icon: 'image' },
        { id: 'PDF', label: 'Archives', icon: 'picture_as_pdf' }
    ]

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex gap-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
                    {[1, 2, 3, 4].map(i => <LoadingShimmer key={i} width="w-32" height="h-12" rounded="rounded-2xl" />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => <LoadingShimmer key={i} height="h-48" rounded="rounded-[2rem]" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-headline font-black italic uppercase tracking-tighter text-on-surface leading-none mb-2">{title}</h2>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest italic">{records.length} Verified Entries</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="surface" size="sm" icon="sync" onClick={fetchRecords}>Refresh</Button>
                    <Button variant="primary" size="sm" icon="add" onClick={() => navigate('/upload-record')}>Index New Data</Button>
                </div>
            </header>

            {/* Filters */}
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setFilter(cat.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap italic ${filter === cat.id ? 'bg-on-surface text-surface shadow-lg' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                        <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            <Input 
                icon="search" 
                placeholder="Query clinical metadata (Title, ID, or Keywords)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xl"
            />

            <AnimatePresence mode="popLayout">
                {filteredRecords.length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredRecords.map(record => (
                            <Card 
                                key={record.id} 
                                title={record.title} 
                                subtitle={`${record.record_type} • ${new Date(record.created_at).toLocaleDateString()}`}
                                icon={record.record_type === 'IMAGE' ? 'image' : 'description'}
                                onClick={() => navigate(`/records/${record.id}`)}
                                className="group"
                            >
                                <p className="text-xs font-medium text-on-surface-variant line-clamp-2 mt-2 mb-6 opacity-70">
                                    {record.description || 'No additional metadata indexed for this clinical event.'}
                                </p>
                                <div className="flex items-center justify-between border-t border-outline-variant/5 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${record.is_verified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${record.is_verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {record.is_verified ? 'Verified Node' : 'Pending Sync'}
                                        </span>
                                    </div>
                                    <span className="material-symbols-outlined text-outline/30 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                                </div>
                            </Card>
                        ))}
                    </motion.div>
                ) : (
                    <EmptyState 
                        title="Database Clear" 
                        message={searchQuery ? "No entries match your search query." : "No clinical data has been indexed yet."}
                        actionLabel={searchQuery ? "Clear Search" : "Index First Record"}
                        onAction={searchQuery ? () => setSearchQuery('') : () => navigate('/upload-record')}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default RecordsList
