import { motion } from 'framer-motion';
import { BackgroundEngine } from '@darknes/engine';

export interface BackgroundProps {
  backgroundId: string | null;
}

export function Background({ backgroundId }: BackgroundProps) {
  const url = BackgroundEngine.getBackgroundUrl(backgroundId);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--color-void)]">
      {url && (
        <motion.img
          key={backgroundId}
          src={url}
          alt=""
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full object-cover"
        />
      )}
      {/* Vignette + bottom scrim so dialogue text always stays legible */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
    </div>
  );
}
