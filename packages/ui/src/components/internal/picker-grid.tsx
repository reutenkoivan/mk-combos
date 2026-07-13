import type { CSSProperties } from "react";

import { CheckIcon } from "../../icons/check";
import { LoadingIndicator, StatusMessage } from "../../primitives/state";
import type { PickerOption, PickerSlot, UiResponsiveMode } from "../type";
import { pickerSlotStatuses, uiResponsiveModes } from "../value";
import { SelectableItem } from "./selectable-item";

type PickerGridAction = {
  optionId?: string;
  slotId: string;
  type: "focus" | "select";
};

export type PickerGridProps = {
  busy?: boolean;
  disabled?: boolean;
  focusedSlotId?: string;
  label: string;
  layoutId: string;
  message?: string;
  onRequestAction?: (action: PickerGridAction) => void;
  options: readonly PickerOption[];
  responsiveMode: UiResponsiveMode;
  selectedOptionId?: string;
  slots: readonly PickerSlot[];
};

const compactGridStyle = { gridTemplateColumns: "repeat(auto-fit,minmax(7rem,1fr))" } as const;

export function PickerGrid(props: PickerGridProps) {
  const optionsById = new Map(props.options.map((option) => [option.id, option]));
  let columns = 1;
  let rows = 1;

  for (const slot of props.slots) {
    columns = Math.max(columns, slot.column);
    rows = Math.max(rows, slot.row);
  }

  const wide = props.responsiveMode === uiResponsiveModes.desktop;
  const gridStyle: CSSProperties = wide
    ? {
        gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`,
        gridTemplateRows: `repeat(${rows},minmax(4.5rem,auto))`,
      }
    : compactGridStyle;

  return (
    <fieldset
      aria-busy={props.busy || undefined}
      className="grid min-w-0 gap-2 border-0 p-0"
      data-picker-layout={props.layoutId}
      data-ui-picker-grid
    >
      <legend className="text-sm font-semibold text-[var(--ui-text)]">{props.label}</legend>
      <div className="grid min-w-0 gap-2" style={gridStyle}>
        {props.slots.map((slot, index) => {
          const option = slot.optionId ? optionsById.get(slot.optionId) : undefined;
          const placeholder = slot.status === pickerSlotStatuses.placeholder || !option;
          const style: CSSProperties = wide
            ? { gridColumn: slot.column, gridRow: slot.row }
            : { order: slot.responsiveOrder ?? index + 1 };

          if (placeholder) {
            return (
              <div
                aria-hidden="true"
                className="min-h-16 rounded-[var(--ui-radius-control)] border border-dashed border-[var(--ui-separator)] bg-[var(--ui-placeholder)] opacity-45"
                data-picker-slot={slot.slotId}
                data-picker-slot-status={pickerSlotStatuses.placeholder}
                key={slot.slotId}
                style={style}
              />
            );
          }

          const unavailable =
            slot.status === pickerSlotStatuses.disabledUnavailable || Boolean(props.disabled);
          const selected = option.id === props.selectedOptionId;
          const focused = slot.slotId === props.focusedSlotId;

          return (
            <SelectableItem
              accessibleLabel={
                option.disabledReason ? `${option.label}: ${option.disabledReason}` : option.label
              }
              busy={props.busy}
              className="min-h-16 grid-cols-[1fr_auto] content-center p-2"
              disabled={unavailable}
              key={slot.slotId}
              onRequestFocus={() =>
                props.onRequestAction?.({ optionId: option.id, slotId: slot.slotId, type: "focus" })
              }
              onRequestPress={() =>
                props.onRequestAction?.({
                  optionId: option.id,
                  slotId: slot.slotId,
                  type: "select",
                })
              }
              selected={selected}
              style={style}
              value={slot.slotId}
            >
              <span className="grid min-w-0 gap-1 text-start">
                {option.imageSrc && (
                  <img
                    alt={option.imageAlt ?? ""}
                    className="h-9 w-9 rounded-[var(--ui-radius-control)] object-cover"
                    src={option.imageSrc}
                  />
                )}
                <span className="truncate font-semibold">{option.shortLabel ?? option.label}</span>
                {option.count !== undefined && (
                  <span className="text-xs text-[var(--ui-muted-text)]">{option.count}</span>
                )}
                {option.disabledReason && (
                  <span className="text-xs text-[var(--ui-muted-text)]">
                    {option.disabledReason}
                  </span>
                )}
              </span>
              <span aria-hidden="true" className="grid min-h-5 min-w-5 place-items-center">
                {selected ? <CheckIcon size="small" /> : focused ? "•" : null}
              </span>
            </SelectableItem>
          );
        })}
      </div>
      {props.busy && <LoadingIndicator label={props.message ?? "Loading options"} />}
      {!props.busy && props.message && <StatusMessage>{props.message}</StatusMessage>}
    </fieldset>
  );
}

PickerGrid.displayName = "PickerGrid";
