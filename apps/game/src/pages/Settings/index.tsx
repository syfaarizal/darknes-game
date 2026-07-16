import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SettingsPanel, IconButton } from '@darknes/ui';

export function Settings() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-[var(--color-void)] px-6 py-10">
      <div className="mb-8 flex w-full max-w-md items-center gap-3">
        <IconButton icon={<ArrowLeft size={18} />} label="Back" onClick={() => navigate(-1)} />
        <h2 className="font-display text-xl uppercase tracking-[0.15em] text-[var(--color-ink)]">
          Settings
        </h2>
      </div>
      <SettingsPanel />
    </div>
  );
}
