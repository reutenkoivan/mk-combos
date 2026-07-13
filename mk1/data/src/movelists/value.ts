import { definitiveMk1Dataset } from "../packs/definitive";
import {
  mk1AttackLevels,
  mk1InputNotationValues,
  mk1MoveCategories,
  mk1MoveNotationValues,
  mk1MoveOwnerKinds,
  mk1MoveTacticalFactKinds,
} from "./constants";

export {
  mk1AttackLevels,
  mk1InputNotationValues,
  mk1MoveCategories,
  mk1MoveNotationValues,
  mk1MoveOwnerKinds,
  mk1MoveTacticalFactKinds,
};

export const mk1Movelists = definitiveMk1Dataset.movelists;

export const mk1CharacterMovelists = definitiveMk1Dataset.characterMovelists;

export const mk1KameoMovelists = definitiveMk1Dataset.kameoMovelists;

export const mk1MoveTreeRegistry = definitiveMk1Dataset.moveTreeRegistry;

export const mk1Moves = definitiveMk1Dataset.moves;

export const mk1MoveIds = definitiveMk1Dataset.moveIds;
