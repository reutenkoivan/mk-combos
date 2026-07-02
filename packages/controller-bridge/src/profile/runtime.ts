import type { LocalizedText } from "@mk-combos/contracts/settings/type";

import type { ControllerGamepadSnapshot } from "../input/type";
import type { ControllerProfile, ControllerProfileId } from "./type";
import { controllerProfiles } from "./value";

const fallbackProfile = controllerProfiles.find((profile) => profile.id === "standard");

const profileById = new Map<ControllerProfileId, ControllerProfile>(
  controllerProfiles.map((profile) => [profile.id, profile as ControllerProfile]),
);

const normalizeId = (id: string) => id.toLowerCase();

export function getControllerProfile(profileId?: string): ControllerProfile {
  if (profileId !== undefined && profileById.has(profileId as ControllerProfileId)) {
    return profileById.get(profileId as ControllerProfileId) as ControllerProfile;
  }

  return fallbackProfile as ControllerProfile;
}

export function detectControllerProfile(input: Pick<ControllerGamepadSnapshot, "id" | "mapping">) {
  const normalizedId = normalizeId(input.id);

  for (const profile of controllerProfiles) {
    if (profile.id === "standard") {
      continue;
    }
    if (profile.matchers.some((matcher) => normalizedId.includes(matcher))) {
      return profile as ControllerProfile;
    }
  }

  return getControllerProfile(input.mapping === "standard" ? "standard" : undefined);
}

export function getControllerButtonLabel(
  profileId: string | undefined,
  controlId: string,
): LocalizedText {
  const profile = getControllerProfile(profileId);
  return profile.buttonLabels[controlId] ?? { fallback: controlId };
}
