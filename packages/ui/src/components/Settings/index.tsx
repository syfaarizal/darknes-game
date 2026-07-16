import { TextSpeed } from '@darknes/shared';
import { useSettingsStore } from '@darknes/engine';

const TEXT_SPEED_OPTIONS: TextSpeed[] = [
  TextSpeed.Slow,
  TextSpeed.Normal,
  TextSpeed.Fast,
  TextSpeed.Instant,
];

export function SettingsPanel() {
  const audio = useSettingsStore((s) => s.audio);
  const setVolume = useSettingsStore((s) => s.setVolume);
  const textSpeedPreset = useSettingsStore((s) => s.textSpeedPreset);
  const setTextSpeed = useSettingsStore((s) => s.setTextSpeed);
  const fullscreen = useSettingsStore((s) => s.fullscreen);
  const toggleFullscreen = useSettingsStore((s) => s.toggleFullscreen);

  return (
    <div className="w-full max-w-md space-y-6 font-body text-[var(--color-ink)]">
      <section>
        <h3 className="mb-3 font-display text-sm uppercase tracking-[0.15em] text-[var(--color-accent-strong)]">
          Audio
        </h3>
        <div className="space-y-3">
          {(Object.keys(audio) as Array<keyof typeof audio>).map((channel) => (
            <label key={channel} className="flex items-center justify-between gap-4 text-sm">
              <span className="w-24 uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
                {channel}
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={audio[channel]}
                onChange={(e) => setVolume(channel, Number(e.target.value))}
                className="h-1 flex-1 accent-[var(--color-accent-strong)]"
              />
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-display text-sm uppercase tracking-[0.15em] text-[var(--color-accent-strong)]">
          Text Speed
        </h3>
        <div className="flex gap-2">
          {TEXT_SPEED_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setTextSpeed(option)}
              className={`flex-1 border px-3 py-2 text-xs uppercase tracking-[0.08em] transition-colors ${
                textSpeedPreset === option
                  ? 'border-[var(--color-accent-strong)] bg-[var(--color-accent-soft)] text-[var(--color-ink)]'
                  : 'border-[var(--color-hairline)] text-[var(--color-ink-muted)] hover:border-[var(--color-ink-muted)]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-between">
        <span className="text-sm uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
          Fullscreen
        </span>
        <button
          onClick={toggleFullscreen}
          className={`h-6 w-11 rounded-full border border-[var(--color-hairline)] p-0.5 transition-colors ${
            fullscreen ? 'bg-[var(--color-accent-strong)]' : 'bg-[var(--color-graphite)]'
          }`}
        >
          <span
            className={`block h-4 w-4 rounded-full bg-[var(--color-ink)] transition-transform ${
              fullscreen ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </section>
    </div>
  );
}
