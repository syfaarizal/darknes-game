import { BookOpen, Save, Settings, Menu as MenuIcon, LayoutGrid } from 'lucide-react';
import { IconButton } from '../Buttons';

export interface TopBarProps {
  onLog: () => void;
  onSave: () => void;
  onGallery: () => void;
  onSettings: () => void;
  onMenu: () => void;
}

export function TopBar({ onLog, onSave, onGallery, onSettings, onMenu }: TopBarProps) {
  return (
    <div className="absolute right-4 top-4 z-40 flex items-center gap-1 border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-2 py-1 backdrop-blur-md">
      <IconButton icon={<BookOpen size={16} />} label="History" onClick={onLog} />
      <IconButton icon={<Save size={16} />} label="Save" onClick={onSave} />
      <IconButton icon={<LayoutGrid size={16} />} label="Gallery" onClick={onGallery} />
      <IconButton icon={<Settings size={16} />} label="Settings" onClick={onSettings} />
      <IconButton icon={<MenuIcon size={16} />} label="Menu" onClick={onMenu} />
    </div>
  );
}
