import { AudioChannel, DialogueNodeType, evaluateConditions, GamePhase } from '@darknes/shared';
import type { SceneChoiceOption, SceneFile, SceneNode } from '@darknes/shared';
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

export async function advance(): Promise<void> {
  const { currentNode } = useDialogueStore.getState();
  const { currentSceneId } = useGameStore.getState();
  if (!currentNode || !currentSceneId) return;

  if (
    (currentNode.type === DialogueNodeType.Line || currentNode.type === DialogueNodeType.Narration) &&
    useDialogueStore.getState().isTyping
  ) {
    const { playerName, variables } = useGameStore.getState();
    const ctx = getVariableContext(playerName, variables);
    finishTypewriter(replaceVariables(currentNode.text, ctx));
    return;
  }

  const scene = requireCurrentScene();

  if (currentNode.type === DialogueNodeType.Choice) {
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
      const { playerName, variables } = useGameStore.getState();
      const ctx = getVariableContext(playerName, variables);
      const resolvedText = replaceVariables(node.text, ctx);
      const { textSpeedPreset } = useSettingsStore.getState();
      const { promise } = runTypewriter(resolvedText, textSpeedPreset);
      await promise;
      recordHistory(buildHistoryEntry(node, scene.meta.id, resolvedText, playerName, variables));

      if (useDialogueStore.getState().isAutoMode) {
        const delay = useSettingsStore.getState().text.autoModeDelayMs;
        setTimeout(() => advance(), delay);
      }
      return;
    }
    case DialogueNodeType.Choice: {
      applyNodeCharactersToStage(node);
      presentChoices(node);
      return;
    }
    case DialogueNodeType.SceneChange: {
      await startScene(node.targetSceneId);
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
      if (endNode.nextScene) {
        // Trigger fade-to-black before loading the next scene.
        // The Game UI reads sceneTransitionPhase and handles the fade animation.
        useDialogueStore.getState().setSceneTransition('fading-out', endNode.nextScene);
      } else {
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
