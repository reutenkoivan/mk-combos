import { BuilderGraphSchema } from "@mk-combos/builder-core/graph/schema";
import type { BuilderGraph } from "@mk-combos/builder-core/graph/type";
import type { BuilderRuntimeSnapshot } from "@mk-combos/builder-core/runtime/type";

import { MkxlBuilderContextSchema } from "../context/schema";
import type { MkxlBuilderContext } from "../context/type";
import { composeCoreMkxlBuilderGraph } from "../internal/indexes";
import { getMkxlValidNextChoices } from "../internal/transitions";
import type { MkxlBuilderMoveChoices } from "./type";

export const composeMkxlBuilderGraph = (context: MkxlBuilderContext): BuilderGraph => {
  const graph = composeCoreMkxlBuilderGraph(MkxlBuilderContextSchema.parse(context));

  return BuilderGraphSchema.parse(graph);
};

export const getMkxlBuilderValidNextMoves = (input: {
  context: MkxlBuilderContext;
  runtime?: BuilderRuntimeSnapshot;
}): MkxlBuilderMoveChoices => getMkxlValidNextChoices(input);
