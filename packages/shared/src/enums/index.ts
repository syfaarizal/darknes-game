/**
 * Enums shared across engine, ui, and every game app.
 * Keep these string enums (not numeric) so JSON scene files stay readable
 * and diffable, and so save files remain stable across engine versions.
 */

export enum SceneTransitionType {
  Fade = 'fade',
  Cut = 'cut',
  CrossFade = 'crossfade',
  SlideLeft = 'slide-left',
  SlideRight = 'slide-right',
  Flash = 'flash',
}

export enum CharacterPosition {
  Left = 'left',
  Center = 'center',
  Right = 'right',
  FarLeft = 'far-left',
  FarRight = 'far-right',
  Offscreen = 'offscreen',
}

export enum CharacterAnimation {
  Enter = 'enter',
  Exit = 'exit',
  Shake = 'shake',
  Nod = 'nod',
  Bob = 'bob',
  None = 'none',
}

export enum CameraMoveType {
  Static = 'static',
  ZoomIn = 'zoom-in',
  ZoomOut = 'zoom-out',
  PanLeft = 'pan-left',
  PanRight = 'pan-right',
  Shake = 'shake',
  Punch = 'punch',
}

export enum AudioChannel {
  Music = 'music',
  Sfx = 'sfx',
  Voice = 'voice',
  Ambience = 'ambience',
  Ui = 'ui',
}

export enum DialogueNodeType {
  Line = 'line',
  Choice = 'choice',
  Narration = 'narration',
  SceneChange = 'scene-change',
  SetFlag = 'set-flag',
  SetVariable = 'set-variable',
  Conditional = 'conditional',
  End = 'end',
}

export enum GamePhase {
  Boot = 'boot',
  Splash = 'splash',
  MainMenu = 'main-menu',
  InGame = 'in-game',
  Paused = 'paused',
  Ending = 'ending',
  Credits = 'credits',
}

export enum TextSpeed {
  Slow = 'slow',
  Normal = 'normal',
  Fast = 'fast',
  Instant = 'instant',
}

export enum SaveSlotKind {
  Manual = 'manual',
  Auto = 'auto',
  QuickSave = 'quick-save',
}
