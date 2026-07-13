import { activeMkxlDataset } from "../packs/value";
import type { MkxlDataSource, MkxlGame } from "./type";

export { mkxlDataSourceKinds } from "./constants";

export const mkxlDataSources = activeMkxlDataset.sources satisfies readonly MkxlDataSource[];

export const mkxlDataSourceIds = activeMkxlDataset.sources.map((source) => source.id);

export const mkxlGame = activeMkxlDataset.game satisfies MkxlGame;
