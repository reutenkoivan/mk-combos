import { Button } from "../primitives/button";
import { Present, type PresentContentProps, Show } from "../primitives/conditional";
import { Badge } from "../primitives/state";
import { cx } from "../recipes/class-name";
import { uiToneModes } from "../tokens/value";
import { CharacterPicker, type CharacterPickerProps } from "./character-picker";
import { KameoPicker, type KameoPickerProps } from "./kameo-picker";
import type { ComponentActionIntent, UiResponsiveMode } from "./type";
import { componentInteractionReasons, pickerPresentationModes } from "./value";
import { VariationPicker, type VariationPickerProps } from "./variation-picker";

export const comboListConfigModuleActions = {
  changeCharacter: "changeCharacter",
} as const;

export type ComboListConfigModuleAction =
  (typeof comboListConfigModuleActions)[keyof typeof comboListConfigModuleActions];

export type ComboListConfigModuleIntent = ComponentActionIntent<ComboListConfigModuleAction> & {
  expanded?: boolean;
};

export const comboListConfigPickerKinds = {
  kameo: "kameo",
  variation: "variation",
} as const;

export type ComboListConfigPickerKind =
  (typeof comboListConfigPickerKinds)[keyof typeof comboListConfigPickerKinds];

export type ComboListConfigGameContextPicker =
  | {
      kind: typeof comboListConfigPickerKinds.kameo;
      props: Omit<KameoPickerProps, "responsiveMode">;
    }
  | {
      kind: typeof comboListConfigPickerKinds.variation;
      props: Omit<VariationPickerProps, "responsiveMode">;
    };

export const comboListConfigSelectionSteps = {
  character: "character",
  specification: "specification",
} as const;

export type ComboListConfigSelectionStep =
  (typeof comboListConfigSelectionSteps)[keyof typeof comboListConfigSelectionSteps];

export type ComboListConfigSelectorHeader = {
  announcement?: string;
  description?: string;
  gameLabel?: string;
  headingId?: string;
  instruction?: string;
  optionCountLabel?: string;
  stepLabel: string;
  title: string;
};

export type ComboListConfigLockedCharacter = {
  changeLabel?: string;
  gameLabel?: string;
  id: string;
  imageAlt?: string;
  imageSrc?: string;
  label: string;
  progressLabel: string;
};

type ComboListConfigCommandHint = {
  commandId: string;
  disabled?: boolean;
  inputLabel: string;
  label: string;
};

type ComboListConfigSelectionBase = {
  commands?: readonly ComboListConfigCommandHint[];
  header: ComboListConfigSelectorHeader;
};

export type ComboListConfigContextSelection =
  | (ComboListConfigSelectionBase & {
      characterPicker: Omit<CharacterPickerProps, "responsiveMode">;
      gameContextPicker?: never;
      lockedCharacter?: never;
      step: typeof comboListConfigSelectionSteps.character;
    })
  | (ComboListConfigSelectionBase & {
      characterPicker?: never;
      gameContextPicker: ComboListConfigGameContextPicker;
      lockedCharacter: ComboListConfigLockedCharacter;
      step: typeof comboListConfigSelectionSteps.specification;
    });

type ComboListConfigModuleBaseProps = {
  onRequestAction?: (intent: ComboListConfigModuleIntent) => void;
  responsiveMode: UiResponsiveMode;
  sourceFocusTarget?: string;
};

export type ComboListConfigModuleProps = ComboListConfigModuleBaseProps & {
  contextSelection: ComboListConfigContextSelection;
};

function renderGameContextPicker(
  picker: ComboListConfigGameContextPicker,
  responsiveMode: UiResponsiveMode,
  presentation?: KameoPickerProps["presentation"],
) {
  switch (picker.kind) {
    case comboListConfigPickerKinds.kameo:
      return (
        <KameoPicker
          {...picker.props}
          responsiveMode={responsiveMode}
          presentation={presentation ?? picker.props.presentation}
        />
      );
    case comboListConfigPickerKinds.variation:
      return (
        <VariationPicker
          {...picker.props}
          responsiveMode={responsiveMode}
          presentation={presentation ?? picker.props.presentation}
        />
      );
  }

  const unhandledPicker: never = picker;
  return unhandledPicker;
}

function SelectorPicker(props: {
  responsiveMode: UiResponsiveMode;
  selection: ComboListConfigContextSelection;
}) {
  switch (props.selection.step) {
    case comboListConfigSelectionSteps.character:
      return (
        <CharacterPicker
          {...props.selection.characterPicker}
          responsiveMode={props.responsiveMode}
          presentation={pickerPresentationModes.commandDeck}
        />
      );
    case comboListConfigSelectionSteps.specification:
      return renderGameContextPicker(
        props.selection.gameContextPicker,
        props.responsiveMode,
        pickerPresentationModes.commandDeck,
      );
  }

  const unhandledSelection: never = props.selection;
  return unhandledSelection;
}

function SelectorHeader(props: {
  header: ComboListConfigSelectorHeader;
  step: ComboListConfigSelectionStep;
}) {
  const headingId = props.header.headingId ?? `catalog-selector-${props.step}-heading`;
  const characterStep = props.step === comboListConfigSelectionSteps.character;

  return (
    <header
      data-command-deck-header
      className={cx(
        "grid min-w-0 border-b border-(--ui-command-border) bg-(--ui-command-chrome) text-(--ui-command-chrome-text) sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
        characterStep ? "gap-2 p-3" : "gap-4 p-4 sm:p-6",
      )}
    >
      <div className={cx("grid min-w-0", characterStep ? "gap-1" : "gap-2")}>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-(--ui-command-accent)">
          {props.header.stepLabel}
        </p>
        <h2
          tabIndex={-1}
          id={headingId}
          className={cx(
            "break-words font-(--ui-font-display) font-semibold uppercase leading-none tracking-[-0.02em]",
            characterStep ? "text-3xl" : "text-3xl sm:text-4xl",
          )}
        >
          {props.header.title}
        </h2>
        <Show when={Boolean(props.header.description)}>
          {() => (
            <p
              className={cx(
                "max-w-3xl break-words text-sm text-(--ui-command-muted-text)",
                characterStep ? "leading-5" : "leading-6",
              )}
            >
              {props.header.description}
            </p>
          )}
        </Show>
      </div>
      <dl className="grid min-w-0 gap-2 border-s border-(--ui-command-border) ps-3 text-xs">
        <Show when={Boolean(props.header.gameLabel)}>
          {() => <CommandTelemetry label={props.header.gameLabel ?? ""} />}
        </Show>
        <Show when={Boolean(props.header.optionCountLabel)}>
          {() => <CommandTelemetry label={props.header.optionCountLabel ?? ""} />}
        </Show>
        <Show when={Boolean(props.header.instruction)}>
          {() => <CommandTelemetry label={props.header.instruction ?? ""} />}
        </Show>
      </dl>
      <Show when={Boolean(props.header.announcement)}>
        {() => (
          <p aria-live="polite" className="sr-only">
            {props.header.announcement}
          </p>
        )}
      </Show>
    </header>
  );
}

function CommandTelemetry(props: { label: string }) {
  return (
    <div className="min-w-0 border-b border-(--ui-command-border) pb-1 last:border-b-0">
      <dd className="break-words font-mono uppercase tracking-[0.08em]">{props.label}</dd>
    </div>
  );
}

function LockedCharacterStrip(props: {
  character: ComboListConfigLockedCharacter;
  onChange?: () => void;
}) {
  const hasChangeAction = Boolean(props.character.changeLabel);

  return (
    <section
      aria-label={props.character.label}
      data-command-deck-locked-character={props.character.id}
      className={cx(
        "grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-(--ui-command-border) bg-(--ui-command-locked) p-3 sm:p-4",
        hasChangeAction && "sm:grid-cols-[auto_minmax(0,1fr)_auto]",
      )}
    >
      <Show
        when={Boolean(props.character.imageSrc)}
        fallback={() => (
          <span
            aria-hidden="true"
            className="grid h-14 w-14 place-items-center border border-dashed border-(--ui-command-border) font-mono text-lg"
          >
            —
          </span>
        )}
      >
        {() => (
          <img
            src={props.character.imageSrc}
            alt={props.character.imageAlt ?? ""}
            className="h-14 w-14 rounded-none border border-(--ui-command-border) bg-(--ui-window) object-cover"
          />
        )}
      </Show>
      <div className="grid min-w-0 gap-1">
        <p className="break-words font-(--ui-font-display) text-xl font-semibold uppercase leading-none">
          {props.character.label}
        </p>
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-(--ui-muted-text)">
          <Show when={Boolean(props.character.gameLabel)}>
            {() => (
              <span className="break-words font-mono uppercase">{props.character.gameLabel}</span>
            )}
          </Show>
          <Badge className="rounded-none font-mono">{props.character.progressLabel}</Badge>
        </div>
      </div>
      <Show when={hasChangeAction}>
        {() => (
          <Button
            onRequestPress={props.onChange}
            className="col-span-2 h-auto min-h-11 rounded-none whitespace-normal sm:col-span-1"
          >
            {props.character.changeLabel}
          </Button>
        )}
      </Show>
    </section>
  );
}

type LockedCharacterRegionValue = Readonly<{
  character: ComboListConfigLockedCharacter;
  onRequestAction: ComboListConfigModuleBaseProps["onRequestAction"];
  sourceFocusTarget: string | undefined;
  sourceSurface: string;
}>;

function LockedCharacterRegionContent({ value }: PresentContentProps<LockedCharacterRegionValue>) {
  return (
    <LockedCharacterStrip
      character={value.character}
      onChange={() =>
        value.onRequestAction?.({
          action: comboListConfigModuleActions.changeCharacter,
          reason: componentInteractionReasons.press,
          sourceFocusTarget: value.sourceFocusTarget,
          sourceSurface: value.sourceSurface,
        })
      }
    />
  );
}

function CommandRibbon(props: { commands: readonly ComboListConfigCommandHint[] }) {
  if (props.commands.length === 0) {
    return null;
  }

  return (
    <footer
      data-command-deck-ribbon
      className="sticky bottom-0 z-20 border-t border-(--ui-command-border) bg-(--ui-command-chrome) p-2 text-(--ui-command-chrome-text)"
    >
      <ul className="flex min-w-0 list-none flex-wrap items-center gap-x-4 gap-y-2 p-0">
        {props.commands.map((command) => (
          <li
            key={command.commandId}
            className={cx(
              "inline-flex min-w-0 items-center gap-2 text-xs",
              command.disabled && "opacity-50",
            )}
          >
            <Badge className="rounded-none font-mono" tone={uiToneModes.accent}>
              {command.inputLabel}
            </Badge>
            <span className="break-words text-(--ui-command-muted-text)">{command.label}</span>
          </li>
        ))}
      </ul>
    </footer>
  );
}

function SelectorSurface(props: ComboListConfigModuleProps) {
  const selection = props.contextSelection;
  const characterStep = selection.step === comboListConfigSelectionSteps.character;
  const sourceSurface =
    selection.step === comboListConfigSelectionSteps.character
      ? selection.characterPicker.sourceSurface
      : selection.gameContextPicker.props.sourceSurface;
  const lockedCharacterRegionValue =
    selection.step === comboListConfigSelectionSteps.specification
      ? {
          character: selection.lockedCharacter,
          onRequestAction: props.onRequestAction,
          sourceFocusTarget: props.sourceFocusTarget,
          sourceSurface,
        }
      : undefined;

  return (
    <section
      data-command-deck-selector
      data-ui-component="UI-CMP-012"
      data-command-deck-step={selection.step}
      aria-labelledby={selection.header.headingId ?? `catalog-selector-${selection.step}-heading`}
      className="grid min-h-[calc(100dvh-6rem)] min-w-0 grid-rows-[auto_auto_1fr_auto] overflow-clip border border-(--ui-command-border) bg-(--ui-command-surface)"
    >
      <SelectorHeader header={selection.header} step={selection.step} />
      <Present fallback={<span aria-hidden="true" />} value={lockedCharacterRegionValue}>
        {LockedCharacterRegionContent}
      </Present>
      <div
        data-command-deck-picker-region
        className={cx(
          "min-w-0 motion-safe:animate-[ui-command-step-enter_180ms_ease-out]",
          characterStep ? "p-2 min-[40rem]:p-3" : "p-3 sm:p-5 lg:p-6",
        )}
      >
        <SelectorPicker responsiveMode={props.responsiveMode} selection={selection} />
      </div>
      <CommandRibbon commands={selection.commands ?? []} />
    </section>
  );
}

export function ComboListConfigModule(props: ComboListConfigModuleProps) {
  return <SelectorSurface {...props} />;
}

ComboListConfigModule.displayName = "ComboListConfigModule";
