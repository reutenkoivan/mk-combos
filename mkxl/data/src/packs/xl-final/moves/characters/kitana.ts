import type { MkxlAuthoredCharacterMoves } from "../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../character-ids";
import { mkxlXlFinalInputNotationValues as fgcNotation } from "../../notation";

const characterId = characterIds.kitana;

export const kitanaMoves = {
  sourcePath: "characters/kitana.ts",
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
    mournful: {
      mournfulTechnique: {
        id: `${characterId}:mournful:mournful-technique`,
        characterId,
        label: {
          EN: "Mournful Technique",
          fallback: "Mournful Technique",
        },
        notation: [fgcNotation.down, fgcNotation.back, fgcNotation.one],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:mournful`],
        },
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
    royalStorm: {
      royalStormTechnique: {
        id: `${characterId}:royal-storm:royal-storm-technique`,
        characterId,
        label: {
          EN: "Royal Storm Technique",
          fallback: "Royal Storm Technique",
        },
        notation: [fgcNotation.back, fgcNotation.forward, fgcNotation.two],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:royal-storm`],
        },
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
    assassin: {
      assassinTechnique: {
        id: `${characterId}:assassin:assassin-technique`,
        characterId,
        label: {
          EN: "Assassin Technique",
          fallback: "Assassin Technique",
        },
        notation: [fgcNotation.down, fgcNotation.forward, fgcNotation.three],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:assassin`],
        },
        meterGain: 1,
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
  },
} as const satisfies MkxlAuthoredCharacterMoves;
