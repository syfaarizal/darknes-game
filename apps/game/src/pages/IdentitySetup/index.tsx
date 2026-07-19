import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IdentityLayout } from './IdentityLayout';
import { PlayerNameInput } from './PlayerNameInput';
import { PrimaryButton } from '@darknes/ui';
import { SaveEngine, StoryEngine, useGameStore } from '@darknes/engine';

const FIRST_SCENE_ID = 'scene02';

const CINEMATIC_SENTENCES = [
  '...',
  'Before this story begins...',
  'There is one thing I need to know.',
  'What is your name?',
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
  const [currentSentence, setCurrentSentence] = useState(0);

  const { isValid, trimmed } = useInputValidation(name);

  // Auto-capitalize first letter on change
  const handleNameChange = useCallback((value: string) => {
    setName(capitalizeFirst(value));
  }, []);

  // Cinematic sentence reveal
  useEffect(() => {
    if (currentSentence >= CINEMATIC_SENTENCES.length) {
      // All sentences shown — show input
      setTimeout(() => {
        setIsReady(true);
        // Focus input after animation
        setTimeout(() => inputRef.current?.focus(), 300);
      }, 600);
      return;
    }

    const delay = currentSentence === 0 ? 1200 : 2200;
    const timer = window.setTimeout(() => {
      setCurrentSentence((prev) => prev + 1);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [currentSentence]);

  const handleContinue = useCallback(async () => {
    if (!isValid) return;

    const finalName = trimmed;

    // Create new game state
    useGameStore.getState().createNewGame(finalName);

    // Save initial data
    SaveEngine.saveAuto();

    // Show welcome screen
    setIsWelcome(true);

    // Wait, then navigate to intro
    await new Promise((resolve) => setTimeout(resolve, 2200));
    await StoryEngine.startScene(FIRST_SCENE_ID);
    navigate('/game');
  }, [isValid, trimmed, navigate]);

  return (
    <IdentityLayout>
      <AnimatePresence mode="wait">
        {isWelcome ? (
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
              Welcome back,
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
                    />
                  </div>

                  <PrimaryButton
                    onClick={handleContinue}
                    disabled={!isValid}
                    className="w-full"
                  >
                    Continue
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
