import type { MkxlStage } from "../../stages/type";

export const mkxlXlFinalStages = [
  {
    id: "crossroads",
    label: {
      EN: "Crossroads",
      fallback: "Crossroads",
    },
    zones: [
      {
        id: "crossroads:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "crossroads:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "crossroads:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "crossroads:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "crossroads:position-escape",
        stageId: "crossroads",
        label: {
          EN: "Crossroads position escape",
          fallback: "Crossroads position escape",
        },
        zoneId: "crossroads:mid",
        segmentId: "crossroads:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "crossroads:corner-attack",
        stageId: "crossroads",
        label: {
          EN: "Crossroads corner attack",
          fallback: "Crossroads corner attack",
        },
        zoneId: "crossroads:corner",
        segmentId: "crossroads:corner-wall",
        usagePolicy: "oncePerCombo",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "dead-woods",
    label: {
      EN: "Dead Woods",
      fallback: "Dead Woods",
    },
    zones: [
      {
        id: "dead-woods:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "dead-woods:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "dead-woods:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "dead-woods:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "dead-woods:position-escape",
        stageId: "dead-woods",
        label: {
          EN: "Dead Woods position escape",
          fallback: "Dead Woods position escape",
        },
        zoneId: "dead-woods:mid",
        segmentId: "dead-woods:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "dead-woods:corner-attack",
        stageId: "dead-woods",
        label: {
          EN: "Dead Woods corner attack",
          fallback: "Dead Woods corner attack",
        },
        zoneId: "dead-woods:corner",
        segmentId: "dead-woods:corner-wall",
        usagePolicy: "reusable",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "destroyed-city",
    label: {
      EN: "Destroyed City",
      fallback: "Destroyed City",
    },
    zones: [
      {
        id: "destroyed-city:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "destroyed-city:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "destroyed-city:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "destroyed-city:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "destroyed-city:position-escape",
        stageId: "destroyed-city",
        label: {
          EN: "Destroyed City position escape",
          fallback: "Destroyed City position escape",
        },
        zoneId: "destroyed-city:mid",
        segmentId: "destroyed-city:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "destroyed-city:corner-attack",
        stageId: "destroyed-city",
        label: {
          EN: "Destroyed City corner attack",
          fallback: "Destroyed City corner attack",
        },
        zoneId: "destroyed-city:corner",
        segmentId: "destroyed-city:corner-wall",
        usagePolicy: "reusable",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "emperors-courtyard",
    label: {
      EN: "Emperor's Courtyard",
      fallback: "Emperor's Courtyard",
    },
    zones: [
      {
        id: "emperors-courtyard:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "emperors-courtyard:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "emperors-courtyard:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "emperors-courtyard:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "emperors-courtyard:position-escape",
        stageId: "emperors-courtyard",
        label: {
          EN: "Emperor's Courtyard position escape",
          fallback: "Emperor's Courtyard position escape",
        },
        zoneId: "emperors-courtyard:mid",
        segmentId: "emperors-courtyard:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "emperors-courtyard:corner-attack",
        stageId: "emperors-courtyard",
        label: {
          EN: "Emperor's Courtyard corner attack",
          fallback: "Emperor's Courtyard corner attack",
        },
        zoneId: "emperors-courtyard:corner",
        segmentId: "emperors-courtyard:corner-wall",
        usagePolicy: "oncePerCombo",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "jinsei-chamber",
    label: {
      EN: "Jinsei Chamber",
      fallback: "Jinsei Chamber",
    },
    zones: [
      {
        id: "jinsei-chamber:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "jinsei-chamber:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "jinsei-chamber:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "jinsei-chamber:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "jinsei-chamber:position-escape",
        stageId: "jinsei-chamber",
        label: {
          EN: "Jinsei Chamber position escape",
          fallback: "Jinsei Chamber position escape",
        },
        zoneId: "jinsei-chamber:mid",
        segmentId: "jinsei-chamber:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "jinsei-chamber:corner-attack",
        stageId: "jinsei-chamber",
        label: {
          EN: "Jinsei Chamber corner attack",
          fallback: "Jinsei Chamber corner attack",
        },
        zoneId: "jinsei-chamber:corner",
        segmentId: "jinsei-chamber:corner-wall",
        usagePolicy: "reusable",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "kuatan-jungle",
    label: {
      EN: "Kuatan Jungle",
      fallback: "Kuatan Jungle",
    },
    zones: [
      {
        id: "kuatan-jungle:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "kuatan-jungle:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "kuatan-jungle:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "kuatan-jungle:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "kuatan-jungle:position-escape",
        stageId: "kuatan-jungle",
        label: {
          EN: "Kuatan Jungle position escape",
          fallback: "Kuatan Jungle position escape",
        },
        zoneId: "kuatan-jungle:mid",
        segmentId: "kuatan-jungle:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "kuatan-jungle:corner-attack",
        stageId: "kuatan-jungle",
        label: {
          EN: "Kuatan Jungle corner attack",
          fallback: "Kuatan Jungle corner attack",
        },
        zoneId: "kuatan-jungle:corner",
        segmentId: "kuatan-jungle:corner-wall",
        usagePolicy: "reusable",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "lin-kuei-temple",
    label: {
      EN: "Lin Kuei Temple",
      fallback: "Lin Kuei Temple",
    },
    zones: [
      {
        id: "lin-kuei-temple:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "lin-kuei-temple:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "lin-kuei-temple:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "lin-kuei-temple:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "lin-kuei-temple:position-escape",
        stageId: "lin-kuei-temple",
        label: {
          EN: "Lin Kuei Temple position escape",
          fallback: "Lin Kuei Temple position escape",
        },
        zoneId: "lin-kuei-temple:mid",
        segmentId: "lin-kuei-temple:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "lin-kuei-temple:corner-attack",
        stageId: "lin-kuei-temple",
        label: {
          EN: "Lin Kuei Temple corner attack",
          fallback: "Lin Kuei Temple corner attack",
        },
        zoneId: "lin-kuei-temple:corner",
        segmentId: "lin-kuei-temple:corner-wall",
        usagePolicy: "oncePerCombo",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "outworld-marketplace",
    label: {
      EN: "Outworld Marketplace",
      fallback: "Outworld Marketplace",
    },
    zones: [
      {
        id: "outworld-marketplace:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "outworld-marketplace:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "outworld-marketplace:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "outworld-marketplace:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "outworld-marketplace:position-escape",
        stageId: "outworld-marketplace",
        label: {
          EN: "Outworld Marketplace position escape",
          fallback: "Outworld Marketplace position escape",
        },
        zoneId: "outworld-marketplace:mid",
        segmentId: "outworld-marketplace:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "outworld-marketplace:corner-attack",
        stageId: "outworld-marketplace",
        label: {
          EN: "Outworld Marketplace corner attack",
          fallback: "Outworld Marketplace corner attack",
        },
        zoneId: "outworld-marketplace:corner",
        segmentId: "outworld-marketplace:corner-wall",
        usagePolicy: "reusable",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "quan-chi-fortress",
    label: {
      EN: "Quan Chi Fortress",
      fallback: "Quan Chi Fortress",
    },
    zones: [
      {
        id: "quan-chi-fortress:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "quan-chi-fortress:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "quan-chi-fortress:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "quan-chi-fortress:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "quan-chi-fortress:position-escape",
        stageId: "quan-chi-fortress",
        label: {
          EN: "Quan Chi Fortress position escape",
          fallback: "Quan Chi Fortress position escape",
        },
        zoneId: "quan-chi-fortress:mid",
        segmentId: "quan-chi-fortress:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "quan-chi-fortress:corner-attack",
        stageId: "quan-chi-fortress",
        label: {
          EN: "Quan Chi Fortress corner attack",
          fallback: "Quan Chi Fortress corner attack",
        },
        zoneId: "quan-chi-fortress:corner",
        segmentId: "quan-chi-fortress:corner-wall",
        usagePolicy: "reusable",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "refugee-kamp",
    label: {
      EN: "Refugee Kamp",
      fallback: "Refugee Kamp",
    },
    stageFatality: true,
    zones: [
      {
        id: "refugee-kamp:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "refugee-kamp:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "refugee-kamp:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "refugee-kamp:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "refugee-kamp:position-escape",
        stageId: "refugee-kamp",
        label: {
          EN: "Refugee Kamp position escape",
          fallback: "Refugee Kamp position escape",
        },
        zoneId: "refugee-kamp:mid",
        segmentId: "refugee-kamp:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "refugee-kamp:corner-attack",
        stageId: "refugee-kamp",
        label: {
          EN: "Refugee Kamp corner attack",
          fallback: "Refugee Kamp corner attack",
        },
        zoneId: "refugee-kamp:corner",
        segmentId: "refugee-kamp:corner-wall",
        usagePolicy: "oncePerCombo",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "sky-temple",
    label: {
      EN: "Sky Temple",
      fallback: "Sky Temple",
    },
    zones: [
      {
        id: "sky-temple:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "sky-temple:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "sky-temple:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "sky-temple:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "sky-temple:position-escape",
        stageId: "sky-temple",
        label: {
          EN: "Sky Temple position escape",
          fallback: "Sky Temple position escape",
        },
        zoneId: "sky-temple:mid",
        segmentId: "sky-temple:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "sky-temple:corner-attack",
        stageId: "sky-temple",
        label: {
          EN: "Sky Temple corner attack",
          fallback: "Sky Temple corner attack",
        },
        zoneId: "sky-temple:corner",
        segmentId: "sky-temple:corner-wall",
        usagePolicy: "reusable",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "the-kove",
    label: {
      EN: "The Kove",
      fallback: "The Kove",
    },
    stageFatality: true,
    zones: [
      {
        id: "the-kove:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "the-kove:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "the-kove:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "the-kove:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "the-kove:position-escape",
        stageId: "the-kove",
        label: {
          EN: "The Kove position escape",
          fallback: "The Kove position escape",
        },
        zoneId: "the-kove:mid",
        segmentId: "the-kove:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "the-kove:corner-attack",
        stageId: "the-kove",
        label: {
          EN: "The Kove corner attack",
          fallback: "The Kove corner attack",
        },
        zoneId: "the-kove:corner",
        segmentId: "the-kove:corner-wall",
        usagePolicy: "reusable",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "the-pit",
    label: {
      EN: "The Pit",
      fallback: "The Pit",
    },
    stageFatality: true,
    zones: [
      {
        id: "the-pit:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "the-pit:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "the-pit:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "the-pit:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "the-pit:position-escape",
        stageId: "the-pit",
        label: {
          EN: "The Pit position escape",
          fallback: "The Pit position escape",
        },
        zoneId: "the-pit:mid",
        segmentId: "the-pit:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "the-pit:corner-attack",
        stageId: "the-pit",
        label: {
          EN: "The Pit corner attack",
          fallback: "The Pit corner attack",
        },
        zoneId: "the-pit:corner",
        segmentId: "the-pit:corner-wall",
        usagePolicy: "oncePerCombo",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
  {
    id: "training-room",
    label: {
      EN: "Training Room",
      fallback: "Training Room",
    },
    zones: [
      {
        id: "training-room:mid",
        label: {
          EN: "Mid screen",
          fallback: "Mid screen",
        },
        segments: [
          {
            id: "training-room:mid-screen",
            label: {
              EN: "Mid-screen lane",
              fallback: "Mid-screen lane",
            },
          },
        ],
      },
      {
        id: "training-room:corner",
        label: {
          EN: "Corner",
          fallback: "Corner",
        },
        segments: [
          {
            id: "training-room:corner-wall",
            label: {
              EN: "Corner wall",
              fallback: "Corner wall",
            },
          },
        ],
      },
    ],
    interactables: [
      {
        id: "training-room:position-escape",
        stageId: "training-room",
        label: {
          EN: "Training Room position escape",
          fallback: "Training Room position escape",
        },
        zoneId: "training-room:mid",
        segmentId: "training-room:mid-screen",
        usagePolicy: "reusable",
        tags: ["mobility", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
      {
        id: "training-room:corner-attack",
        stageId: "training-room",
        label: {
          EN: "Training Room corner attack",
          fallback: "Training Room corner attack",
        },
        zoneId: "training-room:corner",
        segmentId: "training-room:corner-wall",
        usagePolicy: "reusable",
        tags: ["attack", "stage"],
        sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
      },
    ],
    sourceIds: ["mkwarehouse-mkx", "wikipedia-mkx", "in-game-practice-mode"],
  },
] as const satisfies readonly MkxlStage[];
