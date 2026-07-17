import { act, render, screen } from "@mk-combos/contracts/test/unit/react";
import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import { describe, expect, it, vi } from "vitest";

import {
  ControllerSessionProvider,
  useControllerCommandRibbonModel,
  useControllerCommandScope,
  useControllerSessionObservableState,
} from "./provider";
import type { ControllerSessionEnvironment } from "./type";
import { controllerCommandRibbonShellPolicies, controllerCommandScopeLayers } from "./value";

const neutralGamepad = {
  axes: [0, 0, 0, 0],
  buttons: Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 })),
  connected: true,
  id: "Standard Controller",
  index: 0,
  mapping: "standard",
  timestamp: 0,
};
const gesturingGamepad = {
  ...neutralGamepad,
  buttons: neutralGamepad.buttons.map((button, index) =>
    index === 0 ? { ...button, pressed: true, touched: true, value: 1 } : button,
  ),
};

function ControllerConnectionConsumer() {
  const controllerSession = useControllerSessionObservableState();

  return <output data-testid="controller-connected">{String(controllerSession.connected)}</output>;
}

function DynamicCommandRibbonConsumer(props: Readonly<{ enabled: boolean; label: string }>) {
  useControllerCommandScope({
    commandIds: [knownControllerCommandIds.confirm],
    enabled: props.enabled,
    handleCommand: () => true,
    id: "dynamic-page",
    layer: controllerCommandScopeLayers.page,
    ribbon: {
      accessibleLabel: "Page commands",
      commands: [
        {
          commandIds: [knownControllerCommandIds.confirm],
          id: "confirm-action",
          label: props.label,
        },
      ],
      shellPolicy: controllerCommandRibbonShellPolicies.append,
    },
  });
  const commandRibbon = useControllerCommandRibbonModel();

  return (
    <output data-testid="command-ribbon">
      {commandRibbon === null ? "hidden" : commandRibbon.commands[0]?.label}
    </output>
  );
}

function CommandRibbonConsumer() {
  const commandRibbon = useControllerCommandRibbonModel();

  return <output>{commandRibbon?.accessibleLabel}</output>;
}

describe("ControllerSessionProvider", () => {
  it("projects connect and disconnect without resetting the provider", () => {
    let gamepads: (typeof neutralGamepad)[] = [];
    let nextFrame: ((timestamp: number) => void) | undefined;
    let frameHandle = 0;
    const cancelAnimationFrame = vi.fn();
    const environment: ControllerSessionEnvironment = {
      browser: {
        isSecureContext: true,
        navigator: { getGamepads: () => gamepads },
      },
      cancelAnimationFrame,
      now: () => 0,
      requestAnimationFrame: (callback) => {
        nextFrame = callback;
        frameHandle += 1;
        return frameHandle;
      },
    };
    const view = render(
      <ControllerSessionProvider environment={environment}>
        <ControllerConnectionConsumer />
      </ControllerSessionProvider>,
    );

    expect(screen.getByTestId("controller-connected").textContent).toBe("false");

    gamepads = [gesturingGamepad];
    act(() => nextFrame?.(1));
    expect(screen.getByTestId("controller-connected").textContent).toBe("true");

    gamepads = [neutralGamepad];
    act(() => nextFrame?.(2));
    expect(screen.getByTestId("controller-connected").textContent).toBe("true");

    gamepads = [];
    act(() => nextFrame?.(3));
    expect(screen.getByTestId("controller-connected").textContent).toBe("false");

    view.unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledOnce();
  });

  it("fails clearly when observable state is read outside the provider", () => {
    expect(() => render(<ControllerConnectionConsumer />)).toThrow(
      "Controller session hooks must be used within ControllerSessionProvider",
    );
  });

  it("updates dynamic scope ribbon state without re-registering its identity", () => {
    const environment: ControllerSessionEnvironment = {
      browser: {},
      now: () => 0,
    };
    const view = render(
      <ControllerSessionProvider environment={environment}>
        <DynamicCommandRibbonConsumer enabled label="Confirm" />
      </ControllerSessionProvider>,
    );

    expect(screen.getByTestId("command-ribbon").textContent).toBe("Confirm");

    view.rerender(
      <ControllerSessionProvider environment={environment}>
        <DynamicCommandRibbonConsumer enabled label="Continue" />
      </ControllerSessionProvider>,
    );
    expect(screen.getByTestId("command-ribbon").textContent).toBe("Continue");

    view.rerender(
      <ControllerSessionProvider environment={environment}>
        <DynamicCommandRibbonConsumer enabled={false} label="Continue" />
      </ControllerSessionProvider>,
    );
    expect(screen.getByTestId("command-ribbon").textContent).toBe("hidden");
  });

  it("fails clearly when command ribbon state is read outside the provider", () => {
    expect(() => render(<CommandRibbonConsumer />)).toThrow(
      "Controller session hooks must be used within ControllerSessionProvider",
    );
  });
});
