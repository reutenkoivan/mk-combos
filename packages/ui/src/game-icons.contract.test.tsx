import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

import { render, screen } from "@mk-combos/contracts/test/unit/react";
import * as contractEntry from "@mk-combos/ui/contract";
import { mkxlCharacterIcons } from "@mk-combos/ui/icons/game/mkxl/characters";
import { mkxlInteractableIcons } from "@mk-combos/ui/icons/game/mkxl/interactables";
import {
  mkxlFactionIcons,
  mkxlInteractableTypeIcons,
  mkxlRealmIcons,
  mkxlSharedIcons,
  mkxlStateIcons,
} from "@mk-combos/ui/icons/game/mkxl/shared";
import { mkxlStageIcons } from "@mk-combos/ui/icons/game/mkxl/stages";
import { mkxlVariationIcons } from "@mk-combos/ui/icons/game/mkxl/variations";
import { GameIcon } from "@mk-combos/ui/icons/game/runtime";
import { GameIconAssetSchema } from "@mk-combos/ui/icons/game/schema";
import type { GameIconAsset, GameIconKind } from "@mk-combos/ui/icons/game/type";
import { gameIconKinds as typeGameIconKinds } from "@mk-combos/ui/icons/game/type";
import { gameIconKinds } from "@mk-combos/ui/icons/game/value";
import { describe, expect, it } from "vitest";

const allMkxlIcons = [
  ...mkxlCharacterIcons,
  ...mkxlVariationIcons,
  ...mkxlStageIcons,
  ...mkxlInteractableIcons,
  ...mkxlSharedIcons,
] as const satisfies readonly GameIconAsset[];

const expectedMkxlVariationIconIds = [
  "alien:tarkatan",
  "alien:acidic",
  "alien:konjurer",
  "bo-rai-cho:bartitsu",
  "bo-rai-cho:dragon-breath",
  "bo-rai-cho:drunken-master",
  "cassie-cage:spec-ops",
  "cassie-cage:hollywood",
  "cassie-cage:brawler",
  "dvorah:venomous",
  "dvorah:brood-mother",
  "dvorah:swarm-queen",
  "ermac:spectral",
  "ermac:mystic",
  "ermac:master-of-souls",
  "erron-black:marksman",
  "erron-black:gunslinger",
  "erron-black:outlaw",
  "ferra-torr:lackey",
  "ferra-torr:ruthless",
  "ferra-torr:vicious",
  "goro:tigrar-fury",
  "goro:kuatan-warrior",
  "goro:dragon-fangs",
  "jacqui-briggs:high-tech",
  "jacqui-briggs:shotgun",
  "jacqui-briggs:full-auto",
  "jason-voorhees:unstoppable",
  "jason-voorhees:slasher",
  "jason-voorhees:relentless",
  "jax:wrestler",
  "jax:heavy-weapons",
  "jax:pumped-up",
  "johnny-cage:a-list",
  "johnny-cage:fisticuffs",
  "johnny-cage:stunt-double",
  "kano:commando",
  "kano:cutthroat",
  "kano:cybernetic",
  "kenshi:kenjutsu",
  "kenshi:balanced",
  "kenshi:possessed",
  "kitana:mournful",
  "kitana:royal-storm",
  "kitana:assassin",
  "kotal-kahn:sun-god",
  "kotal-kahn:blood-god",
  "kotal-kahn:war-god",
  "kung-jin:shaolin",
  "kung-jin:ancestral",
  "kung-jin:bojutsu",
  "kung-lao:hat-trick",
  "kung-lao:tempest",
  "kung-lao:buzz-saw",
  "leatherface:pretty-lady",
  "leatherface:killer",
  "leatherface:butcher",
  "liu-kang:dualist",
  "liu-kang:flame-fist",
  "liu-kang:dragons-fire",
  "mileena:ravenous",
  "mileena:piercing",
  "mileena:ethereal",
  "predator:hish-qu-ten",
  "predator:warrior",
  "predator:hunter",
  "quan-chi:summoner",
  "quan-chi:warlock",
  "quan-chi:sorcerer",
  "raiden:thunder-god",
  "raiden:displacer",
  "raiden:master-of-storms",
  "reptile:noxious",
  "reptile:deceptive",
  "reptile:nimble",
  "scorpion:inferno",
  "scorpion:ninjutsu",
  "scorpion:hellfire",
  "shinnok:necromancer",
  "shinnok:impostor",
  "shinnok:bone-shaper",
  "sonya-blade:covert-ops",
  "sonya-blade:special-forces",
  "sonya-blade:demolition",
  "sub-zero:grandmaster",
  "sub-zero:cryomancer",
  "sub-zero:unbreakable",
  "takeda:ronin",
  "takeda:shirai-ryu",
  "takeda:lasher",
  "tanya:pyromancer",
  "tanya:kobu-jutsu",
  "tanya:dragon-naginata",
  "tremor:crystalline",
  "tremor:aftershock",
  "tremor:metallic",
  "triborg:smoke",
  "triborg:sektor",
  "triborg:cyrax",
  "triborg:cyber-sub-zero",
] as const;

const assetFilePath = (asset: GameIconAsset) => resolve(process.cwd(), "src", asset.assetPath);

const collectSvgAssetPaths = (directoryPath: string): string[] =>
  readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directoryPath, entry.name);

    if (entry.isDirectory()) {
      return collectSvgAssetPaths(entryPath);
    }

    return entry.name.endsWith(".svg")
      ? [relative(resolve(process.cwd(), "src"), entryPath).split(sep).join("/")]
      : [];
  });

const semanticGroupAttribute = (asset: GameIconAsset, groupName: "frame" | "symbol") =>
  asset.kind === gameIconKinds.variation
    ? `data-variation-${groupName}`
    : `data-game-icon-${groupName}`;

const extractSemanticGroup = (svg: string, asset: GameIconAsset, groupName: "frame" | "symbol") => {
  const attribute = semanticGroupAttribute(asset, groupName);
  const group = svg.match(
    new RegExp(`<g\\s+[^>]*${attribute}="true"[^>]*>([\\s\\S]*?)<\\/g>`, "u"),
  )?.[1];

  if (!group) {
    throw new Error(`Missing ${attribute} group in ${asset.assetPath}`);
  }

  return group;
};

const normalizeSemanticGeometry = (group: string) =>
  group
    .replace(/#[0-9a-f]{3,8}/giu, "#COLOR")
    .replace(/(?:rgb|hsl)a?\([^)]*\)/giu, "COLOR")
    .replace(/\b(?:color|fill|stroke)="(?!none\b)[^"]+"/giu, 'color="COLOR"')
    .replace(/\s+/gu, " ")
    .trim();

const decodeSvgDataUrl = (src: string) => {
  const separatorIndex = src.indexOf(",");
  const metadata = src.slice(0, separatorIndex);
  const payload = src.slice(separatorIndex + 1);

  return metadata.endsWith(";base64")
    ? Buffer.from(payload, "base64").toString("utf8")
    : decodeURIComponent(payload);
};

const normalizeSvgSource = (svg: string) =>
  svg.replaceAll("'", '"').replace(/>\s+</gu, "><").trim();

const acceptsGameIconTypes = <
  _Contract extends {
    asset: GameIconAsset;
    kind: GameIconKind;
  },
>() => true;

describe("@mk-combos/ui game icon contract", () => {
  it("publishes the game-agnostic facade and MKXL registry subpaths", () => {
    expect(acceptsGameIconTypes).toBeTruthy();
    expect(typeGameIconKinds).toBe(gameIconKinds);
    expect(gameIconKinds).toEqual({
      character: "character",
      faction: "faction",
      interactable: "interactable",
      "interactable-type": "interactable-type",
      realm: "realm",
      stage: "stage",
      state: "state",
      variation: "variation",
    });
    expect(contractEntry.uiContractGroups.gameIcons).toEqual({
      mkxl: {
        characters: "@mk-combos/ui/icons/game/mkxl/characters",
        interactables: "@mk-combos/ui/icons/game/mkxl/interactables",
        shared: "@mk-combos/ui/icons/game/mkxl/shared",
        stages: "@mk-combos/ui/icons/game/mkxl/stages",
        variations: "@mk-combos/ui/icons/game/mkxl/variations",
      },
      runtime: "@mk-combos/ui/icons/game/runtime",
      schema: "@mk-combos/ui/icons/game/schema",
      type: "@mk-combos/ui/icons/game/type",
      value: "@mk-combos/ui/icons/game/value",
    });
    expect(contractEntry.mkCombosUi.valueSets.gameIconKinds).toBe(gameIconKinds);
  });

  it("contains the complete logical icon inventory", () => {
    expect(mkxlCharacterIcons).toHaveLength(33);
    expect(mkxlVariationIcons).toHaveLength(100);
    expect(mkxlStageIcons).toHaveLength(14);
    expect(mkxlInteractableIcons).toHaveLength(58);
    expect(mkxlStateIcons).toHaveLength(10);
    expect(mkxlInteractableTypeIcons).toHaveLength(20);
    expect(mkxlRealmIcons).toHaveLength(3);
    expect(mkxlFactionIcons).toHaveLength(5);
    expect(mkxlSharedIcons).toHaveLength(38);
    expect(allMkxlIcons).toHaveLength(243);
    expect(mkxlVariationIcons.map((asset) => asset.id)).toEqual(expectedMkxlVariationIconIds);
  });

  it("keeps IDs, paths, and parent relationships deterministic", () => {
    const ids = new Set(allMkxlIcons.map((asset) => asset.id));
    const paths = new Set(allMkxlIcons.map((asset) => asset.assetPath));
    const characterIds = new Set(mkxlCharacterIcons.map((asset) => asset.id));
    const stageIds = new Set(mkxlStageIcons.map((asset) => asset.id));

    expect(ids.size).toBe(allMkxlIcons.length);
    expect(paths.size).toBe(allMkxlIcons.length);
    expect([...paths].sort()).toEqual(
      collectSvgAssetPaths(resolve(process.cwd(), "src/icons/game/mkxl")).sort(),
    );

    for (const asset of mkxlVariationIcons) {
      expect(asset.parentId).toBeTruthy();
      expect(characterIds.has(asset.parentId)).toBe(true);
      expect(asset.id.startsWith(`${asset.parentId}:`)).toBe(true);
    }

    for (const asset of mkxlInteractableIcons) {
      expect(asset.parentId).toBeTruthy();
      expect(stageIds.has(asset.parentId)).toBe(true);
      expect(asset.id.startsWith(`${asset.parentId}:`)).toBe(true);
    }
  });

  it("validates strict descriptors and every SVG source file", () => {
    const contentHashes = new Set<string>();
    const disallowedSvgContent = /<(?:foreignObject|image|script|text|use)\b/iu;
    const titles = new Set<string>();

    for (const asset of allMkxlIcons) {
      expect(GameIconAssetSchema.parse(asset)).toEqual(asset);

      const filePath = assetFilePath(asset);
      expect(existsSync(filePath), asset.assetPath).toBe(true);

      const svg = readFileSync(filePath, "utf8");
      if (asset.src.startsWith("data:image/svg+xml")) {
        expect(normalizeSvgSource(decodeSvgDataUrl(asset.src))).toBe(normalizeSvgSource(svg));
      } else {
        expect(
          decodeURIComponent(new URL(asset.src).pathname).endsWith(`/src/${asset.assetPath}`),
        ).toBe(true);
      }
      expect(svg).toMatch(/<svg\b/u);
      expect(svg).toContain('viewBox="0 0 64 64"');
      const titleMatches = [...svg.matchAll(/<title>([^<]+)<\/title>/gu)];
      expect(titleMatches).toHaveLength(1);
      titles.add(titleMatches[0]?.[1] ?? "");
      expect(svg).not.toMatch(disallowedSvgContent);
      expect(svg).not.toMatch(/\b(?:href|src)\s*=/iu);
      expect(svg).not.toMatch(/\b(?:class|style)\s*=/iu);

      for (const groupName of ["frame", "symbol"] as const) {
        const attribute = semanticGroupAttribute(asset, groupName);
        expect([...svg.matchAll(new RegExp(`${attribute}="true"`, "gu"))]).toHaveLength(1);
        expect(extractSemanticGroup(svg, asset, groupName)).not.toMatch(/<g\b/u);
      }

      contentHashes.add(createHash("sha256").update(svg).digest("hex"));
    }

    expect(contentHashes.size).toBe(allMkxlIcons.length);
    expect(titles.size).toBe(allMkxlIcons.length);
    expect(
      GameIconAssetSchema.safeParse({ ...mkxlCharacterIcons[0], undocumented: true }).success,
    ).toBe(false);
    expect(
      GameIconAssetSchema.safeParse({ ...mkxlCharacterIcons[0], gameId: "future-game" }).success,
    ).toBe(true);
    expect(
      GameIconAssetSchema.safeParse({ ...mkxlCharacterIcons[0], parentId: "not-allowed" }).success,
    ).toBe(false);
    const { parentId: _parentId, ...variationWithoutParent } = mkxlVariationIcons[0];
    expect(GameIconAssetSchema.safeParse(variationWithoutParent).success).toBe(false);
  });

  it("keeps every icon symbol and every variation frame and palette unique", () => {
    const frameFingerprints = new Set<string>();
    const paletteFingerprints = new Set<string>();
    const symbolFingerprints = new Set<string>();

    for (const asset of allMkxlIcons) {
      const svg = readFileSync(assetFilePath(asset), "utf8");

      symbolFingerprints.add(normalizeSemanticGeometry(extractSemanticGroup(svg, asset, "symbol")));

      if (asset.kind !== gameIconKinds.variation) {
        continue;
      }

      const palette = [
        ...new Set([...svg.matchAll(/#[0-9a-f]{3,8}/giu)].map(([color]) => color.toUpperCase())),
      ]
        .sort()
        .join("|");

      frameFingerprints.add(normalizeSemanticGeometry(extractSemanticGroup(svg, asset, "frame")));
      paletteFingerprints.add(palette);
    }

    expect(frameFingerprints.size).toBe(mkxlVariationIcons.length);
    expect(paletteFingerprints.size).toBe(mkxlVariationIcons.length);
    expect(symbolFingerprints.size).toBe(allMkxlIcons.length);
  });

  it("renders informative and decorative icon variants accessibly", () => {
    const asset = mkxlCharacterIcons[0];
    const view = render(<GameIcon asset={asset} data-testid="game-icon" />);

    expect(screen.getByRole("img", { name: asset.accessibleLabel })).toBeTruthy();
    expect(screen.getByTestId("game-icon").getAttribute("draggable")).toBe("false");

    view.rerender(<GameIcon asset={asset} data-testid="game-icon" decorative />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByTestId("game-icon").getAttribute("alt")).toBe("");
    expect(screen.getByTestId("game-icon").getAttribute("aria-hidden")).toBe("true");
  });
});
