import type { ReactNode } from "react";

import type { UiResponsiveMode } from "../components/type";
import { uiResponsiveModes } from "../components/value";
import { UiRoot } from "../primitives/layout";
import { cx } from "../recipes/class-name";
import type { UiContrastMode, UiThemeMode } from "../tokens/type";
import { uiContrastModes, uiThemeModes } from "../tokens/value";

const storyFramePaddingClasses = {
  [uiResponsiveModes.desktop]: "p-6",
  [uiResponsiveModes.mobile]: "p-3",
  [uiResponsiveModes.tablet]: "p-5",
} as const satisfies Record<UiResponsiveMode, string>;

export type StoryFrameProps = {
  children: ReactNode;
  contentClassName?: string;
  contrast?: UiContrastMode;
  responsiveMode?: UiResponsiveMode;
  theme?: UiThemeMode;
};

export function StoryFrame(props: StoryFrameProps) {
  const responsiveMode = props.responsiveMode ?? uiResponsiveModes.desktop;

  return (
    <UiRoot
      className={cx(
        "grid min-h-screen content-start justify-items-center bg-[var(--ui-window)]",
        storyFramePaddingClasses[responsiveMode],
      )}
      contrast={props.contrast ?? uiContrastModes.standard}
      responsiveMode={responsiveMode}
      theme={props.theme ?? uiThemeModes.dark}
    >
      <main className={cx("grid w-full max-w-6xl gap-6", props.contentClassName)}>
        {props.children}
      </main>
    </UiRoot>
  );
}

StoryFrame.displayName = "StoryFrame";
