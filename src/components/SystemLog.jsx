import React, { useEffect, useRef } from 'react';

const SystemLog = ({ logs }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="h-full flex flex-col font-mono text-xs">
            <div className="flex-none px-4 py-2 border-b border-white/10 bg-black/20 flex justify-between items-center">
                <span className="text-emerald-400 font-bold tracking-wider">SYSTEM_LOGS</span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150"></div>
                </div>
            </div>
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
                {logs.length === 0 && (
                    <div className="text-gray-600 italic text-center mt-10">
                        // NO ACTIVITY DETECTED //
                    </div>
                )}
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-gray-500 shrink-0">
                            [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                        </span>
                        <span className={`
                            ${log.type === 'ERROR' ? 'text-red-400 font-bold' : ''}
                            ${log.type === 'WARNING' ? 'text-yellow-400' : ''}
                            ${log.type === 'SUCCESS' ? 'text-emerald-400 font-bold' : ''}
                            ${log.type === 'INFO' ? 'text-blue-300' : ''}
                        `}>
                            {log.message}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SystemLog;
