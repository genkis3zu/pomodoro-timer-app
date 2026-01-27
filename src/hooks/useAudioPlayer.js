import { useEffect, useRef } from 'react';

export const useAudioPlayer = ({ src, volume = 0.5, loop = false, enabled = false, fadeDuration = 2000 }) => {
    const audioRef = useRef(null);
    const fadeIntervalRef = useRef(null);

    // Cleanup function to stop any active fades
    const clearFadeInterval = () => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
    };

    useEffect(() => {
        if (!src) return;

        const audio = new Audio(src);
        audio.loop = loop;
        // Start at 0 if enabled (to fade in), otherwise set to volume (but it won't play)
        audio.volume = enabled ? 0 : volume;
        audioRef.current = audio;

        if (enabled) {
            audio.play().catch(e => console.error("Audio playback failed:", e));
            // Fade In
            clearFadeInterval();
            const stepTime = 50;
            const steps = fadeDuration / stepTime;
            const stepValue = volume / steps;

            fadeIntervalRef.current = setInterval(() => {
                if (audio.volume < volume) {
                    const newVolume = Math.min(audio.volume + stepValue, volume);
                    audio.volume = Math.min(newVolume, 1.0);
                } else {
                    clearFadeInterval();
                }
            }, stepTime);
        }

        return () => {
            clearFadeInterval();
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, [src, loop, enabled, fadeDuration, volume]);

    // Handle Volume Changes (only if not currently fading ideally, but for now direct update)
    useEffect(() => {
        if (audioRef.current && !fadeIntervalRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle Enabled/Disabled (Fade In/Out)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        clearFadeInterval();

        if (enabled) {
            // Fade In
            // If already playing, don't reset volume to 0? 
            // If we are resuming, we should fade in from current volume?
            // For simplicity, let's fade in from 0 if paused.
            if (audio.paused) {
                audio.volume = 0;
                audio.play().catch(e => console.error("Audio playback failed:", e));
            }

            const stepTime = 50;
            const steps = fadeDuration / stepTime;
            const stepValue = volume / steps;

            fadeIntervalRef.current = setInterval(() => {
                if (audio.volume < volume) {
                    const newVolume = Math.min(audio.volume + stepValue, volume);
                    audio.volume = Math.min(newVolume, 1.0);
                } else {
                    clearFadeInterval();
                }
            }, stepTime);

        } else {
            // Fade Out
            const stepTime = 50;
            const steps = fadeDuration / stepTime;
            const stepValue = audio.volume / steps; // Fade out from current volume

            fadeIntervalRef.current = setInterval(() => {
                if (audio.volume > 0) {
                    const newVolume = Math.max(audio.volume - stepValue, 0);
                    audio.volume = newVolume;
                } else {
                    audio.pause();
                    clearFadeInterval();
                }
            }, stepTime);
        }

        return () => clearFadeInterval();
    }, [enabled, fadeDuration, volume]);

    return audioRef;
};
