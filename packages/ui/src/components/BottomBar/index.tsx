import { FastForward, Save, FolderOpen } from 'lucide-react';
import { IconButton } from '../Buttons';

export interface BottomBarProps {
  onSkip: () => void;
  onQuickSave: () => void;
  onQuickLoad: () => void;
  isSkipping: boolean;
}

export function BottomBar({ onSkip, onQuickSave, onQuickLoad, isSkipping }: BottomBarProps) {
  return (
    <div className="absolute bottom-4 left-4 z-40 flex items-center gap-1 border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-2 py-1 backdrop-blur-md">
      <IconButton
        icon={<FastForward size={16} />}
        label="Skip"
        onClick={onSkip}
        className={isSkipping ? 'text-[var(--color-accent-strong)]' : undefined}
      />
      <IconButton icon={<Save size={16} />} label="Quick Save" onClick={onQuickSave} />
      <IconButton icon={<FolderOpen size={16} />} label="Quick Load" onClick={onQuickLoad} />
    </div>
  );
}
