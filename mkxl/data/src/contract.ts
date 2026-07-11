import { mkxlComboDifficulties, mkxlComboPositions, mkxlComboRouteTypes } from "./combos/value";
import { mkxlCoverageTargets } from "./coverage/value";
import { mkxlDataSourceIds, mkxlGame } from "./game/value";
import { mkxlStageGraphFragmentIds, mkxlVariationGraphIds } from "./graph/value";
import {
  mkxlInputNotationValues,
  mkxlMoveCategories,
  mkxlMoveIds,
  mkxlMoveNotationValues,
} from "./movelists/value";
import { mkxlCharacterIds } from "./roster/value";
import { mkxlInteractableIds, mkxlStageIds } from "./stages/value";
import { mkxlVariationIds } from "./variations/value";

export const mkxlDataContractGroups = {
  combos: {
    schema: "@mk-combos/mkxl-data/combos/schema",
    type: "@mk-combos/mkxl-data/combos/type",
    value: "@mk-combos/mkxl-data/combos/value",
  },
  coverage: {
    runtime: "@mk-combos/mkxl-data/coverage/runtime",
    schema: "@mk-combos/mkxl-data/coverage/schema",
    type: "@mk-combos/mkxl-data/coverage/type",
    value: "@mk-combos/mkxl-data/coverage/value",
  },
  game: {
    schema: "@mk-combos/mkxl-data/game/schema",
    type: "@mk-combos/mkxl-data/game/type",
    value: "@mk-combos/mkxl-data/game/value",
  },
  graph: {
    schema: "@mk-combos/mkxl-data/graph/schema",
    type: "@mk-combos/mkxl-data/graph/type",
    value: "@mk-combos/mkxl-data/graph/value",
  },
  movelists: {
    schema: "@mk-combos/mkxl-data/movelists/schema",
    type: "@mk-combos/mkxl-data/movelists/type",
    value: "@mk-combos/mkxl-data/movelists/value",
  },
  roster: {
    schema: "@mk-combos/mkxl-data/roster/schema",
    type: "@mk-combos/mkxl-data/roster/type",
    value: "@mk-combos/mkxl-data/roster/value",
  },
  stages: {
    schema: "@mk-combos/mkxl-data/stages/schema",
    type: "@mk-combos/mkxl-data/stages/type",
    value: "@mk-combos/mkxl-data/stages/value",
  },
  variations: {
    schema: "@mk-combos/mkxl-data/variations/schema",
    type: "@mk-combos/mkxl-data/variations/type",
    value: "@mk-combos/mkxl-data/variations/value",
  },
} as const;

export const mkCombosMkxlData = {
  packageName: "@mk-combos/mkxl-data",
  game: mkxlGame,
  groups: mkxlDataContractGroups,
  coverage: mkxlCoverageTargets,
  valueSets: {
    mkxlCharacterIds,
    mkxlComboDifficulties,
    mkxlComboPositions,
    mkxlComboRouteTypes,
    mkxlDataSourceIds,
    mkxlInputNotationValues,
    mkxlInteractableIds,
    mkxlMoveCategories,
    mkxlMoveIds,
    mkxlMoveNotationValues,
    mkxlStageGraphFragmentIds,
    mkxlStageIds,
    mkxlVariationGraphIds,
    mkxlVariationIds,
  },
} as const;
