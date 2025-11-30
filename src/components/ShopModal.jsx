import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CYBERWARE_CATALOG } from '../data/cyberware';

const ShopModal = ({ onClose }) => {
    const { credits, inventory, buyItem, equipItem, equippedItems } = useGame();
    const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'inventory'
    const [filter, setFilter] = useState('all'); // 'all', 'theme', 'audio', 'implant'

    const filteredItems = (activeTab === 'catalog' ? CYBERWARE_CATALOG : CYBERWARE_CATALOG.filter(i => inventory.includes(i.id)))
        .filter(item => filter === 'all' || item.type === filter);

    const handleBuy = async (item) => {
        const result = await buyItem(item.id);
        if (!result.success) {
            alert(result.message); // Simple alert for now, could be a toast
        }
    };

    const isEquipped = (item) => {
        if (item.type === 'theme') return equippedItems.theme === item.id;
        if (item.type === 'audio') return equippedItems.audio === item.id;
        if (item.type === 'implant') return equippedItems.implants.includes(item.id);
        return false;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl bg-slate-900 border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-widest text-blue-400 uppercase">Cyberware Shop</h2>
                        <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-300 font-mono text-sm">
                            CREDITS: {credits}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs & Filters */}
                <div className="p-4 border-b border-white/10 flex flex-wrap gap-4 justify-between items-center bg-white/5">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('catalog')}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'catalog' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            CATALOG
                        </button>
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'inventory' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            INVENTORY
                        </button>
                    </div>
                    <div className="flex gap-2">
                        {['all', 'theme', 'audio', 'implant'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded text-xs font-mono uppercase border transition-all ${filter === f ? 'border-blue-400 text-blue-300 bg-blue-400/10' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map(item => {
                        const owned = inventory.includes(item.id);
                        const equipped = isEquipped(item);

                        return (
                            <div key={item.id} className={`group relative p-4 rounded-xl border transition-all hover:border-blue-500/50 hover:bg-white/5 ${equipped ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">{item.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded border ${item.type === 'theme' ? 'border-purple-500/50 text-purple-300' :
                                            item.type === 'audio' ? 'border-cyan-500/50 text-cyan-300' :
                                                'border-orange-500/50 text-orange-300'
                                        }`}>
                                        {item.type.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4 h-10">{item.description}</p>

                                <div className="flex justify-between items-center mt-auto">
                                    <div className="font-mono text-yellow-400 text-sm">
                                        {owned ? 'OWNED' : `${item.cost} CR`}
                                    </div>

                                    {owned ? (
                                        <button
                                            onClick={() => equipItem(item.id, item.type)}
                                            className={`px-4 py-1.5 rounded text-sm font-bold transition-all ${equipped
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                                    : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            {equipped ? 'INSTALLED' : 'INSTALL'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleBuy(item)}
                                            disabled={credits < item.cost}
                                            className={`px-4 py-1.5 rounded text-sm font-bold transition-all ${credits >= item.cost
                                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            PURCHASE
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ShopModal;
