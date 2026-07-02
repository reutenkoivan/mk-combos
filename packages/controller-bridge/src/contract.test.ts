import {
  createControllerBridge,
  defaultControllerBindings,
} from "@mk-combos/controller-bridge/bridge/runtime";
import { ControllerBridgePollResultSchema } from "@mk-combos/controller-bridge/bridge/schema";
import type {
  ControllerBridgePollResult,
  ControllerCommandBinding,
  ControllerCommandEventPhase,
} from "@mk-combos/controller-bridge/bridge/type";
import {
  ControllerCommandMetadataSchema,
  controllerCommandGroups as commandSchemaGroups,
  knownControllerCommandIds as commandSchemaIds,
  controllerCommandMetadata as commandSchemaMetadata,
} from "@mk-combos/controller-bridge/command/schema";
import type {
  ControllerCommandGroup,
  ControllerCommandId,
  ControllerCommandMetadataList,
  KnownControllerCommandId,
} from "@mk-combos/controller-bridge/command/type";
import {
  controllerCommandGroups as commandTypeGroups,
  knownControllerCommandIds as commandTypeIds,
  controllerCommandMetadata as commandTypeMetadata,
} from "@mk-combos/controller-bridge/command/type";
import {
  controllerCommandGroups as commandValueGroups,
  knownControllerCommandIds as commandValueIds,
  controllerCommandMetadata,
} from "@mk-combos/controller-bridge/command/value";
import * as contractEntry from "@mk-combos/controller-bridge/contract";
import {
  controllerBridgeContractGroups,
  mkCombosControllerBridge,
} from "@mk-combos/controller-bridge/contract";
import { buildControllerHints } from "@mk-combos/controller-bridge/hint/runtime";
import { ControllerHintListSchema } from "@mk-combos/controller-bridge/hint/schema";
import type { ControllerHintList, ControllerHintRow } from "@mk-combos/controller-bridge/hint/type";
import { normalizeGamepadSnapshot } from "@mk-combos/controller-bridge/input/runtime";
import {
  ControllerGamepadSnapshotSchema,
  controllerAxisDirections as inputSchemaAxisDirections,
  controllerControlIds as inputSchemaControlIds,
  controllerControlSources as inputSchemaControlSources,
  defaultControllerInputConfig as inputSchemaDefaultConfig,
} from "@mk-combos/controller-bridge/input/schema";
import type {
  ControllerAxisDirection,
  ControllerControlSource,
  ControllerGamepadSnapshot,
  KnownControllerControlId,
} from "@mk-combos/controller-bridge/input/type";
import {
  controllerAxisDirections as inputTypeAxisDirections,
  controllerControlIds as inputTypeControlIds,
  controllerControlSources as inputTypeControlSources,
  defaultControllerInputConfig as inputTypeDefaultConfig,
} from "@mk-combos/controller-bridge/input/type";
import {
  detectControllerProfile,
  getControllerProfile,
} from "@mk-combos/controller-bridge/profile/runtime";
import {
  ControllerProfileSchema,
  controllerProfileIds as profileSchemaIds,
  controllerProfileMatchers as profileSchemaMatchers,
  controllerProfiles as profileSchemaProfiles,
} from "@mk-combos/controller-bridge/profile/schema";
import type {
  ControllerButtonLabelMap,
  ControllerProfileId,
  ControllerProfileList,
} from "@mk-combos/controller-bridge/profile/type";
import {
  controllerProfileIds as profileTypeIds,
  controllerProfileMatchers as profileTypeMatchers,
  controllerProfiles as profileTypeProfiles,
} from "@mk-combos/controller-bridge/profile/type";
import {
  controllerProfileIds,
  controllerProfileMatchers,
  controllerProfiles,
} from "@mk-combos/controller-bridge/profile/value";
import { describe, expect, it } from "vitest";

const gamepad = {
  id: "Xbox Wireless Controller",
  index: 0,
  connected: true,
  mapping: "standard",
  timestamp: 0,
  buttons: Array.from({ length: 17 }, (_, index) => ({
    pressed: index === 0,
    value: index === 0 ? 1 : 0,
  })),
  axes: [0, 0, 0, 0],
} satisfies ControllerGamepadSnapshot;

const acceptsPublicTypes = (_contract: {
  commandId: ControllerCommandId;
  commandGroup: ControllerCommandGroup;
  commandMetadataList: ControllerCommandMetadataList;
  eventPhase: ControllerCommandEventPhase;
  knownCommandId: KnownControllerCommandId;
  knownControlId: KnownControllerControlId;
  controlSource: ControllerControlSource;
  axisDirection: ControllerAxisDirection;
  profileId: ControllerProfileId;
  profileList: ControllerProfileList;
  buttonLabels: ControllerButtonLabelMap;
  binding: ControllerCommandBinding;
  gamepad: ControllerGamepadSnapshot;
  result: ControllerBridgePollResult;
  hint: ControllerHintRow;
  hints: ControllerHintList;
}) => true;

describe("@mk-combos/controller-bridge contract", () => {
  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual([
      "controllerBridgeContractGroups",
      "mkCombosControllerBridge",
    ]);
    expect(mkCombosControllerBridge.packageName).toBe("@mk-combos/controller-bridge");
    expect(mkCombosControllerBridge.groups).toBe(controllerBridgeContractGroups);
    expect(controllerBridgeContractGroups.command).toEqual({
      schema: "@mk-combos/controller-bridge/command/schema",
      type: "@mk-combos/controller-bridge/command/type",
      value: "@mk-combos/controller-bridge/command/value",
    });
    expect(controllerBridgeContractGroups.profile).toEqual({
      runtime: "@mk-combos/controller-bridge/profile/runtime",
      schema: "@mk-combos/controller-bridge/profile/schema",
      type: "@mk-combos/controller-bridge/profile/type",
      value: "@mk-combos/controller-bridge/profile/value",
    });
    expect(controllerBridgeContractGroups.input).toEqual({
      runtime: "@mk-combos/controller-bridge/input/runtime",
      schema: "@mk-combos/controller-bridge/input/schema",
      type: "@mk-combos/controller-bridge/input/type",
    });
    expect(controllerBridgeContractGroups.bridge).toEqual({
      runtime: "@mk-combos/controller-bridge/bridge/runtime",
      schema: "@mk-combos/controller-bridge/bridge/schema",
      type: "@mk-combos/controller-bridge/bridge/type",
    });
    expect(controllerBridgeContractGroups.hint).toEqual({
      runtime: "@mk-combos/controller-bridge/hint/runtime",
      schema: "@mk-combos/controller-bridge/hint/schema",
      type: "@mk-combos/controller-bridge/hint/type",
    });
  });

  it("keeps public value-set re-exports intentional", () => {
    expect(commandValueIds).toContain("confirm");
    expect(commandValueIds).toContain("builderNextGroup");
    expect(commandSchemaIds).toBe(commandValueIds);
    expect(commandTypeIds).toBe(commandValueIds);
    expect(commandSchemaGroups).toBe(commandValueGroups);
    expect(commandTypeGroups).toBe(commandValueGroups);
    expect(commandSchemaMetadata).toBe(controllerCommandMetadata);
    expect(commandTypeMetadata).toBe(controllerCommandMetadata);
    expect(controllerProfileIds).toEqual(["dualsense", "xbox", "standard"]);
    expect(profileSchemaIds).toBe(controllerProfileIds);
    expect(profileTypeIds).toBe(controllerProfileIds);
    expect(profileSchemaMatchers).toBe(controllerProfileMatchers);
    expect(profileTypeMatchers).toBe(controllerProfileMatchers);
    expect(profileSchemaProfiles).toBe(controllerProfiles);
    expect(profileTypeProfiles).toBe(controllerProfiles);
    expect(inputSchemaControlIds).toBe(mkCombosControllerBridge.valueSets.controllerControlIds);
    expect(inputTypeControlIds).toBe(inputSchemaControlIds);
    expect(inputSchemaAxisDirections).toEqual(["negative", "positive"]);
    expect(inputTypeAxisDirections).toBe(inputSchemaAxisDirections);
    expect(inputSchemaControlSources).toEqual(["button", "axis"]);
    expect(inputTypeControlSources).toBe(inputSchemaControlSources);
    expect(inputTypeDefaultConfig).toBe(inputSchemaDefaultConfig);
    expect(controllerProfileMatchers.xbox).toContain("xbox");
    expect(mkCombosControllerBridge.valueSets.knownControllerCommandIds).toBe(commandValueIds);
    expect(mkCombosControllerBridge.valueSets.controllerProfileIds).toBe(controllerProfileIds);
    expect(mkCombosControllerBridge.valueSets.controllerControlIds).toContain("faceSouth");
  });

  it("keeps command ids open while documenting known metadata", () => {
    expect(ControllerCommandMetadataSchema.parse(controllerCommandMetadata[0])).toEqual(
      controllerCommandMetadata[0],
    );
    const futureBinding = {
      controlId: "futurePaddle",
      commandId: "futureCommand",
    } satisfies ControllerCommandBinding;

    expect(futureBinding.commandId satisfies ControllerCommandId).toBe("futureCommand");
  });

  it("imports every public subpath and keeps helpers usable together", () => {
    const bridge = createControllerBridge();
    const profile = detectControllerProfile(gamepad);
    const normalized = normalizeGamepadSnapshot(gamepad);
    const result = bridge.process({
      timestamp: 0,
      gamepads: [ControllerGamepadSnapshotSchema.parse(gamepad)],
    });
    const hints = buildControllerHints({ profileId: profile.id, commandIds: ["confirm"] });

    expect(ControllerProfileSchema.parse(getControllerProfile(profile.id))).toEqual(
      getControllerProfile(profile.id),
    );
    expect(normalized.pressedControls).toContain("faceSouth");
    expect(ControllerBridgePollResultSchema.parse(result)).toEqual(result);
    expect(ControllerHintListSchema.parse(hints)).toEqual(hints);
    expect(defaultControllerBindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          controlId: "faceSouth",
          commandId: "confirm",
        }),
      ]),
    );
    expect(controllerProfiles.map((knownProfile) => knownProfile.id)).toContain(profile.id);
    expect(
      acceptsPublicTypes({
        commandId: "futureCommand",
        commandGroup: "navigation",
        commandMetadataList: controllerCommandMetadata,
        eventPhase: "press",
        knownCommandId: "confirm",
        knownControlId: "faceSouth",
        controlSource: "button",
        axisDirection: "positive",
        profileId: "standard",
        profileList: controllerProfiles,
        buttonLabels: getControllerProfile("standard").buttonLabels,
        binding: { controlId: "faceSouth", commandId: "confirm" },
        gamepad,
        result,
        hint: hints[0] as ControllerHintRow,
        hints,
      }),
    ).toBe(true);
  });
});
