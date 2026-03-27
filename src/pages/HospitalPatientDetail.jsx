import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import { Card, Button, LoadingShimmer, EmptyState } from '../components/ui'

const HospitalPatientDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [patient, setPatient] = useState(null)
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await api.get(`/hospital/patient/${id}/`)
                setPatient(res.data.patient)
                setRecords(res.data.records || [])
            } catch (err) {
                setError(err.response?.status === 404
                    ? 'Patient not found in this facility\'s registry.'
                    : err.response?.data?.error || 'Failed to load patient data.')
            } finally {
                setLoading(false)
            }
        }
        fetchPatient()
    }, [id])

    if (loading) return (
        <div className="space-y-8">
            <LoadingShimmer height="h-12" width="w-64" />
            <LoadingShimmer height="h-48" rounded="rounded-[2.5rem]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LoadingShimmer height="h-40" rounded="rounded-3xl" />
                <LoadingShimmer height="h-40" rounded="rounded-3xl" />
            </div>
        </div>
    )

    if (error) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full text-center p-12">
                <span className="material-symbols-outlined text-5xl text-error mb-4 block">person_off</span>
                <h2 className="text-2xl font-headline font-black text-on-surface uppercase italic mb-3">Access Denied</h2>
                <p className="text-on-surface-variant font-medium mb-8">{error}</p>
                <Button variant="primary" onClick={() => navigate('/hospital/patients')}>Back to Registry</Button>
            </Card>
        </div>
    )

    return (
        <div className="space-y-10">
            {/* Back + Header */}
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-4">
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="font-bold text-sm">Patient Registry</span>
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings:"'FILL' 1"}}>person</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-headline font-black text-on-surface italic uppercase">
                                {patient?.user?.first_name} {patient?.user?.last_name}
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                NIN: {patient?.nin || 'N/A'} · ID: HV-{String(patient?.id || 0).padStart(3,'0')}
                            </p>
                        </div>
                    </div>
                    <Button variant="primary" icon="upload_file" onClick={() => navigate('/upload')}>
                        Upload Record
                    </Button>
                </div>
            </div>

            {/* Vital Snapshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Blood Group', value: patient?.blood_group || 'N/A', icon: 'water_drop' },
                    { label: 'Genotype',    value: patient?.genotype    || 'N/A', icon: 'genetics' },
                    { label: 'Allergies',   value: patient?.allergies   || 'None', icon: 'warning' },
                    { label: 'Records',     value: records.length,               icon: 'folder_shared' },
                ].map(({ label, value, icon }) => (
                    <Card key={label} className="text-center py-6">
                        <span className="material-symbols-outlined text-2xl text-primary mb-2 block" style={{fontVariationSettings:"'FILL' 1"}}>{icon}</span>
                        <p className="text-xl font-black text-on-surface">{value}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">{label}</p>
                    </Card>
                ))}
            </div>

            {/* Records */}
            <div>
                <h2 className="text-xl font-headline font-black text-on-surface uppercase italic mb-6">Clinical Records</h2>
                {records.length > 0 ? (
                    <div className="space-y-4">
                        {records.map(record => (
                            <Card
                                key={record.id}
                                className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
                                onClick={() => navigate(`/record/${record.id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{record.title}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                            {record.record_type} · {new Date(record.created_at).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" icon="arrow_forward">View</Button>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon="folder_open"
                        title="No Records Yet"
                        message="No clinical documents have been uploaded for this patient."
                        actionLabel="Upload Record"
                        onAction={() => navigate('/upload')}
                    />
                )}
            </div>
        </div>
    )
}

export default HospitalPatientDetail
