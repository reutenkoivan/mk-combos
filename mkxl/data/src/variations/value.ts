import { activeMkxlDataset } from "../packs/value";
import type { MkxlVariation } from "./type";

export const mkxlVariations = activeMkxlDataset.variations satisfies readonly MkxlVariation[];

export const mkxlVariationIds = activeMkxlDataset.variationIds;

export const mkxlVariationsByCharacterId = activeMkxlDataset.variationsByCharacterId;
