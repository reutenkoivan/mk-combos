import { activeMkxlDataset } from "../packs/value";

export {
  mkxlAttackLevels,
  mkxlInputNotationValues,
  mkxlInputsRegistry,
  mkxlMoveCategories,
  mkxlMoveNotationValues,
  mkxlMoveTacticalFactKinds,
} from "./constants";

export const mkxlMovelists = activeMkxlDataset.movelists;

export const mkxlMoves = activeMkxlDataset.moves;

export const mkxlMoveIds = activeMkxlDataset.moveIds;
