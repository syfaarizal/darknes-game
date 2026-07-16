# data/endings

Ending definitions (`EndingDefinition` in `@darknes/shared`): id, title,
description, background art, and the conditions used to resolve which
ending a playthrough reaches. Empty for now — populate as the story's
branches are finalized, e.g. `good-end.json`, `neutral-end.json`,
`bad-end.json`. Scene `end` nodes reference an ending by `endingId`; the
`Ending` page resolves that id against this folder.
