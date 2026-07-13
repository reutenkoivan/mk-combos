import type { BuilderReplayInvalid, BuilderReplayValid } from "./type";
import { builderReplayStatuses } from "./value";

export function createValidReplay(input: {
  originalPath: BuilderReplayValid["originalPath"];
  acceptedPath?: BuilderReplayValid["acceptedPath"];
  finalRuntime: BuilderReplayValid["finalRuntime"];
  transitions: BuilderReplayValid["transitions"];
  metadata?: BuilderReplayValid["metadata"];
}): BuilderReplayValid {
  const result: BuilderReplayValid = {
    ok: true,
    status: builderReplayStatuses.valid,
    originalPath: input.originalPath,
    acceptedPath: input.acceptedPath ?? input.originalPath,
    finalRuntime: input.finalRuntime,
    transitions: input.transitions,
  };

  if (input.metadata !== undefined) {
    result.metadata = input.metadata;
  }

  return result;
}

export function createInvalidReplay(input: {
  originalPath: BuilderReplayInvalid["originalPath"];
  validPrefix: BuilderReplayInvalid["validPrefix"];
  invalidTail: BuilderReplayInvalid["invalidTail"];
  invalidBoundary: BuilderReplayInvalid["invalidBoundary"];
  reason: BuilderReplayInvalid["reason"];
  lastRuntime?: BuilderReplayInvalid["lastRuntime"];
  acceptedTransitions?: BuilderReplayInvalid["acceptedTransitions"];
  rejectedTransition?: BuilderReplayInvalid["rejectedTransition"];
  metadata?: BuilderReplayInvalid["metadata"];
}): BuilderReplayInvalid {
  const result: BuilderReplayInvalid = {
    ok: false,
    status: builderReplayStatuses.invalid,
    originalPath: input.originalPath,
    validPrefix: input.validPrefix,
    invalidTail: input.invalidTail,
    invalidBoundary: input.invalidBoundary,
    reason: input.reason,
  };

  if (input.lastRuntime !== undefined) {
    result.lastRuntime = input.lastRuntime;
  }
  if (input.acceptedTransitions !== undefined) {
    result.acceptedTransitions = input.acceptedTransitions;
  }
  if (input.rejectedTransition !== undefined) {
    result.rejectedTransition = input.rejectedTransition;
  }
  if (input.metadata !== undefined) {
    result.metadata = input.metadata;
  }

  return result;
}
