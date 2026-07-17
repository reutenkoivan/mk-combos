import type { LanguageCode, LocalizedText } from "@mk-combos/contracts/settings/type";
import { languageCodes } from "@mk-combos/contracts/settings/value";

import type { AppCopy } from "./type";
import { appCopyByLanguage } from "./value";

export function getAppCopy(language: LanguageCode): AppCopy {
  return appCopyByLanguage[language];
}

export function formatGameCopy(template: string, gameLabel: string): string {
  return template.replaceAll("{game}", gameLabel);
}

export function formatCountCopy(template: string, count: number): string {
  return template.replaceAll("{count}", String(count));
}

export function resolveLocalizedText(
  text: LocalizedText | undefined,
  language: LanguageCode,
  explicitFallback: string,
): string {
  const secondaryLanguage = language === languageCodes.EN ? languageCodes.UA : languageCodes.EN;
  const candidates = [
    text?.[language],
    text?.default,
    text?.fallback,
    text?.[secondaryLanguage],
    explicitFallback,
  ];

  for (const candidate of candidates) {
    const normalized = candidate?.trim();

    if (normalized) {
      return normalized;
    }
  }

  return explicitFallback;
}
