import { mk1BuilderMoveChoiceKinds } from "./graph/value";

export const mk1BuilderContractGroups = {
  context: {
    schema: "@mk-combos/mk1-builder/context/schema",
    type: "@mk-combos/mk1-builder/context/type",
  },
  graph: {
    runtime: "@mk-combos/mk1-builder/graph/runtime",
    schema: "@mk-combos/mk1-builder/graph/schema",
    type: "@mk-combos/mk1-builder/graph/type",
    value: "@mk-combos/mk1-builder/graph/value",
  },
  replay: {
    runtime: "@mk-combos/mk1-builder/replay/runtime",
  },
  state: {
    runtime: "@mk-combos/mk1-builder/state/runtime",
  },
} as const;

export const mkCombosMk1Builder = {
  packageName: "@mk-combos/mk1-builder",
  groups: mk1BuilderContractGroups,
  valueSets: { mk1BuilderMoveChoiceKinds },
} as const;
