import {
  createControllerBridge,
  defaultControllerBindings,
} from "@mk-combos/controller-bridge/bridge/runtime";
import {
  ControllerBridgePollResultSchema,
  ControllerCommandEventPhaseSchema,
} from "@mk-combos/controller-bridge/bridge/schema";
import type {
  ControllerBridgePollResult,
  ControllerCommandBinding,
  ControllerCommandEventPhase,
} from "@mk-combos/controller-bridge/bridge/type";
import { controllerCommandEventPhases } from "@mk-combos/controller-bridge/bridge/value";
import { readControllerBrowserSource } from "@mk-combos/controller-bridge/capability/runtime";
import {
  ControllerBrowserSourceResultSchema,
  controllerCapabilityReasons as capabilitySchemaReasons,
  controllerCapabilityStates as capabilitySchemaStates,
} from "@mk-combos/controller-bridge/capability/schema";
import type {
  ControllerBrowserSourceResult,
  ControllerCapabilityReason,
  ControllerCapabilityState,
} from "@mk-combos/controller-bridge/capability/type";
import {
  controllerCapabilityReasons as capabilityTypeReasons,
  controllerCapabilityStates as capabilityTypeStates,
} from "@mk-combos/controller-bridge/capability/type";
import {
  controllerCapabilityReasons,
  controllerCapabilityStates,
} from "@mk-combos/controller-bridge/capability/value";
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
  controllerAxisDirections,
  controllerControlIds,
  controllerControlSources,
} from "@mk-combos/controller-bridge/input/value";
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

const requireFirst = <T>(values: readonly T[], label: string): T => {
  const [first] = values;

  if (first === undefined) {
    throw new Error(`${label} must not be empty.`);
  }

  return first;
};

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
  capabilityState: ControllerCapabilityState;
  capabilityReason: ControllerCapabilityReason;
  browserSource: ControllerBrowserSourceResult;
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
    expect(controllerBridgeContractGroups.capability).toEqual({
      runtime: "@mk-combos/controller-bridge/capability/runtime",
      schema: "@mk-combos/controller-bridge/capability/schema",
      type: "@mk-combos/controller-bridge/capability/type",
      value: "@mk-combos/controller-bridge/capability/value",
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
      value: "@mk-combos/controller-bridge/input/value",
    });
    expect(controllerBridgeContractGroups.bridge).toEqual({
      runtime: "@mk-combos/controller-bridge/bridge/runtime",
      schema: "@mk-combos/controller-bridge/bridge/schema",
      type: "@mk-combos/controller-bridge/bridge/type",
      value: "@mk-combos/controller-bridge/bridge/value",
    });
    expect(controllerBridgeContractGroups.hint).toEqual({
      runtime: "@mk-combos/controller-bridge/hint/runtime",
      schema: "@mk-combos/controller-bridge/hint/schema",
      type: "@mk-combos/controller-bridge/hint/type",
    });
  });

  it("keeps public value-set re-exports intentional", () => {
    expect(commandValueIds).toEqual({
      addToList: "addToList",
      back: "back",
      builderCancel: "builderCancel",
      builderFinish: "builderFinish",
      builderNextGroup: "builderNextGroup",
      builderPreviousGroup: "builderPreviousGroup",
      builderSelectMove: "builderSelectMove",
      builderUndoMove: "builderUndoMove",
      closeDetail: "closeDetail",
      closePanel: "closePanel",
      confirm: "confirm",
      navDown: "navDown",
      navLeft: "navLeft",
      navRight: "navRight",
      navUp: "navUp",
      nextTab: "nextTab",
      openActions: "openActions",
      openControllerHelp: "openControllerHelp",
      openDetail: "openDetail",
      openFilters: "openFilters",
      openGlobalMenu: "openGlobalMenu",
      previousTab: "previousTab",
      removeFromList: "removeFromList",
    });
    expect(commandValueGroups).toEqual({
      builder: "builder",
      catalog: "catalog",
      detail: "detail",
      list: "list",
      navigation: "navigation",
      panel: "panel",
    });
    expect(controllerCapabilityStates).toEqual({
      awaitingGesture: "awaitingGesture",
      awaitingNeutral: "awaitingNeutral",
      blocked: "blocked",
      checking: "checking",
      disconnected: "disconnected",
      ready: "ready",
      suspended: "suspended",
      unsupported: "unsupported",
    });
    expect(controllerCapabilityReasons).toEqual({
      apiUnavailable: "apiUnavailable",
      controllerDisconnected: "controllerDisconnected",
      documentHidden: "documentHidden",
      gestureRequired: "gestureRequired",
      insecureContext: "insecureContext",
      neutralRequired: "neutralRequired",
      none: "none",
      permissionBlocked: "permissionBlocked",
    });
    expect(controllerCommandEventPhases).toEqual({ press: "press", repeat: "repeat" });
    expect(
      ControllerCommandEventPhaseSchema.safeParse(controllerCommandEventPhases.press).success,
    ).toBe(true);
    expect(ControllerCommandEventPhaseSchema.safeParse("release").success).toBe(false);
    expect(capabilitySchemaStates).toBe(controllerCapabilityStates);
    expect(capabilityTypeStates).toBe(controllerCapabilityStates);
    expect(capabilitySchemaReasons).toBe(controllerCapabilityReasons);
    expect(capabilityTypeReasons).toBe(controllerCapabilityReasons);
    expect(mkCombosControllerBridge.valueSets.controllerCapabilityStates).toBe(
      controllerCapabilityStates,
    );
    expect(commandSchemaIds).toBe(commandValueIds);
    expect(commandTypeIds).toBe(commandValueIds);
    expect(commandSchemaGroups).toBe(commandValueGroups);
    expect(commandTypeGroups).toBe(commandValueGroups);
    expect(commandSchemaMetadata).toBe(controllerCommandMetadata);
    expect(commandTypeMetadata).toBe(controllerCommandMetadata);
    expect(controllerProfileIds).toEqual({
      dualsense: "dualsense",
      standard: "standard",
      xbox: "xbox",
    });
    expect(profileSchemaIds).toBe(controllerProfileIds);
    expect(profileTypeIds).toBe(controllerProfileIds);
    expect(profileSchemaMatchers).toBe(controllerProfileMatchers);
    expect(profileTypeMatchers).toBe(controllerProfileMatchers);
    expect(profileSchemaProfiles).toBe(controllerProfiles);
    expect(profileTypeProfiles).toBe(controllerProfiles);
    expect(inputSchemaControlIds).toBe(mkCombosControllerBridge.valueSets.controllerControlIds);
    expect(inputTypeControlIds).toBe(inputSchemaControlIds);
    expect(controllerAxisDirections).toEqual({ negative: "negative", positive: "positive" });
    expect(inputSchemaAxisDirections).toBe(controllerAxisDirections);
    expect(inputTypeAxisDirections).toBe(inputSchemaAxisDirections);
    expect(controllerControlSources).toEqual({ axis: "axis", button: "button" });
    expect(inputSchemaControlSources).toBe(controllerControlSources);
    expect(inputTypeControlSources).toBe(inputSchemaControlSources);
    expect(controllerControlIds).toEqual({
      dpadDown: "dpadDown",
      dpadLeft: "dpadLeft",
      dpadRight: "dpadRight",
      dpadUp: "dpadUp",
      faceEast: "faceEast",
      faceNorth: "faceNorth",
      faceSouth: "faceSouth",
      faceWest: "faceWest",
      home: "home",
      leftShoulder: "leftShoulder",
      leftStickDown: "leftStickDown",
      leftStickLeft: "leftStickLeft",
      leftStickPress: "leftStickPress",
      leftStickRight: "leftStickRight",
      leftStickUp: "leftStickUp",
      leftTrigger: "leftTrigger",
      rightShoulder: "rightShoulder",
      rightStickDown: "rightStickDown",
      rightStickLeft: "rightStickLeft",
      rightStickPress: "rightStickPress",
      rightStickRight: "rightStickRight",
      rightStickUp: "rightStickUp",
      rightTrigger: "rightTrigger",
      select: "select",
      start: "start",
    });
    expect(inputSchemaControlIds).toBe(controllerControlIds);
    expect(inputTypeDefaultConfig).toBe(inputSchemaDefaultConfig);
    expect(controllerProfileMatchers.xbox).toContain("xbox");
    expect(mkCombosControllerBridge.valueSets.knownControllerCommandIds).toBe(commandValueIds);
    expect(mkCombosControllerBridge.valueSets.controllerCommandGroups).toBe(commandValueGroups);
    expect(mkCombosControllerBridge.valueSets.controllerCommandEventPhases).toBe(
      controllerCommandEventPhases,
    );
    expect(mkCombosControllerBridge.valueSets.controllerProfileIds).toBe(controllerProfileIds);
    expect(mkCombosControllerBridge.valueSets.controllerControlIds).toBe(controllerControlIds);
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
    const firstHint = requireFirst(hints, "Controller hints");
    const browserSource = readControllerBrowserSource({ isSecureContext: false });

    expect(ControllerProfileSchema.parse(getControllerProfile(profile.id))).toEqual(
      getControllerProfile(profile.id),
    );
    expect(normalized.pressedControls).toContain("faceSouth");
    expect(ControllerBridgePollResultSchema.parse(result)).toEqual(result);
    expect(ControllerHintListSchema.parse(hints)).toEqual(hints);
    expect(ControllerBrowserSourceResultSchema.parse(browserSource)).toEqual(browserSource);
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
        hint: firstHint,
        hints,
        capabilityState: "awaitingGesture",
        capabilityReason: "gestureRequired",
        browserSource,
      }),
    ).toBe(true);
  });
});
