import type { ReactNode } from 'react';

export interface IdentityLayoutProps {
  children: ReactNode;
}

/**
 * Dark cinematic layout for the Identity Setup page.
 * Full-screen black background with subtle atmospheric gradients.
 */
export function IdentityLayout({ children }: IdentityLayoutProps) {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[var(--color-void)]">
      {/* Subtle atmospheric gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.06),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,transparent_30%,transparent_70%,rgba(0,0,0,0.5)_100%)]" />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center px-8">
        {children}
      </div>
    </div>
  );
}
