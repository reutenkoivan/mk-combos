export const controllerCommandScopeLayers = {
  overlay: "overlay",
  page: "page",
  shell: "shell",
} as const;

export const controllerCommandRibbonShellPolicies = {
  append: "append",
  suppress: "suppress",
} as const;

export const controllerCommandScopeLayerSequence = [
  controllerCommandScopeLayers.overlay,
  controllerCommandScopeLayers.shell,
  controllerCommandScopeLayers.page,
] as const;
