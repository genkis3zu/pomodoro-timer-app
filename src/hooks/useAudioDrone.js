import { useState, useEffect, useRef } from 'react';

export const useAudioDrone = (enabled = false) => {
    const audioContextRef = useRef(null);
    const oscillatorsRef = useRef([]);
    const gainNodeRef = useRef(null);

    useEffect(() => {
        if (enabled) {
            startDrone();
        } else {
            stopDrone();
        }

        return () => stopDrone();
    }, [enabled]);

    const startDrone = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        const ctx = audioContextRef.current;
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.1; // Low volume
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;

        // Create two oscillators for a thick drone sound
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.value = 55; // Low A
        osc1.connect(gainNode);

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 55.5; // Slightly detuned for beating effect
        osc2.connect(gainNode);

        osc1.start();
        osc2.start();

        oscillatorsRef.current = [osc1, osc2];
    };

    const stopDrone = () => {
        oscillatorsRef.current.forEach(osc => {
            try {
                osc.stop();
                osc.disconnect();
            } catch (e) {
                // Ignore errors if already stopped
            }
        });
        oscillatorsRef.current = [];

        if (gainNodeRef.current) {
            gainNodeRef.current.disconnect();
        }
    };

    return null;
};
