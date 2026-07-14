import type { GameSwitcherOption } from "@mk-combos/ui/components/type";
import { componentOptionStatuses } from "@mk-combos/ui/components/value";

import { installedGames } from "./value";

export const installedGameOptions: readonly GameSwitcherOption[] = installedGames.map(
  (business) => ({
    gameId: business.id,
    label: business.label,
    shortLabel: business.label,
    status: componentOptionStatuses.available,
  }),
);
