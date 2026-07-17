import { z } from "zod/v4";

import { catalogFilterChangeKinds } from "./value";

export { catalogFilterChangeKinds } from "./value";

const CatalogFilterIdSchema = z.string().trim().min(1);

const CatalogFilterOptionValueSchema = z.string().trim().min(1);

export const CatalogFilterChangeKindSchema = z.enum(catalogFilterChangeKinds);

const CatalogFilterClearAllChangeSchema = z
  .object({
    kind: z.literal(catalogFilterChangeKinds.clearAll),
  })
  .strict();

const CatalogFilterClearFacetChangeSchema = z
  .object({
    kind: z.literal(catalogFilterChangeKinds.clearFacet),
    filterId: CatalogFilterIdSchema,
  })
  .strict();

const CatalogFilterToggleOptionChangeSchema = z
  .object({
    kind: z.literal(catalogFilterChangeKinds.toggleOption),
    filterId: CatalogFilterIdSchema,
    value: CatalogFilterOptionValueSchema,
    selected: z.boolean(),
  })
  .strict();

export const CatalogFilterChangeSchema = z.discriminatedUnion("kind", [
  CatalogFilterClearAllChangeSchema,
  CatalogFilterClearFacetChangeSchema,
  CatalogFilterToggleOptionChangeSchema,
]);
