import { cx } from "../recipes/class-name";
import { indicatorRecipe } from "../recipes/indicator";
import type { UiDensityMode, UiShapeMode, UiToneMode } from "../tokens/type";
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
    density = "small",
    ref,
    shape = "fixed",
    tone = "neutral",
    ...badgeProps
  } = props;

  return (
    <span
      {...badgeProps}
      className={cx(indicatorRecipe({ density, shape, tone }), className)}
      data-ui-badge
      ref={ref}
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
  accent: "text-[var(--ui-accent-strong)]",
  destructive: "text-[var(--ui-destructive)]",
  neutral: "text-[var(--ui-muted-text)]",
  success: "text-[var(--ui-success)]",
  warning: "text-[var(--ui-warning)]",
} as const;

export function StatusMessage(props: StatusMessageProps) {
  const { children, className, ref, role, tone = "neutral", ...messageProps } = props;
  const resolvedRole = role ?? (tone === "destructive" ? "alert" : "status");

  return (
    <div
      {...messageProps}
      className={cx("text-[13px] leading-snug", statusToneClasses[tone], className)}
      data-ui-status-message
      ref={ref}
      role={resolvedRole}
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
    tone = "neutral",
    ...indicatorProps
  } = props;

  return (
    <span
      {...indicatorProps}
      className={cx("inline-flex items-center justify-center", statusToneClasses[tone], className)}
      data-ui-loading-indicator
      ref={ref}
      role={role}
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
