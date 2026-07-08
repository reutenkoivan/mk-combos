import type { MkxlDataSource, MkxlGame } from "../../game/type";

export const mkxlXlFinalDataSources = [
  {
    id: "mkwarehouse-mkx",
    label: "Mortal Kombat Warehouse MKX",
    url: "https://www.mortalkombatwarehouse.com/mkx/",
    kind: "reference",
  },
  {
    id: "wikipedia-mkx",
    label: "Mortal Kombat X Wikipedia",
    url: "https://en.wikipedia.org/wiki/Mortal_Kombat_X",
    kind: "crossCheck",
  },
  {
    id: "wikipedia-it-mkx-variations",
    label: "Italian Wikipedia Mortal Kombat X variation table",
    url: "https://it.wikipedia.org/wiki/Mortal_Kombat_X",
    kind: "crossCheck",
  },
  {
    id: "in-game-practice-mode",
    label: "In-game practice-mode verification",
    kind: "manualVerification",
  },
  {
    id: "community-combo-source",
    label: "Community combo source",
    kind: "communityComboSource",
  },
] as const satisfies readonly MkxlDataSource[];

export const mkxlXlFinalGame = {
  id: "mkxl",
  label: {
    EN: "Mortal Kombat XL",
    UA: "Mortal Kombat XL",
    fallback: "MKXL",
  },
  gameVersion: "XL-final",
  sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
} as const satisfies MkxlGame;
