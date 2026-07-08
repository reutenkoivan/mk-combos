import { activeMkxlDataset } from "../packs/value";
import type { MkxlCharacter } from "./type";

export const mkxlCharacters = activeMkxlDataset.characters satisfies readonly MkxlCharacter[];

export const mkxlCharacterIds = activeMkxlDataset.characterIds;
