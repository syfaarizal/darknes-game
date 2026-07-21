import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@darknes/engine';

export interface MenuItem {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
}

export function Menu({ items }: MenuProps) {
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<number>(0);
  const sfxVolume = useSettingsStore((s) => s.audio.sfx * s.audio.master);

  /* Initialize hover sound */
  useEffect(() => {
    hoverSoundRef.current = new Audio('/assets/audio/sfx/button-hover-sfx.mp3');
    hoverSoundRef.current.volume = sfxVolume;
    hoverSoundRef.current.preload = 'auto';

    return () => {
      if (hoverSoundRef.current) {
        hoverSoundRef.current.pause();
        hoverSoundRef.current = null;
      }
    };
  }, []);

  /* Update volume when settings change */
  useEffect(() => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.volume = sfxVolume;
    }
  }, [sfxVolume]);

  /* Play hover sound with debounce to prevent rapid re-playing */
  const handleHover = useCallback(() => {
    const now = Date.now();
    if (now - lastPlayedRef.current < 150) return; // 150ms debounce
    if (sfxVolume <= 0) return;

    lastPlayedRef.current = now;
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, [sfxVolume]);

  return (
    <nav className="flex w-full flex-col items-center gap-3">
      {items.map((item) => {
        const isPrimary = item.variant === 'primary';

        return (
          <motion.button
            key={item.label}
            onClick={item.onClick}
            disabled={item.disabled}
            whileHover="hover"
            whileTap="tap"
            initial="rest"
            onMouseEnter={handleHover}
            className="group relative disabled:cursor-not-allowed disabled:opacity-30"
          >
            {/* Ornate button frame */}
            <div className="relative px-10 py-3.5 overflow-hidden">
              {/* Corner decorations - top left */}
              <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8B1A1A] opacity-60 group-hover:opacity-100 group-hover:border-[#DC143C] transition-all duration-300" />
              {/* Corner decorations - top right */}
              <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8B1A1A] opacity-60 group-hover:opacity-100 group-hover:border-[#DC143C] transition-all duration-300" />
              {/* Corner decorations - bottom left */}
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#8B1A1A] opacity-60 group-hover:opacity-100 group-hover:border-[#DC143C] transition-all duration-300" />
              {/* Corner decorations - bottom right */}
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8B1A1A] opacity-60 group-hover:opacity-100 group-hover:border-[#DC143C] transition-all duration-300" />

              {/* Background fill */}
              <motion.div
                variants={{
                  rest:  { opacity: 0.85 },
                  hover: { opacity: 1 },
                }}
                className="absolute inset-0 bg-[rgba(15,5,5,0.95)]"
              />

              {/* Inner border glow on hover */}
              <motion.div
                variants={{
                  rest:  { opacity: 0 },
                  hover: { opacity: 1 },
                }}
                className="absolute inset-[3px] border border-[#DC143C]/30 pointer-events-none"
              />

              {/* Label */}
              <motion.span
                variants={{
                  rest:  { x: 0,    color: '#A05252', letterSpacing: '0.25em' },
                  hover: { x: 0,    color: '#DC143C', letterSpacing: '0.35em' },
                  tap:   { x: 0,    color: '#FF4444' },
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-base uppercase font-medium"
                style={{ fontFamily: '"Cinzel", serif' }}
              >
                {item.label}
              </motion.span>

              {/* Decorative line under text */}
              <motion.div
                variants={{
                  rest:  { scaleX: 0, opacity: 0 },
                  hover: { scaleX: 1, opacity: 1 },
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 h-px w-16 bg-gradient-to-r from-transparent via-[#DC143C] to-transparent"
              />
            </div>

            {/* Outer glow effect on hover */}
            <motion.div
              variants={{
                rest:  { opacity: 0, scale: 1 },
                hover: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 -z-10 bg-[#DC143C]/10 blur-xl rounded-sm pointer-events-none"
            />
          </motion.button>
        );
      })}
    </nav>
  );
}
