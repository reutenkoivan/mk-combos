import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";
import { NotationIcon } from "../notation/renderer";
import { mapNotationSequence } from "../notation/runtime";
import type { UiNotationTokenState } from "../notation/type";
import { uiNotationTokenStates } from "../notation/value";
import { Show } from "../primitives/conditional";
import { cx } from "../recipes/class-name";
import type { ComboPresentationRouteStep, ComponentActionIntent } from "./type";

export const notationRendererActions = {} as const;

export type NotationRendererAction =
  (typeof notationRendererActions)[keyof typeof notationRendererActions];

export type NotationRendererIntent = ComponentActionIntent<NotationRendererAction>;

export const notationRendererDensities = {
  command: "command",
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
  routeSteps?: readonly ComboPresentationRouteStep[];
  tokenState?: UiNotationTokenState;
  wrappingMode?: NotationRendererWrappingMode;
};

const densityClasses = {
  command: "gap-1 font-mono",
  compact: "gap-1",
  detail: "gap-2",
  list: "gap-1.5",
  whiteboard: "gap-2",
} as const satisfies Record<NotationRendererDensity, string>;

const commandRouteStepClasses = [
  "text-(--ui-muted-text)",
  "data-[ui-notation-kind=starter]:text-(--ui-command-cool)",
  "data-[ui-notation-kind=string]:text-(--ui-command-cool)",
  "data-[ui-notation-kind=launcher]:text-(--ui-command-cool)",
  "data-[ui-notation-kind=link]:text-(--ui-command-link)",
  "data-[ui-notation-kind=cancel]:text-(--ui-command-link)",
  "data-[ui-notation-kind=finish]:text-(--ui-command-accent)",
  "data-[ui-notation-kind=meter]:text-(--ui-command-accent)",
  "data-[ui-notation-kind=cashout]:text-(--ui-command-accent)",
] as const;

export function NotationRenderer(props: NotationRendererProps) {
  const density = props.density ?? notationRendererDensities.compact;
  const commandDensity = density === notationRendererDensities.command;
  const wrappingMode = props.wrappingMode ?? notationRendererWrappingModes.multiline;
  const sourceNotation = props.routeSteps?.map((step) => step.notation) ?? props.notation;
  const mapped = mapNotationSequence(sourceNotation, props.notationDisplayMode, props.tokenState);
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
      routeStep: props.routeSteps?.[stepIndex],
      stepIndex,
    };
  });

  return (
    <Show
      when={mapped.length > 0}
      fallback={() => (
        <span
          role="img"
          data-ui-notation-empty
          data-ui-component="UI-CMP-015"
          className="text-sm text-(--ui-muted-text)"
          aria-label={props.accessibleLabel ?? props.fallbackLabel ?? "Notation unavailable"}
        >
          {props.fallbackLabel ?? "Notation unavailable"}
        </span>
      )}
    >
      {() => (
        <span
          role="img"
          data-ui-component="UI-CMP-015"
          data-ui-notation-density={density}
          data-token-state={props.tokenState}
          aria-label={props.accessibleLabel ?? accessibleSummary}
          className={cx(
            "inline-flex min-w-0 items-center",
            densityClasses[density],
            wrappingMode === notationRendererWrappingModes.multiline ? "flex-wrap" : "flex-nowrap",
          )}
        >
          {keyedSteps.map((step) => (
            <Show
              key={step.key}
              when={commandDensity}
              fallback={() => (
                <span
                  aria-hidden="true"
                  data-ui-notation-step={step.stepIndex}
                  className="inline-flex items-center gap-1"
                  data-ui-notation-kind={step.routeStep?.kind}
                  data-ui-notation-emphasis={step.routeStep?.emphasis}
                  data-ui-notation-repetition={step.routeStep?.repetitionCount}
                >
                  {step.descriptors.map(({ descriptor, key }) => (
                    <NotationIcon
                      key={key}
                      descriptor={descriptor}
                      tone={
                        descriptor.state === uiNotationTokenStates.invalid ? "accent" : "neutral"
                      }
                    />
                  ))}
                  <Show when={(step.routeStep?.repetitionCount ?? 1) > 1}>
                    {() => (
                      <span
                        data-ui-notation-repeat
                        className="font-mono text-xs text-(--ui-muted-text)"
                      >
                        ×{step.routeStep?.repetitionCount}
                      </span>
                    )}
                  </Show>
                  <Show when={step.stepIndex < mapped.length - 1}>
                    {() => (
                      <span data-ui-notation-separator className="text-(--ui-muted-text)">
                        ›
                      </span>
                    )}
                  </Show>
                </span>
              )}
            >
              {() => (
                <span
                  aria-hidden="true"
                  data-ui-notation-step={step.stepIndex}
                  data-ui-notation-kind={step.routeStep?.kind}
                  data-ui-notation-emphasis={step.routeStep?.emphasis}
                  data-ui-notation-repetition={step.routeStep?.repetitionCount}
                  className={cx("inline-flex shrink-0 items-end gap-1.5", commandRouteStepClasses)}
                >
                  <Show when={step.stepIndex > 0}>
                    {() => (
                      <span
                        data-ui-notation-separator
                        className="pb-1.5 text-xs text-(--ui-muted-text)"
                      >
                        ›
                      </span>
                    )}
                  </Show>
                  <span className="grid shrink-0 gap-0.5">
                    <Show when={Boolean(step.routeStep)}>
                      {() => (
                        <span
                          data-ui-notation-step-badge
                          data-ui-notation-emphasis={step.routeStep?.emphasis}
                          className="w-max max-w-full border-s-2 border-current ps-1 font-(--ui-font-display) text-[8px] font-semibold uppercase leading-none tracking-[0.08em] data-[ui-notation-emphasis=strong]:border data-[ui-notation-emphasis=strong]:bg-[color-mix(in_srgb,var(--ui-command-accent-fill)_22%,var(--ui-command-surface))] data-[ui-notation-emphasis=strong]:px-1 data-[ui-notation-emphasis=strong]:py-0.5"
                        >
                          {step.routeStep?.kind}
                          <Show when={(step.routeStep?.repetitionCount ?? 1) > 1}>
                            {() => ` ×${step.routeStep?.repetitionCount}`}
                          </Show>
                        </span>
                      )}
                    </Show>
                    <span
                      data-ui-notation-keycap
                      data-ui-notation-emphasis={step.routeStep?.emphasis}
                      className="inline-flex min-h-8 min-w-9 shrink-0 items-center gap-0.5 whitespace-nowrap px-1.5 py-0.5"
                    >
                      {step.descriptors.map(({ descriptor, key }) => (
                        <NotationIcon
                          key={key}
                          descriptor={descriptor}
                          commandAccent={step.routeStep?.emphasis === "strong"}
                          tone={
                            descriptor.state === uiNotationTokenStates.invalid
                              ? "accent"
                              : "neutral"
                          }
                        />
                      ))}
                      <Show when={(step.routeStep?.repetitionCount ?? 1) > 1}>
                        {() => (
                          <span
                            data-ui-notation-repeat
                            className="font-mono text-xs text-(--ui-muted-text)"
                          >
                            ×{step.routeStep?.repetitionCount}
                          </span>
                        )}
                      </Show>
                    </span>
                  </span>
                </span>
              )}
            </Show>
          ))}
        </span>
      )}
    </Show>
  );
}

NotationRenderer.displayName = "NotationRenderer";
