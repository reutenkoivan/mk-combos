export const mk1BusinessContractGroups = {
  entry: {
    runtime: "@mk-combos/mk1-business",
  },
  runtime: {
    runtime: "@mk-combos/mk1-business/runtime",
  },
  schema: {
    schema: "@mk-combos/mk1-business/schema",
  },
  type: {
    type: "@mk-combos/mk1-business/type",
  },
} as const;

export const mkCombosMk1Business = {
  packageName: "@mk-combos/mk1-business",
  groups: mk1BusinessContractGroups,
} as const;
