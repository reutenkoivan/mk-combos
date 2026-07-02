import type {
  BuilderTransitionAccepted,
  BuilderTransitionCandidate,
  BuilderTransitionEffect,
  BuilderTransitionRejected,
} from "./type";

export function acceptTransition(input: {
  candidate: BuilderTransitionCandidate;
  step: BuilderTransitionAccepted["step"];
  fromRuntime?: BuilderTransitionAccepted["fromRuntime"];
  toRuntime: BuilderTransitionAccepted["toRuntime"];
  effects?: readonly BuilderTransitionEffect[];
  metadata?: BuilderTransitionAccepted["metadata"];
}): BuilderTransitionAccepted {
  const result: BuilderTransitionAccepted = {
    ok: true,
    status: "accepted",
    candidate: input.candidate,
    step: input.step,
    toRuntime: input.toRuntime,
  };

  if (input.fromRuntime !== undefined) {
    result.fromRuntime = input.fromRuntime;
  }
  if (input.effects !== undefined) {
    result.effects = input.effects;
  }
  if (input.metadata !== undefined) {
    result.metadata = input.metadata;
  }

  return result;
}

export function rejectTransition(input: {
  attemptedMoveId: BuilderTransitionRejected["attemptedMoveId"];
  edgeId?: BuilderTransitionRejected["edgeId"];
  fromRuntime?: BuilderTransitionRejected["fromRuntime"];
  reason: BuilderTransitionRejected["reason"];
  metadata?: BuilderTransitionRejected["metadata"];
}): BuilderTransitionRejected {
  const result: BuilderTransitionRejected = {
    ok: false,
    status: "rejected",
    attemptedMoveId: input.attemptedMoveId,
    reason: input.reason,
  };

  if (input.edgeId !== undefined) {
    result.edgeId = input.edgeId;
  }
  if (input.fromRuntime !== undefined) {
    result.fromRuntime = input.fromRuntime;
  }
  if (input.metadata !== undefined) {
    result.metadata = input.metadata;
  }

  return result;
}
