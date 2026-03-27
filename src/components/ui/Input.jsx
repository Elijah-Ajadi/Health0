import React from 'react'

/**
 * Input - Standardized form primitive
 */
const Input = ({ 
    label, 
    icon, 
    error, 
    className = '', 
    ...props 
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/40 group-focus-within:text-primary transition-colors">
                        {icon}
                    </span>
                )}
                <input 
                    className={`w-full bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl ${icon ? 'pl-16' : 'px-6'} py-4 focus:shadow-lg focus:shadow-primary/5 transition-all outline-none font-bold text-on-surface placeholder:text-on-surface-variant/40 placeholder:font-medium`}
                    {...props} 
                />
            </div>
            {error && <p className="text-[10px] font-bold text-error uppercase tracking-widest ml-1">{error}</p>}
        </div>
    )
}

export default Input
