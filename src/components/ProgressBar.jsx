import React from 'react';

const ProgressBar = ({ progress, size = 300, strokeWidth = 15, mode, children }) => {
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    const strokeColor = mode === 'work' ? 'text-blue-400' : 'text-emerald-400';
    const glowColor = mode === 'work' ? 'drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]' : 'drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]';

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg
                className="transform -rotate-90 w-full h-full"
                width={size}
                height={size}
            >
                {/* Background Circle */}
                <circle
                    className="text-white/10"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={center}
                    cy={center}
                />
                {/* Progress Circle */}
                <circle
                    className={`${strokeColor} ${glowColor} transition-all duration-1000 ease-out`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={center}
                    cy={center}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default ProgressBar;
