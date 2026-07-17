import type { CSSProperties } from "react";

import { CheckIcon } from "../../icons/check";
import { useUiRootContext } from "../../internal/ui-root-context";
import { Present, type PresentContentProps, Show } from "../../primitives/conditional";
import { Badge, LoadingIndicator, StatusMessage } from "../../primitives/state";
import { cx } from "../../recipes/class-name";
import { uiDensityModes, uiToneModes } from "../../tokens/value";
import type { PickerOption, PickerPresentationMode, PickerSlot, UiResponsiveMode } from "../type";
import { pickerPresentationModes, pickerSlotStatuses, uiResponsiveModes } from "../value";
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
  placement?: PickerGridPlacement;
  portraitLayout?: boolean;
  presentation?: PickerPresentationMode;
  responsiveMode: UiResponsiveMode;
  selectedOptionId?: string;
  slots: readonly PickerSlot[];
};

const compactGridStyle = { gridTemplateColumns: "repeat(auto-fit,minmax(7rem,1fr))" } as const;
const portraitFillGridStyle = {
  gridTemplateColumns: "repeat(auto-fit,minmax(min(7.5rem,100%),1fr))",
} as const;
const portraitCompactGridStyle = {
  gridTemplateColumns: "repeat(auto-fit,minmax(min(8rem,100%),10rem))",
} as const;

const pickerGridOrientations = {
  horizontal: "horizontal",
  portrait: "portrait",
} as const;

type PickerGridOrientation = (typeof pickerGridOrientations)[keyof typeof pickerGridOrientations];

export const pickerGridPlacements = {
  authored: "authored",
  compact: "compact",
  fill: "fill",
} as const;

type PickerGridPlacement = (typeof pickerGridPlacements)[keyof typeof pickerGridPlacements];

type PickerOptionCountContentValue = Readonly<{
  commandDeck: boolean;
  count: number;
  label?: string;
  portrait: boolean;
}>;

function PickerOptionCountContent({ value }: PresentContentProps<PickerOptionCountContentValue>) {
  return (
    <Show
      when={value.portrait}
      fallback={() => (
        <Badge
          density={uiDensityModes.mini}
          data-picker-option-count={value.count}
          className={cx(
            "h-auto min-h-5 w-fit max-w-full whitespace-normal break-words py-1 leading-snug",
            value.commandDeck && "rounded-none border-(--ui-command-border) font-mono",
          )}
        >
          {value.label ?? value.count}
        </Badge>
      )}
    >
      {() => (
        <span
          data-ui-badge
          aria-hidden="true"
          data-picker-option-count={value.count}
          className="pointer-events-none absolute -end-2 -top-2 z-20 inline-flex h-6 min-h-6 min-w-6 items-center justify-center rounded-full border border-(--ui-destructive) bg-(--ui-destructive) px-1.5 font-bold text-xs text-(--ui-accent-text) tabular-nums"
        >
          {value.count}
        </span>
      )}
    </Show>
  );
}

type PickerOptionMarkerProps = Readonly<{
  commandDeck: boolean;
  controllerFocused: boolean;
  portrait: boolean;
  selected: boolean;
}>;

function PickerOptionMarker(props: PickerOptionMarkerProps) {
  return (
    <span
      aria-hidden="true"
      data-picker-option-marker={
        props.portrait ? (props.selected ? "selected" : "controller-focused") : undefined
      }
      className={cx(
        "grid min-h-5 min-w-5 place-items-center",
        props.commandDeck &&
          !props.portrait &&
          "self-start border border-(--ui-command-border) font-mono text-xs",
        props.portrait &&
          "pointer-events-none absolute start-2 top-2 z-10 h-6 w-6 rounded-full border font-mono text-xs",
        props.portrait &&
          (props.selected
            ? "border-(--ui-accent) bg-(--ui-accent) text-(--ui-accent-text)"
            : "border-(--ui-command-border) bg-(--ui-window) text-(--ui-text)"),
      )}
    >
      <Show
        when={props.selected}
        fallback={() => <Show when={props.controllerFocused}>{() => "◎"}</Show>}
      >
        {() => <CheckIcon size="small" />}
      </Show>
    </span>
  );
}

type PortraitPickerOptionContentProps = Readonly<{
  option: PickerOption;
}>;

function PortraitPickerOptionContent(props: PortraitPickerOptionContentProps) {
  return (
    <span
      data-picker-option-layout="portrait"
      className="grid w-full min-w-0 justify-items-center gap-2 text-center"
    >
      <span className="relative grid h-16 w-16 place-items-center" data-picker-option-portrait>
        <Show
          when={Boolean(props.option.imageSrc)}
          fallback={() => (
            <span
              aria-hidden="true"
              data-picker-missing-asset
              className="grid h-16 w-16 place-items-center border border-dashed border-(--ui-command-border) bg-(--ui-window) font-mono text-(--ui-muted-text)"
            >
              —
            </span>
          )}
        >
          {() => (
            <img
              src={props.option.imageSrc}
              alt={props.option.imageAlt ?? ""}
              className="h-16 w-16 border border-(--ui-command-border) bg-(--ui-window) object-cover"
            />
          )}
        </Show>
        <Present
          value={
            props.option.count === undefined
              ? undefined
              : {
                  commandDeck: true,
                  count: props.option.count,
                  label: props.option.countLabel,
                  portrait: true,
                }
          }
        >
          {PickerOptionCountContent}
        </Present>
      </span>
      <span
        data-picker-option-label
        className="w-full min-w-0 whitespace-normal break-words font-(--ui-font-display) font-semibold text-base leading-snug tracking-[0.04em] uppercase"
      >
        {props.option.shortLabel ?? props.option.label}
      </span>
      <Show when={Boolean(props.option.description)}>
        {() => (
          <span className="w-full min-w-0 break-words text-xs leading-snug text-(--ui-muted-text)">
            {props.option.description}
          </span>
        )}
      </Show>
      <Show when={Boolean(props.option.disabledReason)}>
        {() => (
          <span className="w-full min-w-0 break-words text-xs leading-snug text-(--ui-muted-text)">
            {props.option.disabledReason}
          </span>
        )}
      </Show>
    </span>
  );
}

export function PickerGrid(props: PickerGridProps) {
  const { controllerFocusVisible } = useUiRootContext();
  const optionsById = new Map(props.options.map((option) => [option.id, option]));
  const presentation = props.presentation ?? pickerPresentationModes.standard;
  const commandDeck = presentation === pickerPresentationModes.commandDeck;
  const orientation: PickerGridOrientation =
    props.portraitLayout && commandDeck
      ? pickerGridOrientations.portrait
      : pickerGridOrientations.horizontal;
  const portrait = orientation === pickerGridOrientations.portrait;
  const placement: PickerGridPlacement = portrait
    ? (props.placement ?? pickerGridPlacements.fill)
    : pickerGridPlacements.authored;
  const compactPortrait = placement === pickerGridPlacements.compact;
  const wide = props.responsiveMode === uiResponsiveModes.desktop;
  let columns = 1;
  let rows = 1;

  if (wide && placement === pickerGridPlacements.authored) {
    for (const slot of props.slots) {
      columns = Math.max(columns, slot.column);
      rows = Math.max(rows, slot.row);
    }
  }

  const gridStyle: CSSProperties =
    placement === pickerGridPlacements.compact
      ? portraitCompactGridStyle
      : placement === pickerGridPlacements.fill
        ? portraitFillGridStyle
        : wide
          ? {
              gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`,
              gridTemplateRows: `repeat(${rows},minmax(4.5rem,auto))`,
            }
          : compactGridStyle;

  return (
    <fieldset
      data-ui-picker-grid
      aria-busy={props.busy || undefined}
      data-picker-placement={placement}
      data-picker-layout={props.layoutId}
      data-picker-orientation={orientation}
      data-picker-presentation={presentation}
      className={cx("grid min-w-0 border-0 p-0", commandDeck ? "gap-4" : "gap-2")}
    >
      <legend
        className={cx(
          "break-words font-semibold text-(--ui-text)",
          commandDeck ? "font-(--ui-font-display) text-lg uppercase tracking-[0.08em]" : "text-sm",
        )}
      >
        {props.label}
      </legend>
      <div
        style={gridStyle}
        className={cx(
          "grid min-w-0",
          placement === pickerGridPlacements.compact
            ? "w-full justify-center gap-4"
            : placement === pickerGridPlacements.fill
              ? "w-full max-w-[96rem] justify-self-center gap-4"
              : commandDeck
                ? "gap-px"
                : "gap-2",
        )}
      >
        {props.slots.map((slot, index) => {
          const option = slot.optionId ? optionsById.get(slot.optionId) : undefined;
          const placeholder = slot.status === pickerSlotStatuses.placeholder || !option;
          const style: CSSProperties =
            placement !== pickerGridPlacements.authored || !wide
              ? { order: slot.responsiveOrder ?? index + 1 }
              : { gridColumn: slot.column, gridRow: slot.row };
          const slotDomId = `picker-${encodeURIComponent(props.layoutId)}--${encodeURIComponent(slot.slotId)}`;

          if (placeholder) {
            return (
              <div
                style={style}
                id={slotDomId}
                key={slot.slotId}
                aria-hidden="true"
                data-picker-slot={slot.slotId}
                data-picker-slot-status={pickerSlotStatuses.placeholder}
                className={cx(
                  "min-h-16 border border-dashed border-(--ui-separator) bg-(--ui-placeholder) opacity-45",
                  portrait
                    ? cx(compactPortrait ? "min-h-44" : "min-h-36", "rounded-none")
                    : commandDeck
                      ? "min-h-28 rounded-none"
                      : "rounded-(--ui-radius-control)",
                )}
              />
            );
          }

          const unavailable =
            slot.status === pickerSlotStatuses.disabledUnavailable || Boolean(props.disabled);
          const selected = option.id === props.selectedOptionId;
          const focused = slot.slotId === props.focusedSlotId;
          const controllerFocused = controllerFocusVisible && focused;

          return (
            <SelectableItem
              style={style}
              id={slotDomId}
              busy={props.busy}
              key={slot.slotId}
              selected={selected}
              value={slot.slotId}
              disabled={unavailable}
              controllerFocused={controllerFocused}
              tabIndex={props.focusedSlotId ? (focused ? 0 : -1) : undefined}
              tone={selected && commandDeck ? uiToneModes.accent : uiToneModes.neutral}
              onRequestFocus={() =>
                props.onRequestAction?.({ optionId: option.id, slotId: slot.slotId, type: "focus" })
              }
              accessibleLabel={[option.label, option.countLabel, option.disabledReason]
                .filter(Boolean)
                .join(": ")}
              onRequestPress={() =>
                props.onRequestAction?.({
                  optionId: option.id,
                  slotId: slot.slotId,
                  type: "select",
                })
              }
              className={cx(
                portrait
                  ? cx(
                      "relative grid-cols-1 content-start items-start justify-items-stretch rounded-none border-(--ui-command-border) bg-(--ui-command-surface) p-3 text-center shadow-none",
                      compactPortrait ? "min-h-44" : "min-h-36",
                    )
                  : cx(
                      "grid-cols-[1fr_auto] content-center",
                      commandDeck
                        ? "min-h-28 rounded-none border-(--ui-command-border) bg-(--ui-command-surface) p-3 shadow-none"
                        : "min-h-16 p-2",
                    ),
              )}
            >
              <Show
                when={!portrait}
                fallback={() => (
                  <>
                    <PortraitPickerOptionContent option={option} />
                    <Show when={selected || controllerFocused}>
                      {() => (
                        <PickerOptionMarker
                          portrait
                          commandDeck
                          selected={selected}
                          controllerFocused={controllerFocused}
                        />
                      )}
                    </Show>
                  </>
                )}
              >
                {() => (
                  <>
                    <span
                      className={cx(
                        "grid min-w-0 gap-1 text-start",
                        commandDeck && "grid-cols-[3.5rem_minmax(0,1fr)] items-center",
                      )}
                    >
                      <Show when={Boolean(option.imageSrc)}>
                        {() => (
                          <img
                            src={option.imageSrc}
                            alt={option.imageAlt ?? ""}
                            className={cx(
                              "object-cover",
                              commandDeck
                                ? "h-14 w-14 rounded-none border border-(--ui-command-border) bg-(--ui-window)"
                                : "h-9 w-9 rounded-(--ui-radius-control)",
                            )}
                          />
                        )}
                      </Show>
                      <Show when={commandDeck && !option.imageSrc}>
                        {() => (
                          <span
                            aria-hidden="true"
                            data-picker-missing-asset
                            className="grid h-14 w-14 place-items-center border border-dashed border-(--ui-command-border) bg-(--ui-window) font-mono text-(--ui-muted-text)"
                          >
                            —
                          </span>
                        )}
                      </Show>
                      <span className="grid min-w-0 gap-1">
                        <span
                          className={cx(
                            "break-words font-semibold leading-snug",
                            commandDeck &&
                              "font-(--ui-font-display) text-base uppercase tracking-[0.04em]",
                          )}
                        >
                          {option.shortLabel ?? option.label}
                        </span>
                        <Show when={Boolean(option.description)}>
                          {() => (
                            <span className="break-words text-xs leading-snug text-(--ui-muted-text)">
                              {option.description}
                            </span>
                          )}
                        </Show>
                        <Present
                          value={
                            option.count === undefined
                              ? undefined
                              : {
                                  commandDeck,
                                  count: option.count,
                                  label: option.countLabel,
                                  portrait: false,
                                }
                          }
                        >
                          {PickerOptionCountContent}
                        </Present>
                        <Show when={Boolean(option.disabledReason)}>
                          {() => (
                            <span className="break-words text-xs leading-snug text-(--ui-muted-text)">
                              {option.disabledReason}
                            </span>
                          )}
                        </Show>
                      </span>
                    </span>
                    <PickerOptionMarker
                      portrait={false}
                      selected={selected}
                      commandDeck={commandDeck}
                      controllerFocused={controllerFocused}
                    />
                  </>
                )}
              </Show>
            </SelectableItem>
          );
        })}
      </div>
      <Show when={Boolean(props.busy)}>
        {() => <LoadingIndicator label={props.message ?? "Loading options"} />}
      </Show>
      <Show when={!props.busy && Boolean(props.message)}>
        {() => <StatusMessage>{props.message}</StatusMessage>}
      </Show>
    </fieldset>
  );
}

PickerGrid.displayName = "PickerGrid";
