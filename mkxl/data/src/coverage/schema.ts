import { z } from "zod/v4";

export const MkxlCoverageTargetsSchema = z
  .object({
    expectedCharacterCount: z.number().int().positive(),
    expectedVariationCount: z.number().int().positive(),
    expectedStageCount: z.number().int().positive(),
    minimumCombosPerVariation: z.number().int().positive(),
    requireSourceProvenance: z.boolean(),
    requireLocalizedLabels: z.boolean(),
  })
  .strict();

export const MkxlDataValidationIssueSchema = z
  .object({
    code: z.string().min(1),
    message: z.string().min(1),
    path: z.array(z.string().min(1)).readonly().optional(),
  })
  .strict();

export const MkxlDataValidationCountsSchema = z
  .object({
    characters: z.number().int().min(0),
    variations: z.number().int().min(0),
    movelists: z.number().int().min(0),
    moves: z.number().int().min(0),
    combos: z.number().int().min(0),
    variationGraphs: z.number().int().min(0),
    stageGraphFragments: z.number().int().min(0),
    stages: z.number().int().min(0),
    interactables: z.number().int().min(0),
  })
  .strict();

export const MkxlDataValidationResultSchema = z
  .object({
    ok: z.boolean(),
    counts: MkxlDataValidationCountsSchema,
    issues: z.array(MkxlDataValidationIssueSchema).readonly(),
  })
  .strict();
