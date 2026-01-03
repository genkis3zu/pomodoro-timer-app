export const CYBERWARE_CATALOG = [
    // Themes
    {
        id: 'theme_default',
        name: 'Standard Issue',
        type: 'theme',
        cost: 0,
        description: 'Factory default interface.',
        effect: { type: 'visual_theme', value: 'default' }
    },
    {
        id: 'theme_matrix',
        name: 'Construct Matrix',
        type: 'theme',
        cost: 500,
        description: 'Green digital rain aesthetic.',
        effect: { type: 'visual_theme', value: 'matrix' }
    },
    {
        id: 'theme_cyber_pink',
        name: 'Neon Samurai',
        type: 'theme',
        cost: 800,
        description: 'Aggressive pink and blue contrast.',
        effect: { type: 'visual_theme', value: 'neon_samurai' }
    },
    {
        id: 'theme_golden_age',
        name: 'Corporate Gold',
        type: 'theme',
        cost: 1200,
        description: 'Luxurious gold and black finish.',
        effect: { type: 'visual_theme', value: 'gold' }
    },
    {
        id: 'theme_ice_blue',
        name: 'Arctic ICE',
        type: 'theme',
        cost: 1500,
        description: 'Cool blue and white tones.',
        effect: { type: 'visual_theme', value: 'default' } // Reuse default for now, need App.jsx update
    },
    {
        id: 'theme_crimson',
        name: 'Red Alert',
        type: 'theme',
        cost: 1800,
        description: 'Emergency red warning theme.',
        effect: { type: 'visual_theme', value: 'default' } // Reuse default for now
    },
    {
        id: 'theme_midnight',
        name: 'Midnight Black',
        type: 'theme',
        cost: 2000,
        description: 'Stealth mode dark theme.',
        effect: { type: 'visual_theme', value: 'default' } // Reuse default for now
    },
    {
        id: 'theme_royal',
        name: 'Royal Purple',
        type: 'theme',
        cost: 2500,
        description: 'Regal purple styling.',
        effect: { type: 'visual_theme', value: 'default' } // Reuse default for now
    },
    {
        id: 'theme_terminal',
        name: 'Retro Terminal',
        type: 'theme',
        cost: 3000,
        description: 'Amber monochrome output.',
        effect: { type: 'visual_theme', value: 'default' } // Reuse default for now
    },
    {
        id: 'theme_rainbow',
        name: 'RGB Gaming',
        type: 'theme',
        cost: 5000,
        description: 'For the true gamer.',
        effect: { type: 'visual_theme', value: 'default' } // Reuse default for now
    },

    // Audio
    {
        id: 'audio_lofi_synth',
        name: 'Lo-Fi Synth Pack',
        type: 'audio',
        cost: 300,
        description: 'Relaxing synthwave beats for focus.',
        effect: { type: 'audio_pack', value: 'lofi_synth' }
    },
    {
        id: 'audio_binaural',
        name: 'Neural Sync (Binaural)',
        type: 'audio',
        cost: 600,
        description: '40Hz binaural beats for deep focus.',
        effect: { type: 'audio_pack', value: 'binaural' }
    },
    {
        id: 'audio_rain',
        name: 'Heavy Rain',
        type: 'audio',
        cost: 400,
        description: 'Continuous downpour ambience.',
        effect: { type: 'audio_pack', value: 'rain' }
    },
    {
        id: 'audio_cafe',
        name: 'Midnight Cafe',
        type: 'audio',
        cost: 500,
        description: 'Background chatter and coffee machines.',
        effect: { type: 'audio_pack', value: 'cafe' }
    },
    {
        id: 'audio_ocean',
        name: 'Ocean Waves',
        type: 'audio',
        cost: 450,
        description: 'Calming shore sounds.',
        effect: { type: 'audio_pack', value: 'ocean' }
    },
    {
        id: 'audio_white',
        name: 'White Noise',
        type: 'audio',
        cost: 200,
        description: 'Pure static focus.',
        effect: { type: 'audio_pack', value: 'white_noise' }
    },
    {
        id: 'audio_jungle',
        name: 'Neon Jungle',
        type: 'audio',
        cost: 700,
        description: 'Exotic bio-dome sounds.',
        effect: { type: 'audio_pack', value: 'jungle' }
    },
    {
        id: 'audio_storm',
        name: 'Thunderstorm',
        type: 'audio',
        cost: 550,
        description: 'Distant rolling thunder.',
        effect: { type: 'audio_pack', value: 'storm' }
    },
    {
        id: 'audio_keyboard',
        name: 'Mech Keyboard',
        type: 'audio',
        cost: 350,
        description: 'ASMR clicking sounds.',
        effect: { type: 'audio_pack', value: 'keyboard' }
    },
    {
        id: 'audio_fan',
        name: 'Server Fan',
        type: 'audio',
        cost: 150,
        description: 'White noise drone of cooling fans.',
        effect: { type: 'audio_pack', value: 'fan' }
    },

    // Implants (Passive Bonuses)
    {
        id: 'implant_xp_1',
        name: 'Synaptic Accelerator Mk.I',
        type: 'implant',
        cost: 1000,
        description: '+10% XP gain per session.',
        effect: { type: 'xp_multiplier', value: 1.1 }
    },
    {
        id: 'implant_xp_2',
        name: 'Synaptic Accelerator Mk.II',
        type: 'implant',
        cost: 2500,
        description: '+25% XP gain per session.',
        effect: { type: 'xp_multiplier', value: 1.25 }
    },
    {
        id: 'implant_efficiency',
        name: 'Cortex Optimizer',
        type: 'implant',
        cost: 5000,
        description: 'Start sessions with 5 minutes Overdrive credit.',
        effect: { type: 'overdrive_credit', value: 5 }
    },
    {
        id: 'implant_luck',
        name: 'Probability Engine',
        type: 'implant',
        cost: 7777,
        description: 'Increases random drop rates (Future feature).',
        effect: { type: 'xp_multiplier', value: 1.07 }
    },
    {
        id: 'implant_regen',
        name: 'Nanobot Repair',
        type: 'implant',
        cost: 4000,
        description: 'Mental fatigue recovery +5%.',
        effect: { type: 'xp_multiplier', value: 1.05 }
    },
    {
        id: 'implant_storage',
        name: 'Expanded Memory',
        type: 'implant',
        cost: 3000,
        description: 'Allows more logs to be stored.',
        effect: { type: 'xp_multiplier', value: 1.0 }
    },
    {
        id: 'implant_cpu',
        name: 'Overclocked CPU',
        type: 'implant',
        cost: 6000,
        description: 'Faster processing speed.',
        effect: { type: 'xp_multiplier', value: 1.15 }
    },
    {
        id: 'implant_shield',
        name: 'Firewall Plating',
        type: 'implant',
        cost: 4500,
        description: 'Defense against distractors.',
        effect: { type: 'xp_multiplier', value: 1.0 }
    },
    {
        id: 'implant_cooling',
        name: 'Liquid Cooling',
        type: 'implant',
        cost: 2000,
        description: 'Keeps you cool properly.',
        effect: { type: 'xp_multiplier', value: 1.02 }
    },
    {
        id: 'implant_boss',
        name: 'CEO Mindset',
        type: 'implant',
        cost: 10000,
        description: 'Ultimate productivity module.',
        effect: { type: 'xp_multiplier', value: 1.50 }
    }
];
