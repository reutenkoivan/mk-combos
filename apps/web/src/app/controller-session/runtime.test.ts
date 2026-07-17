import { notationDisplayModes } from "@mk-combos/contracts/settings/value";
import type { ControllerCommandEvent } from "@mk-combos/controller-bridge/bridge/type";
import { controllerCommandEventPhases } from "@mk-combos/controller-bridge/bridge/value";
import { controllerCapabilityStates } from "@mk-combos/controller-bridge/capability/value";
import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import { controllerControlIds } from "@mk-combos/controller-bridge/input/value";
import { controllerProfileIds } from "@mk-combos/controller-bridge/profile/value";
import { describe, expect, it, vi } from "vitest";

import { createControllerCommandScopeRegistry, createControllerSession } from "./runtime";
import type { ControllerCommandRibbonModel } from "./type";
import { controllerCommandRibbonShellPolicies, controllerCommandScopeLayers } from "./value";

const commandEvent = (
  commandId: string = knownControllerCommandIds.confirm,
): ControllerCommandEvent => ({
  commandId,
  controlId: controllerControlIds.faceSouth,
  gamepadId: "test-gamepad",
  gamepadIndex: 0,
  phase: controllerCommandEventPhases.press,
  profileId: controllerProfileIds.standard,
  sequence: 1,
  timestamp: 100,
  value: 1,
});

const commandRibbon = (
  accessibleLabel: string,
  commands: ControllerCommandRibbonModel["commands"],
  shellPolicy: ControllerCommandRibbonModel["shellPolicy"] = controllerCommandRibbonShellPolicies.append,
): ControllerCommandRibbonModel => ({
  accessibleLabel,
  commands,
  shellPolicy,
});

const menuCommand = {
  commandIds: [knownControllerCommandIds.openGlobalMenu],
  id: "global-menu",
  label: "Menu",
} as const;

describe("controller command scope registry", () => {
  it("dispatches to the latest highest-priority enabled scope and bubbles when unhandled", () => {
    const registry = createControllerCommandScopeRegistry();
    const page = vi.fn(() => true);
    const shell = vi.fn(() => false);
    const overlay = vi.fn(() => true);

    registry.register({
      handleCommand: page,
      id: "page",
      layer: controllerCommandScopeLayers.page,
    });
    registry.register({
      handleCommand: shell,
      id: "shell",
      layer: controllerCommandScopeLayers.shell,
    });
    const overlayRegistration = registry.register({
      handleCommand: overlay,
      id: "overlay",
      layer: controllerCommandScopeLayers.overlay,
    });

    expect(registry.dispatch(commandEvent())).toEqual({ handled: true, scopeId: "overlay" });
    expect(shell).not.toHaveBeenCalled();
    expect(page).not.toHaveBeenCalled();

    overlayRegistration.unregister();
    expect(registry.dispatch(commandEvent())).toEqual({ handled: true, scopeId: "page" });
    expect(shell).toHaveBeenCalledOnce();
    expect(page).toHaveBeenCalledOnce();
  });

  it("replaces a scope id safely and ignores a stale unregister callback", () => {
    const registry = createControllerCommandScopeRegistry();
    const first = vi.fn(() => true);
    const second = vi.fn(() => true);
    const firstRegistration = registry.register({
      handleCommand: first,
      id: "catalog",
      layer: controllerCommandScopeLayers.page,
    });

    registry.register({
      commandIds: [knownControllerCommandIds.confirm],
      handleCommand: second,
      id: "catalog",
      layer: controllerCommandScopeLayers.page,
    });
    firstRegistration.unregister();

    expect(registry.dispatch(commandEvent())).toEqual({
      handled: true,
      scopeId: "catalog",
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
    expect(registry.dispatch(commandEvent(knownControllerCommandIds.back))).toEqual({
      handled: false,
    });
  });

  it("updates scope behavior without changing its priority", () => {
    const registry = createControllerCommandScopeRegistry();
    const first = vi.fn(() => true);
    const second = vi.fn(() => true);
    const firstRegistration = registry.register({
      commandIds: [knownControllerCommandIds.confirm],
      handleCommand: first,
      id: "first",
      layer: controllerCommandScopeLayers.page,
    });

    registry.register({
      commandIds: [knownControllerCommandIds.confirm],
      handleCommand: second,
      id: "second",
      layer: controllerCommandScopeLayers.page,
    });
    firstRegistration.update({
      commandIds: [knownControllerCommandIds.back],
      handleCommand: first,
      id: "first",
      layer: controllerCommandScopeLayers.page,
    });

    expect(registry.dispatch(commandEvent())).toEqual({
      handled: true,
      scopeId: "second",
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
    expect(registry.dispatch(commandEvent(knownControllerCommandIds.back))).toEqual({
      handled: true,
      scopeId: "first",
    });
  });

  it("uses an exclusive overlay as a barrier while allowing explicit pass-through", () => {
    const registry = createControllerCommandScopeRegistry();
    const page = vi.fn(() => true);
    const shell = vi.fn(() => true);
    const overlay = vi.fn(() => false);

    registry.register({
      handleCommand: page,
      id: "page",
      layer: controllerCommandScopeLayers.page,
    });
    registry.register({
      commandIds: [knownControllerCommandIds.openGlobalMenu],
      handleCommand: shell,
      id: "shell",
      layer: controllerCommandScopeLayers.shell,
    });
    registry.register({
      commandIds: [knownControllerCommandIds.confirm],
      exclusive: true,
      handleCommand: overlay,
      id: "dialog",
      layer: controllerCommandScopeLayers.overlay,
      passThroughCommandIds: [knownControllerCommandIds.openGlobalMenu],
    });

    expect(registry.dispatch(commandEvent())).toEqual({ handled: false });
    expect(overlay).toHaveBeenCalledOnce();
    expect(page).not.toHaveBeenCalled();

    expect(registry.dispatch(commandEvent(knownControllerCommandIds.back))).toEqual({
      handled: false,
    });
    expect(overlay).toHaveBeenCalledOnce();
    expect(page).not.toHaveBeenCalled();

    expect(registry.dispatch(commandEvent(knownControllerCommandIds.openGlobalMenu))).toEqual({
      handled: true,
      scopeId: "shell",
    });
    expect(shell).toHaveBeenCalledOnce();
  });

  it("resolves page and shell ribbon commands with contextual dedupe", () => {
    const registry = createControllerCommandScopeRegistry();

    registry.register({
      handleCommand: () => false,
      id: "shell",
      layer: controllerCommandScopeLayers.shell,
      ribbon: commandRibbon("Global commands", [menuCommand]),
    });
    registry.register({
      handleCommand: () => false,
      id: "catalog",
      layer: controllerCommandScopeLayers.page,
      ribbon: {
        ...commandRibbon("Catalog commands", [
          {
            commandIds: [knownControllerCommandIds.confirm],
            id: "view-combo",
            label: "View combo",
          },
          {
            commandIds: [knownControllerCommandIds.openGlobalMenu],
            id: "close-global-menu",
            label: "Close menu",
          },
        ]),
        notationDisplayModeOverride: notationDisplayModes.PlayStation,
      },
    });

    expect(registry.getCommandRibbonModel()).toEqual({
      accessibleLabel: "Catalog commands",
      commands: [
        {
          commandIds: [knownControllerCommandIds.confirm],
          id: "view-combo",
          label: "View combo",
        },
        {
          commandIds: [knownControllerCommandIds.openGlobalMenu],
          id: "close-global-menu",
          label: "Close menu",
        },
      ],
      notationDisplayModeOverride: notationDisplayModes.PlayStation,
      shellPolicy: controllerCommandRibbonShellPolicies.append,
    });
  });

  it("lets the latest active overlay replace the page ribbon and restores it on removal", () => {
    const registry = createControllerCommandScopeRegistry();
    const shellRegistration = registry.register({
      handleCommand: () => false,
      id: "shell",
      layer: controllerCommandScopeLayers.shell,
      ribbon: commandRibbon("Global commands", [menuCommand]),
    });
    const pageRegistration = registry.register({
      handleCommand: () => false,
      id: "catalog",
      layer: controllerCommandScopeLayers.page,
      ribbon: commandRibbon("Catalog commands", [
        {
          commandIds: [knownControllerCommandIds.confirm],
          id: "view-combo",
          label: "View combo",
        },
      ]),
    });
    const overlayRegistration = registry.register({
      handleCommand: () => false,
      id: "filters",
      layer: controllerCommandScopeLayers.overlay,
      ribbon: commandRibbon(
        "Filter commands",
        [
          {
            commandIds: [knownControllerCommandIds.back],
            id: "discard-filters",
            label: "Discard",
          },
        ],
        controllerCommandRibbonShellPolicies.suppress,
      ),
    });

    expect(registry.getCommandRibbonModel()?.accessibleLabel).toBe("Filter commands");
    expect(registry.getCommandRibbonModel()?.commands.map((command) => command.id)).toEqual([
      "discard-filters",
    ]);

    overlayRegistration.update({
      enabled: false,
      handleCommand: () => false,
      id: "filters",
      layer: controllerCommandScopeLayers.overlay,
      ribbon: commandRibbon("Filter commands", [], controllerCommandRibbonShellPolicies.suppress),
    });
    expect(registry.getCommandRibbonModel()?.accessibleLabel).toBe("Catalog commands");
    expect(registry.getCommandRibbonModel()?.commands.map((command) => command.id)).toEqual([
      "view-combo",
      "global-menu",
    ]);

    pageRegistration.unregister();
    expect(registry.getCommandRibbonModel()?.accessibleLabel).toBe("Global commands");
    shellRegistration.unregister();
    expect(registry.getCommandRibbonModel()).toBeNull();
  });

  it("publishes only structurally changed ribbon snapshots and restores after empty suppression", () => {
    const registry = createControllerCommandScopeRegistry();
    const listener = vi.fn();
    const unsubscribe = registry.subscribeCommandRibbon(listener);
    const pageRibbon = commandRibbon("Catalog commands", [
      {
        commandIds: [knownControllerCommandIds.confirm],
        id: "view-combo",
        label: "View combo",
      },
    ]);
    const pageRegistration = registry.register({
      handleCommand: () => false,
      id: "catalog",
      layer: controllerCommandScopeLayers.page,
      ribbon: pageRibbon,
    });
    const firstSnapshot = registry.getCommandRibbonModel();

    expect(listener).toHaveBeenCalledOnce();
    pageRegistration.update({
      handleCommand: () => true,
      id: "catalog",
      layer: controllerCommandScopeLayers.page,
      ribbon: commandRibbon("Catalog commands", [
        {
          commandIds: [knownControllerCommandIds.confirm],
          id: "view-combo",
          label: "View combo",
        },
      ]),
    });
    expect(listener).toHaveBeenCalledOnce();
    expect(registry.getCommandRibbonModel()).toBe(firstSnapshot);

    const overlayRegistration = registry.register({
      exclusive: true,
      handleCommand: () => false,
      id: "busy-dialog",
      layer: controllerCommandScopeLayers.overlay,
      ribbon: commandRibbon(
        "Busy dialog commands",
        [],
        controllerCommandRibbonShellPolicies.suppress,
      ),
    });
    expect(registry.getCommandRibbonModel()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);

    overlayRegistration.unregister();
    expect(registry.getCommandRibbonModel()).toEqual(firstSnapshot);
    expect(listener).toHaveBeenCalledTimes(3);

    unsubscribe();
    registry.clear();
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("lets the latest enabled overlay suppress lower ribbons without publishing its own model", () => {
    const registry = createControllerCommandScopeRegistry();

    registry.register({
      handleCommand: () => false,
      id: "shell",
      layer: controllerCommandScopeLayers.shell,
      ribbon: commandRibbon("Global commands", [menuCommand]),
    });
    registry.register({
      handleCommand: () => false,
      id: "catalog",
      layer: controllerCommandScopeLayers.page,
      ribbon: commandRibbon("Catalog commands", [
        {
          commandIds: [knownControllerCommandIds.confirm],
          id: "view-combo",
          label: "View combo",
        },
      ]),
    });
    const filterRegistration = registry.register({
      handleCommand: () => false,
      id: "filters",
      layer: controllerCommandScopeLayers.overlay,
      ribbon: commandRibbon("Filter commands", [
        {
          commandIds: [knownControllerCommandIds.back],
          id: "discard-filters",
          label: "Discard",
        },
      ]),
    });
    const busyRegistration = registry.register({
      exclusive: true,
      handleCommand: () => false,
      id: "busy-operation",
      layer: controllerCommandScopeLayers.overlay,
    });

    expect(registry.getCommandRibbonModel()).toBeNull();

    busyRegistration.unregister();
    expect(registry.getCommandRibbonModel()?.accessibleLabel).toBe("Filter commands");

    filterRegistration.unregister();
    expect(registry.getCommandRibbonModel()?.commands.map((command) => command.id)).toEqual([
      "view-combo",
      "global-menu",
    ]);
  });

  it("synchronizes dynamic command ids, barriers, and pass-through without reprioritizing", () => {
    const registry = createControllerCommandScopeRegistry();
    const shell = vi.fn(() => true);
    const page = vi.fn(() => true);
    const overlay = vi.fn(() => false);

    registry.register({
      commandIds: [knownControllerCommandIds.openGlobalMenu],
      handleCommand: shell,
      id: "shell",
      layer: controllerCommandScopeLayers.shell,
    });
    registry.register({
      handleCommand: page,
      id: "page",
      layer: controllerCommandScopeLayers.page,
    });
    const overlayRegistration = registry.register({
      commandIds: [knownControllerCommandIds.confirm],
      exclusive: true,
      handleCommand: overlay,
      id: "overlay",
      layer: controllerCommandScopeLayers.overlay,
    });

    expect(registry.dispatch(commandEvent(knownControllerCommandIds.openGlobalMenu))).toEqual({
      handled: false,
    });

    overlayRegistration.update({
      commandIds: [knownControllerCommandIds.back],
      exclusive: true,
      handleCommand: overlay,
      id: "overlay",
      layer: controllerCommandScopeLayers.overlay,
      passThroughCommandIds: [knownControllerCommandIds.openGlobalMenu],
    });

    expect(registry.dispatch(commandEvent(knownControllerCommandIds.openGlobalMenu))).toEqual({
      handled: true,
      scopeId: "shell",
    });
    expect(registry.dispatch(commandEvent(knownControllerCommandIds.confirm))).toEqual({
      handled: false,
    });
    expect(overlay).not.toHaveBeenCalled();
    expect(page).not.toHaveBeenCalled();

    overlayRegistration.update({
      commandIds: [knownControllerCommandIds.back],
      exclusive: false,
      handleCommand: overlay,
      id: "overlay",
      layer: controllerCommandScopeLayers.overlay,
    });

    expect(registry.dispatch(commandEvent(knownControllerCommandIds.confirm))).toEqual({
      handled: true,
      scopeId: "page",
    });
  });
});

describe("controller session lifecycle", () => {
  it("projects browser capability state and supports suspend, resume, and cleanup", () => {
    let now = 0;
    const removeVisibilityListener = vi.fn();
    const session = createControllerSession({
      environment: {
        browser: {
          isSecureContext: true,
          navigator: { getGamepads: () => [] },
        },
        now: () => {
          now += 1;
          return now;
        },
        subscribeVisibilityChange: () => removeVisibilityListener,
      },
    });

    session.start();
    expect(session.getObservableState().lifecycleState).toBe(
      controllerCapabilityStates.awaitingGesture,
    );

    session.source.suspend();
    expect(session.getObservableState().lifecycleState).toBe(controllerCapabilityStates.suspended);

    session.source.resume();
    expect(session.getObservableState().lifecycleState).toBe(
      controllerCapabilityStates.awaitingGesture,
    );

    session.stop();
    expect(removeVisibilityListener).toHaveBeenCalledOnce();
    expect(session.getObservableState().lifecycleState).toBe(controllerCapabilityStates.suspended);
  });
});
