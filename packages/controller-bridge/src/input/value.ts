export const controllerControlIds = {
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
} as const;

export const controllerControlSources = {
  axis: "axis",
  button: "button",
} as const;

export const controllerAxisDirections = {
  negative: "negative",
  positive: "positive",
} as const;

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
