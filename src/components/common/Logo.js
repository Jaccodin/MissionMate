import React from 'react';

export default function Logo({ width = 'auto', height = 32, className = '' }) {
    // During development, use the local path
    const logoPath = process.env.NODE_ENV === 'production'
        ? '/MissionMate/images/mission-mate-logo.png'  // GitHub Pages path
        : '/images/mission-mate-logo.png';             // Local development path

    return (
        <img
            src={logoPath}
            alt="MissionMate"
            width={width}
            height={height}
            className={className}
            style={{ 
                objectFit: 'contain',
                verticalAlign: 'middle'
            }}
        />
    );
}
