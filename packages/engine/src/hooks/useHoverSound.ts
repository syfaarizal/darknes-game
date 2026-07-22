import { useCallback, useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';

const HOVER_SFX_PATH = '/assets/audio/sfx/button-hover-sfx.mp3';

interface UseHoverSoundOptions {
  /** Minimum ms between consecutive plays to prevent rapid-fire */
  debounceMs?: number;
}

export function useHoverSound(options: UseHoverSoundOptions = {}) {
  const { debounceMs = 150 } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<number>(0);

  const sfxVolume = useSettingsStore((s) => s.audio.sfx * s.audio.master);

  /* Initialize audio element once */
  useEffect(() => {
    audioRef.current = new Audio(HOVER_SFX_PATH);
    audioRef.current.volume = sfxVolume;
    audioRef.current.preload = 'auto';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  /* Sync volume with settings */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = sfxVolume;
    }
  }, [sfxVolume]);

  const playHover = useCallback(() => {
    if (sfxVolume <= 0) return;
    const now = Date.now();
    if (now - lastPlayedRef.current < debounceMs) return;

    lastPlayedRef.current = now;
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore autoplay errors
    });
  }, [sfxVolume, debounceMs]);

  return { playHover };
}
