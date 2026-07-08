import { compileMkxlDataPack } from "./runtime";
import { mkxlXlFinalPack } from "./xl-final";

const activeMkxlDataPack = mkxlXlFinalPack;

export const activeMkxlDataset = compileMkxlDataPack(activeMkxlDataPack);
