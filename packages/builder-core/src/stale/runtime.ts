import type { BuilderReplayInvalid } from "../replay/type";
import type {
  BuilderComboFreshState,
  BuilderComboInvalidState,
  BuilderComboStaleState,
} from "./type";

export function createFreshComboState(input: {
  currentPath: BuilderComboFreshState["currentPath"];
  replay?: BuilderComboFreshState["replay"];
  metadata?: BuilderComboFreshState["metadata"];
}): BuilderComboFreshState {
  const result: BuilderComboFreshState = {
    ok: true,
    status: "fresh",
    currentPath: input.currentPath,
  };

  if (input.replay !== undefined) {
    result.replay = input.replay;
  }
  if (input.metadata !== undefined) {
    result.metadata = input.metadata;
  }

  return result;
}

export function createStaleComboState(input: {
  originalPath: BuilderComboStaleState["originalPath"];
  validPrefix: BuilderComboStaleState["validPrefix"];
  invalidTail: BuilderComboStaleState["invalidTail"];
  invalidBoundary: BuilderComboStaleState["invalidBoundary"];
  reason: BuilderComboStaleState["reason"];
  replay?: BuilderComboStaleState["replay"];
  metadata?: BuilderComboStaleState["metadata"];
}): BuilderComboStaleState {
  const result: BuilderComboStaleState = {
    ok: false,
    status: "stale",
    originalPath: input.originalPath,
    validPrefix: input.validPrefix,
    invalidTail: input.invalidTail,
    invalidBoundary: input.invalidBoundary,
    reason: input.reason,
  };

  if (input.replay !== undefined) {
    result.replay = input.replay;
  }
  if (input.metadata !== undefined) {
    result.metadata = input.metadata;
  }

  return result;
}

export function createInvalidComboState(input: {
  originalPath: BuilderComboInvalidState["originalPath"];
  validPrefix: BuilderComboInvalidState["validPrefix"];
  invalidTail: BuilderComboInvalidState["invalidTail"];
  invalidBoundary: BuilderComboInvalidState["invalidBoundary"];
  reason: BuilderComboInvalidState["reason"];
  replay?: BuilderComboInvalidState["replay"];
  metadata?: BuilderComboInvalidState["metadata"];
}): BuilderComboInvalidState {
  const result: BuilderComboInvalidState = {
    ok: false,
    status: "invalid",
    originalPath: input.originalPath,
    validPrefix: input.validPrefix,
    invalidTail: input.invalidTail,
    invalidBoundary: input.invalidBoundary,
    reason: input.reason,
  };

  if (input.replay !== undefined) {
    result.replay = input.replay;
  }
  if (input.metadata !== undefined) {
    result.metadata = input.metadata;
  }

  return result;
}

export function createStaleComboStateFromReplay(
  replay: BuilderReplayInvalid,
  metadata?: BuilderComboStaleState["metadata"],
): BuilderComboStaleState {
  return createStaleComboState({
    originalPath: replay.originalPath,
    validPrefix: replay.validPrefix,
    invalidTail: replay.invalidTail,
    invalidBoundary: replay.invalidBoundary,
    reason: replay.reason,
    replay,
    metadata,
  });
}

export function createInvalidComboStateFromReplay(
  replay: BuilderReplayInvalid,
  metadata?: BuilderComboInvalidState["metadata"],
): BuilderComboInvalidState {
  return createInvalidComboState({
    originalPath: replay.originalPath,
    validPrefix: replay.validPrefix,
    invalidTail: replay.invalidTail,
    invalidBoundary: replay.invalidBoundary,
    reason: replay.reason,
    replay,
    metadata,
  });
}
