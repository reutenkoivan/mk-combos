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

import type { MkxlBuilderContext } from "../context/type";
import {
  createMkxlBuilderInitialRuntime,
  parseMkxlBuilderRuntimeSnapshot,
} from "../internal/runtime-state";
import { replayMkxlBuilderPath } from "../replay/runtime";

export { createMkxlBuilderInitialRuntime, parseMkxlBuilderRuntimeSnapshot };

export const getMkxlBuilderComboState = (input: {
  context: MkxlBuilderContext;
  path: BuilderMovePath;
  initialRuntime?: BuilderRuntimeSnapshot;
  invalidStatus?: BuilderInvalidComboStateStatus;
}): BuilderComboState => {
  const replay = replayMkxlBuilderPath({
    context: input.context,
    path: input.path,
    initialRuntime: input.initialRuntime,
  });

  if (replay.ok) {
    return createFreshComboState({
      currentPath: replay.acceptedPath,
      replay,
      metadata: {
        gameId: "mkxl",
      },
    });
  }

  if (input.invalidStatus === builderInvalidComboStateStatuses.invalid) {
    return createInvalidComboStateFromReplay(replay, {
      gameId: "mkxl",
    });
  }

  return createStaleComboStateFromReplay(replay, {
    gameId: "mkxl",
  });
};
