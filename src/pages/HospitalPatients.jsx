import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Card, Button, Input, LoadingShimmer, EmptyState } from '../components/ui'

const HospitalPatients = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [recentPatients, setRecentPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [searching, setSearching] = useState(false)
    const [error, setError] = useState('')
    const [hasSearched, setHasSearched] = useState(false)

    useEffect(() => {
        // Load recent patients on mount
        const fetchRecent = async () => {
            try {
                const res = await api.get('/hospital/search/?q=')
                setRecentPatients(res.data.slice(0, 10))
            } catch (err) {
                console.error('Failed to fetch recent patients:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchRecent()
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        setSearching(true)
        setError('')
        setHasSearched(true)
        try {
            const res = await api.get(`/hospital/search/?q=${encodeURIComponent(searchQuery)}`)
            setSearchResults(res.data)
        } catch (err) {
            setError(err.response?.data?.error || 'Search failed. Try again.')
        } finally {
            setSearching(false)
        }
    }

    const displayList = hasSearched ? searchResults : recentPatients

    return (
        <div className="space-y-10">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                        Patient Registry
                    </span>
                    <h1 className="text-4xl font-headline font-black text-on-surface tracking-tight italic uppercase mt-2">
                        Patient <span className="text-primary">Discovery</span>
                    </h1>
                    <p className="text-on-surface-variant font-medium mt-1">Search by NIN, name, or facility ID</p>
                </div>
                <Button variant="primary" icon="person_add" onClick={() => navigate('/hospital/register')}>
                    Register Patient
                </Button>
            </section>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <Input
                    placeholder="Search by NIN, name, or Hospital ID..."
                    icon="search"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); if (!e.target.value) { setHasSearched(false); setSearchResults([]) } }}
                    className="flex-1 mb-0"
                />
                <Button type="submit" variant="surface" className="px-8" disabled={searching}>
                    {searching ? 'Searching...' : 'Probe Vault'}
                </Button>
                {hasSearched && (
                    <Button type="button" variant="ghost" icon="close" onClick={() => { setHasSearched(false); setSearchQuery(''); setSearchResults([]) }} />
                )}
            </form>

            {/* Error */}
            {error && (
                <div className="p-4 bg-error-container border border-error/10 rounded-2xl flex items-center gap-3 text-error text-sm font-bold">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
            )}

            {/* Results */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-headline font-black text-on-surface uppercase tracking-tight">
                        {hasSearched ? `${searchResults.length} Results` : 'Recent Patients'}
                    </h2>
                    {!hasSearched && <span className="text-xs text-on-surface-variant font-bold">Showing last 10</span>}
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1,2,3].map(i => <LoadingShimmer key={i} height="h-24" rounded="rounded-3xl" />)}
                    </div>
                ) : displayList.length > 0 ? (
                    <motion.div className="space-y-4">
                        {displayList.map((patient, i) => (
                            <motion.div
                                key={patient.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <Card
                                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer"
                                    onClick={() => navigate(`/hospital/patient/${patient.id}`)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-2xl">person</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-on-surface group-hover:text-primary transition-colors">
                                                {patient.user?.first_name} {patient.user?.last_name}
                                            </p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-0.5">
                                                NIN: {patient.nin || 'Not set'} · {patient.blood_group || 'Blood group unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-auto">
                                        <Button
                                            variant="surface"
                                            size="sm"
                                            icon="folder_shared"
                                            onClick={(e) => { e.stopPropagation(); navigate(`/hospital/patient/${patient.id}`) }}
                                        >
                                            View Records
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            icon="upload_file"
                                            onClick={(e) => { e.stopPropagation(); navigate('/upload') }}
                                        >
                                            Upload
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <EmptyState
                        icon="manage_search"
                        title={hasSearched ? 'No Patients Found' : 'No Patients Yet'}
                        message={hasSearched ? 'No records match that identity. Try a different NIN or name.' : 'Registered patients will appear here.'}
                        actionLabel="Register New Patient"
                        onAction={() => navigate('/hospital/register')}
                    />
                )}
            </div>
        </div>
    )
}

export default HospitalPatients
