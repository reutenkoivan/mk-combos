import { builderReplayStatuses } from "./replay/value";
import { builderComboStateStatuses } from "./stale/value";
import { builderTransitionStatuses } from "./transition/value";

export const builderCoreContractGroups = {
  graph: {
    schema: "@mk-combos/builder-core/graph/schema",
    type: "@mk-combos/builder-core/graph/type",
  },
  replay: {
    runtime: "@mk-combos/builder-core/replay/runtime",
    schema: "@mk-combos/builder-core/replay/schema",
    type: "@mk-combos/builder-core/replay/type",
    value: "@mk-combos/builder-core/replay/value",
  },
  runtime: {
    schema: "@mk-combos/builder-core/runtime/schema",
    type: "@mk-combos/builder-core/runtime/type",
  },
  stale: {
    runtime: "@mk-combos/builder-core/stale/runtime",
    schema: "@mk-combos/builder-core/stale/schema",
    type: "@mk-combos/builder-core/stale/type",
    value: "@mk-combos/builder-core/stale/value",
  },
  transition: {
    runtime: "@mk-combos/builder-core/transition/runtime",
    schema: "@mk-combos/builder-core/transition/schema",
    type: "@mk-combos/builder-core/transition/type",
    value: "@mk-combos/builder-core/transition/value",
  },
} as const;

export const mkCombosBuilderCore = {
  packageName: "@mk-combos/builder-core",
  groups: builderCoreContractGroups,
  valueSets: {
    builderComboStateStatuses,
    builderReplayStatuses,
    builderTransitionStatuses,
  },
} as const;
