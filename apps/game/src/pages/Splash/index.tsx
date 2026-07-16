import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/menu'), 2600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      onClick={() => navigate('/menu')}
      className="flex h-screen w-screen cursor-pointer items-center justify-center bg-[var(--color-void)]"
    >
      <motion.h1
        initial={{ opacity: 0, letterSpacing: '0.4em' }}
        animate={{ opacity: 1, letterSpacing: '0.2em' }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-4xl uppercase text-[var(--color-ink)]"
      >
        DARKNES
      </motion.h1>
    </div>
  );
}
