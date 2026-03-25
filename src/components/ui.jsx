import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, FileText, User, Bell } from 'lucide-react'

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
    ghost: 'bg-transparent text-primary hover:bg-primary-light',
    outline: 'bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  }
  
  return (
    <button 
      className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const Card = ({ children, title, subtitle, icon: Icon, onClick, className = '' }) => (
  <motion.div 
    whileTap={onClick ? { scale: 0.98 } : {}}
    className={`bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 transition-shadow ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
    onClick={onClick}
  >
    {Icon && (
      <div className="w-12 h-12 rounded-xl bg-primary-light/20 text-primary flex items-center justify-center shrink-0">
        <Icon size={24} />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <h4 className="text-slate-900 font-semibold truncate m-0">{title}</h4>
      {subtitle && <p className="text-slate-500 text-sm truncate m-0">{subtitle}</p>}
    </div>
    {children}
  </motion.div>
)

export const Input = ({ label, className = '', ...props }) => (
  <div className={`mb-4 ${className}`}>
    {label && <label className="block mb-2 text-sm font-medium text-slate-500">{label}</label>}
    <input 
      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-all" 
      {...props} 
    />
  </div>
)

export const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: FileText, label: 'Records' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'notif', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' },
  ]
  
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-16 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-around items-center px-4 pb-safe z-50">
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <motion.div
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
          </motion.div>
        )
      })}
    </nav>
  )
}
