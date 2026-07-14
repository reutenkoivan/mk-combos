import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { mkxlCharacterIcons } from "../icons/game/mkxl/characters";
import { mkxlInteractableIcons } from "../icons/game/mkxl/interactables";
import {
  mkxlFactionIcons,
  mkxlInteractableTypeIcons,
  mkxlRealmIcons,
  mkxlStateIcons,
} from "../icons/game/mkxl/shared";
import { mkxlStageIcons } from "../icons/game/mkxl/stages";
import { mkxlVariationIcons } from "../icons/game/mkxl/variations";
import { GameIcon } from "../icons/game/runtime";
import type { GameIconAsset } from "../icons/game/type";
import { StoryFrame } from "./story-frame";
import { storyViewportGlobals } from "./story-viewports";

function MkxlGameIconStorySurface() {
  return null;
}

const meta = {
  component: MkxlGameIconStorySurface,
  globals: storyViewportGlobals.desktop,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  title: "Assets/Game Icons/MKXL",
} satisfies Meta<typeof MkxlGameIconStorySurface>;

export default meta;
type Story = StoryObj<typeof meta>;

const IconTile = ({ asset }: { asset: GameIconAsset }) => (
  <article className="grid min-w-0 content-start gap-2 rounded-(--ui-radius-control) border border-(--ui-separator) bg-(--ui-content) p-3">
    <GameIcon asset={asset} className="h-16 w-16 object-contain" />
    <div className="grid min-w-0 gap-1">
      <strong className="text-sm text-(--ui-text)">{asset.accessibleLabel}</strong>
      <code className="break-all text-xs text-(--ui-muted-text)">{asset.id}</code>
      <code className="break-all text-[0.65rem] text-(--ui-muted-text)">{asset.assetPath}</code>
    </div>
  </article>
);

const IconGrid = ({ assets }: { assets: readonly GameIconAsset[] }) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3">
    {assets.map((asset) => (
      <IconTile asset={asset} key={asset.id} />
    ))}
  </div>
);

const ShapeAuditGrid = ({ assets }: { assets: readonly GameIconAsset[] }) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3">
    {assets.map((asset) => (
      <article
        className="grid min-w-0 justify-items-center gap-3 rounded-(--ui-radius-control) border border-(--ui-separator) bg-(--ui-content) p-3"
        key={asset.id}
      >
        <div className="flex min-h-16 items-end justify-center gap-3">
          <GameIcon asset={asset} className="h-16 w-16 grayscale contrast-200" decorative />
          <GameIcon asset={asset} className="h-8 w-8 grayscale contrast-200" decorative />
        </div>
        <div className="grid min-w-0 justify-items-center gap-1 text-center">
          <strong className="text-xs text-(--ui-text)">{asset.accessibleLabel}</strong>
          <code className="break-all text-[0.65rem] text-(--ui-muted-text)">{asset.id}</code>
        </div>
      </article>
    ))}
  </div>
);

const PageHeader = (props: { count: number; description: string; title: string }) => (
  <header className="grid gap-2">
    <p className="text-xs font-semibold text-(--ui-accent-strong)">MKXL · {props.count}</p>
    <h1 className="font-(--ui-font-display) text-2xl font-semibold text-(--ui-text)">
      {props.title}
    </h1>
    <p className="max-w-3xl text-sm text-(--ui-muted-text)">{props.description}</p>
  </header>
);

const GroupSection = (props: { children: ReactNode; count: number; title: string }) => (
  <section className="grid gap-3 border-t border-(--ui-separator) pt-5 first:border-t-0 first:pt-0">
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="font-(--ui-font-display) text-lg font-semibold text-(--ui-text)">
        {props.title}
      </h2>
      <span className="text-xs text-(--ui-muted-text)">{props.count} icons</span>
    </div>
    {props.children}
  </section>
);

const variationsByCharacter = mkxlCharacterIcons.map((character) => ({
  character,
  variations: mkxlVariationIcons.filter((variation) => variation.parentId === character.id),
}));

const interactablesByStage = mkxlStageIcons.map((stage) => ({
  interactables: mkxlInteractableIcons.filter((interactable) => interactable.parentId === stage.id),
  stage,
}));

export const Characters: Story = {
  render: () => (
    <StoryFrame>
      <PageHeader
        count={mkxlCharacterIcons.length}
        description="Complete character-select icon set. Every tile lists the public entity ID and package-relative SVG path."
        title="Characters"
      />
      <IconGrid assets={mkxlCharacterIcons} />
    </StoryFrame>
  ),
};

export const CharacterShapeAudit: Story = {
  render: () => (
    <StoryFrame>
      <PageHeader
        count={mkxlCharacterIcons.length}
        description="Grayscale 64 px and 32 px previews verify that each fighter remains recognizable through the portrait silhouette and signature equipment without relying on color."
        title="Character shape audit"
      />
      <ShapeAuditGrid assets={mkxlCharacterIcons} />
    </StoryFrame>
  ),
};

export const Variations: Story = {
  render: () => (
    <StoryFrame>
      <PageHeader
        count={mkxlVariationIcons.length}
        description="Variation artwork is grouped by its parent character. Triborg includes the hidden Cyber Sub-Zero variation."
        title="Variations"
      />
      {variationsByCharacter.map(({ character, variations }) => (
        <GroupSection
          count={variations.length}
          key={character.id}
          title={character.accessibleLabel}
        >
          <IconGrid assets={variations} />
        </GroupSection>
      ))}
    </StoryFrame>
  ),
};

export const VariationShapeAudit: Story = {
  render: () => (
    <StoryFrame>
      <PageHeader
        count={mkxlVariationIcons.length}
        description="Grayscale 64 px and 32 px previews remove color as an identifier. Every variation must remain distinguishable through its frame and signature silhouette."
        title="Variation shape audit"
      />
      {variationsByCharacter.map(({ character, variations }) => (
        <GroupSection
          count={variations.length}
          key={character.id}
          title={character.accessibleLabel}
        >
          <ShapeAuditGrid assets={variations} />
        </GroupSection>
      ))}
    </StoryFrame>
  ),
};

export const StageAndInteractableShapeAudit: Story = {
  render: () => (
    <StoryFrame>
      <PageHeader
        count={mkxlStageIcons.length + mkxlInteractableIcons.length}
        description="Every arena landmark and usable object is shown without color at 64 px and 32 px. Stage context groups related objects while their silhouettes remain individually identifiable."
        title="Stage & interactable shape audit"
      />
      {interactablesByStage.map(({ interactables, stage }) => (
        <GroupSection count={1 + interactables.length} key={stage.id} title={stage.accessibleLabel}>
          <ShapeAuditGrid assets={[stage, ...interactables]} />
        </GroupSection>
      ))}
    </StoryFrame>
  ),
};

export const StagesAndInteractables: Story = {
  render: () => (
    <StoryFrame>
      <PageHeader
        count={mkxlStageIcons.length + mkxlInteractableIcons.length}
        description="Each arena is followed by its unique interactable artwork in registry order. Mirrored or repeated uses share one SVG; Training Room has no unique interactables."
        title="Stages & interactables"
      />
      {interactablesByStage.map(({ interactables, stage }) => (
        <GroupSection count={1 + interactables.length} key={stage.id} title={stage.accessibleLabel}>
          <div className="grid gap-4 lg:grid-cols-[11rem_1fr]">
            <IconTile asset={stage} />
            {interactables.length > 0 ? (
              <IconGrid assets={interactables} />
            ) : (
              <p className="self-center text-sm text-(--ui-muted-text)">
                No unique stage interactables.
              </p>
            )}
          </div>
        </GroupSection>
      ))}
    </StoryFrame>
  ),
};

const sharedGroups = [
  { assets: mkxlStateIcons, title: "States & badges" },
  { assets: mkxlInteractableTypeIcons, title: "Interactable types" },
  { assets: mkxlRealmIcons, title: "Realms" },
  { assets: mkxlFactionIcons, title: "Factions" },
] as const;

export const Shared: Story = {
  render: () => (
    <StoryFrame>
      <PageHeader
        count={sharedGroups.reduce((count, group) => count + group.assets.length, 0)}
        description="Reusable badges and classification glyphs for selection state, arena interaction, realm, and faction presentation."
        title="Shared game icons"
      />
      {sharedGroups.map((group) => (
        <GroupSection count={group.assets.length} key={group.title} title={group.title}>
          <IconGrid assets={group.assets} />
        </GroupSection>
      ))}
    </StoryFrame>
  ),
};

export const SharedShapeAudit: Story = {
  render: () => (
    <StoryFrame>
      <PageHeader
        count={sharedGroups.reduce((count, group) => count + group.assets.length, 0)}
        description="State, interaction, realm, and faction glyphs are reviewed in grayscale at 64 px and 32 px so category meaning cannot depend on palette alone."
        title="Shared icon shape audit"
      />
      {sharedGroups.map((group) => (
        <GroupSection count={group.assets.length} key={group.title} title={group.title}>
          <ShapeAuditGrid assets={group.assets} />
        </GroupSection>
      ))}
    </StoryFrame>
  ),
};
