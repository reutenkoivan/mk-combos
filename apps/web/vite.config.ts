import { createViteConfig } from "@mk-combos/contracts/build/vite/config";
import { mkCombosEnv } from "@mk-combos/contracts/env/value";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default createViteConfig({
  base: mkCombosEnv.viteBase,
  preReactPlugins: tanstackStart({
    prerender: {
      failOnError: true,
    },
    router: {
      basepath: "/",
      quoteStyle: "double",
      semicolons: true,
    },
    sitemap: {
      enabled: false,
    },
    spa: {
      enabled: true,
      maskPath: mkCombosEnv.viteBase,
      prerender: {
        outputPath: "/index.html",
      },
    },
  }),
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
  },
});
