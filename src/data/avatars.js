export const AVATAR_PARTS = {
    bases: [
        {
            id: 'base_male_1',
            name: 'Runner (M)',
            src: '/avatars/avatar_base_male.png',
            cost: 0,
            description: 'Standard issue male netrunner interface.'
        },
        {
            id: 'base_female_1',
            name: 'Runner (F)',
            src: '/avatars/avatar_base_female.png',
            cost: 0,
            description: 'Standard issue female netrunner interface.'
        },
        {
            id: 'base_male_2',
            name: 'Operative (M)',
            src: '/avatars/avatar_base_male.png',
            cost: 500,
            description: 'Advanced field operative chassis. (Visual: Standard)'
        },
        {
            id: 'base_female_2',
            name: 'Operative (F)',
            src: '/avatars/avatar_base_female.png',
            cost: 500,
            description: 'Advanced field operative chassis. (Visual: Standard)'
        },
        {
            id: 'base_android_m',
            name: 'Synth-Droid (M)',
            src: '/avatars/avatar_base_male.png',
            cost: 1000,
            description: 'Full synthetic body replacement. (Visual: Standard)'
        },
        {
            id: 'base_android_f',
            name: 'Synth-Droid (F)',
            src: '/avatars/avatar_base_female.png',
            cost: 1000,
            description: 'Full synthetic body replacement. (Visual: Standard)'
        },
        {
            id: 'base_hacker_m',
            name: 'Elite Hacker (M)',
            src: '/avatars/avatar_base_male.png',
            cost: 2000,
            description: 'Optimized for deep dive operations. (Visual: Standard)'
        },
        {
            id: 'base_hacker_f',
            name: 'Elite Hacker (F)',
            src: '/avatars/avatar_base_female.png',
            cost: 2000,
            description: 'Optimized for deep dive operations. (Visual: Standard)'
        },
        {
            id: 'base_corpo_m',
            name: 'Executive (M)',
            src: '/avatars/avatar_base_male.png',
            cost: 5000,
            description: 'High-end corporate shell. (Visual: Standard)'
        },
        {
            id: 'base_corpo_f',
            name: 'Executive (F)',
            src: '/avatars/avatar_base_female.png',
            cost: 5000,
            description: 'High-end corporate shell. (Visual: Standard)'
        }
    ],
    cyberware: [
        {
            id: 'cyber_visor_1',
            name: 'Optical Visor Mk.I',
            src: '/avatars/avatar_visor.png',
            cost: 500,
            description: 'Enhanced optical overlay for data visualization.',
            effect: { type: 'xp_boost', value: 1.05 }
        },
        {
            id: 'cyber_visor_2',
            name: 'Optical Visor Mk.II',
            src: '/avatars/avatar_visor.png',
            cost: 1500,
            description: 'Advanced targeting algorithms included. (Visual: Standard)',
            effect: { type: 'xp_boost', value: 1.10 }
        },
        {
            id: 'cyber_visor_3',
            name: 'Night Operations Visor',
            src: '/avatars/avatar_visor.png',
            cost: 2500,
            description: 'Low-light amplification. (Visual: Standard)',
            effect: { type: 'xp_boost', value: 1.15 }
        },
        {
            id: 'cyber_visor_4',
            name: 'Netrunning Visor',
            src: '/avatars/avatar_visor.png',
            cost: 4000,
            description: 'Direct neural interface link. (Visual: Standard)',
            effect: { type: 'xp_boost', value: 1.20 }
        },
        // Placeholder items reusing visor for now as we don't have other art
        {
            id: 'cyber_audio_1',
            name: 'Auditory Implant',
            src: '/avatars/avatar_visor.png',
            cost: 1000,
            description: 'Enhanced hearing range. (Visual: Visor Placeholder)',
            effect: { type: 'focus_boost', value: 1.05 }
        },
        {
            id: 'cyber_mask_1',
            name: 'Filter Mask',
            src: '/avatars/avatar_visor.png',
            cost: 800,
            description: 'Toxic fume filtration. (Visual: Visor Placeholder)',
        },
        {
            id: 'cyber_jack_1',
            name: 'Data Jack',
            src: '/avatars/avatar_visor.png',
            cost: 1200,
            description: 'Generic input/output port. (Visual: Visor Placeholder)',
        },
        {
            id: 'cyber_chip_1',
            name: 'Reflex Chip',
            src: '/avatars/avatar_visor.png',
            cost: 2000,
            description: 'Boosts reaction times. (Visual: Visor Placeholder)',
        },
        {
            id: 'cyber_optics_red',
            name: 'Kiroshi Optics',
            src: '/avatars/avatar_visor.png',
            cost: 5000,
            description: 'Top of the line. (Visual: Visor Placeholder)',
            effect: { type: 'xp_boost', value: 1.25 }
        },
        {
            id: 'cyber_processor',
            name: 'Sandevistan Link',
            src: '/avatars/avatar_visor.png',
            cost: 8000,
            description: 'Overclocked visual processing. (Visual: Visor Placeholder)',
        }
    ],
    backgrounds: [
        {
            id: 'bg_default',
            name: 'Void',
            src: null,
            css: 'linear-gradient(to bottom, #000000, #1a1a1a)',
            cost: 0,
            description: 'Empty void.'
        },
        {
            id: 'bg_matrix',
            name: 'Digital Rain',
            src: '/avatars/avatar_bg_matrix.png',
            css: null,
            cost: 200,
            description: 'Classic green digital rain backdrop.'
        },
        {
            id: 'bg_sunset',
            name: 'Neon Sunset',
            src: null,
            css: 'linear-gradient(to bottom, #2b1055, #7597de)',
            cost: 500,
            description: 'A calming vaporwave gradient.'
        },
        {
            id: 'bg_blood',
            name: 'Red Alert',
            src: null,
            css: 'linear-gradient(to top, #500000, #000000)',
            cost: 600,
            description: 'Crimson gradient for dangerous missions.'
        },
        {
            id: 'bg_ocean',
            name: 'Deep Dive',
            src: null,
            css: 'linear-gradient(to bottom, #001f3f, #0074D9)',
            cost: 700,
            description: 'Submerged data streams.'
        },
        {
            id: 'bg_forest',
            name: 'Synth-Forest',
            src: null,
            css: 'linear-gradient(to bottom, #134e5e, #71b280)',
            cost: 800,
            description: 'Organic data structures.'
        },
        {
            id: 'bg_gold',
            name: 'Corporate High-Rise',
            src: null,
            css: 'linear-gradient(45deg, #FFD700, #DAA520, #000000)',
            cost: 2000,
            description: 'The view from the top.'
        },
        {
            id: 'bg_cyber',
            name: 'Cyber Space',
            src: null,
            css: 'repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)',
            cost: 1500,
            description: 'Raw data stream visualization.'
        },
        {
            id: 'bg_toxic',
            name: 'Toxic Waste',
            src: null,
            css: 'radial-gradient(circle, #ccff00, #000000)',
            cost: 1200,
            description: 'Hazardous sector.'
        },
        {
            id: 'bg_royal',
            name: 'Royal Guard',
            src: null,
            css: 'linear-gradient(to right, #4b6cb7, #182848)',
            cost: 1800,
            description: 'Elite security forces background.'
        },
        {
            id: 'bg_rainbow',
            name: 'Overdrive',
            src: null,
            css: 'linear-gradient(135deg, #fce abb, #f8b500)',
            cost: 3000,
            description: 'Maximum power output.'
        }
    ]
};
