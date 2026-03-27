import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Card, Button, Input } from '../components/ui'
import { motion } from 'framer-motion'

const ProfileSettings = () => {
    const { user, logout } = useAuth()
    const role = user?.role || 'PATIENT'
    const profile = role === 'PATIENT' ? user?.patient_profile : user?.hospital_profile

    const [isEditing, setIsEditing] = useState(false)

    const renderPatientSettings = () => (
        <div className="space-y-8">
            <section>
                <h3 className="text-xl font-headline font-black italic uppercase tracking-tighter text-on-surface mb-6">Identity & Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card icon="fingerprint" title="Biometric Vault" subtitle="Fingerprint & Face ID" variant="glass">
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status: Active</span>
                            <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                            </div>
                        </div>
                    </Card>
                    <Card icon="key" title="Clinical PIN" subtitle="4-Digit Secure Access" variant="glass">
                        <Button variant="outline" size="sm" className="mt-4 w-full">Update PIN</Button>
                    </Card>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-headline font-black italic uppercase tracking-tighter text-on-surface mb-6">Personal Discovery</h3>
                <Card className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Legal First Name" value={user?.first_name} disabled={!isEditing} />
                        <Input label="Legal Last Name" value={user?.last_name} disabled={!isEditing} />
                        <Input label="Digital Identity (NIN)" value={profile?.nin || 'Not Linked'} disabled />
                        <Input label="Contact Phone" value={profile?.phone_number} disabled={!isEditing} />
                    </div>
                </Card>
            </section>
        </div>
    )

    const renderHospitalSettings = () => (
        <div className="space-y-8">
            <section>
                <h3 className="text-xl font-headline font-black italic uppercase tracking-tighter text-on-surface mb-6">Facility Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card icon="verified" title="Accreditation" subtitle="HEFAMAA & MDCN Status" variant="glass">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase mt-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active Provider
                        </div>
                    </Card>
                    <Card icon="api" title="Developer Node" subtitle="API Keys & Integrations" variant="glass">
                        <Button variant="outline" size="sm" className="mt-4 w-full">Manage Keys</Button>
                    </Card>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-headline font-black italic uppercase tracking-tighter text-on-surface mb-6">Institutional Metadata</h3>
                <Card className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Registered Facility Name" value={profile?.hospital_name} disabled />
                        <Input label="Institutional Email" value={profile?.contact_email} disabled={!isEditing} />
                        <Input label="Business Logic (CAC)" value={profile?.cac_number} disabled />
                        <Input label="Clinical Category" value={profile?.category} disabled />
                    </div>
                </Card>
            </section>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-headline font-black italic uppercase tracking-tighter text-on-surface leading-none mb-4">Command Center</h1>
                    <p className="text-sm font-bold text-on-surface-variant uppercase tracking-[0.2em]">Account & Node Configuration</p>
                </div>
                <div className="flex gap-4">
                    <Button 
                        variant={isEditing ? 'primary' : 'surface'} 
                        icon={isEditing ? 'check' : 'edit'}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                    <Card className="text-center sticky top-24">
                        <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center text-primary text-3xl font-black italic uppercase">
                            {user?.first_name?.[0] || 'U'}
                        </div>
                        <h2 className="text-xl font-headline font-black italic uppercase tracking-tighter text-on-surface">{user?.first_name} {user?.last_name}</h2>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1 mb-8">Role: {role}</p>
                        
                        <div className="pt-8 border-t border-outline-variant/10">
                            <Button variant="error" size="sm" className="w-full" icon="logout" onClick={logout}>
                                Terminate Session
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-8">
                    {role === 'PATIENT' ? renderPatientSettings() : renderHospitalSettings()}
                    
                    <section className="mt-12 pt-12 border-t border-outline-variant/10">
                        <Card variant="dark" className="bg-red-950/20 border-red-500/20">
                            <h3 className="text-lg font-headline font-black italic uppercase tracking-tighter text-red-500 mb-2">Danger Zone</h3>
                            <p className="text-xs font-medium text-red-400/60 mb-6">Irreversible actions regarding your clinical node and identity vault.</p>
                            <Button variant="error" size="sm" className="bg-red-500/10 text-red-500 border border-red-500/20 shadow-none hover:bg-red-500 hover:text-white">Deactivate Node</Button>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default ProfileSettings
