import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

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
import { Button, IconButton } from "../primitives/button";
import { DisclosurePanel, DisclosureRoot, DisclosureTrigger } from "../primitives/disclosure";
import { Field, FieldLabel, FieldMessage, TextInput } from "../primitives/field";
import {
  Grid,
  Group,
  gridColumnModes,
  Panel,
  Separator,
  Stack,
  Surface,
  separatorOrientations,
} from "../primitives/layout";
import { SegmentedControl } from "../primitives/segmented-control";
import { Badge, LoadingIndicator, StatusMessage } from "../primitives/state";
import { TabsList, TabsPanel, TabsRoot, TabsTab } from "../primitives/tabs";
import { controlRecipe } from "../recipes/control";
import { fieldRecipe } from "../recipes/field";
import { indicatorRecipe } from "../recipes/indicator";
import { itemRecipe } from "../recipes/item";
import { separatorRecipe } from "../recipes/separator";
import { surfaceRecipe } from "../recipes/surface";
import {
  uiContrastModes,
  uiDensityModes,
  uiEmphasisModes,
  uiInteractionStates,
  uiMaterialModes,
  uiPlacementModes,
  uiSelectionStates,
  uiSemanticTokens,
  uiThemeModes,
  uiToneModes,
} from "../tokens/value";
import { StoryFrame } from "./story-frame";
import { storyViewportGlobals } from "./story-viewports";

const meta = {
  component: FoundationStorySurface,
  globals: storyViewportGlobals.desktop,
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
    tokens: Object.values(uiNotationTokens).filter((token) => uiNotationTokenKinds[token] === kind),
  }))
  .filter((group) => group.tokens.length > 0);

const unknownNotationTokens = ["UNKNOWN"] as const;

function FoundationStorySurface() {
  return null;
}

const Section = (props: { children: React.ReactNode; title: string }) => (
  <section className="flex flex-col gap-3 border-t border-(--ui-separator) pt-5 first:border-t-0 first:pt-0">
    <h2 className="font-(--ui-font-display) text-base font-semibold text-(--ui-text)">
      {props.title}
    </h2>
    {props.children}
  </section>
);

const TokenGrid = () => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-2">
    {Object.entries(uiSemanticTokens).map(([name, variable]) => (
      <div
        key={name}
        className="grid min-h-16 gap-1 rounded-(--ui-radius-control) border border-(--ui-separator) bg-(--ui-content) p-2"
      >
        <span className="text-xs font-medium text-(--ui-text)">{name}</span>
        <span className="text-xs text-(--ui-muted-text)">{variable}</span>
        <span
          style={{ background: `var(${variable})` }}
          className="h-4 rounded-sm border border-(--ui-separator)"
        />
      </div>
    ))}
  </div>
);

const RecipeMatrix = () => (
  <div className="grid gap-3">
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className={controlRecipe({
          emphasis: uiEmphasisModes.normal,
          tone: uiToneModes.neutral,
        })}
      >
        Neutral
      </button>
      <button
        type="button"
        className={controlRecipe({
          emphasis: uiEmphasisModes.prominent,
          tone: uiToneModes.accent,
        })}
      >
        Accent
      </button>
      <button
        type="button"
        className={controlRecipe({
          emphasis: uiEmphasisModes.prominent,
          tone: uiToneModes.destructive,
        })}
      >
        Destructive
      </button>
      <button
        disabled
        type="button"
        className={controlRecipe({ state: uiInteractionStates.disabled })}
      >
        Disabled
      </button>
      <button className={controlRecipe({ state: uiInteractionStates.loading })} type="button">
        Loading
      </button>
    </div>

    <div className="grid gap-2 md:grid-cols-2">
      <input
        aria-label="Search notation"
        placeholder="Search notation"
        className={fieldRecipe({ state: uiInteractionStates.idle })}
      />
      <input
        aria-invalid="true"
        aria-label="Invalid route name"
        defaultValue="Long localized route label without overlap"
        className={fieldRecipe({ state: uiInteractionStates.invalid })}
      />
    </div>

    <div className="grid gap-2">
      <div className={itemRecipe({ selection: uiSelectionStates.selected })}>
        <span className={indicatorRecipe({ tone: uiToneModes.accent })}>1</span>
        <span>Selected row keeps stable density</span>
        <span className="text-(--ui-muted-text)">⌘K</span>
      </div>
      <div
        className={itemRecipe({
          state: uiInteractionStates.invalid,
          tone: uiToneModes.destructive,
        })}
      >
        <span
          className={indicatorRecipe({
            state: uiInteractionStates.invalid,
            tone: uiToneModes.destructive,
          })}
        >
          !
        </span>
        <span>Invalid state does not rely on color alone</span>
        <span className="text-(--ui-muted-text)">State</span>
      </div>
      <div className={separatorRecipe({ orientation: separatorOrientations.horizontal })} />
    </div>
  </div>
);

const PrimitiveMatrix = () => {
  const [displayMode, setDisplayMode] = useState<NotationDisplayMode>(
    notationDisplayModes.PlayStation,
  );
  const [disclosureOpen, setDisclosureOpen] = useState(true);
  const [query, setQuery] = useState("Very long localized input value without layout shift");
  const [status, setStatus] = useState("Primitives are ready for interaction");
  const [tab, setTab] = useState("interface");

  return (
    <Stack density={uiDensityModes.medium}>
      <Surface material={uiMaterialModes.separated}>
        <Panel density={uiDensityModes.medium}>
          <Grid columns={gridColumnModes.two}>
            <Stack>
              <Group>
                <Button
                  tone={uiToneModes.accent}
                  onRequestPress={() => setStatus("Save requested")}
                >
                  Save
                </Button>
                <Button loading>Saving</Button>
                <Button disabled>Disabled</Button>
                <IconButton
                  label="Open actions"
                  onRequestPress={() => setStatus("Icon action requested")}
                >
                  <MenuIcon decorative size={14} />
                </IconButton>
              </Group>

              <Group>
                <Badge tone={uiToneModes.success}>Ready</Badge>
                <Badge tone={uiToneModes.warning}>Stale</Badge>
                <LoadingIndicator label="Loading primitives" />
              </Group>
            </Stack>

            <Field>
              <FieldLabel htmlFor="primitive-query">Search</FieldLabel>
              <TextInput
                invalid
                value={query}
                id="primitive-query"
                placeholder="Find combo"
                aria-describedby="primitive-query-message"
                onValueChange={({ value }) => {
                  setQuery(value);
                  setStatus(`Search value: ${value || "empty"}`);
                }}
              />
              <FieldMessage id="primitive-query-message" invalid>
                Invalid state stays adjacent to the field.
              </FieldMessage>
            </Field>
          </Grid>

          <Separator />

          <TabsRoot
            value={tab}
            onValueChange={({ value }) => {
              setTab(value);
              setStatus(`Tab selected: ${value}`);
            }}
          >
            <TabsList aria-label="Settings sections">
              <TabsTab value="interface">Interface</TabsTab>
              <TabsTab value="backup">Game backups</TabsTab>
              <TabsTab disabled value="unavailable">
                Unavailable
              </TabsTab>
            </TabsList>
            <TabsPanel value="interface">Language and button-label preferences.</TabsPanel>
            <TabsPanel value="backup">Per-game backup controls.</TabsPanel>
          </TabsRoot>

          <Stack>
            <SegmentedControl
              value={displayMode}
              aria-label="Display mode"
              onValueChange={({ value }) => {
                setDisplayMode(value);
                setStatus(`Display mode selected: ${value}`);
              }}
              options={[
                { label: "FGC", value: notationDisplayModes.FGC },
                { label: "PlayStation", value: notationDisplayModes.PlayStation },
                { label: "Xbox", value: notationDisplayModes.Xbox },
              ]}
            />
            <StatusMessage aria-live="polite">{status}</StatusMessage>
            <StatusMessage tone={uiToneModes.warning}>
              Long status text wraps inside its owning panel without overlapping neighboring
              controls.
            </StatusMessage>
          </Stack>

          <DisclosureRoot
            open={disclosureOpen}
            onOpenChange={({ open }) => {
              setDisclosureOpen(open);
              setStatus(`Disclosure ${open ? "expanded" : "collapsed"}`);
            }}
          >
            <DisclosureTrigger>
              Open primitive disclosure with a long localized label
            </DisclosureTrigger>
            <DisclosurePanel>
              <Stack>
                <span>
                  Expanded panel content uses surface tokens and remains in regular reading order.
                </span>
                <Group>
                  <Button
                    tone={uiToneModes.accent}
                    onRequestPress={() => setStatus("Primary action requested")}
                  >
                    Primary action
                  </Button>
                  <Button
                    tone={uiToneModes.destructive}
                    onRequestPress={() => setStatus("Destructive action requested")}
                  >
                    Destructive action
                  </Button>
                </Group>
              </Stack>
            </DisclosurePanel>
          </DisclosureRoot>
        </Panel>
      </Surface>
    </Stack>
  );
};

const IconMatrix = () => (
  <div className="flex flex-wrap gap-2">
    {iconExamples.map((Icon) => (
      <span
        key={Icon.displayName}
        className="inline-flex h-8 w-8 items-center justify-center rounded-(--ui-radius-control) border border-(--ui-control-border) bg-(--ui-control) text-(--ui-text)"
      >
        <Icon size={16} />
      </span>
    ))}
  </div>
);

const NotationMatrix = () => {
  const legendRows = createNotationLegendRows(Object.values(notationDisplayModes));

  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        {legendRows.map((row) => (
          <div className={itemRecipe({ density: uiDensityModes.small })} key={row.mode}>
            <NotationIcon descriptor={row.modeIcon} tone={uiToneModes.accent} />
            <span className="flex flex-wrap gap-1">
              {row.markerIcons.map((icon) => (
                <NotationIcon descriptor={icon} key={icon.iconName} />
              ))}
            </span>
            <span className="text-(--ui-muted-text)">{row.modeIcon.accessibleLabel}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-3">
        {notationRegistryTokenGroups.map((group) => (
          <div className="grid gap-2" key={group.kind}>
            <span className="text-xs font-semibold text-(--ui-muted-text)">{group.label}</span>
            <div className="grid gap-1">
              {Object.values(notationDisplayModes).map((mode) => (
                <div
                  key={`${group.kind}-${mode}`}
                  className="grid items-start gap-1 sm:grid-cols-[7rem_minmax(0,1fr)]"
                >
                  <span className="text-xs font-medium text-(--ui-muted-text)">{mode}</span>
                  <span className="flex flex-wrap gap-1">
                    {mapNotationStep(group.tokens, mode).map((token) => (
                      <span
                        className="inline-flex items-center gap-1"
                        key={`${mode}-${group.kind}-${token.token}`}
                      >
                        <NotationIcon descriptor={token} />
                        <span className="text-[10px] text-(--ui-muted-text)">{token.token}</span>
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
        <span className="text-xs font-semibold text-(--ui-muted-text)">Fallback</span>
        {Object.values(notationDisplayModes).map((mode) => (
          <div
            key={`fallback-${mode}`}
            className="grid items-start gap-1 sm:grid-cols-[7rem_minmax(0,1fr)]"
          >
            <span className="text-xs font-medium text-(--ui-muted-text)">{mode}</span>
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
    <StoryFrame contentClassName="max-w-5xl">
      <Section title="Tokens">
        <TokenGrid />
      </Section>
      <Section title="Recipes">
        <RecipeMatrix />
      </Section>
      <Section title="Primitives">
        <PrimitiveMatrix />
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
    <StoryFrame
      theme={uiThemeModes.dark}
      contentClassName="max-w-5xl"
      contrast={uiContrastModes.increased}
    >
      <Section title="Dark Increased Contrast Recipes">
        <RecipeMatrix />
      </Section>
      <Section title="Dark Increased Contrast Primitives">
        <PrimitiveMatrix />
      </Section>
      <Section title="Dark Increased Contrast Notation">
        <NotationMatrix />
      </Section>
    </StoryFrame>
  ),
};

export const LightThemeReference: Story = {
  render: () => (
    <StoryFrame contentClassName="max-w-5xl" theme={uiThemeModes.light}>
      <Section title="Light Theme Recipes">
        <RecipeMatrix />
      </Section>
      <Section title="Light Theme Primitives">
        <PrimitiveMatrix />
      </Section>
    </StoryFrame>
  ),
};

export const LongLabelsAndStates: Story = {
  render: () => (
    <StoryFrame contentClassName="max-w-5xl" contrast={uiContrastModes.increased}>
      <Section title="Long Labels, Disabled, Invalid">
        <div className="grid gap-2">
          <button
            disabled
            type="button"
            className={controlRecipe({
              placement: uiPlacementModes.block,
              state: uiInteractionStates.disabled,
            })}
          >
            Дуже довгий localized button label remains readable without overlap
          </button>
          <div
            className={itemRecipe({
              selection: uiSelectionStates.current,
              state: uiInteractionStates.focusVisible,
            })}
          >
            <span className={indicatorRecipe({ tone: uiToneModes.warning })}>!</span>
            <span className="min-w-0 truncate">
              Long current list row with stable action accessory and predictable focus-visible state
            </span>
            <SettingsIcon size={14} />
          </div>
          <div
            className={surfaceRecipe({
              density: uiDensityModes.medium,
              material: uiMaterialModes.glass,
            })}
          >
            Functional material is reserved for owning surfaces and keeps text legible.
          </div>
          <PrimitiveMatrix />
        </div>
      </Section>
    </StoryFrame>
  ),
};
