import { mkxlBuilderMoveChoiceKinds } from "./graph/value";

export const mkxlBuilderContractGroups = {
  context: {
    schema: "@mk-combos/mkxl-builder/context/schema",
    type: "@mk-combos/mkxl-builder/context/type",
  },
  graph: {
    runtime: "@mk-combos/mkxl-builder/graph/runtime",
    schema: "@mk-combos/mkxl-builder/graph/schema",
    type: "@mk-combos/mkxl-builder/graph/type",
    value: "@mk-combos/mkxl-builder/graph/value",
  },
  replay: {
    runtime: "@mk-combos/mkxl-builder/replay/runtime",
  },
  state: {
    runtime: "@mk-combos/mkxl-builder/state/runtime",
  },
} as const;

export const mkCombosMkxlBuilder = {
  packageName: "@mk-combos/mkxl-builder",
  groups: mkxlBuilderContractGroups,
  valueSets: { mkxlBuilderMoveChoiceKinds },
} as const;
