import { z } from "zod/v4";

const CatalogSearchScalarSchema = z.union([z.string(), z.number().finite(), z.boolean()]);

export const CatalogSearchSchema = z.record(z.string(), z.unknown()).transform((input) => {
  const search: Record<string, string | readonly string[]> = {};

  for (const [key, value] of Object.entries(input)) {
    const scalar = CatalogSearchScalarSchema.safeParse(value);

    if (scalar.success) {
      search[key] = String(scalar.data);
      continue;
    }

    if (!Array.isArray(value)) {
      continue;
    }

    const values: string[] = [];

    for (const entry of value) {
      const parsedEntry = CatalogSearchScalarSchema.safeParse(entry);

      if (parsedEntry.success) {
        values.push(String(parsedEntry.data));
      }
    }

    if (values.length > 0) {
      search[key] = values;
    }
  }

  return search;
});
