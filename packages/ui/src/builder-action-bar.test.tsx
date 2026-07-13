import { fireEvent, render, screen } from "@mk-combos/contracts/test/unit/react";
import type { BuilderActionBarActionDescriptor } from "@mk-combos/ui/components/builder-action-bar";
import {
  BuilderActionBar,
  builderActionBarActions,
  builderActionBarStates,
} from "@mk-combos/ui/components/builder-action-bar";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { describe, expect, it, vi } from "vitest";

const actions = [
  {
    action: builderActionBarActions.undoMove,
    available: true,
    id: "undo",
    label: "Undo move",
  },
  {
    action: builderActionBarActions.finishBuilder,
    available: true,
    id: "finish",
    label: "Finish combo",
  },
  {
    action: builderActionBarActions.cancelBuilder,
    available: true,
    id: "cancel",
    label: "Cancel builder",
  },
  {
    action: builderActionBarActions.confirmCancelBuilder,
    available: true,
    id: "confirm-cancel",
    label: "Confirm cancel",
  },
  {
    action: builderActionBarActions.openSavedComboAddToList,
    available: true,
    id: "add-saved-to-list",
    label: "Add saved combo to list",
  },
] as const satisfies readonly BuilderActionBarActionDescriptor[];

const baseProps = {
  actions,
  dirty: false,
  label: "Builder actions",
  responsiveMode: uiResponsiveModes.desktop,
  sourceFocusTarget: "builder-action-bar",
  sourceSurface: "builder",
  state: builderActionBarStates.idle,
} as const;

describe("BuilderActionBar", () => {
  it("publishes the exact action and state dictionaries", () => {
    expect(builderActionBarActions).toEqual({
      cancelBuilder: "cancelBuilder",
      confirmCancelBuilder: "confirmCancelBuilder",
      finishBuilder: "finishBuilder",
      openSavedComboAddToList: "openSavedComboAddToList",
      undoMove: "undoMove",
    });
    expect(builderActionBarStates).toEqual({
      idle: "idle",
      saved: "saved",
      saveError: "saveError",
      saving: "saving",
    });
  });

  it("emits concrete semantic actions with dirty and relevant saved combo context", () => {
    const onRequestAction = vi.fn();
    const view = render(
      <BuilderActionBar
        {...baseProps}
        dirty
        onRequestAction={onRequestAction}
        savedComboId="saved-combo-7"
      />,
    );

    for (const descriptor of actions.slice(0, 4)) {
      fireEvent.click(screen.getByRole("button", { name: descriptor.label }));
    }

    view.rerender(
      <BuilderActionBar
        {...baseProps}
        dirty
        onRequestAction={onRequestAction}
        savedComboId="saved-combo-7"
        state={builderActionBarStates.saved}
      />,
    );
    expect(screen.queryByRole("button", { name: "Finish combo" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Add saved combo to list" }));

    expect(onRequestAction.mock.calls.map(([intent]) => intent)).toEqual([
      {
        action: builderActionBarActions.undoMove,
        actionId: "undo",
        dirty: true,
        reason: "press",
        sourceFocusTarget: "builder-action-bar",
        sourceSurface: "builder",
      },
      {
        action: builderActionBarActions.finishBuilder,
        actionId: "finish",
        dirty: true,
        reason: "press",
        sourceFocusTarget: "builder-action-bar",
        sourceSurface: "builder",
      },
      {
        action: builderActionBarActions.cancelBuilder,
        actionId: "cancel",
        dirty: true,
        reason: "press",
        sourceFocusTarget: "builder-action-bar",
        sourceSurface: "builder",
      },
      {
        action: builderActionBarActions.confirmCancelBuilder,
        actionId: "confirm-cancel",
        dirty: true,
        reason: "press",
        sourceFocusTarget: "builder-action-bar",
        sourceSurface: "builder",
      },
      {
        action: builderActionBarActions.openSavedComboAddToList,
        actionId: "add-saved-to-list",
        dirty: true,
        reason: "press",
        savedComboId: "saved-combo-7",
        sourceFocusTarget: "builder-action-bar",
        sourceSurface: "builder",
      },
    ]);
    expect(
      view.container.querySelector('[data-ui-component="UI-CMP-026"]')?.getAttribute("data-dirty"),
    ).toBe("true");
  });

  it("shows an unavailable reason and keeps the unavailable action inert", () => {
    const onRequestAction = vi.fn();
    const unavailableUndo = {
      action: builderActionBarActions.undoMove,
      available: false,
      disabledReason: "Add a move before undoing",
      id: "undo-unavailable",
      label: "Undo move",
    } as const satisfies BuilderActionBarActionDescriptor;

    render(
      <BuilderActionBar
        {...baseProps}
        actions={[unavailableUndo]}
        onRequestAction={onRequestAction}
      />,
    );

    const button = screen.getByRole("button", { name: "Undo move" }) as HTMLButtonElement;
    const reasonId = button.getAttribute("aria-describedby");
    expect(button.disabled).toBe(true);
    expect(reasonId).toBeTruthy();
    expect(document.getElementById(reasonId ?? "")?.textContent).toBe("Add a move before undoing");
    fireEvent.click(button);
    expect(onRequestAction).not.toHaveBeenCalled();
  });

  it("makes every builder action inert while saving", () => {
    const onRequestAction = vi.fn();
    const view = render(
      <BuilderActionBar
        {...baseProps}
        onRequestAction={onRequestAction}
        savedComboId="saved-combo-7"
        state={builderActionBarStates.saving}
        status="Saving combo"
      />,
    );

    const renderedActions = screen.getAllByRole("button") as HTMLButtonElement[];
    expect(renderedActions).toHaveLength(4);
    for (const button of renderedActions) {
      expect(button.disabled).toBe(true);
      fireEvent.click(button);
    }
    expect(screen.queryByRole("button", { name: "Add saved combo to list" })).toBeNull();
    expect(screen.getByRole("button", { name: "Finish combo" }).getAttribute("aria-busy")).toBe(
      "true",
    );
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
    expect(
      view.container.querySelector('[data-ui-component="UI-CMP-026"]')?.getAttribute("aria-busy"),
    ).toBe("true");
    expect(onRequestAction).not.toHaveBeenCalled();
  });

  it("reveals add-to-list only for a saved state with a saved combo id", () => {
    const savedAction = actions[4];
    const view = render(
      <BuilderActionBar {...baseProps} actions={[savedAction]} savedComboId="saved-combo-7" />,
    );

    expect(screen.queryByRole("button", { name: savedAction.label })).toBeNull();

    view.rerender(
      <BuilderActionBar
        {...baseProps}
        actions={[savedAction]}
        savedComboId="saved-combo-7"
        state={builderActionBarStates.saveError}
      />,
    );
    expect(screen.queryByRole("button", { name: savedAction.label })).toBeNull();

    view.rerender(
      <BuilderActionBar
        {...baseProps}
        actions={[savedAction]}
        state={builderActionBarStates.saved}
      />,
    );
    expect(screen.queryByRole("button", { name: savedAction.label })).toBeNull();

    view.rerender(
      <BuilderActionBar
        {...baseProps}
        actions={actions}
        savedComboId="saved-combo-7"
        state={builderActionBarStates.saved}
      />,
    );
    expect(screen.getByRole("button", { name: savedAction.label })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Finish combo" })).toBeNull();
    expect(
      view.container.querySelector('[data-builder-action-region="primary"]')?.textContent,
    ).toContain(savedAction.label);
  });

  it("uses the dock hierarchy on desktop and a primary-first compact layout", () => {
    const view = render(<BuilderActionBar {...baseProps} actions={actions.slice(0, 3)} />);
    const dock = view.container.querySelector('[data-ui-component="UI-CMP-026"]');

    expect(dock?.getAttribute("data-layout")).toBe("dock");
    expect(dock?.className).toContain("shadow-[var(--ui-shadow)]");
    expect(dock?.className).not.toContain("sticky");
    expect(view.container.querySelector('[data-builder-action-region="undo"]')).toBeTruthy();
    expect(view.container.querySelector('[data-builder-action-region="status"]')).toBeTruthy();
    expect(view.container.querySelector('[data-builder-action-region="primary"]')).toBeTruthy();
    expect(screen.getByRole("button", { name: "Undo move" }).className).not.toContain("min-h-11");
    expect(screen.getByRole("button", { name: "Finish combo" }).className).toContain(
      "bg-[var(--ui-accent)]",
    );

    for (const responsiveMode of [uiResponsiveModes.mobile, uiResponsiveModes.tablet] as const) {
      view.rerender(
        <BuilderActionBar
          {...baseProps}
          actions={actions.slice(0, 3)}
          responsiveMode={responsiveMode}
        />,
      );

      const compactDock = view.container.querySelector('[data-ui-component="UI-CMP-026"]');
      const primaryRegion = view.container.querySelector('[data-builder-action-region="primary"]');
      const secondaryRegion = view.container.querySelector(
        '[data-builder-action-region="secondary"]',
      );
      expect(compactDock?.getAttribute("data-layout")).toBe("compact");
      expect(primaryRegion?.textContent).toContain("Finish combo");
      expect(secondaryRegion?.textContent).toContain("Undo move");
      expect(secondaryRegion?.textContent).toContain("Cancel builder");
      expect(screen.getByRole("button", { name: "Finish combo" }).className).toContain("min-h-11");
      expect(screen.getByRole("button", { name: "Finish combo" }).className).toContain("w-full");
      expect(screen.getByRole("button", { name: "Undo move" }).className).toContain("min-h-11");
      expect(screen.getByRole("button", { name: "Undo move" }).className).toContain("w-full");
    }
  });

  it("reserves a status slot so state changes keep the dock geometry stable", () => {
    const view = render(<BuilderActionBar {...baseProps} actions={[]} />);
    const statusRegion = view.container.querySelector('[data-builder-action-region="status"]');

    expect(statusRegion?.className).toContain("min-h-5");
    expect(statusRegion?.querySelector('[aria-hidden="true"]')).toBeTruthy();

    view.rerender(<BuilderActionBar {...baseProps} actions={[]} status="Builder ready" />);
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("Builder ready");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.getAttribute("aria-atomic")).toBe("true");
  });

  it("shows a visible destructive status for save errors", () => {
    const view = render(
      <BuilderActionBar
        {...baseProps}
        actions={[]}
        state={builderActionBarStates.saveError}
        status="Combo could not be saved"
      />,
    );

    const status = screen.getByRole("alert");
    expect(status.textContent).toBe("Combo could not be saved");
    expect(status.className).toContain("text-[var(--ui-destructive)]");
    expect(status.getAttribute("aria-live")).toBe("assertive");
    expect(
      view.container.querySelector('[data-ui-component="UI-CMP-026"]')?.getAttribute("data-state"),
    ).toBe(builderActionBarStates.saveError);
  });
});
