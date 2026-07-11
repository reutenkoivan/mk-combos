import { NotationDisplayModeSchema } from "@mk-combos/contracts/settings/schema";
import { z } from "zod/v4";

import { uiNotationIconKinds, uiNotationTokenStates, uiNotationTokens } from "./value";

export { notationDisplayModes } from "./value";

export const UiNotationIconKindSchema = z.enum(uiNotationIconKinds);

export const UiNotationTokenSchema = z.enum(uiNotationTokens);

export const UiNotationTokenStateSchema = z.enum(uiNotationTokenStates);

export const UiNotationIconDescriptorSchema = z
  .object({
    accessibleLabel: z.string().min(1),
    displayLabel: z.string().min(1),
    iconName: z.string().min(1),
    kind: UiNotationIconKindSchema,
    mode: NotationDisplayModeSchema,
    state: UiNotationTokenStateSchema.optional(),
    token: z.string().min(1),
  })
  .strict();

export const UiNotationLegendRowSchema = z
  .object({
    markerIcons: z.array(UiNotationIconDescriptorSchema).readonly(),
    mode: NotationDisplayModeSchema,
    modeIcon: UiNotationIconDescriptorSchema,
    modeLabel: z.string().min(1),
    modifierIcons: z.array(UiNotationIconDescriptorSchema).readonly().optional(),
  })
  .strict();
