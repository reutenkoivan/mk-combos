import type { UiResponsiveMode } from "../components/type";
import { uiResponsiveModes } from "../components/value";
import { UiRootContext } from "../internal/ui-root-context";
import { cx } from "../recipes/class-name";
import { separatorRecipe } from "../recipes/separator";
import { surfaceRecipe } from "../recipes/surface";
import type {
  UiContrastMode,
  UiDensityMode,
  UiMaterialMode,
  UiPlacementMode,
  UiShapeMode,
  UiThemeMode,
  UiToneMode,
} from "../tokens/type";
import {
  uiContrastModes,
  uiDensityModes,
  uiMaterialModes,
  uiPlacementModes,
  uiShapeModes,
  uiThemeModes,
  uiToneModes,
} from "../tokens/value";
import { Show } from "./conditional";
import { alignClasses, densityGapClasses, justifyClasses, type UiPrimitiveProps } from "./internal";

export const uiAlignments = {
  center: "center",
  end: "end",
  start: "start",
  stretch: "stretch",
} as const;

export type UiAlign = (typeof uiAlignments)[keyof typeof uiAlignments];

export const uiJustifications = {
  between: "between",
  center: "center",
  end: "end",
  start: "start",
} as const;

export type UiJustify = (typeof uiJustifications)[keyof typeof uiJustifications];

export const gridColumnModes = {
  auto: "auto",
  one: "one",
  three: "three",
  two: "two",
} as const;

export type GridColumnMode = (typeof gridColumnModes)[keyof typeof gridColumnModes];

export const separatorOrientations = {
  horizontal: "horizontal",
  vertical: "vertical",
} as const;

export type SeparatorOrientation =
  (typeof separatorOrientations)[keyof typeof separatorOrientations];

export type UiRootProps = UiPrimitiveProps<HTMLDivElement> & {
  contrast?: UiContrastMode;
  controllerFocusVisible?: boolean;
  density?: UiDensityMode;
  theme?: UiThemeMode;
  responsiveMode?: UiResponsiveMode;
};

export function UiRoot(props: UiRootProps) {
  const {
    children,
    className,
    contrast = uiContrastModes.standard,
    controllerFocusVisible = true,
    density = uiDensityModes.small,
    ref,
    responsiveMode = uiResponsiveModes.desktop,
    theme = uiThemeModes.dark,
    ...rootProps
  } = props;

  return (
    <UiRootContext value={{ contrast, controllerFocusVisible, density, responsiveMode, theme }}>
      <div
        {...rootProps}
        ref={ref}
        data-ui-theme={theme}
        data-ui-density={density}
        data-ui-contrast={contrast}
        data-ui-responsive={responsiveMode}
        data-ui-controller-focus-visible={controllerFocusVisible ? "true" : "false"}
        className={cx("mk-combos-ui-root min-h-full text-(--ui-text)", className)}
      >
        {children}
      </div>
    </UiRootContext>
  );
}

UiRoot.displayName = "UiRoot";

export type StackProps = UiPrimitiveProps<HTMLDivElement> & {
  align?: UiAlign;
  density?: UiDensityMode;
  justify?: UiJustify;
};

export function Stack(props: StackProps) {
  const {
    align = uiAlignments.stretch,
    children,
    className,
    density = uiDensityModes.small,
    justify = uiJustifications.start,
    ref,
    ...stackProps
  } = props;

  return (
    <div
      {...stackProps}
      ref={ref}
      data-ui-layout="stack"
      className={cx(
        "flex min-w-0 flex-col",
        densityGapClasses[density],
        alignClasses[align],
        justifyClasses[justify],
        className,
      )}
    >
      {children}
    </div>
  );
}

Stack.displayName = "Stack";

export type GroupProps = UiPrimitiveProps<HTMLDivElement> & {
  align?: UiAlign;
  density?: UiDensityMode;
  justify?: UiJustify;
  wrap?: boolean;
};

export function Group(props: GroupProps) {
  const {
    align = uiAlignments.center,
    children,
    className,
    density = uiDensityModes.small,
    justify = uiJustifications.start,
    ref,
    wrap = true,
    ...groupProps
  } = props;

  return (
    <div
      {...groupProps}
      ref={ref}
      data-ui-layout="group"
      className={cx(
        "flex min-w-0",
        wrap ? "flex-wrap" : "flex-nowrap",
        densityGapClasses[density],
        alignClasses[align],
        justifyClasses[justify],
        className,
      )}
    >
      {children}
    </div>
  );
}

Group.displayName = "Group";

export type GridProps = UiPrimitiveProps<HTMLDivElement> & {
  align?: UiAlign;
  columns?: GridColumnMode;
  density?: UiDensityMode;
};

const gridColumnClasses = {
  auto: "grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]",
  one: "grid-cols-1",
  three: "grid-cols-1 md:grid-cols-3",
  two: "grid-cols-1 md:grid-cols-2",
} as const satisfies Record<GridColumnMode, string>;

export function Grid(props: GridProps) {
  const {
    align = uiAlignments.stretch,
    children,
    className,
    columns = gridColumnModes.auto,
    density = uiDensityModes.small,
    ref,
    ...gridProps
  } = props;

  return (
    <div
      {...gridProps}
      ref={ref}
      data-ui-layout="grid"
      className={cx(
        "grid min-w-0",
        gridColumnClasses[columns],
        densityGapClasses[density],
        alignClasses[align],
        className,
      )}
    >
      {children}
    </div>
  );
}

Grid.displayName = "Grid";

export type SurfaceProps = UiPrimitiveProps<HTMLDivElement> & {
  density?: UiDensityMode;
  material?: UiMaterialMode;
  placement?: UiPlacementMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
};

export function Surface(props: SurfaceProps) {
  const {
    children,
    className,
    density = uiDensityModes.small,
    material = uiMaterialModes.opaque,
    placement = uiPlacementModes.block,
    ref,
    shape = uiShapeModes.fixed,
    tone = uiToneModes.neutral,
    ...surfaceProps
  } = props;

  return (
    <div
      {...surfaceProps}
      ref={ref}
      data-ui-surface
      className={cx(surfaceRecipe({ density, material, placement, shape, tone }), className)}
    >
      {children}
    </div>
  );
}

Surface.displayName = "Surface";

export type PanelProps = SurfaceProps & {
  gap?: UiDensityMode;
};

export function Panel(props: PanelProps) {
  const {
    children,
    className,
    density = uiDensityModes.small,
    gap = uiDensityModes.small,
    material = uiMaterialModes.opaque,
    placement = uiPlacementModes.block,
    ref,
    shape = uiShapeModes.fixed,
    tone = uiToneModes.neutral,
    ...panelProps
  } = props;

  return (
    <div
      {...panelProps}
      ref={ref}
      data-ui-panel
      className={cx(
        surfaceRecipe({ density, material, placement, shape, tone }),
        "grid min-w-0",
        densityGapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}

Panel.displayName = "Panel";

export type WorkstationSectionProps = UiPrimitiveProps<HTMLElement> & {
  description?: string;
  eyebrow?: string;
  title: string;
  tone?: UiToneMode;
};

export function WorkstationSection(props: WorkstationSectionProps) {
  const {
    children,
    className,
    description,
    eyebrow,
    ref,
    title,
    tone = uiToneModes.neutral,
    ...sectionProps
  } = props;

  return (
    <section
      {...sectionProps}
      ref={ref}
      data-ui-workstation-section
      className={cx(
        surfaceRecipe({
          density: uiDensityModes.medium,
          material: uiMaterialModes.none,
          tone,
        }),
        "grid min-w-0 gap-4 border-t border-(--ui-separator) p-0 pt-5 first:border-t-0 first:pt-0",
        className,
      )}
    >
      <header className="grid gap-1">
        <Show when={Boolean(eyebrow)}>
          {() => <span className="text-xs font-medium text-(--ui-accent-strong)">{eyebrow}</span>}
        </Show>
        <h2 className="font-(--ui-font-display) text-base font-semibold tracking-[-0.01em]">
          {title}
        </h2>
        <Show when={Boolean(description)}>
          {() => <p className="text-sm text-(--ui-muted-text)">{description}</p>}
        </Show>
      </header>
      <div className="grid min-w-0 gap-4">{children}</div>
    </section>
  );
}

WorkstationSection.displayName = "WorkstationSection";

export type SeparatorProps = Omit<UiPrimitiveProps<HTMLHRElement>, "children" | "role"> & {
  density?: UiDensityMode;
  orientation?: SeparatorOrientation;
  tone?: UiToneMode;
};

export function Separator(props: SeparatorProps) {
  const {
    className,
    density = uiDensityModes.small,
    orientation = separatorOrientations.horizontal,
    ref,
    tone = uiToneModes.neutral,
    ...separatorProps
  } = props;

  return (
    <hr
      {...separatorProps}
      ref={ref}
      data-ui-separator
      aria-orientation={orientation}
      className={cx(separatorRecipe({ density, orientation, tone }), className)}
    />
  );
}

Separator.displayName = "Separator";
