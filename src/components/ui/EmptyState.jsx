import React from 'react'
import Button from './Button'

/**
 * EmptyState - High-fidelity zero-data placeholder
 */
const EmptyState = ({ 
    icon = 'folder_open', 
    title = 'No Records Found', 
    message = 'Your digital sanctuary is ready for new data.',
    actionLabel,
    onAction,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-6 text-center bg-surface-container-lowest/50 rounded-[2.5rem] border-2 border-dashed border-outline-variant/10 ${className}`}>
            <div className="w-20 h-20 rounded-3xl bg-surface-container flex items-center justify-center text-outline/30 mb-6 font-bold italic uppercase tracking-tighter">
                <span className="material-symbols-outlined text-5xl">{icon}</span>
            </div>
            <h3 className="text-xl font-headline font-black italic uppercase tracking-tighter text-on-surface mb-2">{title}</h3>
            <p className="text-sm font-medium text-on-surface-variant max-w-xs mx-auto mb-8 whitespace-pre-line">{message}</p>
            {actionLabel && (
                <Button variant="primary" onClick={onAction} icon="add">
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}

export default EmptyState
