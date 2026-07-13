import type { MkxlAuthoredCharacterMoves } from "../../../type";
import { mkxlXlFinalInputNotationValues as fgcNotation } from "../../notation";

const characterId = "general";

export const mkxlXlFinalGeneralMoves = {
  sourcePath: "characters/general.ts",
  characterId,
  sourceIds: ["in-game-practice-mode"],
  universal: {
    run: {
      id: `${characterId}:run`,
      characterId,
      label: {
        EN: "RUN",
        fallback: "RUN",
      },
      notation: [fgcNotation.forward, fgcNotation.forward, fgcNotation.block],
      category: "mechanic",
      availability: {
        kind: "universal",
      },
      tags: ["movement", "mechanic"],
      sourceIds: ["in-game-practice-mode"],
    },
    dash: {
      id: `${characterId}:dash`,
      characterId,
      label: {
        EN: "DASH",
        fallback: "DASH",
      },
      notation: [fgcNotation.forward, fgcNotation.forward],
      category: "mechanic",
      availability: {
        kind: "universal",
      },
      tags: ["movement", "mechanic"],
      sourceIds: ["in-game-practice-mode"],
    },
    xray: {
      id: `${characterId}:xray`,
      characterId,
      label: {
        EN: "XRAY",
        fallback: "XRAY",
      },
      notation: [fgcNotation.block, fgcNotation.stanceSwitch],
      category: "xray",
      availability: {
        kind: "universal",
      },
      tags: ["xray", "meter"],
      sourceIds: ["in-game-practice-mode"],
    },
  },
  variations: {},
} as const satisfies MkxlAuthoredCharacterMoves;
