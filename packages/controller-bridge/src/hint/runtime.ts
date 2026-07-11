import { defaultControllerBindings } from "../bridge/runtime";
import { ControllerCommandMetadataListSchema } from "../command/schema";
import type { ControllerCommandMetadata } from "../command/type";
import { controllerCommandMetadata } from "../command/value";
import { getControllerButtonLabel, getControllerProfile } from "../profile/runtime";
import type { ControllerHintRequest, ControllerHintRow } from "./type";

const runtimeControllerCommandMetadata =
  ControllerCommandMetadataListSchema.parse(controllerCommandMetadata);

const commandMetadataById = new Map<string, ControllerCommandMetadata>();

for (const metadata of runtimeControllerCommandMetadata) {
  commandMetadataById.set(metadata.id, metadata);
}

export function buildControllerHints(input: ControllerHintRequest = {}): ControllerHintRow[] {
  const profile = getControllerProfile(input.profileId);
  const commandIds = input.commandIds === undefined ? undefined : new Set(input.commandIds);
  const availableCommandIds =
    input.availableCommandIds === undefined ? undefined : new Set(input.availableCommandIds);
  const bindings: readonly NonNullable<ControllerHintRequest["bindings"]>[number][] =
    input.bindings ?? defaultControllerBindings;
  const seenCommandIds = new Set<string>();
  const rows: ControllerHintRow[] = [];

  for (const binding of bindings) {
    if (seenCommandIds.has(binding.commandId)) {
      continue;
    }
    if (commandIds !== undefined && !commandIds.has(binding.commandId)) {
      continue;
    }

    const metadata = commandMetadataById.get(binding.commandId);
    const row: ControllerHintRow = {
      commandId: binding.commandId,
      commandLabel: metadata?.label ?? { fallback: binding.commandId },
      controlId: binding.controlId,
      controlLabel: getControllerButtonLabel(profile.id, binding.controlId),
      profileId: profile.id,
    };

    if (metadata?.description !== undefined) {
      row.commandDescription = metadata.description;
    }
    if (availableCommandIds !== undefined) {
      row.available = availableCommandIds.has(binding.commandId);
    }
    if (binding.metadata !== undefined) {
      row.metadata = binding.metadata;
    }

    rows.push(row);
    seenCommandIds.add(binding.commandId);
  }

  return rows;
}
