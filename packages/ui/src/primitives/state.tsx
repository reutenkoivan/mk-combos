import { cx } from "../recipes/class-name";
import { indicatorRecipe } from "../recipes/indicator";
import type { UiDensityMode, UiShapeMode, UiToneMode } from "../tokens/type";
import { uiDensityModes, uiShapeModes, uiToneModes } from "../tokens/value";
import type { UiPrimitiveProps } from "./internal";

export type BadgeProps = UiPrimitiveProps<HTMLSpanElement> & {
  density?: UiDensityMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
};

export function Badge(props: BadgeProps) {
  const {
    children,
    className,
    density = uiDensityModes.small,
    ref,
    shape = uiShapeModes.fixed,
    tone = uiToneModes.neutral,
    ...badgeProps
  } = props;

  return (
    <span
      {...badgeProps}
      ref={ref}
      data-ui-badge
      className={cx(indicatorRecipe({ density, shape, tone }), className)}
    >
      {children}
    </span>
  );
}

Badge.displayName = "Badge";

export type StatusMessageProps = UiPrimitiveProps<HTMLDivElement> & {
  tone?: UiToneMode;
};

const statusToneClasses = {
  accent: "text-(--ui-accent-strong)",
  destructive: "text-(--ui-destructive)",
  neutral: "text-(--ui-muted-text)",
  success: "text-(--ui-success)",
  warning: "text-(--ui-warning)",
} as const;

export function StatusMessage(props: StatusMessageProps) {
  const { children, className, ref, role, tone = uiToneModes.neutral, ...messageProps } = props;
  const resolvedRole = role ?? (tone === uiToneModes.destructive ? "alert" : "status");

  return (
    <div
      {...messageProps}
      ref={ref}
      role={resolvedRole}
      data-ui-status-message
      className={cx("text-[13px] leading-snug", statusToneClasses[tone], className)}
    >
      {children}
    </div>
  );
}

StatusMessage.displayName = "StatusMessage";

export type LoadingIndicatorProps = Omit<UiPrimitiveProps<HTMLSpanElement>, "children"> & {
  label?: string;
  tone?: UiToneMode;
};

export function LoadingIndicator(props: LoadingIndicatorProps) {
  const {
    className,
    label = "Loading",
    ref,
    role = "status",
    tone = uiToneModes.neutral,
    ...indicatorProps
  } = props;

  return (
    <span
      {...indicatorProps}
      ref={ref}
      role={role}
      data-ui-loading-indicator
      className={cx("inline-flex items-center justify-center", statusToneClasses[tone], className)}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="h-4 w-4 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin"
      />
    </span>
  );
}

LoadingIndicator.displayName = "LoadingIndicator";
