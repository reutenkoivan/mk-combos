import { createTsdownConfig } from "@mk-combos/contracts/build/tsdown/config";

export default createTsdownConfig({
  entry: {
    "backup/schema": "src/backup/schema.ts",
    "backup/type": "src/backup/type.ts",
    "build/tsdown/config": "src/build/tsdown/config.ts",
    "build/vite/config": "src/build/vite/config.ts",
    "build/vite/storybook": "src/build/vite/storybook.ts",
    contract: "src/contract.ts",
    "env/runtime": "src/env/runtime.ts",
    "env/type": "src/env/type.ts",
    "env/value": "src/env/value.ts",
    "identity/schema": "src/identity/schema.ts",
    "identity/type": "src/identity/type.ts",
    "result/schema": "src/result/schema.ts",
    "result/runtime": "src/result/runtime.ts",
    "result/type": "src/result/type.ts",
    "routes/schema": "src/routes/schema.ts",
    "routes/type": "src/routes/type.ts",
    "settings/schema": "src/settings/schema.ts",
    "settings/type": "src/settings/type.ts",
    "test/e2e/config": "src/test/e2e/config.ts",
    "test/e2e/test": "src/test/e2e/test.ts",
    "test/unit/config": "src/test/unit/config.ts",
    "test/unit/react": "src/test/unit/react.ts",
    "test/unit/setup": "src/test/unit/setup.ts",
  },
});
