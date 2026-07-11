import { withStorybookViteConfig } from "@mk-combos/contracts/build/vite/storybook";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  viteFinal: (viteConfig) => withStorybookViteConfig(viteConfig),
};

export default config;
