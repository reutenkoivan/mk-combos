import type { LanguageCode } from "@mk-combos/contracts/settings/type";
import { languageCodes, notationDisplayModes } from "@mk-combos/contracts/settings/value";
import type {
  DisplayModeSwitcherOption,
  LanguageSwitcherOption,
} from "@mk-combos/ui/components/type";
import { componentOptionStatuses } from "@mk-combos/ui/components/value";

export function getLanguageOptions(_language: LanguageCode): readonly LanguageSwitcherOption[] {
  return [
    {
      label: "English",
      language: languageCodes.EN,
      shortLabel: languageCodes.EN,
      status: componentOptionStatuses.available,
    },
    {
      label: "Українська",
      language: languageCodes.UA,
      shortLabel: languageCodes.UA,
      status: componentOptionStatuses.available,
    },
  ];
}

export const displayModeOptions: readonly DisplayModeSwitcherOption[] = [
  {
    label: notationDisplayModes.FGC,
    mode: notationDisplayModes.FGC,
    status: componentOptionStatuses.available,
  },
  {
    label: notationDisplayModes.PlayStation,
    mode: notationDisplayModes.PlayStation,
    shortLabel: "PS",
    status: componentOptionStatuses.available,
  },
  {
    label: notationDisplayModes.Xbox,
    mode: notationDisplayModes.Xbox,
    shortLabel: "XB",
    status: componentOptionStatuses.available,
  },
];
