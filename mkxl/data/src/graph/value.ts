import { mkxlSeededCombos } from "../combos/value";
import { toReadableEn } from "../shared/runtime";
import { mkxlStages } from "../stages/value";
import { mkxlTransitions } from "../transitions/value";
import type { MkxlGraphEdge, MkxlStageGraphFragment, MkxlVariationGraph } from "./type";

const stageGraphSourceIds = ["in-game-practice-mode"] as const;
const transitionById = new Map(mkxlTransitions.map((transition) => [transition.id, transition]));

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
  transitionId: step.transitionId,
  frameWindow: index === 0 ? undefined : { start: 0, end: 12, kind: "combo-link" },
  tags: transitionById.get(step.transitionId)?.tags ?? [],
  sourceIds,
});

export const mkxlVariationGraphs = mkxlSeededCombos.map((combo) => {
  const startNodeId = `${combo.variationId}:graph-start`;
  const pathNodeIds = combo.route.map((_step, index) => `${combo.id}:step-${index + 1}:node`);
  const endNodeId = `${combo.variationId}:graph-end`;
  const orderedNodeIds = [startNodeId, ...pathNodeIds, endNodeId];

  return {
    id: `graph:${combo.id}`,
    characterId: combo.characterId,
    variationId: combo.variationId,
    startNodeId,
    nodes: [
      { id: startNodeId, label: toReadableEn("Start"), kind: "start" },
      ...combo.route.map((step, index) => {
        const nodeId = pathNodeIds[index] ?? `${combo.id}:step-${index + 1}:node`;
        const routeEntry = transitionById.get(step.transitionId);

        return {
          id: nodeId,
          label: routeEntry?.label ?? toReadableEn(step.transitionId),
          kind: "transition" as const,
        };
      }),
      { id: endNodeId, label: toReadableEn("End"), kind: "end" },
    ],
    edges: combo.route.map((step, index) =>
      createRouteEdge(
        combo.id,
        orderedNodeIds[index] ?? startNodeId,
        orderedNodeIds[index + 1] ?? endNodeId,
        step,
        index,
        combo.sourceIds,
      ),
    ),
    sourceIds: combo.sourceIds,
  } satisfies MkxlVariationGraph;
}) as readonly MkxlVariationGraph[];

export const mkxlStageGraphFragments = mkxlStages.map((stage) => ({
  id: `stage-graph:${stage.id}`,
  stageId: stage.id,
  nodes: [
    { id: `${stage.id}:stage-start`, label: toReadableEn("Stage start"), kind: "start" },
    ...stage.interactables.map((interactable) => ({
      id: `${interactable.id}:node`,
      label: interactable.label,
      kind: "stageInteraction" as const,
    })),
  ],
  edges: stage.interactables.map((interactable) => ({
    id: `${interactable.id}:edge`,
    fromNodeId: `${stage.id}:stage-start`,
    toNodeId: `${interactable.id}:node`,
    interactableId: interactable.id,
    tags: interactable.tags,
    sourceIds: stageGraphSourceIds,
  })),
  sourceIds: stageGraphSourceIds,
})) as readonly MkxlStageGraphFragment[];

export const mkxlVariationGraphIds = mkxlVariationGraphs.map((graph) => graph.id);

export const mkxlStageGraphFragmentIds = mkxlStageGraphFragments.map((fragment) => fragment.id);
