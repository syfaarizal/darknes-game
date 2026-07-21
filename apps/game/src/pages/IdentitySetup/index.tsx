import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IdentityLayout } from './IdentityLayout';
import { PlayerNameInput } from './PlayerNameInput';
import { PrimaryButton } from '@darknes/ui';
import { SaveEngine, useGameStore } from '@darknes/engine';
import { HeadsetReminder } from './HeadsetReminder';

const CINEMATIC_SENTENCES = [
  '...',
  'Sebelum kisah ini dimulai...',
  'Ada satu hal yang perlu kuketahui.',
  'Siapa namamu?',
] as const;

function useInputValidation(value: string) {
  const trimmed = value.trim();

  const isEmpty = trimmed.length === 0;
  const isTooShort = trimmed.length < 2;
  const isOnlySpaces = /^\s+$/.test(value);
  const isValid = !isEmpty && !isTooShort && !isOnlySpaces && trimmed.length <= 20;

  return { isValid, trimmed };
}

function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function IdentitySetup() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [isReady, setIsReady] = useState(false); // input visible
  const [isWelcome, setIsWelcome] = useState(false); // welcome screen
  const [isHeadset, setIsHeadset] = useState(false); // headset reminder
  const [currentSentence, setCurrentSentence] = useState(0);

  const { isValid, trimmed } = useInputValidation(name);

  // Auto-capitalize first letter on change
  const handleNameChange = useCallback((value: string) => {
    setName(capitalizeFirst(value));
  }, []);

  // Cinematic sentence reveal
  useEffect(() => {
    if (currentSentence >= CINEMATIC_SENTENCES.length) {
      // All sentences shown — show input immediately.
      setIsReady(true);
      window.setTimeout(() => inputRef.current?.focus(), 300);
      return;
    }

    const delay = currentSentence === 0 ? 1200 : 2200;
    const timer = window.setTimeout(() => {
      setCurrentSentence((prev) => prev + 1);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [currentSentence]);

  const handleCinematicClick = useCallback(() => {
    if (isReady) return;

    setCurrentSentence((prev) =>
      Math.min(prev + 1, CINEMATIC_SENTENCES.length),
    );
  }, [isReady]);

  const handleContinue = useCallback(async () => {
    if (!isValid) return;

    const finalName = trimmed;

    // Create new game state
    useGameStore.getState().createNewGame(finalName);

    // Save initial data
    SaveEngine.saveAuto();

    // Show welcome screen
    setIsWelcome(true);

    // Wait, then show headset reminder
    await new Promise((resolve) => setTimeout(resolve, 2200));
    setIsHeadset(true);
  }, [isValid, trimmed]);

  return (
    <IdentityLayout onClick={handleCinematicClick}>
      <AnimatePresence mode="wait">
        {isHeadset ? (
          <HeadsetReminder
            key="headset"
            onSkip={() => navigate('/intro')}
          />
        ) : isWelcome ? (
          // Welcome back screen
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mb-2 font-display text-lg uppercase tracking-[0.2em] text-[var(--color-ink-muted)]"
            >
              Selamat datang kembali,
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="font-display text-4xl uppercase tracking-[0.08em] text-[var(--color-ink)]"
            >
              {trimmed}
            </motion.p>
          </motion.div>
        ) : (
          // Identity setup screen
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex w-full flex-col items-center"
          >
            {/* Cinematic sentences */}
            <div className="mb-12 min-h-[5rem] w-full text-center">
              {CINEMATIC_SENTENCES.map((sentence, index) => {
                const isVisible = index < currentSentence;
                const isCurrent = index === currentSentence - 1;

                return (
                  <AnimatePresence key={sentence}>
                    {isVisible && (
                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.7,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={`
                          font-body leading-relaxed
                          ${sentence === '...' ? 'text-[var(--color-ink-faint)] text-2xl' : 'text-[var(--color-ink)] text-base'}
                          ${isCurrent ? 'mt-4' : 'mt-2'}
                        `}
                      >
                        {sentence}
                      </motion.p>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>

            {/* Input section — fades in after sentences */}
            <AnimatePresence>
              {isReady && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex w-full flex-col items-center"
                >
                  <div className="mb-6 w-full">
                    <PlayerNameInput
                      ref={inputRef}
                      value={name}
                      onChange={handleNameChange}
                      onEnter={isValid ? handleContinue : undefined}
                    />
                  </div>

                  <PrimaryButton
                    onClick={handleContinue}
                    disabled={!isValid}
                    className="w-full"
                  >
                    Lanjutkan
                  </PrimaryButton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </IdentityLayout>
  );
}
