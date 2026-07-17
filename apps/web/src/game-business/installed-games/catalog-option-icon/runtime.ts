import type { GameId } from "@mk-combos/contracts/identity/type";
import { mkxlCharacterIcons } from "@mk-combos/ui/icons/game/mkxl/characters";
import { mkxlInteractableIcons } from "@mk-combos/ui/icons/game/mkxl/interactables";
import { mkxlStageIcons } from "@mk-combos/ui/icons/game/mkxl/stages";
import { mkxlVariationIcons } from "@mk-combos/ui/icons/game/mkxl/variations";

type CatalogOptionIconKind = "character" | "interactable" | "kameo" | "stage" | "variation";

const catalogOptionIcons = new Map(
  [...mkxlCharacterIcons, ...mkxlVariationIcons, ...mkxlStageIcons, ...mkxlInteractableIcons].map(
    (asset) => [`${asset.gameId}:${asset.kind}:${asset.id}`, asset],
  ),
);

export function resolveInstalledCatalogOptionIcon(
  gameId: GameId,
  kind: CatalogOptionIconKind,
  optionId: string,
) {
  return catalogOptionIcons.get(`${gameId}:${kind}:${optionId}`);
}
