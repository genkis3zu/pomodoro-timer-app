// Auto-import all audio files from the presets directories
const workPresets = import.meta.glob('../assets/audio/presets/work/*.{mp3,wav,ogg}', { eager: true, as: 'url' });
const breakPresets = import.meta.glob('../assets/audio/presets/break/*.{mp3,wav,ogg}', { eager: true, as: 'url' });
const alarmPresets = import.meta.glob('../assets/audio/presets/alarm/*.{mp3,wav,ogg}', { eager: true, as: 'url' });

const formatPresets = (presets, category) => {
    return Object.entries(presets).map(([path, url]) => {
        const name = path.split('/').pop().replace(/\.(mp3|wav|ogg)$/, '').replace(/[-_]/g, ' ');
        return {
            id: path,
            name,
            url,
            category
        };
    });
};

export const getPresets = () => {
    return [
        ...formatPresets(workPresets, 'work'),
        ...formatPresets(breakPresets, 'break'),
        ...formatPresets(alarmPresets, 'alarm')
    ];
};
