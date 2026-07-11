import type { Meta, StoryObj } from "@storybook/react-vite";

import { AlertTriangleIcon } from "../icons/alert-triangle";
import { CheckIcon } from "../icons/check";
import { ChevronDownIcon } from "../icons/chevron-down";
import { CircleHelpIcon } from "../icons/circle-help";
import { DownloadIcon } from "../icons/download";
import { Gamepad2Icon } from "../icons/gamepad-2";
import { MenuIcon } from "../icons/menu";
import { PlusIcon } from "../icons/plus";
import { SearchIcon } from "../icons/search";
import { SettingsIcon } from "../icons/settings";
import { Trash2Icon } from "../icons/trash-2";
import { XIcon } from "../icons/x";
import { NotationIcon } from "../notation/renderer";
import { createNotationLegendRows, mapNotationStep } from "../notation/runtime";
import type { UiNotationIconKind } from "../notation/type";
import { notationDisplayModes, uiNotationTokenKinds, uiNotationTokens } from "../notation/value";
import { cx } from "../recipes/class-name";
import { controlRecipe } from "../recipes/control";
import { fieldRecipe } from "../recipes/field";
import { indicatorRecipe } from "../recipes/indicator";
import { itemRecipe } from "../recipes/item";
import { separatorRecipe } from "../recipes/separator";
import { surfaceRecipe } from "../recipes/surface";
import { uiSemanticTokens } from "../tokens/value";

const meta = {
  component: FoundationStorySurface,
  parameters: {
    chromatic: {
      disableSnapshot: false,
    },
  },
  tags: ["autodocs"],
  title: "Foundation/Design System",
} satisfies Meta<typeof FoundationStorySurface>;

export default meta;

type Story = StoryObj<typeof meta>;

const iconExamples = [
  CheckIcon,
  XIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  PlusIcon,
  Trash2Icon,
  DownloadIcon,
  AlertTriangleIcon,
  CircleHelpIcon,
  Gamepad2Icon,
  ChevronDownIcon,
] as const;

const notationRegistryKindLabels = {
  attack: "Attack",
  control: "Controller controls",
  direction: "Directions",
  displayMode: "Display modes",
  frameWindow: "Frame windows",
  modifier: "Modifiers",
  separator: "Separators",
  state: "States",
} as const satisfies Record<UiNotationIconKind, string>;

const notationRegistryKindOrder = [
  "attack",
  "modifier",
  "direction",
  "control",
  "separator",
  "frameWindow",
  "state",
] as const satisfies readonly UiNotationIconKind[];

const notationRegistryTokenGroups = notationRegistryKindOrder
  .map((kind) => ({
    kind,
    label: notationRegistryKindLabels[kind],
    tokens: uiNotationTokens.filter((token) => uiNotationTokenKinds[token] === kind),
  }))
  .filter((group) => group.tokens.length > 0);

const unknownNotationTokens = ["UNKNOWN"] as const;

function FoundationStorySurface() {
  return null;
}

const StoryFrame = (props: {
  contrast?: "standard" | "increased";
  mode?: "light" | "dark";
  children: React.ReactNode;
}) => {
  const { children, contrast = "standard", mode = "light" } = props;

  return (
    <div
      className="mk-combos-ui-root grid min-h-screen justify-items-center p-6"
      data-ui-contrast={contrast}
      data-ui-theme={mode}
    >
      <main className="grid w-full max-w-5xl gap-4">{children}</main>
    </div>
  );
};

const Section = (props: { children: React.ReactNode; title: string }) => (
  <section
    className={cx(
      surfaceRecipe({ density: "medium", material: "separated", shape: "fixed" }),
      "flex flex-col gap-3",
    )}
  >
    <h2 className="text-sm font-semibold text-[var(--ui-text)]">{props.title}</h2>
    {props.children}
  </section>
);

const TokenGrid = () => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-2">
    {Object.entries(uiSemanticTokens).map(([name, variable]) => (
      <div
        className="grid min-h-16 gap-1 rounded-[var(--ui-radius-control)] border border-[var(--ui-separator)] bg-[var(--ui-content)] p-2"
        key={name}
      >
        <span className="text-xs font-medium text-[var(--ui-text)]">{name}</span>
        <span className="text-xs text-[var(--ui-muted-text)]">{variable}</span>
        <span
          className="h-4 rounded-sm border border-[var(--ui-separator)]"
          style={{ background: `var(${variable})` }}
        />
      </div>
    ))}
  </div>
);

const RecipeMatrix = () => (
  <div className="grid gap-3">
    <div className="flex flex-wrap gap-2">
      <button className={controlRecipe({ emphasis: "normal", tone: "neutral" })} type="button">
        Neutral
      </button>
      <button className={controlRecipe({ emphasis: "prominent", tone: "accent" })} type="button">
        Accent
      </button>
      <button
        className={controlRecipe({ emphasis: "prominent", tone: "destructive" })}
        type="button"
      >
        Destructive
      </button>
      <button className={controlRecipe({ state: "disabled" })} disabled type="button">
        Disabled
      </button>
      <button className={controlRecipe({ state: "loading" })} type="button">
        Loading
      </button>
    </div>

    <div className="grid gap-2 md:grid-cols-2">
      <input
        aria-label="Search notation"
        className={fieldRecipe({ state: "idle" })}
        placeholder="Search notation"
      />
      <input
        aria-invalid="true"
        aria-label="Invalid route name"
        className={fieldRecipe({ state: "invalid" })}
        defaultValue="Long localized route label without overlap"
      />
    </div>

    <div className="grid gap-2">
      <div className={itemRecipe({ selection: "selected" })}>
        <span className={indicatorRecipe({ tone: "accent" })}>1</span>
        <span>Selected row keeps stable density</span>
        <span className="text-[var(--ui-muted-text)]">⌘K</span>
      </div>
      <div className={itemRecipe({ state: "invalid", tone: "destructive" })}>
        <span className={indicatorRecipe({ state: "invalid", tone: "destructive" })}>!</span>
        <span>Invalid state does not rely on color alone</span>
        <span className="text-[var(--ui-muted-text)]">State</span>
      </div>
      <div className={separatorRecipe({ orientation: "horizontal" })} />
    </div>
  </div>
);

const IconMatrix = () => (
  <div className="flex flex-wrap gap-2">
    {iconExamples.map((Icon) => (
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--ui-radius-control)] border border-[var(--ui-control-border)] bg-[var(--ui-control)] text-[var(--ui-text)]"
        key={Icon.displayName}
      >
        <Icon size={16} />
      </span>
    ))}
  </div>
);

const NotationMatrix = () => {
  const legendRows = createNotationLegendRows(notationDisplayModes);

  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        {legendRows.map((row) => (
          <div className={itemRecipe({ density: "small" })} key={row.mode}>
            <NotationIcon descriptor={row.modeIcon} tone="accent" />
            <span className="flex flex-wrap gap-1">
              {row.markerIcons.map((icon) => (
                <NotationIcon descriptor={icon} key={icon.iconName} />
              ))}
            </span>
            <span className="text-[var(--ui-muted-text)]">{row.modeIcon.accessibleLabel}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-3">
        {notationRegistryTokenGroups.map((group) => (
          <div className="grid gap-2" key={group.kind}>
            <span className="text-xs font-semibold text-[var(--ui-muted-text)]">{group.label}</span>
            <div className="grid gap-1">
              {notationDisplayModes.map((mode) => (
                <div
                  className="grid items-start gap-1 sm:grid-cols-[7rem_minmax(0,1fr)]"
                  key={`${group.kind}-${mode}`}
                >
                  <span className="text-xs font-medium text-[var(--ui-muted-text)]">{mode}</span>
                  <span className="flex flex-wrap gap-1">
                    {mapNotationStep(group.tokens, mode).map((token) => (
                      <span
                        className="inline-flex items-center gap-1"
                        key={`${mode}-${group.kind}-${token.token}`}
                      >
                        <NotationIcon descriptor={token} />
                        <span className="text-[10px] text-[var(--ui-muted-text)]">
                          {token.token}
                        </span>
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-1">
        <span className="text-xs font-semibold text-[var(--ui-muted-text)]">Fallback</span>
        {notationDisplayModes.map((mode) => (
          <div
            className="grid items-start gap-1 sm:grid-cols-[7rem_minmax(0,1fr)]"
            key={`fallback-${mode}`}
          >
            <span className="text-xs font-medium text-[var(--ui-muted-text)]">{mode}</span>
            <span className="flex flex-wrap gap-1">
              {mapNotationStep(unknownNotationTokens, mode).map((token) => (
                <NotationIcon descriptor={token} key={`${mode}-${token.token}`} />
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <StoryFrame>
      <Section title="Tokens">
        <TokenGrid />
      </Section>
      <Section title="Recipes">
        <RecipeMatrix />
      </Section>
      <Section title="Icons">
        <IconMatrix />
      </Section>
      <Section title="Notation Registry">
        <NotationMatrix />
      </Section>
    </StoryFrame>
  ),
};

export const DarkIncreasedContrast: Story = {
  render: () => (
    <StoryFrame contrast="increased" mode="dark">
      <Section title="Dark Increased Contrast Recipes">
        <RecipeMatrix />
      </Section>
      <Section title="Dark Increased Contrast Notation">
        <NotationMatrix />
      </Section>
    </StoryFrame>
  ),
};

export const LongLabelsAndStates: Story = {
  render: () => (
    <StoryFrame contrast="increased">
      <Section title="Long Labels, Disabled, Invalid">
        <div className="grid gap-2">
          <button
            className={controlRecipe({ placement: "block", state: "disabled" })}
            disabled
            type="button"
          >
            Дуже довгий localized button label remains readable without overlap
          </button>
          <div className={itemRecipe({ selection: "current", state: "focusVisible" })}>
            <span className={indicatorRecipe({ tone: "warning" })}>!</span>
            <span className="min-w-0 truncate">
              Long current list row with stable action accessory and predictable focus-visible state
            </span>
            <SettingsIcon size={14} />
          </div>
          <div className={surfaceRecipe({ density: "medium", material: "glass" })}>
            Functional material is reserved for owning surfaces and keeps text legible.
          </div>
        </div>
      </Section>
    </StoryFrame>
  ),
};
