import React from 'react'
import { motion } from 'framer-motion'

/**
 * Button - High-fidelity interactive primitive
 * @param {'primary' | 'surface' | 'outline' | 'ghost' | 'error'} variant
 * @param {'sm' | 'md' | 'lg'} size
 */
const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md',
    className = '', 
    icon: Icon,
    iconPosition = 'left',
    ...props 
}) => {
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none gap-2"
    
    const variants = {
        primary: "bg-primary text-on-primary shadow-lg shadow-primary/20 hover:bg-primary-container italic uppercase tracking-widest",
        surface: "bg-surface-container-low text-on-surface hover:bg-surface-container italic uppercase tracking-widest",
        outline: "bg-transparent border-2 border-outline/30 text-on-surface hover:border-primary/30",
        ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
        error: "bg-error text-white shadow-lg shadow-error/20 hover:opacity-90"
    }

    const sizes = {
        sm: "px-4 py-2 text-[10px] rounded-xl",
        md: "px-6 py-3.5 text-xs rounded-2xl",
        lg: "px-8 py-5 text-sm rounded-3xl"
    }

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {Icon && iconPosition === 'left' && (
                <span className="material-symbols-outlined text-[1.25em]">{Icon}</span>
            )}
            {children}
            {Icon && iconPosition === 'right' && (
                <span className="material-symbols-outlined text-[1.25em]">{Icon}</span>
            )}
        </motion.button>
    )
}

export default Button
