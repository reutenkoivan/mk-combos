import { Show } from "../primitives/conditional";
import { Badge } from "../primitives/state";
import { cx } from "../recipes/class-name";
import { uiToneModes } from "../tokens/value";
import type { ComponentActionIntent, ComponentLabelValue, UiResponsiveMode } from "./type";
import { uiResponsiveModes } from "./value";

export const comboMetadataGridActions = {} as const;

export type ComboMetadataGridAction =
  (typeof comboMetadataGridActions)[keyof typeof comboMetadataGridActions];

export type ComboMetadataGridIntent = ComponentActionIntent<ComboMetadataGridAction>;

export const comboMetadataImportances = {
  critical: "critical",
  normal: "normal",
  secondary: "secondary",
} as const;

export type ComboMetadataImportance =
  (typeof comboMetadataImportances)[keyof typeof comboMetadataImportances];

export type ComboMetadataRow = ComponentLabelValue & {
  importance?: ComboMetadataImportance;
  statusLabel?: string;
};

export type ComboMetadataGridProps = {
  annotation?: string;
  label: string;
  responsiveMode: UiResponsiveMode;
  rows: readonly ComboMetadataRow[];
};

const metadataRowImportanceClasses = {
  critical:
    "rounded-(--ui-radius-control) border border-(--ui-warning-border) bg-(--ui-warning-soft) p-3",
  normal: "border-b border-(--ui-separator) py-2",
  secondary: "border-b border-(--ui-separator) py-2 text-(--ui-muted-text)",
} as const satisfies Record<ComboMetadataImportance, string>;

const metadataLabelImportanceClasses = {
  critical: "text-(--ui-warning)",
  normal: "text-(--ui-muted-text)",
  secondary: "text-(--ui-muted-text)",
} as const satisfies Record<ComboMetadataImportance, string>;

const metadataValueImportanceClasses = {
  critical: "text-base font-semibold text-(--ui-text)",
  normal: "text-sm text-(--ui-text)",
  secondary: "text-xs text-(--ui-muted-text)",
} as const satisfies Record<ComboMetadataImportance, string>;

export function ComboMetadataGrid(props: ComboMetadataGridProps) {
  const compact = props.responsiveMode !== uiResponsiveModes.desktop;

  return (
    <section aria-label={props.label} className="grid min-w-0 gap-2" data-ui-component="UI-CMP-017">
      <dl className="grid min-w-0 gap-2">
        {props.rows.map((row) => {
          const importance = row.importance ?? comboMetadataImportances.normal;

          return (
            <div
              key={row.id}
              data-metadata-importance={importance}
              className={cx(
                "grid min-w-0 gap-1",
                compact
                  ? "grid-cols-1"
                  : "grid-cols-[minmax(8rem,0.35fr)_minmax(0,1fr)_auto] items-center gap-3",
                metadataRowImportanceClasses[importance],
              )}
            >
              <dt
                className={cx(
                  "break-words text-sm font-semibold leading-snug",
                  metadataLabelImportanceClasses[importance],
                )}
              >
                {row.label}
              </dt>
              <dd
                className={cx(
                  "min-w-0 break-words leading-snug",
                  metadataValueImportanceClasses[importance],
                )}
              >
                {row.value}
              </dd>
              <Show when={Boolean(row.statusLabel)}>
                {() => (
                  <Badge
                    tone={row.tone ?? uiToneModes.neutral}
                    className="h-auto max-w-full shrink whitespace-normal break-words py-1 text-start leading-snug"
                  >
                    {row.statusLabel}
                  </Badge>
                )}
              </Show>
            </div>
          );
        })}
      </dl>
      <Show when={Boolean(props.annotation)}>
        {() => (
          <p className="break-words text-sm leading-snug text-(--ui-warning)">{props.annotation}</p>
        )}
      </Show>
    </section>
  );
}

ComboMetadataGrid.displayName = "ComboMetadataGrid";
