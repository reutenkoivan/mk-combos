export const builderComboStateStatuses = {
  fresh: "fresh",
  invalid: "invalid",
  stale: "stale",
} as const;

export const builderInvalidComboStateStatuses = {
  invalid: builderComboStateStatuses.invalid,
  stale: builderComboStateStatuses.stale,
} as const;
