import type { MkxlMove } from "../../../movelists/type";
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
import { mkxlXlFinalRouteGeneratedMoveRegistry } from "./route-generated";

type MkxlXlFinalMoveRegistryShape = Readonly<
  Record<string, Readonly<Record<string, Readonly<Record<string, MkxlMove>>>>>
>;

const generatedRouteMoves = mkxlXlFinalRouteGeneratedMoveRegistry;

export const mkxlXlFinalMoveRegistry = {
  general: {
    universal: mkxlXlFinalGeneralMoves.universal,
  },
  alien: {
    universal: {
      ...alienMoves.universal,
      ...generatedRouteMoves.alien.universal,
    },
    acidic: {
      ...alienMoves.variations.acidic,
      ...generatedRouteMoves.alien.acidic,
    },
    konjurer: {
      ...alienMoves.variations.konjurer,
      ...generatedRouteMoves.alien.konjurer,
    },
    tarkatan: {
      ...alienMoves.variations.tarkatan,
      ...generatedRouteMoves.alien.tarkatan,
    },
  },
  boRaiCho: {
    universal: {
      ...boRaiChoMoves.universal,
      ...generatedRouteMoves.boRaiCho.universal,
    },
    bartitsu: {
      ...boRaiChoMoves.variations.bartitsu,
      ...generatedRouteMoves.boRaiCho.bartitsu,
    },
    dragonBreath: {
      ...boRaiChoMoves.variations.dragonBreath,
      ...generatedRouteMoves.boRaiCho.dragonBreath,
    },
    drunkenMaster: {
      ...boRaiChoMoves.variations.drunkenMaster,
      ...generatedRouteMoves.boRaiCho.drunkenMaster,
    },
  },
  cassieCage: {
    universal: {
      ...cassieCageMoves.universal,
      ...generatedRouteMoves.cassieCage.universal,
    },
    brawler: {
      ...cassieCageMoves.variations.brawler,
      ...generatedRouteMoves.cassieCage.brawler,
    },
    hollywood: {
      ...cassieCageMoves.variations.hollywood,
      ...generatedRouteMoves.cassieCage.hollywood,
    },
    specOps: {
      ...cassieCageMoves.variations.specOps,
      ...generatedRouteMoves.cassieCage.specOps,
    },
  },
  dvorah: {
    universal: {
      ...dvorahMoves.universal,
      ...generatedRouteMoves.dvorah.universal,
    },
    broodMother: {
      ...dvorahMoves.variations.broodMother,
      ...generatedRouteMoves.dvorah.broodMother,
    },
    swarmQueen: {
      ...dvorahMoves.variations.swarmQueen,
      ...generatedRouteMoves.dvorah.swarmQueen,
    },
    venomous: {
      ...dvorahMoves.variations.venomous,
      ...generatedRouteMoves.dvorah.venomous,
    },
  },
  ermac: {
    universal: {
      ...ermacMoves.universal,
      ...generatedRouteMoves.ermac.universal,
    },
    masterOfSouls: {
      ...ermacMoves.variations.masterOfSouls,
      ...generatedRouteMoves.ermac.masterOfSouls,
    },
    mystic: {
      ...ermacMoves.variations.mystic,
      ...generatedRouteMoves.ermac.mystic,
    },
    spectral: {
      ...ermacMoves.variations.spectral,
      ...generatedRouteMoves.ermac.spectral,
    },
  },
  erronBlack: {
    universal: {
      ...erronBlackMoves.universal,
      ...generatedRouteMoves.erronBlack.universal,
    },
    gunslinger: {
      ...erronBlackMoves.variations.gunslinger,
      ...generatedRouteMoves.erronBlack.gunslinger,
    },
    marksman: {
      ...erronBlackMoves.variations.marksman,
      ...generatedRouteMoves.erronBlack.marksman,
    },
    outlaw: {
      ...erronBlackMoves.variations.outlaw,
      ...generatedRouteMoves.erronBlack.outlaw,
    },
  },
  ferraTorr: {
    universal: {
      ...ferraTorrMoves.universal,
      ...generatedRouteMoves.ferraTorr.universal,
    },
    lackey: {
      ...ferraTorrMoves.variations.lackey,
      ...generatedRouteMoves.ferraTorr.lackey,
    },
    ruthless: {
      ...ferraTorrMoves.variations.ruthless,
      ...generatedRouteMoves.ferraTorr.ruthless,
    },
    vicious: {
      ...ferraTorrMoves.variations.vicious,
      ...generatedRouteMoves.ferraTorr.vicious,
    },
  },
  goro: {
    universal: {
      ...goroMoves.universal,
      ...generatedRouteMoves.goro.universal,
    },
    dragonFangs: {
      ...goroMoves.variations.dragonFangs,
      ...generatedRouteMoves.goro.dragonFangs,
    },
    kuatanWarrior: {
      ...goroMoves.variations.kuatanWarrior,
      ...generatedRouteMoves.goro.kuatanWarrior,
    },
    tigrarFury: {
      ...goroMoves.variations.tigrarFury,
      ...generatedRouteMoves.goro.tigrarFury,
    },
  },
  jacquiBriggs: {
    universal: {
      ...jacquiBriggsMoves.universal,
      ...generatedRouteMoves.jacquiBriggs.universal,
    },
    fullAuto: {
      ...jacquiBriggsMoves.variations.fullAuto,
      ...generatedRouteMoves.jacquiBriggs.fullAuto,
    },
    highTech: {
      ...jacquiBriggsMoves.variations.highTech,
      ...generatedRouteMoves.jacquiBriggs.highTech,
    },
    shotgun: {
      ...jacquiBriggsMoves.variations.shotgun,
      ...generatedRouteMoves.jacquiBriggs.shotgun,
    },
  },
  jasonVoorhees: {
    universal: {
      ...jasonVoorheesMoves.universal,
      ...generatedRouteMoves.jasonVoorhees.universal,
    },
    relentless: {
      ...jasonVoorheesMoves.variations.relentless,
      ...generatedRouteMoves.jasonVoorhees.relentless,
    },
    slasher: {
      ...jasonVoorheesMoves.variations.slasher,
      ...generatedRouteMoves.jasonVoorhees.slasher,
    },
    unstoppable: {
      ...jasonVoorheesMoves.variations.unstoppable,
      ...generatedRouteMoves.jasonVoorhees.unstoppable,
    },
  },
  jax: {
    universal: {
      ...jaxMoves.universal,
      ...generatedRouteMoves.jax.universal,
    },
    heavyWeapons: {
      ...jaxMoves.variations.heavyWeapons,
      ...generatedRouteMoves.jax.heavyWeapons,
    },
    pumpedUp: {
      ...jaxMoves.variations.pumpedUp,
      ...generatedRouteMoves.jax.pumpedUp,
    },
    wrestler: {
      ...jaxMoves.variations.wrestler,
      ...generatedRouteMoves.jax.wrestler,
    },
  },
  johnnyCage: {
    universal: {
      ...johnnyCageMoves.universal,
      ...generatedRouteMoves.johnnyCage.universal,
    },
    aList: {
      ...johnnyCageMoves.variations.aList,
      ...generatedRouteMoves.johnnyCage.aList,
    },
    fisticuffs: {
      ...johnnyCageMoves.variations.fisticuffs,
      ...generatedRouteMoves.johnnyCage.fisticuffs,
    },
    stuntDouble: {
      ...johnnyCageMoves.variations.stuntDouble,
      ...generatedRouteMoves.johnnyCage.stuntDouble,
    },
  },
  kano: {
    universal: {
      ...kanoMoves.universal,
      ...generatedRouteMoves.kano.universal,
    },
    commando: {
      ...kanoMoves.variations.commando,
      ...generatedRouteMoves.kano.commando,
    },
    cutthroat: {
      ...kanoMoves.variations.cutthroat,
      ...generatedRouteMoves.kano.cutthroat,
    },
    cybernetic: {
      ...kanoMoves.variations.cybernetic,
      ...generatedRouteMoves.kano.cybernetic,
    },
  },
  kenshi: {
    universal: {
      ...kenshiMoves.universal,
      ...generatedRouteMoves.kenshi.universal,
    },
    balanced: {
      ...kenshiMoves.variations.balanced,
      ...generatedRouteMoves.kenshi.balanced,
    },
    kenjutsu: {
      ...kenshiMoves.variations.kenjutsu,
      ...generatedRouteMoves.kenshi.kenjutsu,
    },
    possessed: {
      ...kenshiMoves.variations.possessed,
      ...generatedRouteMoves.kenshi.possessed,
    },
  },
  kitana: {
    universal: {
      ...kitanaMoves.universal,
      ...generatedRouteMoves.kitana.universal,
    },
    assassin: {
      ...kitanaMoves.variations.assassin,
      ...generatedRouteMoves.kitana.assassin,
    },
    mournful: {
      ...kitanaMoves.variations.mournful,
      ...generatedRouteMoves.kitana.mournful,
    },
    royalStorm: {
      ...kitanaMoves.variations.royalStorm,
      ...generatedRouteMoves.kitana.royalStorm,
    },
  },
  kotalKahn: {
    universal: {
      ...kotalKahnMoves.universal,
      ...generatedRouteMoves.kotalKahn.universal,
    },
    bloodGod: {
      ...kotalKahnMoves.variations.bloodGod,
      ...generatedRouteMoves.kotalKahn.bloodGod,
    },
    sunGod: {
      ...kotalKahnMoves.variations.sunGod,
      ...generatedRouteMoves.kotalKahn.sunGod,
    },
    warGod: {
      ...kotalKahnMoves.variations.warGod,
      ...generatedRouteMoves.kotalKahn.warGod,
    },
  },
  kungJin: {
    universal: {
      ...kungJinMoves.universal,
      ...generatedRouteMoves.kungJin.universal,
    },
    ancestral: {
      ...kungJinMoves.variations.ancestral,
      ...generatedRouteMoves.kungJin.ancestral,
    },
    bojutsu: {
      ...kungJinMoves.variations.bojutsu,
      ...generatedRouteMoves.kungJin.bojutsu,
    },
    shaolin: {
      ...kungJinMoves.variations.shaolin,
      ...generatedRouteMoves.kungJin.shaolin,
    },
  },
  kungLao: {
    universal: {
      ...kungLaoMoves.universal,
      ...generatedRouteMoves.kungLao.universal,
    },
    buzzSaw: {
      ...kungLaoMoves.variations.buzzSaw,
      ...generatedRouteMoves.kungLao.buzzSaw,
    },
    hatTrick: {
      ...kungLaoMoves.variations.hatTrick,
      ...generatedRouteMoves.kungLao.hatTrick,
    },
    tempest: {
      ...kungLaoMoves.variations.tempest,
      ...generatedRouteMoves.kungLao.tempest,
    },
  },
  leatherface: {
    universal: {
      ...leatherfaceMoves.universal,
      ...generatedRouteMoves.leatherface.universal,
    },
    butcher: {
      ...leatherfaceMoves.variations.butcher,
      ...generatedRouteMoves.leatherface.butcher,
    },
    killer: {
      ...leatherfaceMoves.variations.killer,
      ...generatedRouteMoves.leatherface.killer,
    },
    prettyLady: {
      ...leatherfaceMoves.variations.prettyLady,
      ...generatedRouteMoves.leatherface.prettyLady,
    },
  },
  liuKang: {
    universal: {
      ...liuKangMoves.universal,
      ...generatedRouteMoves.liuKang.universal,
    },
    dragonsFire: {
      ...liuKangMoves.variations.dragonsFire,
      ...generatedRouteMoves.liuKang.dragonsFire,
    },
    dualist: {
      ...liuKangMoves.variations.dualist,
      ...generatedRouteMoves.liuKang.dualist,
    },
    flameFist: {
      ...liuKangMoves.variations.flameFist,
      ...generatedRouteMoves.liuKang.flameFist,
    },
  },
  mileena: {
    universal: {
      ...mileenaMoves.universal,
      ...generatedRouteMoves.mileena.universal,
    },
    ethereal: {
      ...mileenaMoves.variations.ethereal,
      ...generatedRouteMoves.mileena.ethereal,
    },
    piercing: {
      ...mileenaMoves.variations.piercing,
      ...generatedRouteMoves.mileena.piercing,
    },
    ravenous: {
      ...mileenaMoves.variations.ravenous,
      ...generatedRouteMoves.mileena.ravenous,
    },
  },
  predator: {
    universal: {
      ...predatorMoves.universal,
      ...generatedRouteMoves.predator.universal,
    },
    hishQuTen: {
      ...predatorMoves.variations.hishQuTen,
      ...generatedRouteMoves.predator.hishQuTen,
    },
    hunter: {
      ...predatorMoves.variations.hunter,
      ...generatedRouteMoves.predator.hunter,
    },
    warrior: {
      ...predatorMoves.variations.warrior,
      ...generatedRouteMoves.predator.warrior,
    },
  },
  quanChi: {
    universal: {
      ...quanChiMoves.universal,
      ...generatedRouteMoves.quanChi.universal,
    },
    sorcerer: {
      ...quanChiMoves.variations.sorcerer,
      ...generatedRouteMoves.quanChi.sorcerer,
    },
    summoner: {
      ...quanChiMoves.variations.summoner,
      ...generatedRouteMoves.quanChi.summoner,
    },
    warlock: {
      ...quanChiMoves.variations.warlock,
      ...generatedRouteMoves.quanChi.warlock,
    },
  },
  raiden: {
    universal: {
      ...raidenMoves.universal,
      ...generatedRouteMoves.raiden.universal,
    },
    displacer: {
      ...raidenMoves.variations.displacer,
      ...generatedRouteMoves.raiden.displacer,
    },
    masterOfStorms: {
      ...raidenMoves.variations.masterOfStorms,
      ...generatedRouteMoves.raiden.masterOfStorms,
    },
    thunderGod: {
      ...raidenMoves.variations.thunderGod,
      ...generatedRouteMoves.raiden.thunderGod,
    },
  },
  reptile: {
    universal: {
      ...reptileMoves.universal,
      ...generatedRouteMoves.reptile.universal,
    },
    deceptive: {
      ...reptileMoves.variations.deceptive,
      ...generatedRouteMoves.reptile.deceptive,
    },
    nimble: {
      ...reptileMoves.variations.nimble,
      ...generatedRouteMoves.reptile.nimble,
    },
    noxious: {
      ...reptileMoves.variations.noxious,
      ...generatedRouteMoves.reptile.noxious,
    },
  },
  scorpion: {
    universal: {
      ...scorpionMoves.universal,
      ...generatedRouteMoves.scorpion.universal,
    },
    hellfire: {
      ...scorpionMoves.variations.hellfire,
      ...generatedRouteMoves.scorpion.hellfire,
    },
    inferno: {
      ...scorpionMoves.variations.inferno,
      ...generatedRouteMoves.scorpion.inferno,
    },
    ninjutsu: {
      ...scorpionMoves.variations.ninjutsu,
      ...generatedRouteMoves.scorpion.ninjutsu,
    },
  },
  shinnok: {
    universal: {
      ...shinnokMoves.universal,
      ...generatedRouteMoves.shinnok.universal,
    },
    boneShaper: {
      ...shinnokMoves.variations.boneShaper,
      ...generatedRouteMoves.shinnok.boneShaper,
    },
    impostor: {
      ...shinnokMoves.variations.impostor,
      ...generatedRouteMoves.shinnok.impostor,
    },
    necromancer: {
      ...shinnokMoves.variations.necromancer,
      ...generatedRouteMoves.shinnok.necromancer,
    },
  },
  sonyaBlade: {
    universal: {
      ...sonyaBladeMoves.universal,
      ...generatedRouteMoves.sonyaBlade.universal,
    },
    covertOps: {
      ...sonyaBladeMoves.variations.covertOps,
      ...generatedRouteMoves.sonyaBlade.covertOps,
    },
    demolition: {
      ...sonyaBladeMoves.variations.demolition,
      ...generatedRouteMoves.sonyaBlade.demolition,
    },
    specialForces: {
      ...sonyaBladeMoves.variations.specialForces,
      ...generatedRouteMoves.sonyaBlade.specialForces,
    },
  },
  subZero: {
    universal: {
      ...subZeroMoves.universal,
      ...generatedRouteMoves.subZero.universal,
    },
    cryomancer: {
      ...subZeroMoves.variations.cryomancer,
      ...generatedRouteMoves.subZero.cryomancer,
    },
    grandmaster: {
      ...subZeroMoves.variations.grandmaster,
      ...generatedRouteMoves.subZero.grandmaster,
    },
    unbreakable: {
      ...subZeroMoves.variations.unbreakable,
      ...generatedRouteMoves.subZero.unbreakable,
    },
  },
  takeda: {
    universal: {
      ...takedaMoves.universal,
      ...generatedRouteMoves.takeda.universal,
    },
    lasher: {
      ...takedaMoves.variations.lasher,
      ...generatedRouteMoves.takeda.lasher,
    },
    ronin: {
      ...takedaMoves.variations.ronin,
      ...generatedRouteMoves.takeda.ronin,
    },
    shiraiRyu: {
      ...takedaMoves.variations.shiraiRyu,
      ...generatedRouteMoves.takeda.shiraiRyu,
    },
  },
  tanya: {
    universal: {
      ...tanyaMoves.universal,
      ...generatedRouteMoves.tanya.universal,
    },
    dragonNaginata: {
      ...tanyaMoves.variations.dragonNaginata,
      ...generatedRouteMoves.tanya.dragonNaginata,
    },
    kobuJutsu: {
      ...tanyaMoves.variations.kobuJutsu,
      ...generatedRouteMoves.tanya.kobuJutsu,
    },
    pyromancer: {
      ...tanyaMoves.variations.pyromancer,
      ...generatedRouteMoves.tanya.pyromancer,
    },
  },
  tremor: {
    universal: {
      ...tremorMoves.universal,
      ...generatedRouteMoves.tremor.universal,
    },
    aftershock: {
      ...tremorMoves.variations.aftershock,
      ...generatedRouteMoves.tremor.aftershock,
    },
    crystalline: {
      ...tremorMoves.variations.crystalline,
      ...generatedRouteMoves.tremor.crystalline,
    },
    metallic: {
      ...tremorMoves.variations.metallic,
      ...generatedRouteMoves.tremor.metallic,
    },
  },
  triborg: {
    universal: {
      ...triborgMoves.universal,
      ...generatedRouteMoves.triborg.universal,
    },
    cyberSubZero: {
      ...triborgMoves.variations.cyberSubZero,
      ...generatedRouteMoves.triborg.cyberSubZero,
    },
    cyrax: {
      ...triborgMoves.variations.cyrax,
      ...generatedRouteMoves.triborg.cyrax,
    },
    sektor: {
      ...triborgMoves.variations.sektor,
      ...generatedRouteMoves.triborg.sektor,
    },
    smoke: {
      ...triborgMoves.variations.smoke,
      ...generatedRouteMoves.triborg.smoke,
    },
  },
} as const satisfies MkxlXlFinalMoveRegistryShape;
