import { useState, useEffect, useRef } from 'react';

export const useAudioPlayer = ({ src, volume = 0.5, loop = false, enabled = false }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (!src) return;

        const audio = new Audio(src);
        audio.loop = loop;
        audio.volume = volume;
        audioRef.current = audio;

        if (enabled) {
            audio.play().catch(e => console.error("Audio playback failed:", e));
        }

        return () => {
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, [src, loop]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (audioRef.current) {
            if (enabled) {
                audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [enabled]);

    return audioRef;
};
