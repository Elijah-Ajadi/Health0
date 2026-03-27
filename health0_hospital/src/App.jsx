import React, { useState } from 'react';
import axios from 'axios';
import {
    Building2,
    Stethoscope,
    FileText,
    UserPlus,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Upload,
    AlertCircle
} from 'lucide-react';

const CATEGORIES = [
    { value: 'PRIVATE', label: 'Private Hospital' },
    { value: 'PUBLIC', label: 'Public General Hospital' },
    { value: 'PHARMACY', label: 'Pharmacy' },
    { value: 'DIAGNOSTIC', label: 'Diagnostic Lab' },
    { value: 'PRIMARY', label: 'Primary Health Centre' },
];

const App = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        hospital_name: '',
        category: 'PRIVATE',
        cac_number: '',
        tin: '',
        hefamaa_id: '',
        director_name: '',
        mdcn_number: '',
        director_license_expiry: '',
        address: '',
        admin_name: '',
        admin_email: '',
        username: '',
        admin_phone: '',
        password: ''
    });

    const [files, setFiles] = useState({
        cac_document: null,
        hefamaa_license: null,
        letter_of_intent: null,
        proof_of_address: null
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        Object.keys(files).forEach(key => {
            if (files[key]) data.append(key, files[key]);
        });

        try {
            const res = await axios.post('https://health0.onrender.com/api/hospital/signup/', data);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Please check your data.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="main-content" style={{ margin: '0 auto', maxWidth: '600px', textAlign: 'center', paddingTop: '10vh' }}>
                <div className="stat-card" style={{ padding: '3rem' }}>
                    <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1.5rem' }} />
                    <h1 className="page-title">Application Submitted</h1>
                    <p className="page-subtitle" style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
                        Thank you for applying. Our Admin team is currently vetting your medical licenses.
                        This usually takes 24–48 hours.
                    </p>
                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            A confirmation email has been sent to <strong>{formData.admin_email}</strong>.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content" style={{ margin: '0 auto', maxWidth: '800px' }}>
            <header className="page-header" style={{ textAlign: 'center' }}>
                <h1 className="logo-text">Health<span>0</span> for Hospitals</h1>
                <p className="page-subtitle">Onboarding the next generation of healthcare providers.</p>

                <div className="step-indicator" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
                    {[
                        { s: 1, icon: Building2, label: 'Identity' },
                        { s: 2, icon: Stethoscope, label: 'Clinical' },
                        { s: 3, icon: FileText, label: 'Documents' },
                        { s: 4, icon: UserPlus, label: 'Admin' }
                    ].map((item) => (
                        <div key={item.s} style={{ opacity: step === item.s ? 1 : 0.4, transition: '0.3s', textAlign: 'center' }}>
                            <div style={{
                                background: step >= item.s ? 'var(--primary)' : '#e2e8f0',
                                color: step >= item.s ? 'white' : 'var(--text-muted)',
                                width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 0.5rem'
                            }}>
                                <item.icon size={20} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </header>

            <form onSubmit={handleSubmit} className="stat-card" style={{ padding: '2.5rem', marginTop: '1rem' }}>
                {error && (
                    <div style={{ background: '#fef2f2', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {step === 1 && (
                    <div className="step-content">
                        <h2 style={{ marginBottom: '1.5rem' }}>Step A: Basic Identity</h2>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="stat-label">Official Facility Name</label>
                            <input type="text" name="hospital_name" value={formData.hospital_name} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} placeholder="e.g. Evercare Hospital Lekki" required />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="stat-label">Facility Category</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left' }}>
                                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div className="grid-2">
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="stat-label">CAC Registration Number</label>
                                <input type="text" name="cac_number" value={formData.cac_number} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} required />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="stat-label">Tax Identification Number (TIN)</label>
                                <input type="text" name="tin" value={formData.tin} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="step-content">
                        <h2 style={{ marginBottom: '1.5rem' }}>Step B: Clinical Accreditation</h2>
                        <div className="grid-2">
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="stat-label">HEFAMAA / Regulatory ID</label>
                                <input type="text" name="hefamaa_id" value={formData.hefamaa_id} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} required />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="stat-label">Physical Facility Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} required />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="stat-label">Medical Director's Full Name</label>
                            <input type="text" name="director_name" value={formData.director_name} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} required />
                        </div>
                        <div className="grid-2">
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="stat-label">MDCN Registration Number</label>
                                <input type="text" name="mdcn_number" value={formData.mdcn_number} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} required />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="stat-label">Practicing License Expiry Date</label>
                                <input type="date" name="director_license_expiry" value={formData.director_license_expiry} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} required />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="step-content">
                        <h2 style={{ marginBottom: '1.5rem' }}>Step C: Document Uploads</h2>
                        {[
                            { name: 'cac_document', label: 'CAC Certificate (PDF)' },
                            { name: 'hefamaa_license', label: 'HEFAMAA / State License (PDF)' },
                            { name: 'letter_of_intent', label: 'Letter of Intent (Signed & Stamped)' },
                            { name: 'proof_of_address', label: 'Proof of Address (Utility Bill)' }
                        ].map((doc) => (
                            <div key={doc.name} style={{ marginBottom: '1.25rem' }}>
                                <label className="stat-label">{doc.label}</label>
                                <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                    <input type="file" name={doc.name} onChange={handleFileChange} accept=".pdf,image/*" style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }} />
                                    <div className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', background: files[doc.name] ? '#ecfdf5' : '' }}>
                                        <Upload size={16} />
                                        <span>{files[doc.name] ? files[doc.name].name : 'Choose File...'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 4 && (
                    <div className="step-content">
                        <h2 style={{ marginBottom: '1.5rem' }}>Step D: Admin Technical Setup</h2>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="stat-label">Primary Admin Full Name</label>
                            <input type="text" name="admin_name" value={formData.admin_name} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} placeholder="The person managing this account" required />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="stat-label">Choose Admin Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} placeholder="e.g. evercare_admin" required />
                        </div>
                        <div className="grid-2">
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="stat-label">Admin Email Address</label>
                                <input type="email" name="admin_email" value={formData.admin_email} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} required />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="stat-label">Admin Phone Number</label>
                                <input type="tel" name="admin_phone" value={formData.admin_phone} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} required />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="stat-label">Set Account Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', cursor: 'text' }} placeholder="Min 8 characters" required />
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
                    {step > 1 ? (
                        <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                            <ChevronLeft size={18} style={{ marginRight: '0.5rem' }} /> Back
                        </button>
                    ) : <div />}

                    {step < 4 ? (
                        <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
                            Continue <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </button>
                    ) : (
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ background: 'var(--success)', width: '200px' }}>
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default App;
