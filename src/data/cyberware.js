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
    }
];
