import { mkxlSeededCombos } from "../combos/value";
import { mkxlMoves } from "../movelists/value";
import { toReadableEn } from "../shared/runtime";
import { mkxlStages } from "../stages/value";
import type { MkxlGraphEdge, MkxlStageGraphFragment, MkxlVariationGraph } from "./type";

export { mkxlGraphNodeKinds } from "./constants";

const stageGraphSourceIds = ["in-game-practice-mode"] as const;
const moveById = new Map<string, (typeof mkxlMoves)[number]>();

for (const move of mkxlMoves) {
  moveById.set(move.id, move);
}

const createRouteEdge = (
  comboId: string,
  fromNodeId: string,
  toNodeId: string,
  step: (typeof mkxlSeededCombos)[number]["route"][number],
  index: number,
  sourceIds: MkxlGraphEdge["sourceIds"],
): MkxlGraphEdge => ({
  id: `${comboId}:edge-${index + 1}`,
  fromNodeId,
  toNodeId,
  moveId: step.moveId,
  frameWindow: index === 0 ? undefined : { start: 0, end: 12, kind: "combo-link" },
  tags: moveById.get(step.moveId)?.tags ?? [],
  sourceIds,
});

const createVariationGraph = (combo: (typeof mkxlSeededCombos)[number]): MkxlVariationGraph => {
  const startNodeId = `${combo.variationId}:graph-start`;
  const endNodeId = `${combo.variationId}:graph-end`;
  const nodes: MkxlVariationGraph["nodes"][number][] = [
    { id: startNodeId, label: toReadableEn("Start"), kind: "start" },
  ];
  const edges: MkxlVariationGraph["edges"][number][] = [];
  let previousNodeId = startNodeId;

  for (const [index, step] of combo.route.entries()) {
    const nodeId = `${combo.id}:step-${index + 1}:node`;
    const routeEntry = moveById.get(step.moveId);

    nodes.push({
      id: nodeId,
      label: routeEntry?.label ?? toReadableEn(step.moveId),
      kind: "move",
    });
    edges.push(createRouteEdge(combo.id, previousNodeId, nodeId, step, index, combo.sourceIds));
    previousNodeId = nodeId;
  }

  nodes.push({ id: endNodeId, label: toReadableEn("End"), kind: "end" });

  return {
    id: `graph:${combo.id}`,
    characterId: combo.characterId,
    variationId: combo.variationId,
    startNodeId,
    nodes,
    edges,
    sourceIds: combo.sourceIds,
  };
};

const createStageGraphFragment = (stage: (typeof mkxlStages)[number]): MkxlStageGraphFragment => {
  const startNodeId = `${stage.id}:stage-start`;
  const nodes: MkxlStageGraphFragment["nodes"][number][] = [
    { id: startNodeId, label: toReadableEn("Stage start"), kind: "start" },
  ];
  const edges: MkxlStageGraphFragment["edges"][number][] = [];

  for (const interactable of stage.interactables) {
    const nodeId = `${interactable.id}:node`;

    nodes.push({
      id: nodeId,
      label: interactable.label,
      kind: "stageInteraction",
    });
    edges.push({
      id: `${interactable.id}:edge`,
      fromNodeId: startNodeId,
      toNodeId: nodeId,
      interactableId: interactable.id,
      tags: interactable.tags,
      sourceIds: stageGraphSourceIds,
    });
  }

  return {
    id: `stage-graph:${stage.id}`,
    stageId: stage.id,
    nodes,
    edges,
    sourceIds: stageGraphSourceIds,
  };
};

const collectVariationGraphIds = (graphs: readonly MkxlVariationGraph[]): readonly string[] => {
  const graphIds: string[] = [];

  for (const graph of graphs) {
    graphIds.push(graph.id);
  }

  return graphIds;
};

const collectStageGraphFragmentIds = (
  fragments: readonly MkxlStageGraphFragment[],
): readonly string[] => {
  const fragmentIds: string[] = [];

  for (const fragment of fragments) {
    fragmentIds.push(fragment.id);
  }

  return fragmentIds;
};

const createVariationGraphs = (): readonly MkxlVariationGraph[] => {
  const graphs: MkxlVariationGraph[] = [];

  for (const combo of mkxlSeededCombos) {
    graphs.push(createVariationGraph(combo));
  }

  return graphs;
};

const createStageGraphFragments = (): readonly MkxlStageGraphFragment[] => {
  const fragments: MkxlStageGraphFragment[] = [];

  for (const stage of mkxlStages) {
    fragments.push(createStageGraphFragment(stage));
  }

  return fragments;
};

export const mkxlVariationGraphs = createVariationGraphs();

export const mkxlStageGraphFragments = createStageGraphFragments();

export const mkxlVariationGraphIds = collectVariationGraphIds(mkxlVariationGraphs);

export const mkxlStageGraphFragmentIds = collectStageGraphFragmentIds(mkxlStageGraphFragments);
