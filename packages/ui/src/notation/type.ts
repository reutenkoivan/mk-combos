import type { z } from "zod/v4";

import type {
  UiNotationIconDescriptorSchema,
  UiNotationIconKindSchema,
  UiNotationLegendRowSchema,
  UiNotationTokenSchema,
  UiNotationTokenStateSchema,
} from "./schema";

export {
  notationDisplayModes,
  uiNotationDisplayModeIconNames,
  uiNotationIconKinds,
  uiNotationModeTokenIconNames,
  uiNotationModeTokenLabels,
  uiNotationTokenKinds,
  uiNotationTokenStates,
  uiNotationTokens,
} from "./value";

export type UiNotationIconKind = z.output<typeof UiNotationIconKindSchema>;

export type UiNotationToken = z.output<typeof UiNotationTokenSchema>;

export type UiNotationTokenState = z.output<typeof UiNotationTokenStateSchema>;

export type UiNotationIconDescriptor = z.output<typeof UiNotationIconDescriptorSchema>;

export type UiNotationLegendRow = z.output<typeof UiNotationLegendRowSchema>;
