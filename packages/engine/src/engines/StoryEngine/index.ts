import { AudioChannel, DialogueNodeType, evaluateConditions, GamePhase } from '@darknes/shared';
import type { SceneChoiceOption, SceneFile, SceneNode, EndNode } from '@darknes/shared';
import { useGameStore } from '../../store/gameStore';
import { useDialogueStore } from '../../store/dialogueStore';
import { useSceneStore } from '../../store/sceneStore';
import { getNodeById, loadScene } from '../SceneEngine';
import { applyNodeCharactersToStage } from '../CharacterEngine';
import { presentChoices, resolveChoice } from '../ChoiceEngine';
import { buildHistoryEntry, finishTypewriter, recordHistory, runTypewriter } from '../DialogueEngine';
import { replaceVariables, getVariableContext } from '../VariableEngine';
import { playCue } from '../AudioEngine';
import { useSettingsStore } from '../../store/settingsStore';

export async function startScene(
  sceneId: string,
  options: { waitForText?: boolean } = {},
): Promise<void> {
  const scene = await loadScene(sceneId);
  useGameStore.getState().setPhase(GamePhase.InGame);
  useGameStore.getState().setPosition(sceneId, scene.meta.entry);
  if (scene.meta.music) {
    playCue({ channel: AudioChannel.Music, id: scene.meta.music, loop: true });
  }
  const goToFirstNode = goToNode(scene, scene.meta.entry);
  if (options.waitForText === false) return;
  await goToFirstNode;
}

/**
 * Skip to the next scene without playing dialogue.
 * Traverses from current node to the End node, then loads the next scene.
 */
export async function skipScene(): Promise<void> {
  const scene = useSceneStore.getState().scene;
  if (!scene) return;

  // Find the end node by traversing the scene graph
  // Start from the last node we were at, or the entry point
  const currentNode = useDialogueStore.getState().currentNode;
  const startId = currentNode?.id || scene.meta.entry;

  // Find the end node by following next pointers
  const endNode = findEndNode(scene, startId);
  if (endNode && endNode.nextScene) {
    // Turn off skip mode
    useDialogueStore.getState().setSkipping(false);
    // Trigger fade transition to next scene
    useDialogueStore.getState().setSceneTransition('fading-out', endNode.nextScene);
  } else {
    // No next scene found, just turn off skip
    useDialogueStore.getState().setSkipping(false);
  }
}

/**
 * Recursively find an End node in the scene, starting from a given node ID.
 * Follows next pointers, choices, and conditionals.
 */
function findEndNode(scene: SceneFile, startId: string): EndNode | null {
  const node = getNodeById(scene, startId);
  if (!node) return null;

  if (node.type === DialogueNodeType.End) {
    return node as EndNode;
  }

  // Handle different node types
  if (node.type === DialogueNodeType.Choice) {
    // For choices, follow the first option
    if (node.options && node.options.length > 0) {
      return findEndNode(scene, node.options[0].goTo);
    }
  }

  if (node.type === DialogueNodeType.Conditional) {
    // For conditionals, try the ifTrue path first (most common)
    const ifTrueEnd = findEndNode(scene, node.ifTrue);
    if (ifTrueEnd) return ifTrueEnd;
    return findEndNode(scene, node.ifFalse);
  }

  // For Line, Narration, SetFlag, SetVariable - follow next
  if ('next' in node && node.next) {
    return findEndNode(scene, node.next);
  }

  return null;
}

export async function advance(fromAuto: boolean = false): Promise<void> {
  const { currentNode } = useDialogueStore.getState();
  const { currentSceneId } = useGameStore.getState();
  if (!currentNode || !currentSceneId) return;

  // If auto mode is active and there's a scheduled advance, cancel it
  const scheduled = useDialogueStore.getState().autoAdvanceScheduled;
  if (scheduled) {
    useDialogueStore.getState().setAutoAdvanceScheduled(false);
  }

  // If text is still typing, finish it and wait for next click
  if (
    (currentNode.type === DialogueNodeType.Line || currentNode.type === DialogueNodeType.Narration) &&
    useDialogueStore.getState().isTyping
  ) {
    const { playerName, variables } = useGameStore.getState();
    const ctx = getVariableContext(playerName, variables);
    finishTypewriter(replaceVariables(currentNode.text, ctx));
    return;
  }

  // If user manually advanced (not from auto mode), turn off auto mode
  if (!fromAuto && useDialogueStore.getState().isAutoMode) {
    useDialogueStore.getState().setAutoMode(false);
  }

  const scene = requireCurrentScene();

  if (currentNode.type === DialogueNodeType.Choice) {
    return;
  }

  if (currentNode.type === DialogueNodeType.End) {
    const endNode = currentNode as import('@darknes/shared').EndNode;
    if (endNode.nextScene) {
      useDialogueStore.getState().setSceneTransition('fading-out', endNode.nextScene);
    } else {
      useGameStore.getState().setPhase(GamePhase.Ending);
    }
    return;
  }

  if ('next' in currentNode && currentNode.next) {
    await goToNode(scene, currentNode.next);
  }
}

export async function choose(option: SceneChoiceOption): Promise<void> {
  const scene = requireCurrentScene();
  const nextNodeId = resolveChoice(option);
  await goToNode(scene, nextNodeId);
}

async function goToNode(scene: SceneFile, nodeId: string): Promise<void> {
  const node = getNodeById(scene, nodeId);
  if (!node) {
    console.error(`[StoryEngine] Node "${nodeId}" not found in scene "${scene.meta.id}"`);
    return;
  }

  useGameStore.getState().setPosition(scene.meta.id, nodeId);
  useDialogueStore.getState().setCurrentNode(node);

  await processNode(scene, node);
}

async function processNode(scene: SceneFile, node: SceneNode): Promise<void> {
  switch (node.type) {
    case DialogueNodeType.Line:
    case DialogueNodeType.Narration: {
      applyNodeCharactersToStage(node);
      if (node.transition) {
        // ui layer reads dialogueStore.currentNode.transition directly
      }

      // Play any audio cues attached to this node before the typewriter starts.
      const lineNode = node as import('@darknes/shared').LineNode;
      if (lineNode.audio) {
        for (const cue of lineNode.audio) {
          playCue(cue);
        }
      }

      const { playerName, variables } = useGameStore.getState();
      const ctx = getVariableContext(playerName, variables);
      const resolvedText = replaceVariables(lineNode.text, ctx);
      const { textSpeedPreset } = useSettingsStore.getState();
      const { promise } = runTypewriter(resolvedText, textSpeedPreset);
      await promise;
      recordHistory(buildHistoryEntry(lineNode, scene.meta.id, resolvedText, playerName, variables));

      if (useDialogueStore.getState().isAutoMode) {
        const delay = useSettingsStore.getState().text.autoModeDelayMs;
        // Mark that an auto-advance is scheduled
        useDialogueStore.getState().setAutoAdvanceScheduled(true);
        setTimeout(() => {
          // Only advance if still scheduled and auto mode is still on
          if (useDialogueStore.getState().autoAdvanceScheduled && useDialogueStore.getState().isAutoMode) {
            useDialogueStore.getState().setAutoAdvanceScheduled(false);
            advance(true); // Pass true to indicate this is from auto mode
          }
        }, delay);
      }
      return;
    }
    case DialogueNodeType.Choice: {
      applyNodeCharactersToStage(node);
      presentChoices(node);
      return;
    }
    case DialogueNodeType.SceneChange: {
      // Use the same fade transition system as End node
      useDialogueStore.getState().setSceneTransition('fading-out', node.targetSceneId);
      return;
    }
    case DialogueNodeType.SetFlag: {
      node.flags.forEach((f) => useGameStore.getState().setFlag(f.key, f.value));
      if (node.next) await goToNode(scene, node.next);
      return;
    }
    case DialogueNodeType.SetVariable: {
      node.variables.forEach((v) => {
        if (!v.op || v.op === 'set') {
          useGameStore.getState().setVariable(v.key, v.value);
        } else {
          const delta = Number(v.value) * (v.op === 'subtract' ? -1 : 1);
          useGameStore.getState().addToVariable(v.key, delta);
        }
      });
      if (node.next) await goToNode(scene, node.next);
      return;
    }
    case DialogueNodeType.Conditional: {
      const { flags, variables } = useGameStore.getState();
      const passed = evaluateConditions(node.conditions, flags, variables);
      await goToNode(scene, passed ? node.ifTrue : node.ifFalse);
      return;
    }
    case DialogueNodeType.End: {
      const endNode = node as import('@darknes/shared').EndNode;
      console.log('[StoryEngine] End node reached:', endNode);
      // Save endingId before transitioning
      if (endNode.endingId) {
        console.log('[StoryEngine] Saving endingId:', endNode.endingId);
        useGameStore.getState().setEndingId(endNode.endingId);
      }
      if (endNode.nextScene) {
        console.log('[StoryEngine] Transitioning to next scene:', endNode.nextScene);
        // Trigger fade-to-black before loading the next scene.
        // The Game UI reads sceneTransitionPhase and handles the fade animation.
        useDialogueStore.getState().setSceneTransition('fading-out', endNode.nextScene);
      } else {
        console.log('[StoryEngine] Setting phase to Ending');
        useGameStore.getState().setPhase(GamePhase.Ending);
      }
      return;
    }
    default:
      return;
  }
}

function requireCurrentScene(): SceneFile {
  const scene = useSceneStore.getState().scene;
  if (!scene) throw new Error('[StoryEngine] No scene currently loaded.');
  return scene;
}
