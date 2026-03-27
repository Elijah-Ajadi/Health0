import React from 'react'

/**
 * LoadingShimmer - Pulse placeholder for loading states
 */
const LoadingShimmer = ({ className = '', height = 'h-4', width = 'w-full', rounded = 'rounded-lg' }) => {
    return (
        <div className={`animate-pulse bg-surface-container-highest/50 ${height} ${width} ${rounded} ${className}`} />
    )
}

export default LoadingShimmer
