import { createUnitConfig } from "@mk-combos/contracts/test/unit/config";

export default createUnitConfig({
  test: {
    include: ["src/**/*.integration.test.{ts,tsx}"],
  },
});
