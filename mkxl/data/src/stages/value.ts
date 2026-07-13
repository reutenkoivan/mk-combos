import { activeMkxlDataset } from "../packs/value";
import type { MkxlStage } from "./type";

export { mkxlInteractableUsagePolicies } from "./constants";

export const mkxlStages = activeMkxlDataset.stages satisfies readonly MkxlStage[];

export const mkxlStageIds = activeMkxlDataset.stageIds;

export const mkxlInteractableIds = activeMkxlDataset.interactableIds;
