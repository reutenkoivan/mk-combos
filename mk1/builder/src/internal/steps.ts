import { BuilderPathStepSchema } from "@mk-combos/builder-core/graph/schema";
import type { BuilderMovePath, BuilderPathStep } from "@mk-combos/builder-core/graph/type";

export const createMk1BuilderPathStepFromInput = (input: {
  moveId: string;
  index: number;
  edgeId?: string;
  nodeId?: string;
  label?: string;
}): BuilderPathStep =>
  BuilderPathStepSchema.parse({
    id: `step-${input.index}-${input.moveId}`,
    moveId: input.moveId,
    edgeId: input.edgeId,
    nodeId: input.nodeId,
    label: input.label ?? input.moveId,
  });

export const createMk1BuilderMovePathFromIds = (moveIds: readonly string[]): BuilderMovePath =>
  moveIds.map((moveId, index) => createMk1BuilderPathStepFromInput({ moveId, index }));

export const mergeMk1BuilderStep = (
  step: BuilderPathStep | undefined,
  fallbackStep: BuilderPathStep,
): BuilderPathStep => BuilderPathStepSchema.parse(step ?? fallbackStep);
