import React from 'react'

/**
 * RegistrationShell - Unified wrapper for multi-stage registration flows.
 * @param {number} stage - Current stage (1-indexed)
 * @param {number} totalStages - Total number of stages
 * @param {string} title - Title of the current stage
 * @param {function} onBack - Back button handler
 * @param {React.ReactNode} children - Main content for the stage
 * @param {React.ReactNode} footer - Bottom action buttons (optional)
 * @param {React.ReactNode} desktopSidebar - Sidebar content for desktop (optional)
 */
const RegistrationShell = ({ 
    stage, 
    totalStages, 
    title, 
    onBack, 
    children, 
    footer,
    desktopSidebar 
}) => {
    const progress = (stage / totalStages) * 100

    return (
        <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col selection:bg-primary/10">
            {/* ─── MOBILE HEADER (lg:hidden) ─── */}
            <header className="lg:hidden bg-surface/85 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,64,161,0.04)] fixed top-0 w-full z-50 transition-all">
                <div className="flex items-center justify-between px-6 h-16">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onBack} 
                            disabled={stage === 1}
                            className={`p-2 -ml-2 rounded-full transition-transform active:scale-90 ${stage === 1 ? 'text-outline-variant opacity-30' : 'text-primary'}`}
                        >
                            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                        </button>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant leading-none mb-1">
                                Step {stage} of {totalStages}
                            </p>
                            <h1 className="font-headline font-bold text-base text-on-surface leading-tight">
                                {title}
                            </h1>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">medical_services</span>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="h-1 w-full bg-surface-container overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-500 ease-out rounded-r-full" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* ─── MAIN CONTENT ─── */}
            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Desktop Sidebar (Optional) */}
                {desktopSidebar && (
                    <aside className="hidden lg:flex flex-col w-80 fixed left-0 top-0 h-full bg-surface-container-lowest border-r border-outline-variant/20 shadow-subtle z-40">
                        {desktopSidebar}
                    </aside>
                )}

                <main className={`flex-1 flex flex-col transition-all duration-300 ${desktopSidebar ? 'lg:pl-80' : ''}`}>
                    {/* Page Content */}
                    <div className="pt-24 pb-32 px-6 lg:pt-16 lg:pb-16 lg:px-12 max-w-[1440px] mx-auto w-full">
                        {children}
                    </div>

                    {/* ─── MOBILE BOTTOM ACTIONS (lg:hidden) ─── */}
                    {footer && (
                        <footer className="lg:hidden fixed bottom-16 left-0 w-full z-40 px-6 py-4 bg-surface/85 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.04)] active:scale-100 transition-all">
                            <div className="max-w-md mx-auto">
                                {footer}
                            </div>
                        </footer>
                    )}
                </main>
            </div>
        </div>
    )
}

export default RegistrationShell
