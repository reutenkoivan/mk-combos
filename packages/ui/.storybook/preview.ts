import type { Preview } from "@storybook/react-vite";

import "../src/styles.css";
import { storyViewportGlobals, storyViewportOptions } from "../src/stories/story-viewports";

const preview: Preview = {
  initialGlobals: storyViewportGlobals.desktop,
  parameters: {
    a11y: {
      test: "todo",
    },
    controls: {
      expanded: true,
    },
    layout: "fullscreen",
    viewport: {
      options: storyViewportOptions,
    },
  },
};

export default preview;
