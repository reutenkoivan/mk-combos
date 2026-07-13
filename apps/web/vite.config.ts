import { createViteConfig } from "@mk-combos/contracts/build/vite/config";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { webBasePath } from "./src/config/web-path";

export default createViteConfig({
  base: webBasePath,
  preReactPlugins: tanstackStart({
    prerender: {
      failOnError: true,
    },
    router: {
      quoteStyle: "double",
      semicolons: true,
    },
    sitemap: {
      enabled: false,
    },
    spa: {
      enabled: true,
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
