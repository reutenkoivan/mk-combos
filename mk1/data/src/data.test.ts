import { mk1SeededCombos } from "@mk-combos/mk1-data/combos/value";
import { validateMk1Data } from "@mk-combos/mk1-data/coverage/runtime";
import { mk1CoverageTargets } from "@mk-combos/mk1-data/coverage/value";
import { mk1CharacterGraphs, mk1KameoGraphOverlays } from "@mk-combos/mk1-data/graph/value";
import { mk1Kameos } from "@mk-combos/mk1-data/kameos/value";
import { mk1Movelists, mk1MoveNotationValues, mk1Moves } from "@mk-combos/mk1-data/movelists/value";
import { mk1Characters } from "@mk-combos/mk1-data/roster/value";
import { describe, expect, it } from "vitest";

describe("MK1 seeded data", () => {
  it("passes source, coverage, and reference validation", () => {
    const result = validateMk1Data();

    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.counts.characters).toBe(mk1CoverageTargets.expectedCharacterCount);
    expect(result.counts.kameos).toBe(mk1CoverageTargets.expectedKameoCount);
    expect(result.counts.combos).toBe(mk1CoverageTargets.expectedPairComboCount);
  });

  it("covers every main fighter and kameo pair with a seeded combo", () => {
    const pairKeys = new Set(
      mk1SeededCombos.map((combo) => `${combo.characterId}:${combo.kameoId}`),
    );

    expect(pairKeys.size).toBe(mk1Characters.length * mk1Kameos.length);
    for (const character of mk1Characters) {
      for (const kameo of mk1Kameos) {
        expect(pairKeys.has(`${character.id}:${kameo.id}`)).toBe(true);
      }
    }
  });

  it("keeps combo routes derived from move notation", () => {
    const movesById = new Map(mk1Moves.map((move) => [move.id, move]));
    const notationValues = new Set(Object.values(mk1MoveNotationValues));

    for (const combo of mk1SeededCombos) {
      const expectedMovePath: string[] = [];
      const expectedNotation = [];

      for (const step of combo.route) {
        const move = movesById.get(step.moveId);

        expect(move).toBeDefined();
        if (!move) {
          continue;
        }

        expectedMovePath.push(move.id);
        expectedNotation.push(move.notation);
      }

      expect(combo.movePath).toEqual(expectedMovePath);
      expect(combo.notation).toEqual(expectedNotation);
      for (const notation of combo.notation) {
        for (const value of notation) {
          expect(notationValues.has(value)).toBe(true);
        }
      }
    }
  });

  it("keeps selector layout data on main roster and kameos", () => {
    for (const character of mk1Characters) {
      expect(character.pickerSlot.optionId).toBe(character.id);
      expect(character.pickerSlot.status).toBe("selectable");
    }
    for (const kameo of mk1Kameos) {
      expect(kameo.pickerSlot.optionId).toBe(kameo.id);
      expect(kameo.pickerSlot.status).toBe("selectable");
    }
  });

  it("keeps character graphs and selected-kameo overlays separate", () => {
    expect(mk1CharacterGraphs).toHaveLength(mk1Characters.length);
    expect(mk1KameoGraphOverlays).toHaveLength(mk1Characters.length * mk1Kameos.length);
    for (const graph of mk1CharacterGraphs) {
      expect(graph.edges.some((edge) => edge.tags.includes("kameo"))).toBe(false);
    }
    for (const overlay of mk1KameoGraphOverlays) {
      expect(overlay.edges.every((edge) => edge.tags.includes("kameo"))).toBe(true);
    }
  });

  it("keeps movelists available for every main fighter and kameo", () => {
    const ownerIds = new Set(mk1Movelists.map((movelist) => movelist.ownerId));

    for (const character of mk1Characters) {
      expect(ownerIds.has(character.id)).toBe(true);
    }
    for (const kameo of mk1Kameos) {
      expect(ownerIds.has(kameo.id)).toBe(true);
    }
  });
});
