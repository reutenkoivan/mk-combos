import { z } from "zod/v4";

export const Mk1CoverageTargetsSchema = z
  .object({
    expectedCharacterCount: z.number().int().positive(),
    expectedKameoCount: z.number().int().positive(),
    expectedPairComboCount: z.number().int().positive(),
    minimumCombosPerPair: z.number().int().positive(),
    requireSourceProvenance: z.boolean(),
    requireLocalizedLabels: z.boolean(),
  })
  .strict();

export const Mk1DataValidationIssueSchema = z
  .object({
    code: z.string().min(1),
    message: z.string().min(1),
    path: z.array(z.string().min(1)).readonly().optional(),
  })
  .strict();

export const Mk1DataValidationCountsSchema = z
  .object({
    characters: z.number().int().min(0),
    kameos: z.number().int().min(0),
    movelists: z.number().int().min(0),
    moves: z.number().int().min(0),
    combos: z.number().int().min(0),
    characterGraphs: z.number().int().min(0),
    kameoGraphOverlays: z.number().int().min(0),
  })
  .strict();

export const Mk1DataValidationResultSchema = z
  .object({
    ok: z.boolean(),
    counts: Mk1DataValidationCountsSchema,
    issues: z.array(Mk1DataValidationIssueSchema).readonly(),
  })
  .strict();
