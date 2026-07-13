import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";
import { NotationIcon } from "../notation/renderer";
import { mapNotationSequence } from "../notation/runtime";
import type { UiNotationTokenState } from "../notation/type";
import { uiNotationTokenStates } from "../notation/value";
import { cx } from "../recipes/class-name";
import type { ComponentActionIntent } from "./type";

export const notationRendererActions = {} as const;

export type NotationRendererAction =
  (typeof notationRendererActions)[keyof typeof notationRendererActions];

export type NotationRendererIntent = ComponentActionIntent<NotationRendererAction>;

export const notationRendererDensities = {
  compact: "compact",
  detail: "detail",
  list: "list",
  whiteboard: "whiteboard",
} as const;

export type NotationRendererDensity =
  (typeof notationRendererDensities)[keyof typeof notationRendererDensities];

export const notationRendererWrappingModes = {
  inline: "inline",
  multiline: "multiline",
} as const;

export type NotationRendererWrappingMode =
  (typeof notationRendererWrappingModes)[keyof typeof notationRendererWrappingModes];

export type NotationRendererProps = {
  accessibleLabel?: string;
  density?: NotationRendererDensity;
  fallbackLabel?: string;
  notation: readonly (readonly string[])[];
  notationDisplayMode: NotationDisplayMode;
  tokenState?: UiNotationTokenState;
  wrappingMode?: NotationRendererWrappingMode;
};

const densityClasses = {
  compact: "gap-1",
  detail: "gap-2",
  list: "gap-1.5",
  whiteboard: "gap-2",
} as const satisfies Record<NotationRendererDensity, string>;

export function NotationRenderer(props: NotationRendererProps) {
  const density = props.density ?? notationRendererDensities.compact;
  const wrappingMode = props.wrappingMode ?? notationRendererWrappingModes.multiline;
  const mapped = mapNotationSequence(props.notation, props.notationDisplayMode, props.tokenState);
  const accessibleSummary = mapped
    .map((step) => step.map((token) => token.accessibleLabel).join(" + "))
    .join(", ");
  const stepKeyCounts = new Map<string, number>();
  const keyedSteps = mapped.map((step, stepIndex) => {
    const signature = step.map((token) => token.token).join("+") || "empty-step";
    const occurrence = stepKeyCounts.get(signature) ?? 0;
    stepKeyCounts.set(signature, occurrence + 1);
    const tokenKeyCounts = new Map<string, number>();

    return {
      descriptors: step.map((descriptor) => {
        const tokenOccurrence = tokenKeyCounts.get(descriptor.token) ?? 0;
        tokenKeyCounts.set(descriptor.token, tokenOccurrence + 1);
        return { descriptor, key: `${descriptor.token}-${tokenOccurrence}` };
      }),
      key: `${signature}-${occurrence}`,
      stepIndex,
    };
  });

  if (mapped.length === 0) {
    return (
      <span
        aria-label={props.accessibleLabel ?? props.fallbackLabel ?? "Notation unavailable"}
        className="text-sm text-[var(--ui-muted-text)]"
        data-ui-component="UI-CMP-015"
        data-ui-notation-empty
        role="img"
      >
        {props.fallbackLabel ?? "Notation unavailable"}
      </span>
    );
  }

  return (
    <span
      aria-label={props.accessibleLabel ?? accessibleSummary}
      className={cx(
        "inline-flex min-w-0 items-center",
        densityClasses[density],
        wrappingMode === notationRendererWrappingModes.multiline ? "flex-wrap" : "flex-nowrap",
      )}
      data-token-state={props.tokenState}
      data-ui-component="UI-CMP-015"
      data-ui-notation-density={density}
      role="img"
    >
      {keyedSteps.map((step) => (
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-1"
          data-ui-notation-step={step.stepIndex}
          key={step.key}
        >
          {step.descriptors.map(({ descriptor, key }) => (
            <NotationIcon
              descriptor={descriptor}
              key={key}
              tone={descriptor.state === uiNotationTokenStates.invalid ? "accent" : "neutral"}
            />
          ))}
          {step.stepIndex < mapped.length - 1 && (
            <span className="text-[var(--ui-muted-text)]" data-ui-notation-separator>
              ›
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

NotationRenderer.displayName = "NotationRenderer";
