import type { LocalizedText } from "@mk-combos/contracts/settings/type";

import type { ControllerGamepadSnapshot } from "../input/type";
import { ControllerProfileListSchema } from "./schema";
import type { ControllerProfile } from "./type";
import { controllerProfileIds, controllerProfiles } from "./value";

const runtimeControllerProfiles = ControllerProfileListSchema.parse(controllerProfiles);

const profileById = new Map<string, ControllerProfile>();

for (const profile of runtimeControllerProfiles) {
  profileById.set(profile.id, profile);
}

const requireFallbackProfile = (): ControllerProfile => {
  const fallbackProfile = profileById.get(controllerProfileIds.standard);

  if (fallbackProfile === undefined) {
    throw new Error("Standard controller profile is not registered.");
  }

  return fallbackProfile;
};

const fallbackProfile = requireFallbackProfile();

const normalizeId = (id: string) => id.toLowerCase();

export function getControllerProfile(profileId?: string): ControllerProfile {
  if (profileId !== undefined) {
    return profileById.get(profileId) ?? fallbackProfile;
  }

  return fallbackProfile;
}

export function detectControllerProfile(input: Pick<ControllerGamepadSnapshot, "id" | "mapping">) {
  const normalizedId = normalizeId(input.id);

  for (const profile of runtimeControllerProfiles) {
    if (profile.id === controllerProfileIds.standard) {
      continue;
    }
    if (profile.matchers.some((matcher) => normalizedId.includes(matcher))) {
      return profile;
    }
  }

  return getControllerProfile(
    input.mapping === controllerProfileIds.standard ? controllerProfileIds.standard : undefined,
  );
}

export function getControllerButtonLabel(
  profileId: string | undefined,
  controlId: string,
): LocalizedText {
  const profile = getControllerProfile(profileId);
  return profile.buttonLabels[controlId] ?? { fallback: controlId };
}
