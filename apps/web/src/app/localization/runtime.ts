import type { LanguageCode } from "@mk-combos/contracts/settings/type";

import type { AppCopy } from "./type";
import { appCopyByLanguage } from "./value";

export function getAppCopy(language: LanguageCode): AppCopy {
  return appCopyByLanguage[language];
}

export function formatGameCopy(template: string, gameLabel: string): string {
  return template.replaceAll("{game}", gameLabel);
}
