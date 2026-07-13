import { activeMkxlDataset } from "../packs/value";
import type { MkxlCharacter } from "./type";

export { mkxlCharacterReleaseKinds } from "./constants";

export const mkxlCharacters = activeMkxlDataset.characters satisfies readonly MkxlCharacter[];

export const mkxlCharacterIds = activeMkxlDataset.characterIds;
