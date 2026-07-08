import type { MkxlAuthoredCharacterMoves } from "../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../character-ids";
import { mkxlXlFinalFgcNotation as fgcNotation } from "../../notation";

const characterId = characterIds.ermac;

export const ermacMoves = {
  sourcePath: "characters/ermac.ts",
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
    spectral: {
      spectralTechnique: {
        id: `${characterId}:spectral:spectral-technique`,
        characterId,
        label: {
          EN: "Spectral Technique",
          fallback: "Spectral Technique",
        },
        notation: [fgcNotation.down, fgcNotation.back, fgcNotation.one],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:spectral`],
        },
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
    mystic: {
      mysticTechnique: {
        id: `${characterId}:mystic:mystic-technique`,
        characterId,
        label: {
          EN: "Mystic Technique",
          fallback: "Mystic Technique",
        },
        notation: [fgcNotation.back, fgcNotation.forward, fgcNotation.two],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:mystic`],
        },
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
    masterOfSouls: {
      masterOfSoulsTechnique: {
        id: `${characterId}:master-of-souls:master-of-souls-technique`,
        characterId,
        label: {
          EN: "Master of Souls Technique",
          fallback: "Master of Souls Technique",
        },
        notation: [fgcNotation.down, fgcNotation.forward, fgcNotation.three],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:master-of-souls`],
        },
        meterGain: 1,
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
  },
} as const satisfies MkxlAuthoredCharacterMoves;
