import React from 'react';
import { AVATAR_PARTS } from '../data/avatars';

const AvatarDisplay = ({ config, size = 'md', className = '' }) => {
    const { base, cyberware, background } = config;

    const basePart = AVATAR_PARTS.bases.find(p => p.id === base);
    const bgPart = AVATAR_PARTS.backgrounds.find(p => p.id === background);
    const cyberwareParts = cyberware.map(id =>
        AVATAR_PARTS.cyberware.find(p => p.id === id)
    ).filter(Boolean);

    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-24 h-24',
        lg: 'w-48 h-48',
        xl: 'w-64 h-64'
    };

    return (
        <div className={`relative rounded-full overflow-hidden border-2 border-blue-500/30 bg-slate-900 ${sizeClasses[size]} ${className}`}>
            {/* Background Layer */}
            {bgPart && bgPart.src && (
                <img
                    src={bgPart.src}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
            )}

            {/* Base Layer */}
            {basePart && (
                <img
                    src={basePart.src}
                    alt="Avatar Base"
                    className="absolute inset-0 w-full h-full object-cover z-10"
                />
            )}

            {/* Cyberware Layer */}
            {cyberwareParts.map(part => (
                <img
                    key={part.id}
                    src={part.src}
                    alt={part.name}
                    className="absolute inset-0 w-full h-full object-cover z-20 mix-blend-screen"
                />
            ))}

            {/* Scanline Overlay */}
            <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-20 pointer-events-none z-30 mix-blend-overlay"></div>

            {/* Glitch Effect (Optional, CSS based) */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent z-40 pointer-events-none"></div>
        </div>
    );
};

export default AvatarDisplay;
