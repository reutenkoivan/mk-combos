import { alienMoves } from "./characters/alien";
import { boRaiChoMoves } from "./characters/bo-rai-cho";
import { cassieCageMoves } from "./characters/cassie-cage";
import { dvorahMoves } from "./characters/dvorah";
import { ermacMoves } from "./characters/ermac";
import { erronBlackMoves } from "./characters/erron-black";
import { ferraTorrMoves } from "./characters/ferra-torr";
import { mkxlXlFinalGeneralMoves } from "./characters/general";
import { goroMoves } from "./characters/goro";
import { jacquiBriggsMoves } from "./characters/jacqui-briggs";
import { jasonVoorheesMoves } from "./characters/jason-voorhees";
import { jaxMoves } from "./characters/jax";
import { johnnyCageMoves } from "./characters/johnny-cage";
import { kanoMoves } from "./characters/kano";
import { kenshiMoves } from "./characters/kenshi";
import { kitanaMoves } from "./characters/kitana";
import { kotalKahnMoves } from "./characters/kotal-kahn";
import { kungJinMoves } from "./characters/kung-jin";
import { kungLaoMoves } from "./characters/kung-lao";
import { leatherfaceMoves } from "./characters/leatherface";
import { liuKangMoves } from "./characters/liu-kang";
import { mileenaMoves } from "./characters/mileena";
import { predatorMoves } from "./characters/predator";
import { quanChiMoves } from "./characters/quan-chi";
import { raidenMoves } from "./characters/raiden";
import { reptileMoves } from "./characters/reptile";
import { scorpionMoves } from "./characters/scorpion";
import { shinnokMoves } from "./characters/shinnok";
import { sonyaBladeMoves } from "./characters/sonya-blade";
import { subZeroMoves } from "./characters/sub-zero";
import { takedaMoves } from "./characters/takeda";
import { tanyaMoves } from "./characters/tanya";
import { tremorMoves } from "./characters/tremor";
import { triborgMoves } from "./characters/triborg";
import { mkxlXlFinalTransitionGeneratedMoveRegistry } from "./transition-generated";

const generatedTransitionMoves = mkxlXlFinalTransitionGeneratedMoveRegistry as Readonly<
  Record<string, Readonly<Record<string, object>>>
>;

export const mkxlXlFinalMoveRegistry = {
  general: mkxlXlFinalGeneralMoves.universal,
  alien: {
    universal: {
      ...alienMoves.universal,
      ...generatedTransitionMoves.alien?.universal,
    },
    acidic: {
      ...alienMoves.variations.acidic,
      ...generatedTransitionMoves.alien?.acidic,
    },
    konjurer: {
      ...alienMoves.variations.konjurer,
      ...generatedTransitionMoves.alien?.konjurer,
    },
    tarkatan: {
      ...alienMoves.variations.tarkatan,
      ...generatedTransitionMoves.alien?.tarkatan,
    },
  },
  boRaiCho: {
    universal: {
      ...boRaiChoMoves.universal,
      ...generatedTransitionMoves.boRaiCho?.universal,
    },
    bartitsu: {
      ...boRaiChoMoves.variations.bartitsu,
      ...generatedTransitionMoves.boRaiCho?.bartitsu,
    },
    dragonBreath: {
      ...boRaiChoMoves.variations.dragonBreath,
      ...generatedTransitionMoves.boRaiCho?.dragonBreath,
    },
    drunkenMaster: {
      ...boRaiChoMoves.variations.drunkenMaster,
      ...generatedTransitionMoves.boRaiCho?.drunkenMaster,
    },
  },
  cassieCage: {
    universal: {
      ...cassieCageMoves.universal,
      ...generatedTransitionMoves.cassieCage?.universal,
    },
    brawler: {
      ...cassieCageMoves.variations.brawler,
      ...generatedTransitionMoves.cassieCage?.brawler,
    },
    hollywood: {
      ...cassieCageMoves.variations.hollywood,
      ...generatedTransitionMoves.cassieCage?.hollywood,
    },
    specOps: {
      ...cassieCageMoves.variations.specOps,
      ...generatedTransitionMoves.cassieCage?.specOps,
    },
  },
  dvorah: {
    universal: {
      ...dvorahMoves.universal,
      ...generatedTransitionMoves.dvorah?.universal,
    },
    broodMother: {
      ...dvorahMoves.variations.broodMother,
      ...generatedTransitionMoves.dvorah?.broodMother,
    },
    swarmQueen: {
      ...dvorahMoves.variations.swarmQueen,
      ...generatedTransitionMoves.dvorah?.swarmQueen,
    },
    venomous: {
      ...dvorahMoves.variations.venomous,
      ...generatedTransitionMoves.dvorah?.venomous,
    },
  },
  ermac: {
    universal: {
      ...ermacMoves.universal,
      ...generatedTransitionMoves.ermac?.universal,
    },
    masterOfSouls: {
      ...ermacMoves.variations.masterOfSouls,
      ...generatedTransitionMoves.ermac?.masterOfSouls,
    },
    mystic: {
      ...ermacMoves.variations.mystic,
      ...generatedTransitionMoves.ermac?.mystic,
    },
    spectral: {
      ...ermacMoves.variations.spectral,
      ...generatedTransitionMoves.ermac?.spectral,
    },
  },
  erronBlack: {
    universal: {
      ...erronBlackMoves.universal,
      ...generatedTransitionMoves.erronBlack?.universal,
    },
    gunslinger: {
      ...erronBlackMoves.variations.gunslinger,
      ...generatedTransitionMoves.erronBlack?.gunslinger,
    },
    marksman: {
      ...erronBlackMoves.variations.marksman,
      ...generatedTransitionMoves.erronBlack?.marksman,
    },
    outlaw: {
      ...erronBlackMoves.variations.outlaw,
      ...generatedTransitionMoves.erronBlack?.outlaw,
    },
  },
  ferraTorr: {
    universal: {
      ...ferraTorrMoves.universal,
      ...generatedTransitionMoves.ferraTorr?.universal,
    },
    lackey: {
      ...ferraTorrMoves.variations.lackey,
      ...generatedTransitionMoves.ferraTorr?.lackey,
    },
    ruthless: {
      ...ferraTorrMoves.variations.ruthless,
      ...generatedTransitionMoves.ferraTorr?.ruthless,
    },
    vicious: {
      ...ferraTorrMoves.variations.vicious,
      ...generatedTransitionMoves.ferraTorr?.vicious,
    },
  },
  goro: {
    universal: {
      ...goroMoves.universal,
      ...generatedTransitionMoves.goro?.universal,
    },
    dragonFangs: {
      ...goroMoves.variations.dragonFangs,
      ...generatedTransitionMoves.goro?.dragonFangs,
    },
    kuatanWarrior: {
      ...goroMoves.variations.kuatanWarrior,
      ...generatedTransitionMoves.goro?.kuatanWarrior,
    },
    tigrarFury: {
      ...goroMoves.variations.tigrarFury,
      ...generatedTransitionMoves.goro?.tigrarFury,
    },
  },
  jacquiBriggs: {
    universal: {
      ...jacquiBriggsMoves.universal,
      ...generatedTransitionMoves.jacquiBriggs?.universal,
    },
    fullAuto: {
      ...jacquiBriggsMoves.variations.fullAuto,
      ...generatedTransitionMoves.jacquiBriggs?.fullAuto,
    },
    highTech: {
      ...jacquiBriggsMoves.variations.highTech,
      ...generatedTransitionMoves.jacquiBriggs?.highTech,
    },
    shotgun: {
      ...jacquiBriggsMoves.variations.shotgun,
      ...generatedTransitionMoves.jacquiBriggs?.shotgun,
    },
  },
  jasonVoorhees: {
    universal: {
      ...jasonVoorheesMoves.universal,
      ...generatedTransitionMoves.jasonVoorhees?.universal,
    },
    relentless: {
      ...jasonVoorheesMoves.variations.relentless,
      ...generatedTransitionMoves.jasonVoorhees?.relentless,
    },
    slasher: {
      ...jasonVoorheesMoves.variations.slasher,
      ...generatedTransitionMoves.jasonVoorhees?.slasher,
    },
    unstoppable: {
      ...jasonVoorheesMoves.variations.unstoppable,
      ...generatedTransitionMoves.jasonVoorhees?.unstoppable,
    },
  },
  jax: {
    universal: {
      ...jaxMoves.universal,
      ...generatedTransitionMoves.jax?.universal,
    },
    heavyWeapons: {
      ...jaxMoves.variations.heavyWeapons,
      ...generatedTransitionMoves.jax?.heavyWeapons,
    },
    pumpedUp: {
      ...jaxMoves.variations.pumpedUp,
      ...generatedTransitionMoves.jax?.pumpedUp,
    },
    wrestler: {
      ...jaxMoves.variations.wrestler,
      ...generatedTransitionMoves.jax?.wrestler,
    },
  },
  johnnyCage: {
    universal: {
      ...johnnyCageMoves.universal,
      ...generatedTransitionMoves.johnnyCage?.universal,
    },
    aList: {
      ...johnnyCageMoves.variations.aList,
      ...generatedTransitionMoves.johnnyCage?.aList,
    },
    fisticuffs: {
      ...johnnyCageMoves.variations.fisticuffs,
      ...generatedTransitionMoves.johnnyCage?.fisticuffs,
    },
    stuntDouble: {
      ...johnnyCageMoves.variations.stuntDouble,
      ...generatedTransitionMoves.johnnyCage?.stuntDouble,
    },
  },
  kano: {
    universal: {
      ...kanoMoves.universal,
      ...generatedTransitionMoves.kano?.universal,
    },
    commando: {
      ...kanoMoves.variations.commando,
      ...generatedTransitionMoves.kano?.commando,
    },
    cutthroat: {
      ...kanoMoves.variations.cutthroat,
      ...generatedTransitionMoves.kano?.cutthroat,
    },
    cybernetic: {
      ...kanoMoves.variations.cybernetic,
      ...generatedTransitionMoves.kano?.cybernetic,
    },
  },
  kenshi: {
    universal: {
      ...kenshiMoves.universal,
      ...generatedTransitionMoves.kenshi?.universal,
    },
    balanced: {
      ...kenshiMoves.variations.balanced,
      ...generatedTransitionMoves.kenshi?.balanced,
    },
    kenjutsu: {
      ...kenshiMoves.variations.kenjutsu,
      ...generatedTransitionMoves.kenshi?.kenjutsu,
    },
    possessed: {
      ...kenshiMoves.variations.possessed,
      ...generatedTransitionMoves.kenshi?.possessed,
    },
  },
  kitana: {
    universal: {
      ...kitanaMoves.universal,
      ...generatedTransitionMoves.kitana?.universal,
    },
    assassin: {
      ...kitanaMoves.variations.assassin,
      ...generatedTransitionMoves.kitana?.assassin,
    },
    mournful: {
      ...kitanaMoves.variations.mournful,
      ...generatedTransitionMoves.kitana?.mournful,
    },
    royalStorm: {
      ...kitanaMoves.variations.royalStorm,
      ...generatedTransitionMoves.kitana?.royalStorm,
    },
  },
  kotalKahn: {
    universal: {
      ...kotalKahnMoves.universal,
      ...generatedTransitionMoves.kotalKahn?.universal,
    },
    bloodGod: {
      ...kotalKahnMoves.variations.bloodGod,
      ...generatedTransitionMoves.kotalKahn?.bloodGod,
    },
    sunGod: {
      ...kotalKahnMoves.variations.sunGod,
      ...generatedTransitionMoves.kotalKahn?.sunGod,
    },
    warGod: {
      ...kotalKahnMoves.variations.warGod,
      ...generatedTransitionMoves.kotalKahn?.warGod,
    },
  },
  kungJin: {
    universal: {
      ...kungJinMoves.universal,
      ...generatedTransitionMoves.kungJin?.universal,
    },
    ancestral: {
      ...kungJinMoves.variations.ancestral,
      ...generatedTransitionMoves.kungJin?.ancestral,
    },
    bojutsu: {
      ...kungJinMoves.variations.bojutsu,
      ...generatedTransitionMoves.kungJin?.bojutsu,
    },
    shaolin: {
      ...kungJinMoves.variations.shaolin,
      ...generatedTransitionMoves.kungJin?.shaolin,
    },
  },
  kungLao: {
    universal: {
      ...kungLaoMoves.universal,
      ...generatedTransitionMoves.kungLao?.universal,
    },
    buzzSaw: {
      ...kungLaoMoves.variations.buzzSaw,
      ...generatedTransitionMoves.kungLao?.buzzSaw,
    },
    hatTrick: {
      ...kungLaoMoves.variations.hatTrick,
      ...generatedTransitionMoves.kungLao?.hatTrick,
    },
    tempest: {
      ...kungLaoMoves.variations.tempest,
      ...generatedTransitionMoves.kungLao?.tempest,
    },
  },
  leatherface: {
    universal: {
      ...leatherfaceMoves.universal,
      ...generatedTransitionMoves.leatherface?.universal,
    },
    butcher: {
      ...leatherfaceMoves.variations.butcher,
      ...generatedTransitionMoves.leatherface?.butcher,
    },
    killer: {
      ...leatherfaceMoves.variations.killer,
      ...generatedTransitionMoves.leatherface?.killer,
    },
    prettyLady: {
      ...leatherfaceMoves.variations.prettyLady,
      ...generatedTransitionMoves.leatherface?.prettyLady,
    },
  },
  liuKang: {
    universal: {
      ...liuKangMoves.universal,
      ...generatedTransitionMoves.liuKang?.universal,
    },
    dragonsFire: {
      ...liuKangMoves.variations.dragonsFire,
      ...generatedTransitionMoves.liuKang?.dragonsFire,
    },
    dualist: {
      ...liuKangMoves.variations.dualist,
      ...generatedTransitionMoves.liuKang?.dualist,
    },
    flameFist: {
      ...liuKangMoves.variations.flameFist,
      ...generatedTransitionMoves.liuKang?.flameFist,
    },
  },
  mileena: {
    universal: {
      ...mileenaMoves.universal,
      ...generatedTransitionMoves.mileena?.universal,
    },
    ethereal: {
      ...mileenaMoves.variations.ethereal,
      ...generatedTransitionMoves.mileena?.ethereal,
    },
    piercing: {
      ...mileenaMoves.variations.piercing,
      ...generatedTransitionMoves.mileena?.piercing,
    },
    ravenous: {
      ...mileenaMoves.variations.ravenous,
      ...generatedTransitionMoves.mileena?.ravenous,
    },
  },
  predator: {
    universal: {
      ...predatorMoves.universal,
      ...generatedTransitionMoves.predator?.universal,
    },
    hishQuTen: {
      ...predatorMoves.variations.hishQuTen,
      ...generatedTransitionMoves.predator?.hishQuTen,
    },
    hunter: {
      ...predatorMoves.variations.hunter,
      ...generatedTransitionMoves.predator?.hunter,
    },
    warrior: {
      ...predatorMoves.variations.warrior,
      ...generatedTransitionMoves.predator?.warrior,
    },
  },
  quanChi: {
    universal: {
      ...quanChiMoves.universal,
      ...generatedTransitionMoves.quanChi?.universal,
    },
    sorcerer: {
      ...quanChiMoves.variations.sorcerer,
      ...generatedTransitionMoves.quanChi?.sorcerer,
    },
    summoner: {
      ...quanChiMoves.variations.summoner,
      ...generatedTransitionMoves.quanChi?.summoner,
    },
    warlock: {
      ...quanChiMoves.variations.warlock,
      ...generatedTransitionMoves.quanChi?.warlock,
    },
  },
  raiden: {
    universal: {
      ...raidenMoves.universal,
      ...generatedTransitionMoves.raiden?.universal,
    },
    displacer: {
      ...raidenMoves.variations.displacer,
      ...generatedTransitionMoves.raiden?.displacer,
    },
    masterOfStorms: {
      ...raidenMoves.variations.masterOfStorms,
      ...generatedTransitionMoves.raiden?.masterOfStorms,
    },
    thunderGod: {
      ...raidenMoves.variations.thunderGod,
      ...generatedTransitionMoves.raiden?.thunderGod,
    },
  },
  reptile: {
    universal: {
      ...reptileMoves.universal,
      ...generatedTransitionMoves.reptile?.universal,
    },
    deceptive: {
      ...reptileMoves.variations.deceptive,
      ...generatedTransitionMoves.reptile?.deceptive,
    },
    nimble: {
      ...reptileMoves.variations.nimble,
      ...generatedTransitionMoves.reptile?.nimble,
    },
    noxious: {
      ...reptileMoves.variations.noxious,
      ...generatedTransitionMoves.reptile?.noxious,
    },
  },
  scorpion: {
    universal: {
      ...scorpionMoves.universal,
      ...generatedTransitionMoves.scorpion?.universal,
    },
    hellfire: {
      ...scorpionMoves.variations.hellfire,
      ...generatedTransitionMoves.scorpion?.hellfire,
    },
    inferno: {
      ...scorpionMoves.variations.inferno,
      ...generatedTransitionMoves.scorpion?.inferno,
    },
    ninjutsu: {
      ...scorpionMoves.variations.ninjutsu,
      ...generatedTransitionMoves.scorpion?.ninjutsu,
    },
  },
  shinnok: {
    universal: {
      ...shinnokMoves.universal,
      ...generatedTransitionMoves.shinnok?.universal,
    },
    boneShaper: {
      ...shinnokMoves.variations.boneShaper,
      ...generatedTransitionMoves.shinnok?.boneShaper,
    },
    impostor: {
      ...shinnokMoves.variations.impostor,
      ...generatedTransitionMoves.shinnok?.impostor,
    },
    necromancer: {
      ...shinnokMoves.variations.necromancer,
      ...generatedTransitionMoves.shinnok?.necromancer,
    },
  },
  sonyaBlade: {
    universal: {
      ...sonyaBladeMoves.universal,
      ...generatedTransitionMoves.sonyaBlade?.universal,
    },
    covertOps: {
      ...sonyaBladeMoves.variations.covertOps,
      ...generatedTransitionMoves.sonyaBlade?.covertOps,
    },
    demolition: {
      ...sonyaBladeMoves.variations.demolition,
      ...generatedTransitionMoves.sonyaBlade?.demolition,
    },
    specialForces: {
      ...sonyaBladeMoves.variations.specialForces,
      ...generatedTransitionMoves.sonyaBlade?.specialForces,
    },
  },
  subZero: {
    universal: {
      ...subZeroMoves.universal,
      ...generatedTransitionMoves.subZero?.universal,
    },
    cryomancer: {
      ...subZeroMoves.variations.cryomancer,
      ...generatedTransitionMoves.subZero?.cryomancer,
    },
    grandmaster: {
      ...subZeroMoves.variations.grandmaster,
      ...generatedTransitionMoves.subZero?.grandmaster,
    },
    unbreakable: {
      ...subZeroMoves.variations.unbreakable,
      ...generatedTransitionMoves.subZero?.unbreakable,
    },
  },
  takeda: {
    universal: {
      ...takedaMoves.universal,
      ...generatedTransitionMoves.takeda?.universal,
    },
    lasher: {
      ...takedaMoves.variations.lasher,
      ...generatedTransitionMoves.takeda?.lasher,
    },
    ronin: {
      ...takedaMoves.variations.ronin,
      ...generatedTransitionMoves.takeda?.ronin,
    },
    shiraiRyu: {
      ...takedaMoves.variations.shiraiRyu,
      ...generatedTransitionMoves.takeda?.shiraiRyu,
    },
  },
  tanya: {
    universal: {
      ...tanyaMoves.universal,
      ...generatedTransitionMoves.tanya?.universal,
    },
    dragonNaginata: {
      ...tanyaMoves.variations.dragonNaginata,
      ...generatedTransitionMoves.tanya?.dragonNaginata,
    },
    kobuJutsu: {
      ...tanyaMoves.variations.kobuJutsu,
      ...generatedTransitionMoves.tanya?.kobuJutsu,
    },
    pyromancer: {
      ...tanyaMoves.variations.pyromancer,
      ...generatedTransitionMoves.tanya?.pyromancer,
    },
  },
  tremor: {
    universal: {
      ...tremorMoves.universal,
      ...generatedTransitionMoves.tremor?.universal,
    },
    aftershock: {
      ...tremorMoves.variations.aftershock,
      ...generatedTransitionMoves.tremor?.aftershock,
    },
    crystalline: {
      ...tremorMoves.variations.crystalline,
      ...generatedTransitionMoves.tremor?.crystalline,
    },
    metallic: {
      ...tremorMoves.variations.metallic,
      ...generatedTransitionMoves.tremor?.metallic,
    },
  },
  triborg: {
    universal: {
      ...triborgMoves.universal,
      ...generatedTransitionMoves.triborg?.universal,
    },
    cyberSubZero: {
      ...triborgMoves.variations.cyberSubZero,
      ...generatedTransitionMoves.triborg?.cyberSubZero,
    },
    cyrax: {
      ...triborgMoves.variations.cyrax,
      ...generatedTransitionMoves.triborg?.cyrax,
    },
    sektor: {
      ...triborgMoves.variations.sektor,
      ...generatedTransitionMoves.triborg?.sektor,
    },
    smoke: {
      ...triborgMoves.variations.smoke,
      ...generatedTransitionMoves.triborg?.smoke,
    },
  },
} as const as { readonly [key: string]: any };
