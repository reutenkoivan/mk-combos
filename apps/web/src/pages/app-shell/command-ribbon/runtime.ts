import type { ControllerCommandId } from "@mk-combos/controller-bridge/command/type";
import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";

const navigationCommandIds = new Set<ControllerCommandId>([
  knownControllerCommandIds.navDown,
  knownControllerCommandIds.navLeft,
  knownControllerCommandIds.navRight,
  knownControllerCommandIds.navUp,
]);

const commandNotationTokens: Partial<Record<ControllerCommandId, string>> = {
  [knownControllerCommandIds.back]: "4",
  [knownControllerCommandIds.confirm]: "3",
  [knownControllerCommandIds.nextTab]: "rightShoulder",
  [knownControllerCommandIds.openActions]: "1",
  [knownControllerCommandIds.openFilters]: "2",
  [knownControllerCommandIds.openGlobalMenu]: "start",
  [knownControllerCommandIds.previousTab]: "leftShoulder",
};

export function resolveRibbonCommandPresentation(commandIds: readonly ControllerCommandId[]) {
  if (commandIds.some((commandId) => navigationCommandIds.has(commandId))) {
    return { kind: "text", value: "D-Pad" } as const;
  }

  for (const commandId of commandIds) {
    const token = commandNotationTokens[commandId];

    if (token !== undefined) {
      return { kind: "notation", token } as const;
    }
  }

  return { kind: "text", value: commandIds[0] ?? "" } as const;
}
