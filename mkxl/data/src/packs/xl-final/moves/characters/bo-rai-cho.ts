import type { MkxlAuthoredCharacterMoves } from "../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../character-ids";
import { mkxlXlFinalInputNotationValues as fgcNotation } from "../../notation";

const characterId = characterIds.boRaiCho;

export const boRaiChoMoves = {
  sourcePath: "characters/bo-rai-cho.ts",
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
    bartitsu: {
      bartitsuTechnique: {
        id: `${characterId}:bartitsu:bartitsu-technique`,
        characterId,
        label: {
          EN: "Bartitsu Technique",
          fallback: "Bartitsu Technique",
        },
        notation: [fgcNotation.down, fgcNotation.back, fgcNotation.one],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:bartitsu`],
        },
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
    dragonBreath: {
      dragonBreathTechnique: {
        id: `${characterId}:dragon-breath:dragon-breath-technique`,
        characterId,
        label: {
          EN: "Dragon Breath Technique",
          fallback: "Dragon Breath Technique",
        },
        notation: [fgcNotation.back, fgcNotation.forward, fgcNotation.two],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:dragon-breath`],
        },
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
    drunkenMaster: {
      drunkenMasterTechnique: {
        id: `${characterId}:drunken-master:drunken-master-technique`,
        characterId,
        label: {
          EN: "Drunken Master Technique",
          fallback: "Drunken Master Technique",
        },
        notation: [fgcNotation.down, fgcNotation.forward, fgcNotation.three],
        category: "variation",
        availability: {
          kind: "variation",
          variationIds: [`${characterId}:drunken-master`],
        },
        meterGain: 1,
        tags: ["variation", "branch-specific"],
        sourceIds: ["mkwarehouse-mkx", "in-game-practice-mode"],
      },
    },
  },
} as const satisfies MkxlAuthoredCharacterMoves;
