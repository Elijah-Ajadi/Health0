import React, { useState, useEffect } from 'react';
import api from '../api';
import { Check, X, Eye, ShieldCheck, AlertCircle } from 'lucide-react';

const Hospitals = () => {
    const [hospitals, setHospitals] = useState([]);
    const [pendingOnly, setPendingOnly] = useState(true);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchHospitals();
    }, [pendingOnly]);

    const fetchHospitals = async () => {
        const endpoint = pendingOnly ? '/admin/hospitals/pending/' : '/admin/hospitals/registry/';
        const res = await api.get(endpoint);
        setHospitals(res.data);
    };

    const handleVerify = async (id, action) => {
        try {
            await api.post(`/admin/hospitals/verify/${id}/`, {
                action,
                reason: action === 'REJECT' ? rejectionReason : ''
            });
            setSelectedHospital(null);
            setRejectionReason('');
            fetchHospitals();
        } catch (err) {
            alert('Action failed');
        }
    };

    return (
        <div className="main-content">
            <header className="page-header">
                <h1 className="page-title">Hospital Management</h1>
                <p className="page-subtitle">Vet institutions and manage the healthcare provider registry.</p>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button
                        className={`btn ${pendingOnly ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setPendingOnly(true)}
                    >
                        Pending Verification
                    </button>
                    <button
                        className={`btn ${!pendingOnly ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setPendingOnly(false)}
                    >
                        Full Registry
                    </button>
                </div>
            </header>

            {selectedHospital ? (
                <div className="inspection-tool">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2>Document Inspection: {selectedHospital.hospital_name}</h2>
                        <button className="btn btn-secondary" onClick={() => setSelectedHospital(null)}>Close</button>
                    </div>

                    <div className="grid-2">
                        <div className="stat-card">
                            <h3>Facility & Clinical Data</h3>
                            <div style={{ marginTop: '1rem' }}>
                                <p><strong>Name:</strong> {selectedHospital.hospital_name}</p>
                                <p><strong>Category:</strong> <span className="badge badge-active">{selectedHospital.category}</span></p>
                                <p><strong>CAC Number:</strong> {selectedHospital.cac_number}</p>
                                <p><strong>TIN:</strong> {selectedHospital.tin || 'N/A'}</p>
                                <p><strong>HEFAMAA ID:</strong> {selectedHospital.hefamaa_id || 'N/A'}</p>
                                <p><strong>Director:</strong> {selectedHospital.director_name}</p>
                                <p><strong>MDCN Number:</strong> {selectedHospital.mdcn_number}</p>
                                <p><strong>License Expiry:</strong> {selectedHospital.director_license_expiry}</p>
                                <p><strong>Address:</strong> {selectedHospital.address}</p>
                                <p><strong>Contact:</strong> {selectedHospital.contact_email} | {selectedHospital.contact_phone}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <h3>Verification Documents</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                {[
                                    { label: 'CAC Certificate', field: 'cac_document' },
                                    { label: 'HEFAMAA License', field: 'hefamaa_license' },
                                    { label: 'Letter of Intent', field: 'letter_of_intent' },
                                    { label: 'Proof of Address', field: 'proof_of_address' }
                                ].map(doc => (
                                    <div key={doc.field} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{doc.label}</p>
                                        {selectedHospital[doc.field] ? (
                                            <a href={`https://health0.onrender.com${selectedHospital[doc.field]}`} target="_blank" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>View PDF</a>
                                        ) : (
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Not Uploaded</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <h3>Final Decision</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button className="btn btn-primary" onClick={() => handleVerify(selectedHospital.id, 'APPROVE')}>
                                <ShieldCheck size={18} style={{ marginRight: '0.5rem' }} /> Approve & Activate
                            </button>
                            <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Reason for rejection..."
                                    className="btn btn-secondary"
                                    style={{ flex: 1, textAlign: 'left', cursor: 'text' }}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                                <button className="btn btn-secondary" style={{ color: 'var(--danger)' }} onClick={() => handleVerify(selectedHospital.id, 'REJECT')}>
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Hospital Name</th>
                                <th>Location</th>
                                <th>Tier</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hospitals.map(h => (
                                <tr key={h.id}>
                                    <td><strong>{h.hospital_name}</strong></td>
                                    <td>{h.address.substring(0, 30)}...</td>
                                    <td><span className="badge badge-active">{h.tier}</span></td>
                                    <td>
                                        <span className={`badge badge-${h.status === 'ACTIVE' ? 'active' : (h.status === 'PENDING' ? 'pending' : 'danger')}`}>
                                            {h.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-secondary" onClick={() => setSelectedHospital(h)}>
                                            Inspect
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {hospitals.length === 0 && (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No hospitals found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Hospitals;
