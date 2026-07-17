import { act, render, screen } from "@mk-combos/contracts/test/unit/react";
import type { ComponentActionIntent, ComponentValueIntent } from "@mk-combos/ui/components/type";
import { componentInteractionReasons, uiResponsiveModes } from "@mk-combos/ui/components/value";
import type { UiFocusNavigationScope } from "@mk-combos/ui/focus-navigation/type";
import { uiFocusDirections } from "@mk-combos/ui/focus-navigation/value";
import { type UseFieldMessageResult, useFieldMessage } from "@mk-combos/ui/hooks/field-message";
import {
  type UseFocusNavigationResult,
  useFocusNavigation,
} from "@mk-combos/ui/hooks/focus-navigation";
import {
  type UseComponentActionEmitterResult,
  type UseComponentOpenChangeEmitterResult,
  type UseComponentValueEmitterResult,
  useComponentActionEmitter,
  useComponentOpenChangeEmitter,
  useComponentValueEmitter,
} from "@mk-combos/ui/hooks/intents";
import { type UseUiOpenStateResult, useUiOpenState } from "@mk-combos/ui/hooks/open-state";
import {
  type UseResponsiveModeResult,
  useResponsiveMode,
} from "@mk-combos/ui/hooks/responsive-mode";
import { UiRoot } from "@mk-combos/ui/primitives/layout";
import { afterEach, describe, expect, it, vi } from "vitest";

const requireHookResult = <Result,>(result: Result | undefined): Result => {
  if (result === undefined) {
    throw new Error("Hook harness did not render");
  }
  return result;
};

describe("@mk-combos/ui hooks", () => {
  it("owns presentation open state and changes the return references only with state", () => {
    let hookResult: UseUiOpenStateResult | undefined;

    function Harness(props: { initialOpen: boolean }) {
      hookResult = useUiOpenState({ initialOpen: props.initialOpen });
      return <output>{hookResult.state.open ? "open" : "closed"}</output>;
    }

    const view = render(<Harness initialOpen={false} />);
    const initial = requireHookResult(hookResult);
    expect(initial.state).toEqual({
      baselineOpen: false,
      canClose: false,
      canOpen: true,
      canReset: false,
      dirty: false,
      open: false,
    });

    view.rerender(<Harness initialOpen />);
    const unchanged = requireHookResult(hookResult);
    expect(unchanged).toBe(initial);
    expect(unchanged.state.open).toBe(false);

    act(() => unchanged.methods.open());
    const opened = requireHookResult(hookResult);
    expect(opened.state).toMatchObject({ canClose: true, canOpen: false, dirty: true, open: true });
    expect(screen.getByText("open")).toBeTruthy();

    const openedReference = opened;
    act(() => opened.methods.open());
    expect(requireHookResult(hookResult)).toBe(openedReference);

    act(() => opened.methods.setOpen((currentOpen) => !currentOpen));
    expect(requireHookResult(hookResult).state.open).toBe(false);
    act(() => requireHookResult(hookResult).methods.resetOpen());
    expect(requireHookResult(hookResult).state.dirty).toBe(false);
    act(() => requireHookResult(hookResult).methods.rebaseOpen(true));
    expect(requireHookResult(hookResult).state).toMatchObject({
      baselineOpen: true,
      canReset: false,
      dirty: false,
      open: true,
    });
    act(() => requireHookResult(hookResult).methods.toggle());
    expect(requireHookResult(hookResult).state).toMatchObject({ dirty: true, open: false });
    act(() => requireHookResult(hookResult).methods.close());
    expect(requireHookResult(hookResult).state.open).toBe(false);
  });

  it("exposes intent capabilities and emits exact semantic payloads", () => {
    type Action = "close" | "open" | "save";
    type Value = "FGC" | "Xbox";
    const onAction = vi.fn<(intent: ComponentActionIntent<Action>) => void>();
    const onValue = vi.fn<(intent: ComponentValueIntent<Value>) => void>();
    let actionHook: UseComponentActionEmitterResult<Action> | undefined;
    let valueHook: UseComponentValueEmitterResult<Value> | undefined;
    let openHook: UseComponentOpenChangeEmitterResult<Action> | undefined;

    function Harness() {
      actionHook = useComponentActionEmitter<Action>({
        onRequest: onAction,
        sourceFocusTarget: "save-button",
        sourceSurface: "settings",
      });
      valueHook = useComponentValueEmitter<Value>({
        defaultReason: componentInteractionReasons.itemPress,
        onRequest: onValue,
        sourceSurface: "settings",
      });
      openHook = useComponentOpenChangeEmitter<Action>({
        closeAction: "close",
        onRequest: onAction,
        openAction: "open",
        sourceFocusTarget: "fallback-trigger",
        sourceSurface: "settings",
      });
      return null;
    }

    const view = render(<Harness />);
    const initialActionHook = requireHookResult(actionHook);
    const initialValueHook = requireHookResult(valueHook);
    const initialOpenHook = requireHookResult(openHook);
    expect(initialActionHook.state).toEqual({
      canEmit: true,
      defaultReason: componentInteractionReasons.press,
      sourceFocusTarget: "save-button",
      sourceSurface: "settings",
    });
    expect(initialValueHook.state.defaultReason).toBe(componentInteractionReasons.itemPress);
    expect(initialOpenHook.state).toMatchObject({
      canEmit: true,
      canEmitClose: true,
      canEmitOpen: true,
      closeAction: "close",
      openAction: "open",
    });
    view.rerender(<Harness />);
    expect(requireHookResult(actionHook)).toBe(initialActionHook);
    expect(requireHookResult(valueHook)).toBe(initialValueHook);
    expect(requireHookResult(openHook)).toBe(initialOpenHook);

    act(() => requireHookResult(actionHook).methods.emitAction("save"));
    expect(onAction).toHaveBeenLastCalledWith({
      action: "save",
      reason: componentInteractionReasons.press,
      sourceFocusTarget: "save-button",
      sourceSurface: "settings",
    });

    act(() =>
      requireHookResult(valueHook).methods.emitValue(
        "Xbox",
        componentInteractionReasons.listNavigation,
      ),
    );
    expect(onValue).toHaveBeenLastCalledWith({
      reason: componentInteractionReasons.listNavigation,
      sourceFocusTarget: undefined,
      sourceSurface: "settings",
      value: "Xbox",
    });

    act(() =>
      requireHookResult(openHook).methods.handleOpenChange({
        open: false,
        reason: componentInteractionReasons.escapeKey,
        sourceFocusTarget: "actual-trigger",
      }),
    );
    expect(onAction).toHaveBeenLastCalledWith({
      action: "close",
      reason: componentInteractionReasons.escapeKey,
      sourceFocusTarget: "actual-trigger",
      sourceSurface: "settings",
    });
  });

  it("keeps close-only and missing intent handlers as safe capabilities", () => {
    const onClose = vi.fn<(intent: ComponentActionIntent<"close">) => void>();
    let actionHook: UseComponentActionEmitterResult<"save"> | undefined;
    let closeHook: UseComponentOpenChangeEmitterResult<"close"> | undefined;

    function Harness() {
      actionHook = useComponentActionEmitter({ sourceSurface: "settings" });
      closeHook = useComponentOpenChangeEmitter({
        closeAction: "close",
        onRequest: onClose,
        sourceSurface: "settings",
      });
      return null;
    }

    render(<Harness />);
    expect(requireHookResult(actionHook).state.canEmit).toBe(false);
    expect(requireHookResult(closeHook).state).toMatchObject({
      canEmit: true,
      canEmitClose: true,
      canEmitOpen: false,
    });
    expect(() => requireHookResult(actionHook).methods.emitAction("save")).not.toThrow();
    expect(() =>
      requireHookResult(closeHook).methods.handleOpenChange({
        open: true,
        reason: componentInteractionReasons.triggerPress,
      }),
    ).not.toThrow();
    expect(onClose).not.toHaveBeenCalled();
    act(() =>
      requireHookResult(closeHook).methods.handleOpenChange({
        open: false,
        reason: componentInteractionReasons.outsidePress,
      }),
    );
    expect(onClose).toHaveBeenCalledWith({
      action: "close",
      reason: componentInteractionReasons.outsidePress,
      sourceFocusTarget: undefined,
      sourceSurface: "settings",
    });
  });

  it("provides stable field message state and memoized accessibility bindings", () => {
    let hookResult: UseFieldMessageResult | undefined;
    let secondaryHookResult: UseFieldMessageResult | undefined;

    function Harness(props: { hasMessage: boolean; id?: string; invalid?: boolean }) {
      hookResult = useFieldMessage(props);
      secondaryHookResult = useFieldMessage({ hasMessage: true });
      const result = hookResult;
      return (
        <div>
          <input aria-label="Field" {...result.methods.getControlProps()} />
          {props.hasMessage && <div id={result.methods.getMessageProps().id}>Prepared message</div>}
        </div>
      );
    }

    const view = render(<Harness hasMessage invalid />);
    const initial = requireHookResult(hookResult);
    const initialControlProps = initial.methods.getControlProps();
    const initialMessageProps = initial.methods.getMessageProps();
    expect(requireHookResult(secondaryHookResult).state.messageId).not.toBe(
      initial.state.messageId,
    );
    expect(initial.state).toMatchObject({ hasMessage: true, invalid: true });
    expect(screen.getByLabelText("Field").getAttribute("aria-describedby")).toBe(
      initial.state.messageId,
    );
    expect(screen.getByLabelText("Field").getAttribute("aria-invalid")).toBe("true");

    view.rerender(<Harness hasMessage invalid />);
    const unchanged = requireHookResult(hookResult);
    expect(unchanged).toBe(initial);
    expect(unchanged.methods.getControlProps()).toBe(initialControlProps);
    expect(unchanged.methods.getMessageProps()).toBe(initialMessageProps);

    view.rerender(<Harness hasMessage={false} id="explicit-message" />);
    const explicit = requireHookResult(hookResult);
    expect(explicit.state).toEqual({
      describedBy: undefined,
      hasMessage: false,
      invalid: false,
      messageId: "explicit-message",
    });
    expect(screen.getByLabelText("Field").getAttribute("aria-describedby")).toBeNull();
  });
});

type MockMediaQuery = ReturnType<typeof createMockMediaQuery>;

function createMockMediaQuery(media: string, initialMatches: boolean | string) {
  let matches: boolean | string = initialMatches;
  const listeners = new Set<() => void>();
  const query = {
    addEventListener: vi.fn((_type: string, listener: () => void) => listeners.add(listener)),
    get matches() {
      return matches;
    },
    media,
    removeEventListener: vi.fn((_type: string, listener: () => void) => listeners.delete(listener)),
  };

  return {
    emit(nextMatches: boolean) {
      matches = nextMatches;
      for (const listener of listeners) {
        listener();
      }
    },
    query,
  };
}

describe("useResponsiveMode", () => {
  const originalMatchMedia = globalThis.window.matchMedia;

  afterEach(() => {
    Object.defineProperty(globalThis.window, "matchMedia", {
      configurable: true,
      value: originalMatchMedia,
    });
  });

  const installMatchMedia = (desktop: MockMediaQuery, tablet: MockMediaQuery) => {
    Object.defineProperty(globalThis.window, "matchMedia", {
      configurable: true,
      value: (query: string) => {
        if (query === "(min-width: 70rem)") {
          return desktop.query;
        }
        if (query === "(min-width: 40rem)") {
          return tablet.query;
        }
        throw new Error(`Unexpected media query: ${query}`);
      },
    });
  };

  it("normalizes viewport snapshots and cleans both subscriptions", () => {
    const desktop = createMockMediaQuery("(min-width: 70rem)", false);
    const tablet = createMockMediaQuery("(min-width: 40rem)", false);
    installMatchMedia(desktop, tablet);
    let hookResult: UseResponsiveModeResult | undefined;

    function Harness() {
      hookResult = useResponsiveMode();
      return <output>{hookResult.state.responsiveMode}</output>;
    }

    const view = render(<Harness />);
    const initial = requireHookResult(hookResult);
    expect(initial.state).toEqual({
      isDesktop: false,
      isMobile: true,
      isTablet: false,
      responsiveMode: uiResponsiveModes.mobile,
    });
    expect(initial.methods.matchesMode(uiResponsiveModes.mobile)).toBe(true);
    view.rerender(<Harness />);
    expect(requireHookResult(hookResult)).toBe(initial);

    act(() => tablet.emit(true));
    expect(screen.getByText(uiResponsiveModes.tablet)).toBeTruthy();
    act(() => desktop.emit(true));
    expect(requireHookResult(hookResult).state).toMatchObject({
      isDesktop: true,
      isTablet: false,
      responsiveMode: uiResponsiveModes.desktop,
    });

    view.unmount();
    expect(desktop.query.removeEventListener).toHaveBeenCalledTimes(1);
    expect(tablet.query.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it("uses the parsed desktop fallback when matchMedia is unavailable", () => {
    Object.defineProperty(globalThis.window, "matchMedia", {
      configurable: true,
      value: undefined,
    });
    let hookResult: UseResponsiveModeResult | undefined;

    function Harness() {
      hookResult = useResponsiveMode();
      return null;
    }

    render(<Harness />);
    expect(requireHookResult(hookResult).state.responsiveMode).toBe(uiResponsiveModes.desktop);
  });

  it("rejects malformed browser match snapshots", () => {
    const desktop = createMockMediaQuery("(min-width: 70rem)", "invalid");
    const tablet = createMockMediaQuery("(min-width: 40rem)", false);
    installMatchMedia(desktop, tablet);

    function Harness() {
      useResponsiveMode();
      return null;
    }

    expect(() => render(<Harness />)).toThrow();
  });
});

describe("useFocusNavigation", () => {
  it("owns a deterministic focus snapshot and recovers across scope changes", () => {
    const initialScope = {
      availableCommandIds: ["navDown"],
      entryTargetId: "first",
      fallbackTargetId: "first",
      id: "initial",
      targets: [
        { id: "first", neighbors: { down: "disabled" } },
        { disabled: true, id: "disabled", neighbors: { down: "last", up: "first" } },
        { id: "last", neighbors: { up: "first" } },
      ],
    } satisfies UiFocusNavigationScope;
    const preservedScope = {
      availableCommandIds: ["navUp"],
      entryTargetId: "last",
      fallbackTargetId: "last",
      id: "preserved",
      targets: [
        { id: "first", neighbors: { down: "last" } },
        { id: "last", neighbors: { up: "first" } },
      ],
    } satisfies UiFocusNavigationScope;
    const replacementScope = {
      availableCommandIds: [],
      entryTargetId: "replacement",
      fallbackTargetId: "replacement",
      id: "replacement",
      targets: [{ id: "replacement", neighbors: {} }],
    } satisfies UiFocusNavigationScope;
    let hookResult: UseFocusNavigationResult | undefined;

    function Harness(props: { scope: UiFocusNavigationScope }) {
      hookResult = useFocusNavigation({ initialTargetId: "first", scope: props.scope });
      return <output>{hookResult.state.focusedTargetId}</output>;
    }

    const view = render(<Harness scope={initialScope} />);
    const initial = requireHookResult(hookResult);
    expect(initial.state).toMatchObject({
      availableTargetCount: 2,
      availableTargetIds: ["first", "last"],
      focusedTargetId: "first",
      hasFocusedTarget: true,
      scopeId: "initial",
      targetCount: 3,
    });
    expect(initial.state.canMoveByDirection[uiFocusDirections.down]).toBe(true);
    expect(initial.methods.getNextFocusTarget(uiFocusDirections.down)).toBe("last");
    expect(initial.methods.getTargetAttributes("first")).toEqual({
      "data-controller-focused": "true",
      "data-ui-focus-target": "first",
    });

    view.rerender(<Harness scope={initialScope} />);
    expect(requireHookResult(hookResult)).toBe(initial);
    act(() => initial.methods.moveFocus(uiFocusDirections.down));
    expect(requireHookResult(hookResult).state.focusedTargetId).toBe("last");
    expect(requireHookResult(hookResult).methods.isFocused("last")).toBe(true);
    expect(requireHookResult(hookResult).methods.canMoveFocus(uiFocusDirections.down)).toBe(false);

    view.rerender(<Harness scope={preservedScope} />);
    expect(requireHookResult(hookResult).state).toMatchObject({
      focusedTargetId: "last",
      scopeId: "preserved",
    });
    view.rerender(<Harness scope={replacementScope} />);
    expect(requireHookResult(hookResult).state).toMatchObject({
      focusedTargetId: "replacement",
      scopeId: "replacement",
    });
    act(() => requireHookResult(hookResult).methods.focusTarget("missing"));
    expect(requireHookResult(hookResult).state.focusedTargetId).toBe("replacement");
    act(() => requireHookResult(hookResult).methods.resetFocus());
    expect(requireHookResult(hookResult).state.focusedTargetId).toBe("replacement");
  });

  it("terminates disabled navigation cycles at the current semantic target", () => {
    const scope = {
      availableCommandIds: ["navRight"],
      entryTargetId: "current",
      fallbackTargetId: "current",
      id: "cycle",
      targets: [
        { id: "current", neighbors: { right: "disabled-a" } },
        { disabled: true, id: "disabled-a", neighbors: { right: "disabled-b" } },
        { disabled: true, id: "disabled-b", neighbors: { right: "disabled-a" } },
      ],
    } satisfies UiFocusNavigationScope;
    let hookResult: UseFocusNavigationResult | undefined;

    function Harness() {
      hookResult = useFocusNavigation({ scope });
      return null;
    }

    render(<Harness />);
    expect(requireHookResult(hookResult).methods.getNextFocusTarget(uiFocusDirections.right)).toBe(
      "current",
    );
    expect(requireHookResult(hookResult).state.canMoveByDirection.right).toBe(false);
    act(() => requireHookResult(hookResult).methods.moveFocus(uiFocusDirections.right));
    expect(requireHookResult(hookResult).state.focusedTargetId).toBe("current");
  });

  it("keeps the logical navigation target while global controller focus is hidden", () => {
    const scope = {
      availableCommandIds: ["confirm"],
      entryTargetId: "first",
      fallbackTargetId: "first",
      id: "hidden-controller-focus",
      targets: [{ id: "first", neighbors: {} }],
    } satisfies UiFocusNavigationScope;
    let hookResult: UseFocusNavigationResult | undefined;

    function Harness() {
      hookResult = useFocusNavigation({ scope });
      return <output>{hookResult.state.focusedTargetId}</output>;
    }

    render(
      <UiRoot controllerFocusVisible={false}>
        <Harness />
      </UiRoot>,
    );

    const result = requireHookResult(hookResult);
    expect(result.state.focusedTargetId).toBe("first");
    expect(result.state.hasFocusedTarget).toBe(true);
    expect(result.methods.isFocused("first")).toBe(false);
    expect(result.methods.getTargetAttributes("first")).toEqual({
      "data-controller-focused": undefined,
      "data-ui-focus-target": "first",
    });
  });
});
