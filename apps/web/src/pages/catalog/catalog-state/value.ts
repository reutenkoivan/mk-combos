import type { UiToneMode } from "@mk-combos/ui/tokens/type";
import { uiToneModes } from "@mk-combos/ui/tokens/value";

export const catalogDifficultyToneByValue = {
  easy: uiToneModes.success,
  hard: uiToneModes.destructive,
  medium: uiToneModes.warning,
} as const satisfies Readonly<Record<string, UiToneMode>>;

export const catalogRouteToneByValue = {
  bnb: uiToneModes.success,
  kameo: uiToneModes.accent,
  metered: uiToneModes.warning,
  punish: uiToneModes.destructive,
  stage: uiToneModes.accent,
} as const satisfies Readonly<Record<string, UiToneMode>>;
