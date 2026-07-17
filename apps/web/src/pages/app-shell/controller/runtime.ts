import type { GameSwitcherOption } from "@mk-combos/ui/components/type";
import { componentOptionStatuses } from "@mk-combos/ui/components/value";

export function moveCircular<T>(values: readonly T[], currentIndex: number, delta: number) {
  if (values.length === 0) {
    return undefined;
  }

  const normalizedIndex = currentIndex < 0 ? 0 : currentIndex;
  return values[(normalizedIndex + delta + values.length) % values.length];
}

export function getControllerGameMenuOptions(
  availableGames: readonly GameSwitcherOption[],
  currentGameId: string,
) {
  return availableGames.filter(
    (game) =>
      game.gameId !== currentGameId && game.status !== componentOptionStatuses.disabledUnavailable,
  );
}
