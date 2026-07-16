import { Howl } from 'howler';
import { resolveAudioUrl } from '@darknes/assets';
import { AudioChannel, DEFAULT_AUDIO_FADE_MS } from '@darknes/shared';
import type { AudioCue } from '@darknes/shared';
import { useAudioStore } from '../../store/audioStore';
import { useSettingsStore } from '../../store/settingsStore';

const howlPool = new Map<string, Howl>();

function getVolumeForChannel(channel: AudioChannel): number {
  const { audio } = useSettingsStore.getState();
  const channelVolume = (audio[channel as keyof typeof audio] ?? 1);
  return audio.master * channelVolume;
}

function getOrCreateHowl(cue: AudioCue): Howl | null {
  const url = resolveAudioUrl(cue.id);
  if (!url) return null;

  const existing = howlPool.get(cue.id);
  if (existing) return existing;

  const howl = new Howl({
    src: [url],
    loop: cue.loop ?? (cue.channel === AudioChannel.Music || cue.channel === AudioChannel.Ambience),
    volume: cue.volume ?? getVolumeForChannel(cue.channel),
  });
  howlPool.set(cue.id, howl);
  return howl;
}

export function playCue(cue: AudioCue): void {
  const howl = getOrCreateHowl(cue);
  if (!howl) return;

  const fadeMs = cue.fadeMs ?? DEFAULT_AUDIO_FADE_MS;
  const targetVolume = cue.volume ?? getVolumeForChannel(cue.channel);

  howl.volume(0);
  const howlId = howl.play();
  howl.fade(0, targetVolume, fadeMs, howlId);

  useAudioStore.getState().registerTrack(`${cue.channel}:${cue.id}`, {
    id: cue.id,
    channel: cue.channel,
    howlId,
  });
}

export function stopCue(cue: Pick<AudioCue, 'id' | 'channel' | 'fadeMs'>): void {
  const howl = howlPool.get(cue.id);
  const key = `${cue.channel}:${cue.id}`;
  const active = useAudioStore.getState().activeTracks[key];
  if (!howl || !active) return;

  const fadeMs = cue.fadeMs ?? DEFAULT_AUDIO_FADE_MS;
  howl.fade(howl.volume(active.howlId) as number, 0, fadeMs, active.howlId);
  setTimeout(() => {
    howl.stop(active.howlId);
    useAudioStore.getState().unregisterTrack(key);
  }, fadeMs);
}

export function stopChannel(channel: AudioChannel): void {
  const { activeTracks } = useAudioStore.getState();
  Object.values(activeTracks)
    .filter((t) => t.channel === channel)
    .forEach((t) => stopCue({ id: t.id, channel: t.channel }));
}

export function setMasterVolume(volume: number): void {
  useSettingsStore.getState().setVolume('master', volume);
  howlPool.forEach((howl) => howl.volume(volume));
}
