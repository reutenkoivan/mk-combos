import type { MkxlSeededCombo } from "../combos/type";
import type { MkxlDataSource, MkxlGame } from "../game/type";
import type { MkxlMove, MkxlMovelist, MkxlMoveTree } from "../movelists/type";
import type { MkxlCharacter } from "../roster/type";
import type { MkxlSourceIdList } from "../shared/type";
import type { MkxlStage } from "../stages/type";
import type { MkxlVariation } from "../variations/type";

type MkxlNonEmptyReadonlyArray<T> = readonly [T, ...T[]];

type MkxlInputNotationValueList = readonly [string, ...string[]];

type MkxlAuthoredMoveMap = Readonly<Record<string, MkxlMove>>;

type MkxlAuthoredVariationMoveMap = Readonly<Record<string, MkxlAuthoredMoveMap>>;

export type MkxlAuthoredCharacterMoves = {
  readonly sourcePath: `characters/${string}.ts`;
  readonly characterId: string;
  readonly sourceIds: MkxlSourceIdList;
  readonly universal: MkxlAuthoredMoveMap;
  readonly variations: MkxlAuthoredVariationMoveMap;
};

export type MkxlAuthoredSeededCombo = Omit<
  MkxlSeededCombo,
  "characterId" | "movePath" | "notation" | "route" | "variationId"
> & {
  readonly route: MkxlNonEmptyReadonlyArray<MkxlMove>;
};

export type MkxlAuthoredVariationCombos = {
  readonly sourcePath: `characters/${string}/${string}.ts`;
  readonly characterId: string;
  readonly variationSlug: string;
  readonly variationId: `${string}:${string}`;
  readonly combos: MkxlNonEmptyReadonlyArray<MkxlAuthoredSeededCombo>;
};

type MkxlAddOrReplaceMovePatch = {
  readonly action: "add" | "replace";
  readonly characterId: string;
  readonly key: string;
  readonly move: MkxlMove;
} & (
  | {
      readonly scope: "universal";
    }
  | {
      readonly scope: "variation";
      readonly variationKey: string;
    }
);

type MkxlRetireMovePatch = {
  readonly action: "retire";
  readonly characterId: string;
  readonly key: string;
} & (
  | {
      readonly scope: "universal";
    }
  | {
      readonly scope: "variation";
      readonly variationKey: string;
    }
);

export type MkxlMovePatch = MkxlAddOrReplaceMovePatch | MkxlRetireMovePatch;

type MkxlComboPatch = {
  readonly add?: readonly MkxlAuthoredVariationCombos[];
  readonly replace?: readonly MkxlAuthoredVariationCombos[];
  readonly retireIds?: readonly string[];
};

export type MkxlDataPack = {
  readonly id: string;
  readonly gameVersion: string;
  readonly extends?: MkxlDataPack;
  readonly sources?: readonly MkxlDataSource[];
  readonly game?: MkxlGame;
  readonly roster?: readonly MkxlCharacter[];
  readonly variations?: readonly MkxlVariation[];
  readonly stages?: readonly MkxlStage[];
  readonly inputNotationValues?: MkxlInputNotationValueList;
  readonly moves?: readonly MkxlAuthoredCharacterMoves[];
  readonly combos?: readonly MkxlAuthoredVariationCombos[];
  readonly movePatches?: readonly MkxlMovePatch[];
  readonly comboPatches?: MkxlComboPatch;
};

export type MkxlResolvedCharacterMovelistFile = Omit<MkxlMovelist, "characterId" | "moves"> & {
  readonly sourcePath: `characters/${string}.ts`;
  readonly characterId: string;
  readonly moves: MkxlMoveTree;
};

export type MkxlResolvedVariationComboFile = {
  readonly sourcePath: `characters/${string}/${string}.ts`;
  readonly characterId: string;
  readonly variationSlug: string;
  readonly variationId: `${string}:${string}`;
  readonly combos: MkxlNonEmptyReadonlyArray<MkxlSeededCombo>;
};

export type MkxlResolvedData = {
  readonly packId: string;
  readonly gameVersion: string;
  readonly sources: readonly MkxlDataSource[];
  readonly game: MkxlGame;
  readonly characters: readonly MkxlCharacter[];
  readonly characterIds: readonly string[];
  readonly variations: readonly MkxlVariation[];
  readonly variationIds: readonly string[];
  readonly variationsByCharacterId: Readonly<Record<string, readonly MkxlVariation[]>>;
  readonly stages: readonly MkxlStage[];
  readonly stageIds: readonly string[];
  readonly interactableIds: readonly string[];
  readonly inputNotationValues: MkxlInputNotationValueList;
  readonly movelistFiles: readonly MkxlResolvedCharacterMovelistFile[];
  readonly moveTreeRegistry: Readonly<Record<string, MkxlResolvedCharacterMovelistFile>>;
  readonly movelists: readonly MkxlMovelist[];
  readonly moves: readonly MkxlMove[];
  readonly moveIds: readonly string[];
  readonly comboFiles: readonly MkxlResolvedVariationComboFile[];
  readonly seededCombos: readonly MkxlSeededCombo[];
  readonly seededComboIds: readonly string[];
};
