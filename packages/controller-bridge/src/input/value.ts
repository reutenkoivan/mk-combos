export const controllerControlIds = [
  "faceSouth",
  "faceEast",
  "faceWest",
  "faceNorth",
  "leftShoulder",
  "rightShoulder",
  "leftTrigger",
  "rightTrigger",
  "select",
  "start",
  "leftStickPress",
  "rightStickPress",
  "dpadUp",
  "dpadDown",
  "dpadLeft",
  "dpadRight",
  "home",
  "leftStickLeft",
  "leftStickRight",
  "leftStickUp",
  "leftStickDown",
  "rightStickLeft",
  "rightStickRight",
  "rightStickUp",
  "rightStickDown",
] as const;

export const controllerControlSources = ["button", "axis"] as const;

export const controllerAxisDirections = ["negative", "positive"] as const;

export const standardGamepadButtonControls = [
  { id: "faceSouth", buttonIndex: 0 },
  { id: "faceEast", buttonIndex: 1 },
  { id: "faceWest", buttonIndex: 2 },
  { id: "faceNorth", buttonIndex: 3 },
  { id: "leftShoulder", buttonIndex: 4 },
  { id: "rightShoulder", buttonIndex: 5 },
  { id: "leftTrigger", buttonIndex: 6 },
  { id: "rightTrigger", buttonIndex: 7 },
  { id: "select", buttonIndex: 8 },
  { id: "start", buttonIndex: 9 },
  { id: "leftStickPress", buttonIndex: 10 },
  { id: "rightStickPress", buttonIndex: 11 },
  { id: "dpadUp", buttonIndex: 12 },
  { id: "dpadDown", buttonIndex: 13 },
  { id: "dpadLeft", buttonIndex: 14 },
  { id: "dpadRight", buttonIndex: 15 },
  { id: "home", buttonIndex: 16 },
] as const;

export const standardGamepadAxisControls = [
  { id: "leftStickLeft", axisIndex: 0, direction: "negative" },
  { id: "leftStickRight", axisIndex: 0, direction: "positive" },
  { id: "leftStickUp", axisIndex: 1, direction: "negative" },
  { id: "leftStickDown", axisIndex: 1, direction: "positive" },
  { id: "rightStickLeft", axisIndex: 2, direction: "negative" },
  { id: "rightStickRight", axisIndex: 2, direction: "positive" },
  { id: "rightStickUp", axisIndex: 3, direction: "negative" },
  { id: "rightStickDown", axisIndex: 3, direction: "positive" },
] as const;

export const defaultControllerInputConfig = {
  axisPressThreshold: 0.55,
  axisReleaseThreshold: 0.35,
  buttonPressThreshold: 0.5,
} as const;
