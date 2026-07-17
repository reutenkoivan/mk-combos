import { NotationIcon } from "../notation/renderer";
import type { UiNotationLegendRow } from "../notation/type";
import { Show } from "../primitives/conditional";

export const notationLegendTableLayouts = {
  compact: "compact",
  stacked: "stacked",
  table: "table",
} as const;

export type NotationLegendTableLayout =
  (typeof notationLegendTableLayouts)[keyof typeof notationLegendTableLayouts];

export type NotationLegendTableProps = {
  ariaLabel?: string;
  caption?: string;
  disabled?: boolean;
  invalid?: boolean;
  layout?: NotationLegendTableLayout;
  legendRows: readonly UiNotationLegendRow[];
  markersHeaderLabel: string;
  modeHeaderLabel: string;
  modifiersHeaderLabel?: string;
  showModifiers?: boolean;
};

export function NotationLegendTable(props: NotationLegendTableProps) {
  const layout = props.layout ?? notationLegendTableLayouts.table;

  return (
    <div
      data-layout={layout}
      data-ui-component="UI-CMP-037"
      data-invalid={props.invalid || undefined}
      data-disabled={props.disabled || undefined}
      className="min-w-0 overflow-hidden border-t border-(--ui-separator) py-4"
    >
      <table
        aria-label={!props.caption ? props.ariaLabel : undefined}
        className={
          layout === notationLegendTableLayouts.table
            ? "w-full border-collapse text-left text-sm"
            : "block w-full text-left text-sm [&_tbody]:grid [&_tbody]:divide-y [&_tbody]:divide-(--ui-separator) [&_thead]:sr-only [&_tr]:grid [&_tr]:gap-2 [&_tr]:py-3"
        }
      >
        <Show when={Boolean(props.caption)}>
          {() => (
            <caption
              className={
                layout === notationLegendTableLayouts.table
                  ? "pb-3 text-left font-semibold"
                  : "block w-full pb-3 text-left font-semibold"
              }
            >
              {props.caption}
            </caption>
          )}
        </Show>
        <thead>
          <tr
            className={
              layout === notationLegendTableLayouts.table
                ? "border-b border-(--ui-separator)"
                : undefined
            }
          >
            <th className="p-2" scope="col">
              {props.modeHeaderLabel}
            </th>
            <th className="p-2" scope="col">
              {props.markersHeaderLabel}
            </th>
            <Show when={Boolean(props.showModifiers)}>
              {() => (
                <th className="p-2" scope="col">
                  {props.modifiersHeaderLabel}
                </th>
              )}
            </Show>
          </tr>
        </thead>
        <tbody>
          {props.legendRows.map((row) => (
            <tr
              key={row.mode}
              className={
                layout === notationLegendTableLayouts.table
                  ? "border-b border-(--ui-separator) last:border-b-0"
                  : undefined
              }
            >
              <th className="p-2 font-medium" scope="row">
                <span className="inline-flex items-center gap-2">
                  <NotationIcon descriptor={row.modeIcon} />
                  <span>{row.modeLabel}</span>
                </span>
              </th>
              <td className="p-2">
                <span className="flex flex-wrap items-center gap-1">
                  {row.markerIcons.map((icon) => (
                    <NotationIcon
                      descriptor={icon}
                      key={`${row.mode}-${icon.iconName}-${icon.token}`}
                    />
                  ))}
                </span>
              </td>
              <Show when={Boolean(props.showModifiers)}>
                {() => (
                  <td className="p-2">
                    <span className="flex flex-wrap items-center gap-1">
                      {row.modifierIcons?.map((icon) => (
                        <NotationIcon
                          descriptor={icon}
                          key={`${row.mode}-${icon.iconName}-${icon.token}`}
                        />
                      ))}
                    </span>
                  </td>
                )}
              </Show>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

NotationLegendTable.displayName = "NotationLegendTable";
