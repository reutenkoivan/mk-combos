import { Badge } from "../primitives/state";
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

export function ComboMetadataGrid(props: ComboMetadataGridProps) {
  const compact = props.responsiveMode !== uiResponsiveModes.desktop;

  return (
    <section aria-label={props.label} className="grid min-w-0 gap-2" data-ui-component="UI-CMP-017">
      <dl className="grid min-w-0 gap-2">
        {props.rows.map((row) => (
          <div
            className={
              compact
                ? "grid min-w-0 gap-1 border-b border-[var(--ui-separator)] py-2"
                : "grid min-w-0 grid-cols-[minmax(8rem,0.35fr)_1fr_auto] items-center gap-3 border-b border-[var(--ui-separator)] py-2"
            }
            data-metadata-importance={row.importance}
            key={row.id}
          >
            <dt className="text-sm font-semibold text-[var(--ui-muted-text)]">{row.label}</dt>
            <dd className="min-w-0 text-sm">{row.value}</dd>
            {row.statusLabel && (
              <Badge tone={row.tone ?? uiToneModes.neutral}>{row.statusLabel}</Badge>
            )}
          </div>
        ))}
      </dl>
      {props.annotation && <p className="text-sm text-[var(--ui-warning)]">{props.annotation}</p>}
    </section>
  );
}

ComboMetadataGrid.displayName = "ComboMetadataGrid";
