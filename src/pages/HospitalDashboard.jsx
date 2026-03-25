import React, { useState } from 'react'
import { Plus, Search, Upload, CheckCircle } from 'lucide-react'
import { Card, Button, Input } from '../components/ui'

const HospitalDashboard = () => {
  const [patientId, setPatientId] = useState('')

  const recentUploads = [
    { id: 101, patient: 'John Doe', type: 'MRI Scan', date: '10 mins ago' },
    { id: 102, patient: 'Jane Smith', type: 'Blood Report', date: '2 hours ago' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl">Hospital Portal</h1>
        <p className="text-slate-500">City General Hospital - Radiology Dept.</p>
      </header>

      <section className="bg-slate-50 border-2 border-dashed border-primary/40 rounded-2xl p-8 text-center flex flex-col items-center gap-4">
        <div className="bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/20">
          <Upload size={32} />
        </div>
        <div>
          <h3 className="text-lg">Upload New Record</h3>
          <p className="text-sm text-slate-500">PDF, JPEG, or DICOM files supported</p>
        </div>
        <Button className="w-full mt-2">Select Files</Button>
      </section>

      <section>
        <h3 className="mb-4 text-lg">Patient Lookup</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input 
              placeholder="Enter Patient ID or Name" 
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="mb-0"
            />
          </div>
          <Button className="h-[50px] aspect-square p-0 shrink-0">
            <Search size={22} />
          </Button>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg">Recent Activity</h3>
        <div className="space-y-4">
          {recentUploads.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors rounded-lg">
              <div>
                <p className="font-bold text-slate-900">{item.patient}</p>
                <p className="text-xs text-slate-500 underline uppercase tracking-tight font-bold">{item.type}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold">{item.date}</p>
                <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1 justify-end">
                  <CheckCircle size={10} /> SUCCESS
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HospitalDashboard
