import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Building, AlertCircle, CheckCircle, BarChart3, Settings } from 'lucide-react'
import { Card, Button } from '../components/ui'

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Patients', value: '12,405', icon: Users, color: 'text-primary' },
    { label: 'Active Hospitals', value: '48', icon: Building, color: 'text-emerald-500' },
    { label: 'Pending Verifications', value: '156', icon: AlertCircle, color: 'text-amber-500' },
  ]

  const pendingHospitals = [
    { name: 'St. Mary’s Clinic', location: 'Lagos, NG', status: 'Pending Review' },
    { name: 'HealthFirst Diagnostics', location: 'Abuja, NG', status: 'Document Missing' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl">Admin Control</h1>
          <p className="text-slate-500">System Overview & Verification</p>
        </div>
        <div className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20">
          <Shield size={24} />
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-3 border border-slate-100 text-center shadow-sm">
            <div className={`${stat.color} mb-2 flex justify-center`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-1">{stat.label}</p>
            <h3 className="text-lg font-bold">{stat.value}</h3>
          </div>
        ))}
      </section>

      <section>
        <h3 className="mb-4 text-lg">Verification Queue</h3>
        <div className="flex flex-col gap-3">
          {pendingHospitals.map((hosp, i) => (
            <Card key={i} title={hosp.name} subtitle={hosp.location} icon={Building}>
              <Button variant="ghost" className="text-xs px-3 py-1.5 font-bold">Verify</Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex gap-4 items-center">
        <div className="bg-primary-light p-3 rounded-xl">
          <BarChart3 size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-slate-900 font-bold">System Health</h4>
          <p className="text-sm text-slate-500">All nodes operating normally.</p>
        </div>
        <CheckCircle size={20} className="text-emerald-500" />
      </section>

      <Button variant="outline" className="w-full mt-2">
        <Settings size={18} /> System Settings
      </Button>
    </div>
  )
}

export default AdminDashboard
