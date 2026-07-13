import type { BuilderMovePath } from "@mk-combos/builder-core/graph/type";
import type { BuilderRuntimeSnapshot } from "@mk-combos/builder-core/runtime/type";
import {
  createFreshComboState,
  createInvalidComboStateFromReplay,
  createStaleComboStateFromReplay,
} from "@mk-combos/builder-core/stale/runtime";
import type {
  BuilderComboState,
  BuilderInvalidComboStateStatus,
} from "@mk-combos/builder-core/stale/type";
import { builderInvalidComboStateStatuses } from "@mk-combos/builder-core/stale/value";

import type { Mk1BuilderContext } from "../context/type";
import {
  createMk1BuilderInitialRuntime,
  parseMk1BuilderRuntimeSnapshot,
} from "../internal/runtime-state";
import { replayMk1BuilderPath } from "../replay/runtime";

export { createMk1BuilderInitialRuntime, parseMk1BuilderRuntimeSnapshot };

export const getMk1BuilderComboState = (input: {
  context: Mk1BuilderContext;
  path: BuilderMovePath;
  initialRuntime?: BuilderRuntimeSnapshot;
  invalidStatus?: BuilderInvalidComboStateStatus;
}): BuilderComboState => {
  const replay = replayMk1BuilderPath({
    context: input.context,
    path: input.path,
    initialRuntime: input.initialRuntime,
  });

  if (replay.ok) {
    return createFreshComboState({
      currentPath: replay.acceptedPath,
      replay,
      metadata: {
        gameId: "mk1",
      },
    });
  }

  if (input.invalidStatus === builderInvalidComboStateStatuses.invalid) {
    return createInvalidComboStateFromReplay(replay, {
      gameId: "mk1",
    });
  }

  return createStaleComboStateFromReplay(replay, {
    gameId: "mk1",
  });
};
