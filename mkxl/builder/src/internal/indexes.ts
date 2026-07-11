import type {
  BuilderGraph,
  BuilderGraphEdge,
  BuilderGraphNode,
} from "@mk-combos/builder-core/graph/type";
import type { BuilderFrameWindow } from "@mk-combos/builder-core/transition/type";
import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import type {
  MkxlGraphEdge,
  MkxlGraphNode,
  MkxlStageGraphFragment,
  MkxlVariationGraph,
} from "@mk-combos/mkxl-data/graph/type";
import { mkxlStageGraphFragments, mkxlVariationGraphs } from "@mk-combos/mkxl-data/graph/value";
import type { MkxlMove } from "@mk-combos/mkxl-data/movelists/type";
import { mkxlMoves } from "@mk-combos/mkxl-data/movelists/value";
import { mkxlCharacters } from "@mk-combos/mkxl-data/roster/value";
import type { MkxlInteractable, MkxlStage } from "@mk-combos/mkxl-data/stages/type";
import { mkxlStages } from "@mk-combos/mkxl-data/stages/value";
import type { MkxlVariation } from "@mk-combos/mkxl-data/variations/type";
import { mkxlVariations } from "@mk-combos/mkxl-data/variations/value";

import type { MkxlBuilderContext } from "../context/type";
import { createMkxlBuilderMessage } from "./messages";

type LocalizedLabel = {
  EN?: string;
  UA?: string;
  default?: string;
  fallback?: string;
};

export type MkxlRuntimeEdgeKind = "move" | "interactable";

export type MkxlIndexedEdge = {
  kind: MkxlRuntimeEdgeKind;
  graphId: string;
  edge: MkxlGraphEdge;
  moveId: string;
};

type MkxlVariationRuntime = {
  characterId: string;
  variationId: string;
  graphs: readonly MkxlVariationGraph[];
  graphIds: readonly string[];
  startNodeIds: readonly string[];
  nodes: readonly MkxlGraphNode[];
  edges: readonly MkxlIndexedEdge[];
  edgesByFromNodeId: ReadonlyMap<string, readonly MkxlIndexedEdge[]>;
};

export type MkxlBuilderContextResolution =
  | {
      ok: true;
      context: MkxlBuilderContext;
      runtime: MkxlVariationRuntime;
      stage?: MkxlStage;
      stageFragment?: MkxlStageGraphFragment;
    }
  | {
      ok: false;
      context: MkxlBuilderContext;
      reason: ValidationMessage;
    };

const contextKey = (characterId: string, variationId: string) =>
  `${characterId}\u0000${variationId}`;

const charactersById = new Map<string, (typeof mkxlCharacters)[number]>();

for (const character of mkxlCharacters) {
  charactersById.set(character.id, character);
}

const variationsById = new Map<string, MkxlVariation>();

for (const variation of mkxlVariations) {
  variationsById.set(variation.id, variation);
}

const movesById = new Map<string, MkxlMove>();

for (const move of mkxlMoves) {
  movesById.set(move.id, move);
}

const stagesById = new Map<string, MkxlStage>();

const interactablesById = new Map<string, MkxlInteractable>();

for (const stage of mkxlStages) {
  stagesById.set(stage.id, stage);
  for (const interactable of stage.interactables) {
    interactablesById.set(interactable.id, interactable);
  }
}

const stageFragmentsByStageId = new Map<string, MkxlStageGraphFragment>();

for (const fragment of mkxlStageGraphFragments) {
  stageFragmentsByStageId.set(fragment.stageId, fragment);
}

const graphBucketsByContext = new Map<string, MkxlVariationGraph[]>();

for (const graph of mkxlVariationGraphs) {
  const key = contextKey(graph.characterId, graph.variationId);
  const graphs = graphBucketsByContext.get(key);

  if (graphs) {
    graphs.push(graph);
  } else {
    graphBucketsByContext.set(key, [graph]);
  }
}

const toReadableLabel = (label: LocalizedLabel | undefined, fallback: string): string =>
  label?.EN ?? label?.UA ?? label?.default ?? label?.fallback ?? fallback;

const uniqueStrings = (values: readonly string[]): readonly string[] => {
  const seen = new Set<string>();
  const uniqueValues: string[] = [];

  for (const value of values) {
    if (seen.has(value)) {
      continue;
    }

    seen.add(value);
    uniqueValues.push(value);
  }

  return uniqueValues;
};

const indexedEdgeFromGraphEdge = (
  graphId: string,
  edge: MkxlGraphEdge,
): MkxlIndexedEdge | undefined => {
  if (edge.moveId) {
    return {
      kind: "move",
      graphId,
      edge,
      moveId: edge.moveId,
    };
  }

  if (edge.interactableId) {
    return {
      kind: "interactable",
      graphId,
      edge,
      moveId: edge.interactableId,
    };
  }

  return undefined;
};

const createVariationRuntime = (
  characterId: string,
  variationId: string,
  graphs: readonly MkxlVariationGraph[],
): MkxlVariationRuntime => {
  const graphIds: string[] = [];
  const startNodeIds: string[] = [];
  const nodesById = new Map<string, MkxlGraphNode>();
  const edges: MkxlIndexedEdge[] = [];
  const mutableEdgesByFromNodeId = new Map<string, MkxlIndexedEdge[]>();

  for (const graph of graphs) {
    graphIds.push(graph.id);
    startNodeIds.push(graph.startNodeId);

    for (const node of graph.nodes) {
      if (!nodesById.has(node.id)) {
        nodesById.set(node.id, node);
      }
    }

    for (const edge of graph.edges) {
      const indexedEdge = indexedEdgeFromGraphEdge(graph.id, edge);

      if (!indexedEdge) {
        continue;
      }

      edges.push(indexedEdge);

      const fromNodeEdges = mutableEdgesByFromNodeId.get(edge.fromNodeId);

      if (fromNodeEdges) {
        fromNodeEdges.push(indexedEdge);
      } else {
        mutableEdgesByFromNodeId.set(edge.fromNodeId, [indexedEdge]);
      }
    }
  }

  const edgesByFromNodeId = new Map<string, readonly MkxlIndexedEdge[]>();

  for (const [nodeId, nodeEdges] of mutableEdgesByFromNodeId) {
    edgesByFromNodeId.set(nodeId, nodeEdges);
  }

  return {
    characterId,
    variationId,
    graphs,
    graphIds,
    startNodeIds: uniqueStrings(startNodeIds),
    nodes: [...nodesById.values()],
    edges,
    edgesByFromNodeId,
  };
};

const variationRuntimeByContext = new Map<string, MkxlVariationRuntime>();

for (const [key, graphs] of graphBucketsByContext) {
  const firstGraph = graphs[0];

  if (!firstGraph) {
    continue;
  }

  variationRuntimeByContext.set(
    key,
    createVariationRuntime(firstGraph.characterId, firstGraph.variationId, graphs),
  );
}

const metadataSource = (sourceIds: readonly string[], tags: readonly string[]) => ({
  sourceIds,
  tags,
});

export const getMkxlMove = (moveId: string): MkxlMove | undefined => movesById.get(moveId);

export const getMkxlInteractable = (interactableId: string): MkxlInteractable | undefined =>
  interactablesById.get(interactableId);

export const getMkxlFrameWindow = (edge: MkxlGraphEdge): BuilderFrameWindow | undefined =>
  edge.frameWindow
    ? {
        start: edge.frameWindow.start,
        end: edge.frameWindow.end,
        kind: edge.frameWindow.kind,
      }
    : undefined;

export const resolveMkxlBuilderContext = (
  context: MkxlBuilderContext,
): MkxlBuilderContextResolution => {
  if (!charactersById.has(context.characterId)) {
    return {
      ok: false,
      context,
      reason: createMkxlBuilderMessage(
        "mkxl.builder.invalid_context",
        "Character context does not exist in MKXL data.",
        ["characterId"],
      ),
    };
  }

  const variation = variationsById.get(context.variationId);

  if (!variation || variation.characterId !== context.characterId) {
    return {
      ok: false,
      context,
      reason: createMkxlBuilderMessage(
        "mkxl.builder.invalid_context",
        "Variation context is not valid for character.",
        ["variationId"],
      ),
    };
  }

  const runtime = variationRuntimeByContext.get(
    contextKey(context.characterId, context.variationId),
  );

  if (!runtime) {
    return {
      ok: false,
      context,
      reason: createMkxlBuilderMessage(
        "mkxl.builder.graph_missing",
        "Variation context has no MKXL builder graph.",
        ["variationId"],
      ),
    };
  }

  if (!context.stageId) {
    return {
      ok: true,
      context,
      runtime,
    };
  }

  const stage = stagesById.get(context.stageId);

  if (!stage) {
    return {
      ok: false,
      context,
      reason: createMkxlBuilderMessage(
        "mkxl.builder.invalid_context",
        "Stage context does not exist in MKXL data.",
        ["stageId"],
      ),
    };
  }

  return {
    ok: true,
    context,
    runtime,
    stage,
    stageFragment: stageFragmentsByStageId.get(stage.id),
  };
};

const toCoreNode = (node: MkxlGraphNode): BuilderGraphNode => ({
  id: node.id,
  kind: node.kind,
  label: toReadableLabel(node.label, node.id),
  metadata: {
    mkxlKind: node.kind,
  },
});

const toCoreEdge = (indexedEdge: MkxlIndexedEdge): BuilderGraphEdge => {
  const move = movesById.get(indexedEdge.moveId);
  const interactable = interactablesById.get(indexedEdge.moveId);
  const label =
    (move?.label ?? interactable?.label)
      ? toReadableLabel(move?.label ?? interactable?.label, indexedEdge.moveId)
      : indexedEdge.moveId;

  return {
    id: indexedEdge.edge.id,
    fromNodeId: indexedEdge.edge.fromNodeId,
    toNodeId: indexedEdge.edge.toNodeId,
    moveId: indexedEdge.moveId,
    kind: indexedEdge.kind,
    label,
    metadata: {
      ...metadataSource(indexedEdge.edge.sourceIds, indexedEdge.edge.tags),
      graphId: indexedEdge.graphId,
      interactableId: indexedEdge.edge.interactableId,
      moveId: indexedEdge.edge.moveId,
    },
  };
};

export const composeCoreMkxlBuilderGraph = (context: MkxlBuilderContext): BuilderGraph => {
  const resolution = resolveMkxlBuilderContext(context);

  if (!resolution.ok) {
    return {
      nodes: [],
      edges: [],
      metadata: {
        gameId: "mkxl",
        characterId: context.characterId,
        variationId: context.variationId,
        stageId: context.stageId,
        reason: resolution.reason,
      },
    };
  }

  const nodesById = new Map<string, BuilderGraphNode>();
  const edgesById = new Map<string, BuilderGraphEdge>();

  for (const node of resolution.runtime.nodes) {
    nodesById.set(node.id, toCoreNode(node));
  }
  for (const edge of resolution.runtime.edges) {
    edgesById.set(edge.edge.id, toCoreEdge(edge));
  }

  if (resolution.stageFragment) {
    for (const node of resolution.stageFragment.nodes) {
      nodesById.set(node.id, toCoreNode(node));
    }
    for (const edge of resolution.stageFragment.edges) {
      const indexedEdge = indexedEdgeFromGraphEdge(resolution.stageFragment.id, edge);

      if (indexedEdge) {
        edgesById.set(edge.id, toCoreEdge(indexedEdge));
      }
    }
  }

  return {
    nodes: [...nodesById.values()],
    edges: [...edgesById.values()],
    startNodeId: resolution.runtime.startNodeIds[0],
    metadata: {
      gameId: "mkxl",
      characterId: context.characterId,
      variationId: context.variationId,
      stageId: context.stageId,
      graphIds: resolution.runtime.graphIds,
      stageGraphFragmentId: resolution.stageFragment?.id,
    },
  };
};
