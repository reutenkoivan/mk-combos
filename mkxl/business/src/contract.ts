export const mkxlBusinessContractGroups = {
  entry: {
    runtime: "@mk-combos/mkxl-business",
  },
  runtime: {
    runtime: "@mk-combos/mkxl-business/runtime",
  },
  schema: {
    schema: "@mk-combos/mkxl-business/schema",
  },
  type: {
    type: "@mk-combos/mkxl-business/type",
  },
} as const;

export const mkCombosMkxlBusiness = {
  packageName: "@mk-combos/mkxl-business",
  groups: mkxlBusinessContractGroups,
} as const;
