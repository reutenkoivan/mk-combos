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
import { alignClasses, densityGapClasses, justifyClasses, type UiPrimitiveProps } from "./internal";

type UiAlign = keyof typeof alignClasses;
type UiJustify = keyof typeof justifyClasses;

export type UiRootProps = UiPrimitiveProps<HTMLDivElement> & {
  contrast?: UiContrastMode;
  density?: UiDensityMode;
  theme?: UiThemeMode;
};

export function UiRoot(props: UiRootProps) {
  const {
    children,
    className,
    contrast = "standard",
    density = "small",
    ref,
    theme = "light",
    ...rootProps
  } = props;

  return (
    <div
      {...rootProps}
      className={cx("mk-combos-ui-root min-h-full text-[var(--ui-text)]", className)}
      data-ui-contrast={contrast}
      data-ui-density={density}
      data-ui-theme={theme}
      ref={ref}
    >
      {children}
    </div>
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
    align = "stretch",
    children,
    className,
    density = "small",
    justify = "start",
    ref,
    ...stackProps
  } = props;

  return (
    <div
      {...stackProps}
      className={cx(
        "flex min-w-0 flex-col",
        densityGapClasses[density],
        alignClasses[align],
        justifyClasses[justify],
        className,
      )}
      data-ui-layout="stack"
      ref={ref}
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
    align = "center",
    children,
    className,
    density = "small",
    justify = "start",
    ref,
    wrap = true,
    ...groupProps
  } = props;

  return (
    <div
      {...groupProps}
      className={cx(
        "flex min-w-0",
        wrap ? "flex-wrap" : "flex-nowrap",
        densityGapClasses[density],
        alignClasses[align],
        justifyClasses[justify],
        className,
      )}
      data-ui-layout="group"
      ref={ref}
    >
      {children}
    </div>
  );
}

Group.displayName = "Group";

export type GridProps = UiPrimitiveProps<HTMLDivElement> & {
  align?: UiAlign;
  columns?: "auto" | "one" | "three" | "two";
  density?: UiDensityMode;
};

const gridColumnClasses = {
  auto: "grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]",
  one: "grid-cols-1",
  three: "grid-cols-1 md:grid-cols-3",
  two: "grid-cols-1 md:grid-cols-2",
} as const;

export function Grid(props: GridProps) {
  const {
    align = "stretch",
    children,
    className,
    columns = "auto",
    density = "small",
    ref,
    ...gridProps
  } = props;

  return (
    <div
      {...gridProps}
      className={cx(
        "grid min-w-0",
        gridColumnClasses[columns],
        densityGapClasses[density],
        alignClasses[align],
        className,
      )}
      data-ui-layout="grid"
      ref={ref}
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
    density = "small",
    material = "opaque",
    placement = "block",
    ref,
    shape = "fixed",
    tone = "neutral",
    ...surfaceProps
  } = props;

  return (
    <div
      {...surfaceProps}
      className={cx(surfaceRecipe({ density, material, placement, shape, tone }), className)}
      data-ui-surface
      ref={ref}
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
    density = "small",
    gap = "small",
    material = "separated",
    placement = "block",
    ref,
    shape = "fixed",
    tone = "neutral",
    ...panelProps
  } = props;

  return (
    <div
      {...panelProps}
      className={cx(
        surfaceRecipe({ density, material, placement, shape, tone }),
        "grid min-w-0",
        densityGapClasses[gap],
        className,
      )}
      data-ui-panel
      ref={ref}
    >
      {children}
    </div>
  );
}

Panel.displayName = "Panel";

export type SeparatorProps = Omit<UiPrimitiveProps<HTMLHRElement>, "children" | "role"> & {
  density?: UiDensityMode;
  orientation?: "horizontal" | "vertical";
  tone?: UiToneMode;
};

export function Separator(props: SeparatorProps) {
  const {
    className,
    density = "small",
    orientation = "horizontal",
    ref,
    tone = "neutral",
    ...separatorProps
  } = props;

  return (
    <hr
      {...separatorProps}
      aria-orientation={orientation}
      className={cx(separatorRecipe({ density, orientation, tone }), className)}
      data-ui-separator
      ref={ref}
    />
  );
}

Separator.displayName = "Separator";
