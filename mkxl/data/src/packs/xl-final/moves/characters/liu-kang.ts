import type { MkxlAuthoredCharacterMoves } from "../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../character-ids";
import { mkxlXlFinalInputNotationValues as fgcNotation } from "../../notation";

const characterId = characterIds.liuKang;

export const liuKangMoves = {
  sourcePath: "characters/liu-kang.ts",
  characterId,
  sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
  universal: {
    openingAssault: {
      id: `${characterId}:opening-assault`,
      characterId,
      label: {
        EN: "Opening Assault",
        fallback: "Opening Assault",
      },
      notation: [fgcNotation.one, fgcNotation.one, fgcNotation.two],
      category: "string",
      availability: {
        kind: "universal",
      },
      tags: ["starter", "standing"],
      sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
    },
    risingAssault: {
      id: `${characterId}:rising-assault`,
      characterId,
      label: {
        EN: "Rising Assault",
        fallback: "Rising Assault",
      },
      notation: [fgcNotation.forward, fgcNotation.two],
      category: "normal",
      availability: {
        kind: "universal",
      },
      tags: ["juggle", "standing"],
      sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
    },
    closingStrike: {
      id: `${characterId}:closing-strike`,
      characterId,
      label: {
        EN: "Closing Strike",
        fallback: "Closing Strike",
      },
      notation: [fgcNotation.back, fgcNotation.forward, fgcNotation.four],
      category: "special",
      availability: {
        kind: "universal",
      },
      tags: ["cashout", "special"],
      sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
    },
    closingStrikeEnhanced: {
      id: `${characterId}:closing-strike-enhanced`,
      characterId,
      label: {
        EN: "Closing Strike Enhanced",
        fallback: "Closing Strike Enhanced",
      },
      notation: [fgcNotation.back, fgcNotation.forward, fgcNotation.four, fgcNotation.amplify],
      category: "enhanced",
      availability: {
        kind: "universal",
      },
      meterCost: 1,
      tags: ["cashout", "meter"],
      sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
    },
  },
  variations: {
    dualist: {
      dualistTechnique: {
        id: `${characterId}:dualist:dualist-technique`,
        characterId,
        label: {
          EN: "Dualist Technique",
          fallback: "Dualist Technique",
        },
        notation: [fgcNotation.down, fgcNotation.back, fgcNotation.one],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:dualist`],
        },
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
    flameFist: {
      flameFistTechnique: {
        id: `${characterId}:flame-fist:flame-fist-technique`,
        characterId,
        label: {
          EN: "Flame Fist Technique",
          fallback: "Flame Fist Technique",
        },
        notation: [fgcNotation.back, fgcNotation.forward, fgcNotation.two],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:flame-fist`],
        },
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
    dragonsFire: {
      dragonsFireTechnique: {
        id: `${characterId}:dragons-fire:dragons-fire-technique`,
        characterId,
        label: {
          EN: "Dragon's Fire Technique",
          fallback: "Dragon's Fire Technique",
        },
        notation: [fgcNotation.down, fgcNotation.forward, fgcNotation.three],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:dragons-fire`],
        },
        meterGain: 1,
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
  },
} as const satisfies MkxlAuthoredCharacterMoves;
