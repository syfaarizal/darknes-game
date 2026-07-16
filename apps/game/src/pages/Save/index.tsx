import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { IconButton, PrimaryButton } from '@darknes/ui';
import { SaveEngine } from '@darknes/engine';

export function Save() {
  const navigate = useNavigate();
  const [label, setLabel] = useState('');

  const handleSave = () => {
    SaveEngine.saveManual(label.trim() || `Save — ${new Date().toLocaleString()}`);
    navigate(-1);
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-[var(--color-void)] px-6 py-10">
      <div className="mb-8 flex w-full max-w-md items-center gap-3">
        <IconButton icon={<ArrowLeft size={18} />} label="Back" onClick={() => navigate(-1)} />
        <h2 className="font-display text-xl uppercase tracking-[0.15em] text-[var(--color-ink)]">
          Save Game
        </h2>
      </div>

      <div className="w-full max-w-md space-y-4">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Save name (optional)"
          className="w-full border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent-strong)]"
        />
        <PrimaryButton onClick={handleSave} className="w-full">
          Save
        </PrimaryButton>
      </div>
    </div>
  );
}
