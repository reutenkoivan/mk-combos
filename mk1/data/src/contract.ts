import { mk1ComboDifficulties, mk1ComboPositions, mk1ComboRouteTypes } from "./combos/value";
import { mk1CoverageTargets } from "./coverage/value";
import {
  mk1DataSourceIds,
  mk1DataSourceKinds,
  mk1ExactGameplayEvidenceSourceIds,
  mk1Game,
} from "./game/value";
import {
  mk1CharacterGraphIds,
  mk1GraphNodeKinds,
  mk1GraphTimingKinds,
  mk1KameoGraphOverlayIds,
} from "./graph/value";
import { mk1KameoIds, mk1KameoReleaseKinds } from "./kameos/value";
import {
  mk1AttackLevels,
  mk1InputNotationValues,
  mk1MoveCategories,
  mk1MoveIds,
  mk1MoveNotationValues,
  mk1MoveOwnerKinds,
  mk1MoveTacticalFactKinds,
} from "./movelists/value";
import { mk1CharacterIds, mk1CharacterReleaseKinds } from "./roster/value";
import { mk1PickerSlotStatuses } from "./shared/value";

export const mk1DataContractGroups = {
  combos: {
    schema: "@mk-combos/mk1-data/combos/schema",
    type: "@mk-combos/mk1-data/combos/type",
    value: "@mk-combos/mk1-data/combos/value",
  },
  coverage: {
    runtime: "@mk-combos/mk1-data/coverage/runtime",
    schema: "@mk-combos/mk1-data/coverage/schema",
    type: "@mk-combos/mk1-data/coverage/type",
    value: "@mk-combos/mk1-data/coverage/value",
  },
  game: {
    schema: "@mk-combos/mk1-data/game/schema",
    type: "@mk-combos/mk1-data/game/type",
    value: "@mk-combos/mk1-data/game/value",
  },
  graph: {
    schema: "@mk-combos/mk1-data/graph/schema",
    type: "@mk-combos/mk1-data/graph/type",
    value: "@mk-combos/mk1-data/graph/value",
  },
  kameos: {
    schema: "@mk-combos/mk1-data/kameos/schema",
    type: "@mk-combos/mk1-data/kameos/type",
    value: "@mk-combos/mk1-data/kameos/value",
  },
  movelists: {
    schema: "@mk-combos/mk1-data/movelists/schema",
    type: "@mk-combos/mk1-data/movelists/type",
    value: "@mk-combos/mk1-data/movelists/value",
  },
  roster: {
    schema: "@mk-combos/mk1-data/roster/schema",
    type: "@mk-combos/mk1-data/roster/type",
    value: "@mk-combos/mk1-data/roster/value",
  },
  shared: {
    schema: "@mk-combos/mk1-data/shared/schema",
    type: "@mk-combos/mk1-data/shared/type",
    value: "@mk-combos/mk1-data/shared/value",
  },
} as const;

export const mkCombosMk1Data = {
  packageName: "@mk-combos/mk1-data",
  game: mk1Game,
  groups: mk1DataContractGroups,
  coverage: mk1CoverageTargets,
  valueSets: {
    mk1AttackLevels,
    mk1CharacterGraphIds,
    mk1CharacterIds,
    mk1ComboDifficulties,
    mk1ComboPositions,
    mk1ComboRouteTypes,
    mk1DataSourceIds,
    mk1DataSourceKinds,
    mk1ExactGameplayEvidenceSourceIds,
    mk1GraphNodeKinds,
    mk1GraphTimingKinds,
    mk1InputNotationValues,
    mk1KameoGraphOverlayIds,
    mk1KameoIds,
    mk1KameoReleaseKinds,
    mk1MoveCategories,
    mk1MoveIds,
    mk1MoveNotationValues,
    mk1MoveOwnerKinds,
    mk1MoveTacticalFactKinds,
    mk1CharacterReleaseKinds,
    mk1PickerSlotStatuses,
  },
} as const;
