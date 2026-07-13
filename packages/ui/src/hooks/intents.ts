import { useCallback, useMemo } from "react";

import { createActionIntent, createValueIntent } from "../components/runtime";
import type {
  ComponentActionIntent,
  ComponentInteractionReason,
  ComponentValueIntent,
} from "../components/type";
import { componentInteractionReasons } from "../components/value";
import type { UiPrimitiveOpenChangePayload } from "../primitives/interaction";

type ComponentIntentEmitterSource = {
  sourceFocusTarget?: string;
  sourceSurface: string;
};

type ComponentIntentEmitterOptions<Intent> = ComponentIntentEmitterSource & {
  defaultReason?: ComponentInteractionReason;
  onRequest?: (intent: Intent) => void;
};

type ComponentIntentEmitterState = ComponentIntentEmitterSource & {
  canEmit: boolean;
  defaultReason: ComponentInteractionReason;
};

/** Source metadata and optional action-intent sink used by the action emitter. */
export type UseComponentActionEmitterOptions<Action extends string> = ComponentIntentEmitterOptions<
  ComponentActionIntent<Action>
>;

/** Stable action-emitter capability state and semantic mutation API. */
export type UseComponentActionEmitterResult<Action extends string> = {
  methods: {
    emitAction: (action: Action, reason?: ComponentInteractionReason) => void;
  };
  state: ComponentIntentEmitterState;
};

/** Binds shared component source metadata to semantic action intents without storing emitted state. */
export function useComponentActionEmitter<Action extends string>(
  options: UseComponentActionEmitterOptions<Action>,
): UseComponentActionEmitterResult<Action> {
  const defaultReason = options.defaultReason ?? componentInteractionReasons.press;
  const emitAction = useCallback(
    (action: Action, reason: ComponentInteractionReason = defaultReason) => {
      options.onRequest?.(
        createActionIntent({
          action,
          reason,
          sourceFocusTarget: options.sourceFocusTarget,
          sourceSurface: options.sourceSurface,
        }),
      );
    },
    [defaultReason, options.onRequest, options.sourceFocusTarget, options.sourceSurface],
  );
  const state = useMemo<ComponentIntentEmitterState>(
    () => ({
      canEmit: options.onRequest !== undefined,
      defaultReason,
      sourceFocusTarget: options.sourceFocusTarget,
      sourceSurface: options.sourceSurface,
    }),
    [defaultReason, options.onRequest, options.sourceFocusTarget, options.sourceSurface],
  );
  const methods = useMemo(() => ({ emitAction }), [emitAction]);

  return useMemo(() => ({ methods, state }), [methods, state]);
}

/** Source metadata and optional value-intent sink used by the value emitter. */
export type UseComponentValueEmitterOptions<Value extends string> = ComponentIntentEmitterOptions<
  ComponentValueIntent<Value>
>;

/** Stable value-emitter capability state and semantic mutation API. */
export type UseComponentValueEmitterResult<Value extends string> = {
  methods: {
    emitValue: (value: Value, reason?: ComponentInteractionReason) => void;
  };
  state: ComponentIntentEmitterState;
};

/** Binds shared component source metadata to semantic value intents without storing selected values. */
export function useComponentValueEmitter<Value extends string>(
  options: UseComponentValueEmitterOptions<Value>,
): UseComponentValueEmitterResult<Value> {
  const defaultReason = options.defaultReason ?? componentInteractionReasons.press;
  const emitValue = useCallback(
    (value: Value, reason: ComponentInteractionReason = defaultReason) => {
      options.onRequest?.(
        createValueIntent({
          reason,
          sourceFocusTarget: options.sourceFocusTarget,
          sourceSurface: options.sourceSurface,
          value,
        }),
      );
    },
    [defaultReason, options.onRequest, options.sourceFocusTarget, options.sourceSurface],
  );
  const state = useMemo<ComponentIntentEmitterState>(
    () => ({
      canEmit: options.onRequest !== undefined,
      defaultReason,
      sourceFocusTarget: options.sourceFocusTarget,
      sourceSurface: options.sourceSurface,
    }),
    [defaultReason, options.onRequest, options.sourceFocusTarget, options.sourceSurface],
  );
  const methods = useMemo(() => ({ emitValue }), [emitValue]);

  return useMemo(() => ({ methods, state }), [methods, state]);
}

type ComponentOpenChangeActions<Action extends string> =
  | { closeAction?: Action; openAction: Action }
  | { closeAction: Action; openAction?: Action };

/**
 * Open-change mapping with at least one semantic action. Close-only mappings support controlled
 * dialogs that never request an open transition.
 */
export type UseComponentOpenChangeEmitterOptions<Action extends string> =
  ComponentIntentEmitterSource &
    ComponentOpenChangeActions<Action> & {
      onRequest?: (intent: ComponentActionIntent<Action>) => void;
    };

type ComponentOpenChangeEmitterState<Action extends string> = ComponentIntentEmitterSource & {
  canEmit: boolean;
  canEmitClose: boolean;
  canEmitOpen: boolean;
  closeAction?: Action;
  openAction?: Action;
};

/** Stable open-change capability state and normalized payload handler. */
export type UseComponentOpenChangeEmitterResult<Action extends string> = {
  methods: {
    handleOpenChange: (payload: UiPrimitiveOpenChangePayload) => void;
  };
  state: ComponentOpenChangeEmitterState<Action>;
};

/** Converts normalized primitive open changes into component action intents without owning open state. */
export function useComponentOpenChangeEmitter<Action extends string>(
  options: UseComponentOpenChangeEmitterOptions<Action>,
): UseComponentOpenChangeEmitterResult<Action> {
  const handleOpenChange = useCallback(
    (payload: UiPrimitiveOpenChangePayload) => {
      const action = payload.open ? options.openAction : options.closeAction;
      if (action === undefined) {
        return;
      }

      options.onRequest?.(
        createActionIntent({
          action,
          reason: payload.reason,
          sourceFocusTarget: payload.sourceFocusTarget ?? options.sourceFocusTarget,
          sourceSurface: options.sourceSurface,
        }),
      );
    },
    [
      options.closeAction,
      options.onRequest,
      options.openAction,
      options.sourceFocusTarget,
      options.sourceSurface,
    ],
  );
  const state = useMemo<ComponentOpenChangeEmitterState<Action>>(() => {
    const hasRequest = options.onRequest !== undefined;
    const canEmitClose = hasRequest && options.closeAction !== undefined;
    const canEmitOpen = hasRequest && options.openAction !== undefined;
    return {
      canEmit: canEmitClose || canEmitOpen,
      canEmitClose,
      canEmitOpen,
      closeAction: options.closeAction,
      openAction: options.openAction,
      sourceFocusTarget: options.sourceFocusTarget,
      sourceSurface: options.sourceSurface,
    };
  }, [
    options.closeAction,
    options.onRequest,
    options.openAction,
    options.sourceFocusTarget,
    options.sourceSurface,
  ]);
  const methods = useMemo(() => ({ handleOpenChange }), [handleOpenChange]);

  return useMemo(() => ({ methods, state }), [methods, state]);
}
