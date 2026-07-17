import { notationDisplayModes } from "@mk-combos/contracts/settings/value";
import { render } from "@mk-combos/contracts/test/unit/react";
import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import { describe, expect, it } from "vitest";

import { ControllerCommandRibbon } from "./component";

const commands = [
  {
    commandIds: [knownControllerCommandIds.navUp, knownControllerCommandIds.navDown],
    id: "navigation",
    label: "Navigate",
  },
  {
    commandIds: [knownControllerCommandIds.openActions],
    id: "actions",
    label: "Actions",
  },
  {
    commandIds: [knownControllerCommandIds.openFilters],
    id: "filters",
    label: "Filters",
  },
  {
    commandIds: [knownControllerCommandIds.confirm],
    id: "confirm",
    label: "Confirm",
  },
  {
    commandIds: [knownControllerCommandIds.back],
    id: "back",
    label: "Back",
  },
  {
    commandIds: [knownControllerCommandIds.previousTab],
    id: "previous",
    label: "Previous",
  },
  {
    commandIds: [knownControllerCommandIds.nextTab],
    id: "next",
    label: "Next",
  },
  {
    commandIds: [knownControllerCommandIds.openGlobalMenu],
    id: "menu",
    label: "Menu",
  },
] as const;

describe("ControllerCommandRibbon", () => {
  it.each([
    [
      notationDisplayModes.FGC,
      [
        "notation-fgc-1",
        "notation-fgc-2",
        "notation-fgc-3",
        "notation-fgc-4",
        "notation-control-left-shoulder",
        "notation-control-right-shoulder",
        "notation-control-start",
      ],
    ],
    [
      notationDisplayModes.PlayStation,
      [
        "notation-playstation-square",
        "notation-playstation-triangle",
        "notation-playstation-cross",
        "notation-playstation-circle",
        "notation-playstation-l1",
        "notation-playstation-r1",
        "notation-playstation-options",
      ],
    ],
    [
      notationDisplayModes.Xbox,
      [
        "notation-xbox-x",
        "notation-xbox-y",
        "notation-xbox-a",
        "notation-xbox-b",
        "notation-xbox-lb",
        "notation-xbox-rb",
        "notation-xbox-menu",
      ],
    ],
  ])("uses %s notation setting rather than the detected profile", (mode, expectedIcons) => {
    const view = render(
      <ControllerCommandRibbon
        commands={commands}
        notationDisplayMode={mode}
        accessibleLabel="Controller commands"
      />,
    );

    expect(view.getByRole("navigation", { name: "Controller commands" })).toBeTruthy();
    expect(view.getByText("D-Pad")).toBeTruthy();
    expect(
      Array.from(view.container.querySelectorAll("[data-ui-notation-icon]")).map((node) =>
        node.getAttribute("data-ui-notation-icon"),
      ),
    ).toEqual(expectedIcons);
  });
});
