import React from 'react'

const MobileHeader = ({ user, onOpenNotifications, onOpenProfile }) => {
    return (
        <header className="lg:hidden fixed top-0 left-0 w-full h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-6 z-50">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-lg">healing</span>
                </div>
                <span className="font-headline font-black text-on-surface tracking-tight">Health0</span>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={onOpenNotifications}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors relative"
                >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
                </button>
                <button 
                    onClick={onOpenProfile}
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-surface shadow-subtle"
                >
                    {user?.first_name?.[0] || <span className="material-symbols-outlined">person</span>}
                </button>
            </div>
        </header>
    )
}

export default MobileHeader
