import { UiFocusNavigationScopeSchema } from "./schema";
import type { UiFocusDirection, UiFocusNavigationScope, UiFocusNavigationTarget } from "./type";

const indexTargets = (scope: UiFocusNavigationScope) =>
  new Map(scope.targets.map((target) => [target.id, target]));

const firstAvailable = (
  targets: ReadonlyMap<string, UiFocusNavigationTarget>,
  ids: readonly (string | undefined)[],
) => {
  for (const id of ids) {
    if (!id) {
      continue;
    }

    const target = targets.get(id);

    if (target && !target.disabled) {
      return target.id;
    }
  }

  for (const target of targets.values()) {
    if (!target.disabled) {
      return target.id;
    }
  }

  return undefined;
};

export function resolveFocusEntry(
  input: UiFocusNavigationScope,
  preferredTargetId?: string,
): string | undefined {
  const scope = UiFocusNavigationScopeSchema.parse(input);
  const targets = indexTargets(scope);

  return firstAvailable(targets, [preferredTargetId, scope.fallbackTargetId, scope.entryTargetId]);
}

export function moveFocus(
  input: UiFocusNavigationScope,
  currentTargetId: string | undefined,
  direction: UiFocusDirection,
): string | undefined {
  const scope = UiFocusNavigationScopeSchema.parse(input);
  const targets = indexTargets(scope);
  const currentId = resolveFocusEntry(scope, currentTargetId);

  if (!currentId) {
    return undefined;
  }

  const visited = new Set([currentId]);
  let candidateId = targets.get(currentId)?.neighbors[direction];

  while (candidateId && !visited.has(candidateId)) {
    visited.add(candidateId);
    const candidate = targets.get(candidateId);

    if (!candidate) {
      return currentId;
    }

    if (!candidate.disabled) {
      return candidate.id;
    }

    candidateId = candidate.neighbors[direction];
  }

  return currentId;
}

export const getControllerFocusAttributes = (input: { focused: boolean; targetId: string }) => ({
  "data-controller-focused": input.focused ? "true" : undefined,
  "data-ui-focus-target": input.targetId,
});
