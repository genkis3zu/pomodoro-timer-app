import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CYBERWARE_CATALOG } from '../data/cyberware';
import { AVATAR_PARTS } from '../data/avatars';
import AvatarDisplay from './AvatarDisplay';

const ShopModal = ({ onClose }) => {
    const { credits, inventory, equippedItems, buyItem, equipItem, avatarConfig } = useGame();
    const [activeTab, setActiveTab] = useState('cyberware'); // 'cyberware' or 'avatar'
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Cyberware Filtering
    const cyberwareCategories = ['all', ...new Set(CYBERWARE_CATALOG.map(item => item.type))];
    const filteredCyberware = selectedCategory === 'all'
        ? CYBERWARE_CATALOG
        : CYBERWARE_CATALOG.filter(item => item.type === selectedCategory);

    // Avatar Filtering
    const avatarCategories = ['bases', 'cyberware', 'backgrounds'];
    const [avatarCategory, setAvatarCategory] = useState('bases');

    const getAvatarItems = () => {
        return AVATAR_PARTS[avatarCategory] || [];
    };

    const handleBuy = async (item) => {
        await buyItem(item.id);
    };

    const handleEquip = async (item) => {
        const type = activeTab === 'avatar'
            ? (avatarCategory === 'bases' ? 'base' : avatarCategory === 'backgrounds' ? 'background' : 'avatar_cyberware')
            : item.type;
        await equipItem(item.id, type);
    };

    const isOwned = (itemId) => inventory.includes(itemId) || (itemId.startsWith('base_') || itemId === 'bg_default'); // Bases are free/owned by default
    const isEquipped = (itemId) => {
        if (activeTab === 'avatar') {
            return avatarConfig.base === itemId ||
                avatarConfig.background === itemId ||
                avatarConfig.cyberware.includes(itemId);
        }
        return equippedItems.theme === itemId ||
            equippedItems.audio === itemId ||
            equippedItems.implants.includes(itemId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl bg-slate-900 border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase">
                            Black Market
                        </h2>
                        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400 font-mono font-bold">
                            {credits} CR
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('cyberware')}
                        className={`flex-1 py-4 text-center font-bold uppercase tracking-wider transition-all ${activeTab === 'cyberware' ? 'bg-blue-500/20 text-blue-300 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        Cyberware & Themes
                    </button>
                    <button
                        onClick={() => setActiveTab('avatar')}
                        className={`flex-1 py-4 text-center font-bold uppercase tracking-wider transition-all ${activeTab === 'avatar' ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        Avatar Customization
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Sidebar / Preview */}
                    <div className="w-1/3 border-r border-white/10 p-6 bg-slate-900/30 flex flex-col gap-6">
                        {activeTab === 'avatar' ? (
                            <div className="flex flex-col items-center">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Current Avatar</h3>
                                <AvatarDisplay config={avatarConfig} size="xl" className="shadow-2xl shadow-blue-500/20" />
                                <div className="mt-6 w-full space-y-2">
                                    <div className="text-xs text-gray-500 uppercase">Categories</div>
                                    {avatarCategories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setAvatarCategory(cat)}
                                            className={`w-full text-left px-4 py-2 rounded transition-all ${avatarCategory === cat ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5'}`}
                                        >
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="text-xs text-gray-500 uppercase mb-2">Filter</div>
                                {cyberwareCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left px-4 py-2 rounded transition-all ${selectedCategory === cat ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-400 hover:bg-white/5'}`}
                                    >
                                        {cat === 'all' ? 'All Items' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Items Grid */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(activeTab === 'avatar' ? getAvatarItems() : filteredCyberware).map(item => {
                                const owned = isOwned(item.id);
                                const equipped = isEquipped(item.id);
                                const canAfford = credits >= item.cost;

                                return (
                                    <div key={item.id} className={`relative group bg-slate-800/50 border ${equipped ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'border-white/10'} rounded-xl p-4 transition-all hover:bg-slate-800 hover:border-white/30`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-white group-hover:text-blue-300 transition-colors">{item.name}</h4>
                                            {item.cost > 0 && <span className="text-xs font-mono text-yellow-400">{item.cost} CR</span>}
                                        </div>
                                        <p className="text-xs text-gray-400 mb-4 h-8 line-clamp-2">{item.description}</p>

                                        {/* Preview Image if available */}
                                        {item.src && (
                                            <div className="mb-4 h-24 w-full bg-black/20 rounded-lg overflow-hidden flex items-center justify-center">
                                                <img src={item.src} alt={item.name} className="h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        )}

                                        <div className="flex gap-2 mt-auto">
                                            {owned ? (
                                                <button
                                                    onClick={() => handleEquip(item)}
                                                    disabled={equipped}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${equipped
                                                            ? 'bg-green-500/20 text-green-400 cursor-default'
                                                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                        }`}
                                                >
                                                    {equipped ? 'Equipped' : 'Equip'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBuy(item)}
                                                    disabled={!canAfford}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${canAfford
                                                            ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                                                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Purchase
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopModal;
