export const knownControllerCommandIds = {
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
} as const;

export const controllerCommandGroups = {
  builder: "builder",
  catalog: "catalog",
  detail: "detail",
  list: "list",
  navigation: "navigation",
  panel: "panel",
} as const;

export const controllerCommandMetadata = [
  {
    id: "navUp",
    group: "navigation",
    label: { EN: "Move up", fallback: "Move up" },
    repeatable: true,
  },
  {
    id: "navDown",
    group: "navigation",
    label: { EN: "Move down", fallback: "Move down" },
    repeatable: true,
  },
  {
    id: "navLeft",
    group: "navigation",
    label: { EN: "Move left", fallback: "Move left" },
    repeatable: true,
  },
  {
    id: "navRight",
    group: "navigation",
    label: { EN: "Move right", fallback: "Move right" },
    repeatable: true,
  },
  {
    id: "confirm",
    group: "navigation",
    label: { EN: "Confirm", fallback: "Confirm" },
  },
  {
    id: "back",
    group: "navigation",
    label: { EN: "Back", fallback: "Back" },
  },
  {
    id: "closePanel",
    group: "panel",
    label: { EN: "Close panel", fallback: "Close panel" },
  },
  {
    id: "openGlobalMenu",
    group: "panel",
    label: { EN: "Open global menu", fallback: "Open global menu" },
  },
  {
    id: "openControllerHelp",
    group: "panel",
    label: { EN: "Open controller help", fallback: "Open controller help" },
  },
  {
    id: "openFilters",
    group: "catalog",
    label: { EN: "Open filters", fallback: "Open filters" },
  },
  {
    id: "openDetail",
    group: "detail",
    label: { EN: "Open detail", fallback: "Open detail" },
  },
  {
    id: "openActions",
    group: "panel",
    label: { EN: "Open actions", fallback: "Open actions" },
  },
  {
    id: "addToList",
    group: "list",
    label: { EN: "Add to list", fallback: "Add to list" },
  },
  {
    id: "removeFromList",
    group: "list",
    label: { EN: "Remove from list", fallback: "Remove from list" },
  },
  {
    id: "closeDetail",
    group: "detail",
    label: { EN: "Close detail", fallback: "Close detail" },
  },
  {
    id: "nextTab",
    group: "navigation",
    label: { EN: "Next tab", fallback: "Next tab" },
  },
  {
    id: "previousTab",
    group: "navigation",
    label: { EN: "Previous tab", fallback: "Previous tab" },
  },
  {
    id: "builderSelectMove",
    group: "builder",
    label: { EN: "Select move", fallback: "Select move" },
  },
  {
    id: "builderUndoMove",
    group: "builder",
    label: { EN: "Undo move", fallback: "Undo move" },
  },
  {
    id: "builderFinish",
    group: "builder",
    label: { EN: "Finish combo", fallback: "Finish combo" },
  },
  {
    id: "builderCancel",
    group: "builder",
    label: { EN: "Cancel builder", fallback: "Cancel builder" },
  },
  {
    id: "builderNextGroup",
    group: "builder",
    label: { EN: "Next move group", fallback: "Next move group" },
  },
  {
    id: "builderPreviousGroup",
    group: "builder",
    label: { EN: "Previous move group", fallback: "Previous move group" },
  },
] as const;
