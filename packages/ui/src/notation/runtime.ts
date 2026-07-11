import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";

import { UiNotationTokenSchema } from "./schema";
import type { UiNotationIconDescriptor, UiNotationTokenState } from "./type";
import {
  uiNotationDisplayModeIconNames,
  uiNotationModeTokenIconNames,
  uiNotationModeTokenLabels,
  uiNotationTokenKinds,
} from "./value";

export type UiNotationStepInput = readonly string[];

export type UiNotationSequenceInput = readonly UiNotationStepInput[];

export type UiNotationMappedSequence = readonly (readonly UiNotationIconDescriptor[])[];

const createDisplayModeDescriptor = (mode: NotationDisplayMode): UiNotationIconDescriptor => ({
  accessibleLabel: `${mode} notation display mode`,
  displayLabel: mode,
  iconName: uiNotationDisplayModeIconNames[mode],
  kind: "displayMode",
  mode,
  token: mode,
});

const createUnknownTokenDescriptor = (
  token: string,
  mode: NotationDisplayMode,
  state?: UiNotationTokenState,
): UiNotationIconDescriptor => ({
  accessibleLabel: `Unknown notation token ${token}`,
  displayLabel: token,
  iconName: "notation-unknown",
  kind: "state",
  mode,
  state,
  token,
});

export const getNotationDisplayModeDescriptor = (mode: NotationDisplayMode) =>
  createDisplayModeDescriptor(mode);

export const mapNotationToken = (
  token: string,
  mode: NotationDisplayMode,
  state?: UiNotationTokenState,
): UiNotationIconDescriptor => {
  const parsedToken = UiNotationTokenSchema.safeParse(token);

  if (!parsedToken.success) {
    return createUnknownTokenDescriptor(token, mode, state);
  }

  const value = parsedToken.data;
  const displayLabel = uiNotationModeTokenLabels[mode][value];

  return {
    accessibleLabel: `${mode} ${displayLabel}`,
    displayLabel,
    iconName: uiNotationModeTokenIconNames[mode][value],
    kind: uiNotationTokenKinds[value],
    mode,
    state,
    token: value,
  };
};

export const mapNotationStep = (
  step: UiNotationStepInput,
  mode: NotationDisplayMode,
  state?: UiNotationTokenState,
) => step.map((token) => mapNotationToken(token, mode, state));

export const mapNotationSequence = (
  notation: UiNotationSequenceInput,
  mode: NotationDisplayMode,
  state?: UiNotationTokenState,
): UiNotationMappedSequence => notation.map((step) => mapNotationStep(step, mode, state));

export const createNotationLegendRows = (
  modes: readonly NotationDisplayMode[],
  baseTokens: UiNotationStepInput = ["1", "2", "3", "4"],
) =>
  modes.map((mode) => ({
    markerIcons: mapNotationStep(baseTokens, mode),
    mode,
    modeIcon: getNotationDisplayModeDescriptor(mode),
    modeLabel: mode,
  }));
