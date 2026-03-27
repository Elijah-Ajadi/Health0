import React from 'react'
import { motion } from 'framer-motion'

/**
 * Card - Bento-style container primitive
 */
const Card = ({ 
    children, 
    title, 
    subtitle, 
    icon, 
    onClick, 
    className = '',
    variant = 'default' 
}) => {
    const variants = {
        default: "bg-surface-container-lowest border border-outline shadow-subtle",
        glass: "bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl",
        dark: "bg-on-surface text-surface border border-white/5 shadow-2xl"
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={onClick ? { y: -4, shadow: '0 20px 40px rgba(0,0,0,0.05)' } : {}}
            onClick={onClick}
            className={`p-6 rounded-[2rem] transition-all duration-300 ${variants[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {(title || icon) && (
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        {icon && (
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${variant === 'dark' ? 'bg-white/10 text-white' : 'bg-primary/5 text-primary'}`}>
                                <span className="material-symbols-outlined text-2xl">{icon}</span>
                            </div>
                        )}
                        <div>
                            {title && <h3 className="text-lg font-headline font-black italic uppercase tracking-tighter leading-tight">{title}</h3>}
                            {subtitle && <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">{subtitle}</p>}
                        </div>
                    </div>
                </div>
            )}
            {children}
        </motion.div>
    )
}

export default Card
