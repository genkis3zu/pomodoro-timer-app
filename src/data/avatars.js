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
        }
    ],
    cyberware: [
        {
            id: 'cyber_visor_1',
            name: 'Optical Visor',
            src: '/avatars/avatar_visor.png',
            cost: 500,
            description: 'Enhanced optical overlay for data visualization.',
            effect: { type: 'xp_boost', value: 1.05 } // 5% XP boost
        }
    ],
    backgrounds: [
        {
            id: 'bg_default',
            name: 'Void',
            src: null,
            cost: 0,
            description: 'Empty void.'
        },
        {
            id: 'bg_matrix',
            name: 'Digital Rain',
            src: '/avatars/avatar_bg_matrix.png',
            cost: 200,
            description: 'Classic green digital rain backdrop.'
        }
    ]
};
