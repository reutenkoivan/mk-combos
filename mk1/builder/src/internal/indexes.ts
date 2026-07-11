import type {
  BuilderGraph,
  BuilderGraphEdge,
  BuilderGraphNode,
} from "@mk-combos/builder-core/graph/type";
import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import type { Mk1GraphEdge } from "@mk-combos/mk1-data/graph/type";
import { mk1CharacterGraphs, mk1KameoGraphOverlays } from "@mk-combos/mk1-data/graph/value";
import { mk1Kameos } from "@mk-combos/mk1-data/kameos/value";
import type { Mk1Move } from "@mk-combos/mk1-data/movelists/type";
import { mk1Moves } from "@mk-combos/mk1-data/movelists/value";
import { mk1Characters } from "@mk-combos/mk1-data/roster/value";

import type { Mk1BuilderContext } from "../context/type";
import { createMk1BuilderMessage } from "./messages";

type LocalizedLabel = {
  EN?: string;
  UA?: string;
  default?: string;
  fallback?: string;
};

export type Mk1RuntimeEdgeKind = "move" | "kameo";

export type Mk1IndexedEdge = {
  kind: Mk1RuntimeEdgeKind;
  graphId: string;
  edge: Mk1GraphEdge;
  moveId: string;
};

type Mk1PairRuntime = {
  characterId: string;
  kameoId: string;
  graphIds: readonly string[];
  startNodeIds: readonly string[];
  nodes: readonly BuilderGraphNode[];
  edges: readonly Mk1IndexedEdge[];
  edgesByFromNodeId: ReadonlyMap<string, readonly Mk1IndexedEdge[]>;
};

export type Mk1BuilderContextResolution =
  | {
      ok: true;
      context: Mk1BuilderContext;
      runtime: Mk1PairRuntime;
    }
  | {
      ok: false;
      context: Mk1BuilderContext;
      reason: ValidationMessage;
    };

const charactersById = new Map(mk1Characters.map((character) => [character.id, character]));
const kameosById = new Map(mk1Kameos.map((kameo) => [kameo.id, kameo]));
const movesById = new Map<string, Mk1Move>(mk1Moves.map((move) => [move.id, move]));
const characterGraphsByCharacterId = new Map(
  mk1CharacterGraphs.map((graph) => [graph.characterId, graph]),
);
const overlaysByPairKey = new Map(
  mk1KameoGraphOverlays.map((overlay) => [
    `${overlay.characterId}\u0000${overlay.kameoId}`,
    overlay,
  ]),
);

const toReadableLabel = (value: LocalizedLabel | undefined, fallback: string): string =>
  value?.EN ?? value?.UA ?? value?.default ?? value?.fallback ?? fallback;

const isKameoMove = (moveId: string): boolean => {
  const move = movesById.get(moveId);

  return move?.ownerKind === "kameo";
};

const toCoreNode = (node: {
  readonly id: string;
  readonly kind: "start" | "move" | "kameo" | "end";
  readonly label: LocalizedLabel;
}): BuilderGraphNode => ({
  id: node.id,
  kind: node.kind,
  label: toReadableLabel(node.label, node.id),
  metadata: {
    mk1Kind: node.kind,
  },
});

const indexedEdgeFromGraphEdge = (graphId: string, edge: Mk1GraphEdge): Mk1IndexedEdge => ({
  kind: isKameoMove(edge.moveId) ? "kameo" : "move",
  graphId,
  edge,
  moveId: edge.moveId,
});

const createPairRuntime = (context: Mk1BuilderContext): Mk1PairRuntime | undefined => {
  const graph = characterGraphsByCharacterId.get(context.characterId);
  const overlay = overlaysByPairKey.get(`${context.characterId}\u0000${context.kameoId}`);

  if (!graph || !overlay) {
    return undefined;
  }

  const nodesById = new Map<string, BuilderGraphNode>();
  const indexedEdges: Mk1IndexedEdge[] = [];
  const mutableEdgesByFromNodeId = new Map<string, Mk1IndexedEdge[]>();

  for (const node of graph.nodes) {
    nodesById.set(node.id, toCoreNode(node));
  }
  for (const node of overlay.nodes) {
    nodesById.set(node.id, toCoreNode(node));
  }
  for (const edge of [...graph.edges, ...overlay.edges]) {
    const graphId = graph.edges.includes(edge) ? graph.id : overlay.id;
    const indexedEdge = indexedEdgeFromGraphEdge(graphId, edge);
    indexedEdges.push(indexedEdge);
    const fromNodeEdges = mutableEdgesByFromNodeId.get(edge.fromNodeId);

    if (fromNodeEdges) {
      fromNodeEdges.push(indexedEdge);
    } else {
      mutableEdgesByFromNodeId.set(edge.fromNodeId, [indexedEdge]);
    }
  }

  const edgesByFromNodeId = new Map<string, readonly Mk1IndexedEdge[]>();

  for (const [nodeId, edges] of mutableEdgesByFromNodeId) {
    edgesByFromNodeId.set(nodeId, edges);
  }

  return {
    characterId: context.characterId,
    kameoId: context.kameoId,
    graphIds: [graph.id, overlay.id],
    startNodeIds: [graph.startNodeId],
    nodes: [...nodesById.values()],
    edges: indexedEdges,
    edgesByFromNodeId,
  };
};

const toCoreEdge = (indexedEdge: Mk1IndexedEdge): BuilderGraphEdge => {
  const move = movesById.get(indexedEdge.moveId);

  return {
    id: indexedEdge.edge.id,
    fromNodeId: indexedEdge.edge.fromNodeId,
    toNodeId: indexedEdge.edge.toNodeId,
    moveId: indexedEdge.moveId,
    kind: indexedEdge.kind,
    label: toReadableLabel(move?.label, indexedEdge.moveId),
    metadata: {
      graphId: indexedEdge.graphId,
      kind: indexedEdge.kind,
      sourceIds: indexedEdge.edge.sourceIds,
      tags: indexedEdge.edge.tags,
      kameoCost: indexedEdge.edge.kameoCost,
    },
  };
};

export const getMk1Move = (moveId: string): Mk1Move | undefined => movesById.get(moveId);

export const resolveMk1BuilderContext = (
  context: Mk1BuilderContext,
): Mk1BuilderContextResolution => {
  if (!charactersById.has(context.characterId)) {
    return {
      ok: false,
      context,
      reason: createMk1BuilderMessage(
        "mk1.builder.invalid_context",
        "Character context does not exist in MK1 data.",
        ["characterId"],
      ),
    };
  }
  if (!kameosById.has(context.kameoId)) {
    return {
      ok: false,
      context,
      reason: createMk1BuilderMessage(
        "mk1.builder.invalid_context",
        "Kameo context does not exist in MK1 data.",
        ["kameoId"],
      ),
    };
  }

  const runtime = createPairRuntime(context);

  if (!runtime) {
    return {
      ok: false,
      context,
      reason: createMk1BuilderMessage(
        "mk1.builder.graph_missing",
        "MK1 character and kameo context has no builder graph.",
        ["kameoId"],
      ),
    };
  }

  return {
    ok: true,
    context,
    runtime,
  };
};

export const composeCoreMk1BuilderGraph = (context: Mk1BuilderContext): BuilderGraph => {
  const resolution = resolveMk1BuilderContext(context);

  if (!resolution.ok) {
    return {
      nodes: [],
      edges: [],
      metadata: {
        gameId: "mk1",
        characterId: context.characterId,
        kameoId: context.kameoId,
        reason: resolution.reason,
      },
    };
  }

  return {
    nodes: resolution.runtime.nodes,
    edges: resolution.runtime.edges.map(toCoreEdge),
    startNodeId: resolution.runtime.startNodeIds[0],
    metadata: {
      gameId: "mk1",
      characterId: context.characterId,
      kameoId: context.kameoId,
      graphIds: resolution.runtime.graphIds,
    },
  };
};
