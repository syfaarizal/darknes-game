import { DialogueNodeType } from '@darknes/shared';
import { useDialogueRunner } from '@darknes/engine';
import { NameBox } from '../NameBox';
import { DialogueBox } from '../DialogueBox';
import { ChoiceBox } from '../ChoiceBox';
import { Typewriter } from '../Typewriter';

export interface DialogueLayerProps {
  onToggleLog: () => void;
  speakerColorOf?: (characterId: string) => string | undefined;
}

/**
 * The single component `pages/Game` mounts for all dialogue UI. Reads
 * `useDialogueRunner()` and switches between the line-box and choice-box
 * presentation based on the current node's type — screens never need to
 * inspect node types themselves.
 */
export function DialogueLayer({ onToggleLog, speakerColorOf }: DialogueLayerProps) {
  const { currentNode, pendingChoices, isAutoMode, toggleAutoMode, next, pick } =
    useDialogueRunner();

  if (!currentNode) return null;

  if (currentNode.type === DialogueNodeType.Choice && pendingChoices) {
    return <ChoiceBox prompt={currentNode.prompt} options={pendingChoices} onSelect={pick} />;
  }

  if (currentNode.type === DialogueNodeType.Line || currentNode.type === DialogueNodeType.Narration) {
    const color = currentNode.speaker ? speakerColorOf?.(currentNode.speaker) : undefined;

    return (
      <div>
        {currentNode.speaker && <NameBox name={currentNode.speaker} color={color} />}
        <DialogueBox
          onNext={next}
          onToggleLog={onToggleLog}
          onToggleAuto={toggleAutoMode}
          isAutoMode={isAutoMode}
          isAdvanceable
        >
          <Typewriter text={currentNode.text} />
        </DialogueBox>
      </div>
    );
  }

  return null;
}
