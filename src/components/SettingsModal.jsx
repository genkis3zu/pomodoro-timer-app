import React, { useState, useEffect } from 'react';
import { getPresets } from '../lib/audioPresets';

const SettingsModal = ({ onClose, audioSettings, onUpdateSettings }) => {
    const [activeTab, setActiveTab] = useState('work');
    const presets = getPresets();

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onUpdateSettings({
                ...audioSettings,
                [type]: {
                    ...audioSettings[type],
                    source: 'custom',
                    customUrl: url,
                    customName: file.name
                }
            });
        }
    };

    const handlePresetSelect = (preset, type) => {
        onUpdateSettings({
            ...audioSettings,
            [type]: {
                ...audioSettings[type],
                source: 'preset',
                presetId: preset.id
            }
        });
    };

    const handleVolumeChange = (val, type) => {
        onUpdateSettings({
            ...audioSettings,
            [type]: {
                ...audioSettings[type],
                volume: parseFloat(val)
            }
        });
    };

    const renderAudioSection = (type, label) => {
        const currentSettings = audioSettings[type];
        const categoryPresets = presets.filter(p => p.category === (type === 'alarm' ? 'alarm' : type));

        // If no presets for this category, show all or handle gracefully
        // For now, if 'work' or 'break' is empty, maybe show 'work' presets as fallback?
        // But we have specific folders.

        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">{label}</h3>

                    {/* Volume Control */}
                    <div className="mb-6 flex items-center gap-4">
                        <span className="text-sm text-gray-400 w-16">Volume</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={currentSettings.volume}
                            onChange={(e) => handleVolumeChange(e.target.value, type)}
                            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="text-sm text-gray-400 w-8 text-right">{Math.round(currentSettings.volume * 100)}%</span>
                    </div>

                    {/* Source Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <button
                            onClick={() => onUpdateSettings({ ...audioSettings, [type]: { ...currentSettings, source: 'preset' } })}
                            className={`p-3 rounded-xl border transition-all ${currentSettings.source === 'preset' ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                        >
                            Presets
                        </button>
                        <button
                            onClick={() => onUpdateSettings({ ...audioSettings, [type]: { ...currentSettings, source: 'custom' } })}
                            className={`p-3 rounded-xl border transition-all ${currentSettings.source === 'custom' ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                        >
                            Custom Upload
                        </button>
                    </div>

                    {/* Preset List */}
                    {currentSettings.source === 'preset' && (
                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                            {categoryPresets.length === 0 ? (
                                <div className="text-gray-500 text-sm italic p-4 text-center">No presets found in assets/audio/presets/{type}</div>
                            ) : (
                                categoryPresets.map(preset => (
                                    <button
                                        key={preset.id}
                                        onClick={() => handlePresetSelect(preset, type)}
                                        className={`p-3 rounded-lg text-left text-sm transition-all flex items-center justify-between ${currentSettings.presetId === preset.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                                    >
                                        <span>{preset.name}</span>
                                        {currentSettings.presetId === preset.id && (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* Custom Upload */}
                    {currentSettings.source === 'custom' && (
                        <div className="p-4 border border-dashed border-white/20 rounded-xl bg-white/5 text-center">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => handleFileChange(e, type)}
                                className="hidden"
                                id={`file-upload-${type}`}
                            />
                            <label htmlFor={`file-upload-${type}`} className="cursor-pointer block">
                                <div className="mb-2 text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-300">
                                    {currentSettings.customName || "Click to upload audio file"}
                                </span>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Audio Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('work')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'work' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Work Ambient
                    </button>
                    <button
                        onClick={() => setActiveTab('break')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'break' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Break Ambient
                    </button>
                    <button
                        onClick={() => setActiveTab('alarm')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'alarm' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Alarm Sound
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {activeTab === 'work' && renderAudioSection('work', 'Work Ambient Sound')}
                    {activeTab === 'break' && renderAudioSection('break', 'Break Ambient Sound')}
                    {activeTab === 'alarm' && renderAudioSection('alarm', 'Timer Complete Alarm')}
                </div>

                <div className="p-4 border-t border-white/10 bg-black/20 text-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
