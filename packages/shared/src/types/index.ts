import type {
  AudioChannel,
  CameraMoveType,
  CharacterAnimation,
  CharacterPosition,
  DialogueNodeType,
  SaveSlotKind,
  SceneTransitionType,
} from '../enums';

/* -------------------------------------------------------------------------- */
/*  Characters                                                                */
/* -------------------------------------------------------------------------- */

export interface CharacterExpression {
  /** e.g. "neutral", "smile", "serious" — maps to assets/characters/<id>/<key>.webp */
  key: string;
  /** Path relative to the assets characters root, resolved by AssetManifest. */
  file: string;
}

export interface CharacterDefinition {
  id: string;
  displayName: string;
  /** Hex color used for the name box / dialogue accent for this character. */
  color: string;
  /** Short role/title shown under the name in the character gallery. */
  title?: string;
  expressions: CharacterExpression[];
  /** Default expression key used when a dialogue line omits one. */
  defaultExpression: string;
}

/* -------------------------------------------------------------------------- */
/*  Backgrounds & Audio                                                       */
/* -------------------------------------------------------------------------- */

export interface BackgroundDefinition {
  id: string;
  file: string;
  label?: string;
}

export interface AudioCue {
  channel: AudioChannel;
  /** Track id, resolved via the AssetManifest audio registry. */
  id: string;
  /** 0..1, defaults to the channel's mixer volume. */
  volume?: number;
  loop?: boolean;
  /** Fade time in ms when starting/stopping this cue. */
  fadeMs?: number;
}

/* -------------------------------------------------------------------------- */
/*  Camera & Transitions                                                      */
/* -------------------------------------------------------------------------- */

export interface CameraInstruction {
  type: CameraMoveType;
  /** Duration in ms. */
  duration?: number;
  /** Optional target scale for zoom moves. */
  scale?: number;
}

export interface SceneTransition {
  type: SceneTransitionType;
  duration?: number;
}

/* -------------------------------------------------------------------------- */
/*  Flags & Variables                                                         */
/* -------------------------------------------------------------------------- */

export type FlagValue = boolean;
export type VariableValue = number | string | boolean;

export interface FlagMutation {
  key: string;
  value: FlagValue;
}

export interface VariableMutation {
  key: string;
  /** If omitted, `value` replaces the variable. Otherwise this is an operator. */
  op?: 'set' | 'add' | 'subtract';
  value: VariableValue;
}

export interface ConditionExpression {
  /** Flag or variable key to test. */
  key: string;
  kind: 'flag' | 'variable';
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
  value: FlagValue | VariableValue;
}

/* -------------------------------------------------------------------------- */
/*  Character stage state (who's on screen, in what pose, where)             */
/* -------------------------------------------------------------------------- */

export interface CharacterStageState {
  characterId: string;
  expression: string;
  position: CharacterPosition;
  animation?: CharacterAnimation;
  /** Dim/highlight non-speaking characters. */
  isSpeaking?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Choices                                                                   */
/* -------------------------------------------------------------------------- */

export interface SceneChoiceOption {
  id: string;
  text: string;
  /** Optional secondary/hint line shown under the choice text. */
  hint?: string;
  /** Node id to jump to if this option is picked. */
  goTo: string;
  /** Only show/enable this option if all conditions pass. */
  conditions?: ConditionExpression[];
  setFlags?: FlagMutation[];
  setVariables?: VariableMutation[];
}

/* -------------------------------------------------------------------------- */
/*  Dialogue nodes — the atomic unit of a scene JSON file                    */
/* -------------------------------------------------------------------------- */

export interface BaseDialogueNode {
  id: string;
  type: DialogueNodeType;
  /** Explicit next node id. Omitted for choice/conditional/end nodes. */
  next?: string;
}

export interface LineNode extends BaseDialogueNode {
  type: DialogueNodeType.Line | DialogueNodeType.Narration;
  speaker?: string;
  expression?: string;
  text: string;
  voice?: string;
  characters?: CharacterStageState[];
  camera?: CameraInstruction;
  audio?: AudioCue[];
  transition?: SceneTransition;
}

export interface ChoiceNode extends BaseDialogueNode {
  type: DialogueNodeType.Choice;
  prompt?: string;
  options: SceneChoiceOption[];
  /** Stage directions for characters during this choice node. */
  characters?: CharacterStageState[];
}

export interface SceneChangeNode extends BaseDialogueNode {
  type: DialogueNodeType.SceneChange;
  targetSceneId: string;
}

export interface SetFlagNode extends BaseDialogueNode {
  type: DialogueNodeType.SetFlag;
  flags: FlagMutation[];
}

export interface SetVariableNode extends BaseDialogueNode {
  type: DialogueNodeType.SetVariable;
  variables: VariableMutation[];
}

export interface ConditionalNode extends BaseDialogueNode {
  type: DialogueNodeType.Conditional;
  conditions: ConditionExpression[];
  /** Node id to go to if all conditions pass. */
  ifTrue: string;
  /** Node id to go to otherwise. */
  ifFalse: string;
}

export interface EndNode extends BaseDialogueNode {
  type: DialogueNodeType.End;
  /** Ending id, resolved against data/endings/*.json */
  endingId?: string;
}

export type SceneNode =
  | LineNode
  | ChoiceNode
  | SceneChangeNode
  | SetFlagNode
  | SetVariableNode
  | ConditionalNode
  | EndNode;

/* -------------------------------------------------------------------------- */
/*  Scene file                                                                */
/* -------------------------------------------------------------------------- */

export interface SceneMeta {
  id: string;
  title: string;
  background: string;
  music?: string;
  /** Node id where playback starts. */
  entry: string;
}

export interface SceneFile {
  meta: SceneMeta;
  nodes: SceneNode[];
}

/* -------------------------------------------------------------------------- */
/*  Endings                                                                   */
/* -------------------------------------------------------------------------- */

export interface EndingDefinition {
  id: string;
  title: string;
  description: string;
  background: string;
  /** Conditions checked, in order, to resolve which ending is reached. */
  conditions?: ConditionExpression[];
}

/* -------------------------------------------------------------------------- */
/*  History log                                                               */
/* -------------------------------------------------------------------------- */

export interface HistoryEntry {
  nodeId: string;
  sceneId: string;
  speaker?: string;
  text: string;
  timestamp: number;
}

/* -------------------------------------------------------------------------- */
/*  Settings                                                                  */
/* -------------------------------------------------------------------------- */

export interface AudioSettings {
  master: number;
  music: number;
  sfx: number;
  voice: number;
  ambience: number;
  ui: number;
}

export interface TextSettingsState {
  speed: number;
  autoModeDelayMs: number;
  skipUnreadEnabled: boolean;
}

export interface GameSettings {
  audio: AudioSettings;
  text: TextSettingsState;
  fullscreen: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Player Profile                                                             */
/* -------------------------------------------------------------------------- */

export interface PlayerProfile {
  name: string;
  createdAt: number;
}

/* -------------------------------------------------------------------------- */
/*  Save files                                                                */
/* -------------------------------------------------------------------------- */

export interface SaveFileMeta {
  id: string;
  kind: SaveSlotKind;
  createdAt: number;
  sceneId: string;
  nodeId: string;
  thumbnail?: string;
  label: string;
}

export interface SaveFilePayload {
  meta: SaveFileMeta;
  playerName: string;
  flags: Record<string, FlagValue>;
  variables: Record<string, VariableValue>;
  history: HistoryEntry[];
}
