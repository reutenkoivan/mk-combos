import { CatalogSearchSchema } from "./schema";
import type { CatalogSearch } from "./type";

export function parseCatalogSearch(input: unknown): CatalogSearch {
  return CatalogSearchSchema.parse(input);
}
