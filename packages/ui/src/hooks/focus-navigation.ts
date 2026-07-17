import { useCallback, useMemo, useState } from "react";

import {
  getControllerFocusAttributes,
  moveFocus as moveFocusInScope,
  resolveFocusEntry,
} from "../focus-navigation/runtime";
import { UiFocusNavigationScopeSchema } from "../focus-navigation/schema";
import type { UiFocusDirection, UiFocusNavigationScope } from "../focus-navigation/type";
import { uiFocusDirections } from "../focus-navigation/value";
import { useUiRootContext } from "../internal/ui-root-context";

/** Strict navigation scope and optional initial semantic target for one focus owner. */
export type UseFocusNavigationOptions = {
  initialTargetId?: string;
  scope: UiFocusNavigationScope;
};

type FocusNavigationState = {
  availableTargetCount: number;
  availableTargetIds: readonly string[];
  canMoveByDirection: Readonly<Record<UiFocusDirection, boolean>>;
  focusedTargetId?: string;
  hasFocusedTarget: boolean;
  scopeId: string;
  targetCount: number;
};

type FocusNavigationMethods = {
  canMoveFocus: (direction: UiFocusDirection) => boolean;
  focusTarget: (targetId: string) => void;
  getNextFocusTarget: (direction: UiFocusDirection) => string | undefined;
  getTargetAttributes: (targetId: string) => ReturnType<typeof getControllerFocusAttributes>;
  isFocused: (targetId: string) => boolean;
  moveFocus: (direction: UiFocusDirection) => void;
  resetFocus: (preferredTargetId?: string) => void;
};

/** Stable focus-navigation read model and semantic movement API. */
export type UseFocusNavigationResult = {
  methods: FocusNavigationMethods;
  state: FocusNavigationState;
};

/**
 * Owns deterministic controller focus for one prepared, game-agnostic focus scope.
 * Movement skips disabled targets and never reads geometry or calls DOM focus methods.
 */
export function useFocusNavigation(options: UseFocusNavigationOptions): UseFocusNavigationResult {
  const { controllerFocusVisible } = useUiRootContext();
  const scope = useMemo(() => UiFocusNavigationScopeSchema.parse(options.scope), [options.scope]);
  const [requestedTargetId, setRequestedTargetId] = useState(options.initialTargetId);
  const focusedTargetId = useMemo(
    () => resolveFocusEntry(scope, requestedTargetId),
    [requestedTargetId, scope],
  );
  const availableTargetIds = useMemo(
    () => scope.targets.filter((target) => !target.disabled).map((target) => target.id),
    [scope.targets],
  );
  const nextTargetByDirection = useMemo<Readonly<Record<UiFocusDirection, string | undefined>>>(
    () => ({
      [uiFocusDirections.down]: moveFocusInScope(scope, focusedTargetId, uiFocusDirections.down),
      [uiFocusDirections.left]: moveFocusInScope(scope, focusedTargetId, uiFocusDirections.left),
      [uiFocusDirections.right]: moveFocusInScope(scope, focusedTargetId, uiFocusDirections.right),
      [uiFocusDirections.up]: moveFocusInScope(scope, focusedTargetId, uiFocusDirections.up),
    }),
    [focusedTargetId, scope],
  );
  const canMoveByDirection = useMemo<Readonly<Record<UiFocusDirection, boolean>>>(
    () => ({
      [uiFocusDirections.down]:
        nextTargetByDirection[uiFocusDirections.down] !== undefined &&
        nextTargetByDirection[uiFocusDirections.down] !== focusedTargetId,
      [uiFocusDirections.left]:
        nextTargetByDirection[uiFocusDirections.left] !== undefined &&
        nextTargetByDirection[uiFocusDirections.left] !== focusedTargetId,
      [uiFocusDirections.right]:
        nextTargetByDirection[uiFocusDirections.right] !== undefined &&
        nextTargetByDirection[uiFocusDirections.right] !== focusedTargetId,
      [uiFocusDirections.up]:
        nextTargetByDirection[uiFocusDirections.up] !== undefined &&
        nextTargetByDirection[uiFocusDirections.up] !== focusedTargetId,
    }),
    [focusedTargetId, nextTargetByDirection],
  );

  const focusTarget = useCallback(
    (targetId: string) => {
      setRequestedTargetId(resolveFocusEntry(scope, targetId));
    },
    [scope],
  );
  const moveFocus = useCallback(
    (direction: UiFocusDirection) => {
      setRequestedTargetId((currentTargetId) =>
        moveFocusInScope(scope, resolveFocusEntry(scope, currentTargetId), direction),
      );
    },
    [scope],
  );
  const resetFocus = useCallback(
    (preferredTargetId?: string) => {
      setRequestedTargetId(resolveFocusEntry(scope, preferredTargetId));
    },
    [scope],
  );
  const isFocused = useCallback(
    (targetId: string) => controllerFocusVisible && focusedTargetId === targetId,
    [controllerFocusVisible, focusedTargetId],
  );
  const canMoveFocus = useCallback(
    (direction: UiFocusDirection) => canMoveByDirection[direction],
    [canMoveByDirection],
  );
  const getNextFocusTarget = useCallback(
    (direction: UiFocusDirection) => nextTargetByDirection[direction],
    [nextTargetByDirection],
  );
  const getTargetAttributes = useCallback(
    (targetId: string) =>
      getControllerFocusAttributes({
        focused: controllerFocusVisible && focusedTargetId === targetId,
        targetId,
      }),
    [controllerFocusVisible, focusedTargetId],
  );
  const state = useMemo<FocusNavigationState>(
    () => ({
      availableTargetCount: availableTargetIds.length,
      availableTargetIds,
      canMoveByDirection,
      focusedTargetId,
      hasFocusedTarget: focusedTargetId !== undefined,
      scopeId: scope.id,
      targetCount: scope.targets.length,
    }),
    [availableTargetIds, canMoveByDirection, focusedTargetId, scope.id, scope.targets.length],
  );
  const methods = useMemo<FocusNavigationMethods>(
    () => ({
      canMoveFocus,
      focusTarget,
      getNextFocusTarget,
      getTargetAttributes,
      isFocused,
      moveFocus,
      resetFocus,
    }),
    [
      canMoveFocus,
      focusTarget,
      getNextFocusTarget,
      getTargetAttributes,
      isFocused,
      moveFocus,
      resetFocus,
    ],
  );

  return useMemo(() => ({ methods, state }), [methods, state]);
}
