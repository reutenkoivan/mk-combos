import { BuilderGraphSchema } from "@mk-combos/builder-core/graph/schema";
import type { BuilderGraph } from "@mk-combos/builder-core/graph/type";
import type { BuilderRuntimeSnapshot } from "@mk-combos/builder-core/runtime/type";

import { Mk1BuilderContextSchema } from "../context/schema";
import type { Mk1BuilderContext } from "../context/type";
import { composeCoreMk1BuilderGraph } from "../internal/indexes";
import { getMk1ValidNextChoices } from "../internal/transitions";
import type { Mk1BuilderMoveChoices } from "./type";

export const composeMk1BuilderGraph = (context: Mk1BuilderContext): BuilderGraph => {
  const graph = composeCoreMk1BuilderGraph(Mk1BuilderContextSchema.parse(context));

  return BuilderGraphSchema.parse(graph);
};

export const getMk1BuilderValidNextMoves = (input: {
  context: Mk1BuilderContext;
  runtime?: BuilderRuntimeSnapshot;
}): Mk1BuilderMoveChoices => getMk1ValidNextChoices(input);
