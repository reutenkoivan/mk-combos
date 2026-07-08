import type { MkxlAuthoredTransition } from "../type";
import { mkxlXlFinalMoveRegistry as moves } from "./moves/registry";

const alienTarkatan12Exbf4Transition = {
  id: "alien:tarkatan:12-exbf4",
  label: {
    EN: "12+EXBF4",
    fallback: "12+EXBF4",
  },
  route: [moves.alien.tarkatan.oneTwo, moves.alien.tarkatan.exBFFour],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const alienTarkatan214Df3Transition = {
  id: "alien:tarkatan:214-df3",
  label: {
    EN: "214+DF3",
    fallback: "214+DF3",
  },
  route: [moves.alien.tarkatan.twoOneFour, moves.alien.tarkatan.dFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const alienTarkatan214Exbf1Transition = {
  id: "alien:tarkatan:214-exbf1",
  label: {
    EN: "214+EXBF1",
    fallback: "214+EXBF1",
  },
  route: [moves.alien.tarkatan.twoOneFour, moves.alien.tarkatan.exBFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const alienTarkatanB11u4Transition = {
  id: "alien:tarkatan:b11u4",
  label: {
    EN: "B11U4",
    fallback: "B11U4",
  },
  route: [moves.alien.tarkatan.bOneOneUFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const alienTarkatanB3Exbf4Transition = {
  id: "alien:tarkatan:b3-exbf4",
  label: {
    EN: "B3+EXBF4",
    fallback: "B3+EXBF4",
  },
  route: [moves.alien.tarkatan.bThree, moves.alien.tarkatan.exBFFour],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const alienTarkatanF134Df3Transition = {
  id: "alien:tarkatan:f134-df3",
  label: {
    EN: "F134+DF3",
    fallback: "F134+DF3",
  },
  route: [moves.alien.tarkatan.fOneThreeFour, moves.alien.tarkatan.dFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const alienTarkatanF134Exbf1Transition = {
  id: "alien:tarkatan:f134-exbf1",
  label: {
    EN: "F134+EXBF1",
    fallback: "F134+EXBF1",
  },
  route: [moves.alien.tarkatan.fOneThreeFour, moves.alien.tarkatan.exBFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const alienTarkatanF4Exbf4Transition = {
  id: "alien:tarkatan:f4-exbf4",
  label: {
    EN: "F4+EXBF4",
    fallback: "F4+EXBF4",
  },
  route: [moves.alien.tarkatan.fFour, moves.alien.tarkatan.exBFFour],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const alienTarkatanU3Transition = {
  id: "alien:tarkatan:u3",
  label: {
    EN: "U3",
    fallback: "U3",
  },
  route: [moves.alien.tarkatan.uThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const boRaiChoBartitsu21Transition = {
  id: "bo-rai-cho:bartitsu:21",
  label: {
    EN: "21",
    fallback: "21",
  },
  route: [moves.boRaiCho.bartitsu.twoOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const boRaiChoBartitsu341Transition = {
  id: "bo-rai-cho:bartitsu:341",
  label: {
    EN: "341",
    fallback: "341",
  },
  route: [moves.boRaiCho.bartitsu.threeFourOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const boRaiChoBartitsuB233Bf4Transition = {
  id: "bo-rai-cho:bartitsu:b233-bf4",
  label: {
    EN: "B233+BF4",
    fallback: "B233+BF4",
  },
  route: [moves.boRaiCho.bartitsu.bTwoThreeThree, moves.boRaiCho.bartitsu.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const boRaiChoBartitsuF2Bf4Transition = {
  id: "bo-rai-cho:bartitsu:f2-bf4",
  label: {
    EN: "F2+BF4",
    fallback: "F2+BF4",
  },
  route: [moves.boRaiCho.bartitsu.fTwo, moves.boRaiCho.bartitsu.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const cassieCageHollywood112121Transition = {
  id: "cassie-cage:hollywood:112-121",
  label: {
    EN: "112+121",
    fallback: "112+121",
  },
  route: [moves.cassieCage.hollywood.oneOneTwo, moves.cassieCage.hollywood.oneTwoOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const cassieCageHollywood121Transition = {
  id: "cassie-cage:hollywood:121",
  label: {
    EN: "121",
    fallback: "121",
  },
  route: [moves.cassieCage.hollywood.oneTwoOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const cassieCageHollywood123Db2Transition = {
  id: "cassie-cage:hollywood:123-db2",
  label: {
    EN: "123+DB2",
    fallback: "123+DB2",
  },
  route: [moves.cassieCage.hollywood.oneTwoThree, moves.cassieCage.hollywood.dBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const cassieCageHollywood21U4Transition = {
  id: "cassie-cage:hollywood:21u4",
  label: {
    EN: "21U4",
    fallback: "21U4",
  },
  route: [moves.cassieCage.hollywood.twoOneUFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const cassieCageHollywood242Transition = {
  id: "cassie-cage:hollywood:242",
  label: {
    EN: "242",
    fallback: "242",
  },
  route: [moves.cassieCage.hollywood.twoFourTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const cassieCageHollywoodB12Db2Transition = {
  id: "cassie-cage:hollywood:b12-db2",
  label: {
    EN: "B12+DB2",
    fallback: "B12+DB2",
  },
  route: [moves.cassieCage.hollywood.bOneTwo, moves.cassieCage.hollywood.dBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const cassieCageHollywoodB1Db2Transition = {
  id: "cassie-cage:hollywood:b1-db2",
  label: {
    EN: "B1+DB2",
    fallback: "B1+DB2",
  },
  route: [moves.cassieCage.hollywood.bOne, moves.cassieCage.hollywood.dBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const cassieCageHollywoodF3Exdb2Transition = {
  id: "cassie-cage:hollywood:f3-exdb2",
  label: {
    EN: "F3+EXDB2",
    fallback: "F3+EXDB2",
  },
  route: [moves.cassieCage.hollywood.fThree, moves.cassieCage.hollywood.exDBTwo],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const cassieCageHollywoodF44Bf4Transition = {
  id: "cassie-cage:hollywood:f44-bf4",
  label: {
    EN: "F44+BF4",
    fallback: "F44+BF4",
  },
  route: [moves.cassieCage.hollywood.fFourFour, moves.cassieCage.hollywood.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMother112Exdf1Transition = {
  id: "dvorah:brood-mother:112-exdf1",
  label: {
    EN: "112+EXDF1",
    fallback: "112+EXDF1",
  },
  route: [moves.dvorah.broodMother.oneOneTwo, moves.dvorah.broodMother.exDFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMother11B2Transition = {
  id: "dvorah:brood-mother:11b2",
  label: {
    EN: "11B2",
    fallback: "11B2",
  },
  route: [moves.dvorah.broodMother.oneOneBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMother11B2F112Db4Transition = {
  id: "dvorah:brood-mother:11b2-f112-db4",
  label: {
    EN: "11B2+F112+DB4",
    fallback: "11B2+F112+DB4",
  },
  route: [
    moves.dvorah.broodMother.oneOneBTwo,
    moves.dvorah.broodMother.fOneOneTwo,
    moves.dvorah.broodMother.dBFour,
  ],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMother212Db1Transition = {
  id: "dvorah:brood-mother:212-db1",
  label: {
    EN: "212+DB1",
    fallback: "212+DB1",
  },
  route: [moves.dvorah.broodMother.twoOneTwo, moves.dvorah.broodMother.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMother212Df3Transition = {
  id: "dvorah:brood-mother:212-df3",
  label: {
    EN: "212+DF3",
    fallback: "212+DF3",
  },
  route: [moves.dvorah.broodMother.twoOneTwo, moves.dvorah.broodMother.dFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMother44Db4Transition = {
  id: "dvorah:brood-mother:44-db4",
  label: {
    EN: "44+DB4",
    fallback: "44+DB4",
  },
  route: [moves.dvorah.broodMother.fourFour, moves.dvorah.broodMother.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMotherB1Exdf1Transition = {
  id: "dvorah:brood-mother:b1-exdf1",
  label: {
    EN: "B1+EXDF1",
    fallback: "B1+EXDF1",
  },
  route: [moves.dvorah.broodMother.bOne, moves.dvorah.broodMother.exDFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMotherD1Transition = {
  id: "dvorah:brood-mother:d1",
  label: {
    EN: "D1",
    fallback: "D1",
  },
  route: [moves.dvorah.broodMother.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMotherF112Db4Transition = {
  id: "dvorah:brood-mother:f112-db4",
  label: {
    EN: "F112+DB4",
    fallback: "F112+DB4",
  },
  route: [moves.dvorah.broodMother.fOneOneTwo, moves.dvorah.broodMother.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMotherF11Df3Transition = {
  id: "dvorah:brood-mother:f11-df3",
  label: {
    EN: "F11+DF3",
    fallback: "F11+DF3",
  },
  route: [moves.dvorah.broodMother.fOneOne, moves.dvorah.broodMother.dFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMotherF11Df4Transition = {
  id: "dvorah:brood-mother:f11-df4",
  label: {
    EN: "F11+DF4",
    fallback: "F11+DF4",
  },
  route: [moves.dvorah.broodMother.fOneOne, moves.dvorah.broodMother.dFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMotherF34Transition = {
  id: "dvorah:brood-mother:f34",
  label: {
    EN: "F34",
    fallback: "F34",
  },
  route: [moves.dvorah.broodMother.fThreeFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMotherF44Transition = {
  id: "dvorah:brood-mother:f44",
  label: {
    EN: "F44",
    fallback: "F44",
  },
  route: [moves.dvorah.broodMother.fFourFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMotherF44Db4Transition = {
  id: "dvorah:brood-mother:f44-db4",
  label: {
    EN: "F44+DB4",
    fallback: "F44+DB4",
  },
  route: [moves.dvorah.broodMother.fFourFour, moves.dvorah.broodMother.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ermacMasterOfSouls112Bf2Transition = {
  id: "ermac:master-of-souls:112-bf2",
  label: {
    EN: "112+BF2",
    fallback: "112+BF2",
  },
  route: [moves.ermac.masterOfSouls.oneOneTwo, moves.ermac.masterOfSouls.bFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ermacMasterOfSoulsD2Transition = {
  id: "ermac:master-of-souls:d2",
  label: {
    EN: "D2",
    fallback: "D2",
  },
  route: [moves.ermac.masterOfSouls.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ermacMasterOfSoulsDb4Transition = {
  id: "ermac:master-of-souls:db4",
  label: {
    EN: "DB4",
    fallback: "DB4",
  },
  route: [moves.ermac.masterOfSouls.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlaw112Transition = {
  id: "erron-black:outlaw:112",
  label: {
    EN: "112",
    fallback: "112",
  },
  route: [moves.erronBlack.outlaw.oneOneTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlaw11B3Db4Transition = {
  id: "erron-black:outlaw:11b3-db4",
  label: {
    EN: "11B3+DB4",
    fallback: "11B3+DB4",
  },
  route: [moves.erronBlack.outlaw.oneOneBThree, moves.erronBlack.outlaw.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlaw21122Bf4Transition = {
  id: "erron-black:outlaw:21122-bf4",
  label: {
    EN: "21122+BF4",
    fallback: "21122+BF4",
  },
  route: [moves.erronBlack.outlaw.twoOneOneTwoTwo, moves.erronBlack.outlaw.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlaw21122Dbf2Transition = {
  id: "erron-black:outlaw:21122-dbf2",
  label: {
    EN: "21122+DBF2",
    fallback: "21122+DBF2",
  },
  route: [moves.erronBlack.outlaw.twoOneOneTwoTwo, moves.erronBlack.outlaw.dBFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlaw21122Exdb4Transition = {
  id: "erron-black:outlaw:21122-exdb4",
  label: {
    EN: "21122+EXDB4",
    fallback: "21122+EXDB4",
  },
  route: [moves.erronBlack.outlaw.twoOneOneTwoTwo, moves.erronBlack.outlaw.exDBFour],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlawB33Db4Transition = {
  id: "erron-black:outlaw:b33-db4",
  label: {
    EN: "B33+DB4",
    fallback: "B33+DB4",
  },
  route: [moves.erronBlack.outlaw.bThreeThree, moves.erronBlack.outlaw.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlawB33Df2Transition = {
  id: "erron-black:outlaw:b33-df2",
  label: {
    EN: "B33+DF2",
    fallback: "B33+DF2",
  },
  route: [moves.erronBlack.outlaw.bThreeThree, moves.erronBlack.outlaw.dFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlawB33Exbf3Transition = {
  id: "erron-black:outlaw:b33-exbf3",
  label: {
    EN: "B33+EXBF3",
    fallback: "B33+EXBF3",
  },
  route: [moves.erronBlack.outlaw.bThreeThree, moves.erronBlack.outlaw.exBFThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlawBf4Transition = {
  id: "erron-black:outlaw:bf4",
  label: {
    EN: "BF4",
    fallback: "BF4",
  },
  route: [moves.erronBlack.outlaw.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlawD1Transition = {
  id: "erron-black:outlaw:d1",
  label: {
    EN: "D1",
    fallback: "D1",
  },
  route: [moves.erronBlack.outlaw.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlawD2Transition = {
  id: "erron-black:outlaw:d2",
  label: {
    EN: "D2",
    fallback: "D2",
  },
  route: [moves.erronBlack.outlaw.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlawF13Db4Transition = {
  id: "erron-black:outlaw:f13-db4",
  label: {
    EN: "F13+DB4",
    fallback: "F13+DB4",
  },
  route: [moves.erronBlack.outlaw.fOneThree, moves.erronBlack.outlaw.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ferraTorrRuthless11Transition = {
  id: "ferra-torr:ruthless:11",
  label: {
    EN: "11",
    fallback: "11",
  },
  route: [moves.ferraTorr.ruthless.oneOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ferraTorrRuthless11Exbf2Transition = {
  id: "ferra-torr:ruthless:11-exbf2",
  label: {
    EN: "11+EXBF2",
    fallback: "11+EXBF2",
  },
  route: [moves.ferraTorr.ruthless.oneOne, moves.ferraTorr.ruthless.exBFTwo],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ferraTorrRuthless11Exdb2Transition = {
  id: "ferra-torr:ruthless:11-exdb2",
  label: {
    EN: "11+EXDB2",
    fallback: "11+EXDB2",
  },
  route: [moves.ferraTorr.ruthless.oneOne, moves.ferraTorr.ruthless.exDBTwo],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ferraTorrRuthless4Bf3Transition = {
  id: "ferra-torr:ruthless:4-bf3",
  label: {
    EN: "4+BF3",
    fallback: "4+BF3",
  },
  route: [moves.ferraTorr.ruthless.four, moves.ferraTorr.ruthless.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ferraTorrRuthlessB121Exbf2Transition = {
  id: "ferra-torr:ruthless:b121-exbf2",
  label: {
    EN: "B121+EXBF2",
    fallback: "B121+EXBF2",
  },
  route: [moves.ferraTorr.ruthless.bOneTwoOne, moves.ferraTorr.ruthless.exBFTwo],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ferraTorrRuthlessB121Exdb2Transition = {
  id: "ferra-torr:ruthless:b121-exdb2",
  label: {
    EN: "B121+EXDB2",
    fallback: "B121+EXDB2",
  },
  route: [moves.ferraTorr.ruthless.bOneTwoOne, moves.ferraTorr.ruthless.exDBTwo],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ferraTorrRuthlessD2Transition = {
  id: "ferra-torr:ruthless:d2",
  label: {
    EN: "D2",
    fallback: "D2",
  },
  route: [moves.ferraTorr.ruthless.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ferraTorrRuthlessF2Transition = {
  id: "ferra-torr:ruthless:f2",
  label: {
    EN: "F2",
    fallback: "F2",
  },
  route: [moves.ferraTorr.ruthless.fTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const ferraTorrRuthlessF3Dbf1Transition = {
  id: "ferra-torr:ruthless:f3-dbf1",
  label: {
    EN: "F3+DBF1",
    fallback: "F3+DBF1",
  },
  route: [moves.ferraTorr.ruthless.fThree, moves.ferraTorr.ruthless.dBFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarrior121Dbf3Transition = {
  id: "goro:kuatan-warrior:121-dbf3",
  label: {
    EN: "121+DBF3",
    fallback: "121+DBF3",
  },
  route: [moves.goro.kuatanWarrior.oneTwoOne, moves.goro.kuatanWarrior.dBFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarrior121Exdbf3Transition = {
  id: "goro:kuatan-warrior:121-exdbf3",
  label: {
    EN: "121+EXDBF3",
    fallback: "121+EXDBF3",
  },
  route: [moves.goro.kuatanWarrior.oneTwoOne, moves.goro.kuatanWarrior.exDBFThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarrior3D3Transition = {
  id: "goro:kuatan-warrior:3d3",
  label: {
    EN: "3D3",
    fallback: "3D3",
  },
  route: [moves.goro.kuatanWarrior.threeDThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarrior3D3Bf4Transition = {
  id: "goro:kuatan-warrior:3d3-bf4",
  label: {
    EN: "3D3+BF4",
    fallback: "3D3+BF4",
  },
  route: [moves.goro.kuatanWarrior.threeDThree, moves.goro.kuatanWarrior.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarrior4Dbf3Transition = {
  id: "goro:kuatan-warrior:4-dbf3",
  label: {
    EN: "4+DBF3",
    fallback: "4+DBF3",
  },
  route: [moves.goro.kuatanWarrior.four, moves.goro.kuatanWarrior.dBFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarrior4Exbf1Transition = {
  id: "goro:kuatan-warrior:4-exbf1",
  label: {
    EN: "4+EXBF1",
    fallback: "4+EXBF1",
  },
  route: [moves.goro.kuatanWarrior.four, moves.goro.kuatanWarrior.exBFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarriorB12U2Transition = {
  id: "goro:kuatan-warrior:b12u2",
  label: {
    EN: "B12U2",
    fallback: "B12U2",
  },
  route: [moves.goro.kuatanWarrior.bOneTwoUTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarriorB2Transition = {
  id: "goro:kuatan-warrior:b2",
  label: {
    EN: "B2",
    fallback: "B2",
  },
  route: [moves.goro.kuatanWarrior.bTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarriorD1Transition = {
  id: "goro:kuatan-warrior:d1",
  label: {
    EN: "D1",
    fallback: "D1",
  },
  route: [moves.goro.kuatanWarrior.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarriorF3Bf2Transition = {
  id: "goro:kuatan-warrior:f3-bf2",
  label: {
    EN: "F3+BF2",
    fallback: "F3+BF2",
  },
  route: [moves.goro.kuatanWarrior.fThree, moves.goro.kuatanWarrior.bFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarriorF3Dbf3Transition = {
  id: "goro:kuatan-warrior:f3-dbf3",
  label: {
    EN: "F3+DBF3",
    fallback: "F3+DBF3",
  },
  route: [moves.goro.kuatanWarrior.fThree, moves.goro.kuatanWarrior.dBFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarriorMbTransition = {
  id: "goro:kuatan-warrior:mb",
  label: {
    EN: "MB",
    fallback: "MB",
  },
  route: [moves.goro.kuatanWarrior.mb],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAuto11Transition = {
  id: "jacqui-briggs:full-auto:11",
  label: {
    EN: "11",
    fallback: "11",
  },
  route: [moves.jacquiBriggs.fullAuto.oneOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAuto114Bf4Transition = {
  id: "jacqui-briggs:full-auto:114-bf4",
  label: {
    EN: "114+BF4",
    fallback: "114+BF4",
  },
  route: [moves.jacquiBriggs.fullAuto.oneOneFour, moves.jacquiBriggs.fullAuto.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAuto1212Bf4Transition = {
  id: "jacqui-briggs:full-auto:1212-bf4",
  label: {
    EN: "1212+BF4",
    fallback: "1212+BF4",
  },
  route: [moves.jacquiBriggs.fullAuto.oneTwoOneTwo, moves.jacquiBriggs.fullAuto.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAuto121Db3Transition = {
  id: "jacqui-briggs:full-auto:121-db3",
  label: {
    EN: "121+DB3",
    fallback: "121+DB3",
  },
  route: [moves.jacquiBriggs.fullAuto.oneTwoOne, moves.jacquiBriggs.fullAuto.dBThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAuto121Exdb3Transition = {
  id: "jacqui-briggs:full-auto:121-exdb3",
  label: {
    EN: "121+EXDB3",
    fallback: "121+EXDB3",
  },
  route: [moves.jacquiBriggs.fullAuto.oneTwoOne, moves.jacquiBriggs.fullAuto.exDBThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAuto1F2U2Transition = {
  id: "jacqui-briggs:full-auto:1-f2u2",
  label: {
    EN: "1+F2U2",
    fallback: "1+F2U2",
  },
  route: [moves.jacquiBriggs.fullAuto.one, moves.jacquiBriggs.fullAuto.fTwoUTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAuto23Db3Transition = {
  id: "jacqui-briggs:full-auto:23-db3",
  label: {
    EN: "23+DB3",
    fallback: "23+DB3",
  },
  route: [moves.jacquiBriggs.fullAuto.twoThree, moves.jacquiBriggs.fullAuto.dBThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAuto33Bf4Transition = {
  id: "jacqui-briggs:full-auto:33-bf4",
  label: {
    EN: "33+BF4",
    fallback: "33+BF4",
  },
  route: [moves.jacquiBriggs.fullAuto.threeThree, moves.jacquiBriggs.fullAuto.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAuto33Db2Transition = {
  id: "jacqui-briggs:full-auto:33-db2",
  label: {
    EN: "33+DB2",
    fallback: "33+DB2",
  },
  route: [moves.jacquiBriggs.fullAuto.threeThree, moves.jacquiBriggs.fullAuto.dBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAuto4Bf4Transition = {
  id: "jacqui-briggs:full-auto:4-bf4",
  label: {
    EN: "4+BF4",
    fallback: "4+BF4",
  },
  route: [moves.jacquiBriggs.fullAuto.four, moves.jacquiBriggs.fullAuto.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoB2Exdb2Transition = {
  id: "jacqui-briggs:full-auto:b2-exdb2",
  label: {
    EN: "B2+EXDB2",
    fallback: "B2+EXDB2",
  },
  route: [moves.jacquiBriggs.fullAuto.bTwo, moves.jacquiBriggs.fullAuto.exDBTwo],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoB2Exdb3Transition = {
  id: "jacqui-briggs:full-auto:b2-exdb3",
  label: {
    EN: "B2+EXDB3",
    fallback: "B2+EXDB3",
  },
  route: [moves.jacquiBriggs.fullAuto.bTwo, moves.jacquiBriggs.fullAuto.exDBThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoB33Db3Transition = {
  id: "jacqui-briggs:full-auto:b33-db3",
  label: {
    EN: "B33+DB3",
    fallback: "B33+DB3",
  },
  route: [moves.jacquiBriggs.fullAuto.bThreeThree, moves.jacquiBriggs.fullAuto.dBThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoB33Exdb3Transition = {
  id: "jacqui-briggs:full-auto:b33-exdb3",
  label: {
    EN: "B33+EXDB3",
    fallback: "B33+EXDB3",
  },
  route: [moves.jacquiBriggs.fullAuto.bThreeThree, moves.jacquiBriggs.fullAuto.exDBThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoBf1Transition = {
  id: "jacqui-briggs:full-auto:bf1",
  label: {
    EN: "BF1",
    fallback: "BF1",
  },
  route: [moves.jacquiBriggs.fullAuto.bFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoBf2Transition = {
  id: "jacqui-briggs:full-auto:bf2",
  label: {
    EN: "BF2",
    fallback: "BF2",
  },
  route: [moves.jacquiBriggs.fullAuto.bFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoDashTransition = {
  id: "jacqui-briggs:full-auto:dash",
  label: {
    EN: "DASH",
    fallback: "DASH",
  },
  route: [moves.general.dash],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoDu4Transition = {
  id: "jacqui-briggs:full-auto:du4",
  label: {
    EN: "DU4",
    fallback: "DU4",
  },
  route: [moves.jacquiBriggs.fullAuto.dUFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoF12Db2Transition = {
  id: "jacqui-briggs:full-auto:f12-db2",
  label: {
    EN: "F12+DB2",
    fallback: "F12+DB2",
  },
  route: [moves.jacquiBriggs.fullAuto.fOneTwo, moves.jacquiBriggs.fullAuto.dBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoF1Bf4Transition = {
  id: "jacqui-briggs:full-auto:f1-bf4",
  label: {
    EN: "F1+BF4",
    fallback: "F1+BF4",
  },
  route: [moves.jacquiBriggs.fullAuto.fOne, moves.jacquiBriggs.fullAuto.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoF2U2Transition = {
  id: "jacqui-briggs:full-auto:f2u2",
  label: {
    EN: "F2U2",
    fallback: "F2U2",
  },
  route: [moves.jacquiBriggs.fullAuto.fTwoUTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasher111Df1Transition = {
  id: "jason-voorhees:slasher:111-df1",
  label: {
    EN: "111+DF1",
    fallback: "111+DF1",
  },
  route: [moves.jasonVoorhees.slasher.oneOneOne, moves.jasonVoorhees.slasher.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasher111Exbf2Transition = {
  id: "jason-voorhees:slasher:111-exbf2",
  label: {
    EN: "111+EXBF2",
    fallback: "111+EXBF2",
  },
  route: [moves.jasonVoorhees.slasher.oneOneOne, moves.jasonVoorhees.slasher.exBFTwo],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasher111Exdf1Transition = {
  id: "jason-voorhees:slasher:111-exdf1",
  label: {
    EN: "111+EXDF1",
    fallback: "111+EXDF1",
  },
  route: [moves.jasonVoorhees.slasher.oneOneOne, moves.jasonVoorhees.slasher.exDFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasher11Df1Transition = {
  id: "jason-voorhees:slasher:11-df1",
  label: {
    EN: "11+DF1",
    fallback: "11+DF1",
  },
  route: [moves.jasonVoorhees.slasher.oneOne, moves.jasonVoorhees.slasher.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasher11Exdf1Transition = {
  id: "jason-voorhees:slasher:11-exdf1",
  label: {
    EN: "11+EXDF1",
    fallback: "11+EXDF1",
  },
  route: [moves.jasonVoorhees.slasher.oneOne, moves.jasonVoorhees.slasher.exDFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasher122Bf3Transition = {
  id: "jason-voorhees:slasher:122-bf3",
  label: {
    EN: "122+BF3",
    fallback: "122+BF3",
  },
  route: [moves.jasonVoorhees.slasher.oneTwoTwo, moves.jasonVoorhees.slasher.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasher24Transition = {
  id: "jason-voorhees:slasher:24",
  label: {
    EN: "24",
    fallback: "24",
  },
  route: [moves.jasonVoorhees.slasher.twoFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasherB122Transition = {
  id: "jason-voorhees:slasher:b122",
  label: {
    EN: "B122",
    fallback: "B122",
  },
  route: [moves.jasonVoorhees.slasher.bOneTwoTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasherB2Transition = {
  id: "jason-voorhees:slasher:b2",
  label: {
    EN: "B2",
    fallback: "B2",
  },
  route: [moves.jasonVoorhees.slasher.bTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasherD1Transition = {
  id: "jason-voorhees:slasher:d1",
  label: {
    EN: "D1",
    fallback: "D1",
  },
  route: [moves.jasonVoorhees.slasher.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasherF2Df1Transition = {
  id: "jason-voorhees:slasher:f2-df1",
  label: {
    EN: "F2+DF1",
    fallback: "F2+DF1",
  },
  route: [moves.jasonVoorhees.slasher.fTwo, moves.jasonVoorhees.slasher.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasherF2Exbf2Transition = {
  id: "jason-voorhees:slasher:f2-exbf2",
  label: {
    EN: "F2+EXBF2",
    fallback: "F2+EXBF2",
  },
  route: [moves.jasonVoorhees.slasher.fTwo, moves.jasonVoorhees.slasher.exBFTwo],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasherF42Transition = {
  id: "jason-voorhees:slasher:f42",
  label: {
    EN: "F42",
    fallback: "F42",
  },
  route: [moves.jasonVoorhees.slasher.fFourTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeapons11Transition = {
  id: "jax:heavy-weapons:11",
  label: {
    EN: "11",
    fallback: "11",
  },
  route: [moves.jax.heavyWeapons.oneOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeapons11Db1Transition = {
  id: "jax:heavy-weapons:11-db1",
  label: {
    EN: "11+DB1",
    fallback: "11+DB1",
  },
  route: [moves.jax.heavyWeapons.oneOne, moves.jax.heavyWeapons.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeapons124Db1Transition = {
  id: "jax:heavy-weapons:124-db1",
  label: {
    EN: "124+DB1",
    fallback: "124+DB1",
  },
  route: [moves.jax.heavyWeapons.oneTwoFour, moves.jax.heavyWeapons.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeapons124Exdb1Transition = {
  id: "jax:heavy-weapons:124-exdb1",
  label: {
    EN: "124+EXDB1",
    fallback: "124+EXDB1",
  },
  route: [moves.jax.heavyWeapons.oneTwoFour, moves.jax.heavyWeapons.exDBOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeapons12Db1Transition = {
  id: "jax:heavy-weapons:12-db1",
  label: {
    EN: "12+DB1",
    fallback: "12+DB1",
  },
  route: [moves.jax.heavyWeapons.oneTwo, moves.jax.heavyWeapons.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeapons3b2Transition = {
  id: "jax:heavy-weapons:3b2",
  label: {
    EN: "3B2",
    fallback: "3B2",
  },
  route: [moves.jax.heavyWeapons.threeBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeaponsB2Exbf2dTransition = {
  id: "jax:heavy-weapons:b2-exbf2d",
  label: {
    EN: "B2+EXBF2D",
    fallback: "B2+EXBF2D",
  },
  route: [moves.jax.heavyWeapons.bTwo, moves.jax.heavyWeapons.exBFTwoD],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeaponsB34Exbf2dTransition = {
  id: "jax:heavy-weapons:b34-exbf2d",
  label: {
    EN: "B34+EXBF2D",
    fallback: "B34+EXBF2D",
  },
  route: [moves.jax.heavyWeapons.bThreeFour, moves.jax.heavyWeapons.exBFTwoD],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeaponsB34Exdb1Transition = {
  id: "jax:heavy-weapons:b34-exdb1",
  label: {
    EN: "B34+EXDB1",
    fallback: "B34+EXDB1",
  },
  route: [moves.jax.heavyWeapons.bThreeFour, moves.jax.heavyWeapons.exDBOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeaponsB3Bf2dTransition = {
  id: "jax:heavy-weapons:b3-bf2d",
  label: {
    EN: "B3+BF2D",
    fallback: "B3+BF2D",
  },
  route: [moves.jax.heavyWeapons.bThree, moves.jax.heavyWeapons.bFTwoD],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeaponsD12Transition = {
  id: "jax:heavy-weapons:d12",
  label: {
    EN: "D12",
    fallback: "D12",
  },
  route: [moves.jax.heavyWeapons.dOneTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeaponsF21Transition = {
  id: "jax:heavy-weapons:f21",
  label: {
    EN: "F21",
    fallback: "F21",
  },
  route: [moves.jax.heavyWeapons.fTwoOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeaponsF212Transition = {
  id: "jax:heavy-weapons:f212",
  label: {
    EN: "F212",
    fallback: "F212",
  },
  route: [moves.jax.heavyWeapons.fTwoOneTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeaponsF212d24Transition = {
  id: "jax:heavy-weapons:f212d-2-4",
  label: {
    EN: "F212D+2+4",
    fallback: "F212D+2+4",
  },
  route: [
    moves.jax.heavyWeapons.fTwoOneTwoD,
    moves.jax.heavyWeapons.two,
    moves.jax.heavyWeapons.four,
  ],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDouble113Bd3Transition = {
  id: "johnny-cage:stunt-double:113-bd3",
  label: {
    EN: "113+BD3",
    fallback: "113+BD3",
  },
  route: [moves.johnnyCage.stuntDouble.oneOneThree, moves.johnnyCage.stuntDouble.bDThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDouble113Db1Transition = {
  id: "johnny-cage:stunt-double:113-db1",
  label: {
    EN: "113+DB1",
    fallback: "113+DB1",
  },
  route: [moves.johnnyCage.stuntDouble.oneOneThree, moves.johnnyCage.stuntDouble.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDouble113Exbd3Transition = {
  id: "johnny-cage:stunt-double:113-exbd3",
  label: {
    EN: "113+EXBD3",
    fallback: "113+EXBD3",
  },
  route: [moves.johnnyCage.stuntDouble.oneOneThree, moves.johnnyCage.stuntDouble.exBDThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDouble114Db1Transition = {
  id: "johnny-cage:stunt-double:114-db1",
  label: {
    EN: "114+DB1",
    fallback: "114+DB1",
  },
  route: [moves.johnnyCage.stuntDouble.oneOneFour, moves.johnnyCage.stuntDouble.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDouble12Transition = {
  id: "johnny-cage:stunt-double:12",
  label: {
    EN: "12",
    fallback: "12",
  },
  route: [moves.johnnyCage.stuntDouble.oneTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDouble12Bd3Transition = {
  id: "johnny-cage:stunt-double:12-bd3",
  label: {
    EN: "12+BD3",
    fallback: "12+BD3",
  },
  route: [moves.johnnyCage.stuntDouble.oneTwo, moves.johnnyCage.stuntDouble.bDThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDouble4Db1Transition = {
  id: "johnny-cage:stunt-double:4-db1",
  label: {
    EN: "4+DB1",
    fallback: "4+DB1",
  },
  route: [moves.johnnyCage.stuntDouble.four, moves.johnnyCage.stuntDouble.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDoubleD1Transition = {
  id: "johnny-cage:stunt-double:d1",
  label: {
    EN: "D1",
    fallback: "D1",
  },
  route: [moves.johnnyCage.stuntDouble.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDoubleDashTransition = {
  id: "johnny-cage:stunt-double:dash",
  label: {
    EN: "DASH",
    fallback: "DASH",
  },
  route: [moves.general.dash],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDoubleDb4Transition = {
  id: "johnny-cage:stunt-double:db4",
  label: {
    EN: "DB4",
    fallback: "DB4",
  },
  route: [moves.johnnyCage.stuntDouble.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDoubleF24Transition = {
  id: "johnny-cage:stunt-double:f24",
  label: {
    EN: "F24",
    fallback: "F24",
  },
  route: [moves.johnnyCage.stuntDouble.fTwoFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDoubleF24Exbf4Transition = {
  id: "johnny-cage:stunt-double:f24-exbf4",
  label: {
    EN: "F24+EXBF4",
    fallback: "F24+EXBF4",
  },
  route: [moves.johnnyCage.stuntDouble.fTwoFour, moves.johnnyCage.stuntDouble.exBFFour],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDoubleF24Exdb2Transition = {
  id: "johnny-cage:stunt-double:f24-exdb2",
  label: {
    EN: "F24+EXDB2",
    fallback: "F24+EXDB2",
  },
  route: [moves.johnnyCage.stuntDouble.fTwoFour, moves.johnnyCage.stuntDouble.exDBTwo],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDoubleF3Bd3Transition = {
  id: "johnny-cage:stunt-double:f3-bd3",
  label: {
    EN: "F3+BD3",
    fallback: "F3+BD3",
  },
  route: [moves.johnnyCage.stuntDouble.fThree, moves.johnnyCage.stuntDouble.bDThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDoubleF3Db1Transition = {
  id: "johnny-cage:stunt-double:f3-db1",
  label: {
    EN: "F3+DB1",
    fallback: "F3+DB1",
  },
  route: [moves.johnnyCage.stuntDouble.fThree, moves.johnnyCage.stuntDouble.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDoubleF3Exbd3Transition = {
  id: "johnny-cage:stunt-double:f3-exbd3",
  label: {
    EN: "F3+EXBD3",
    fallback: "F3+EXBD3",
  },
  route: [moves.johnnyCage.stuntDouble.fThree, moves.johnnyCage.stuntDouble.exBDThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroat112Bf3Transition = {
  id: "kano:cutthroat:112-bf3",
  label: {
    EN: "112+BF3",
    fallback: "112+BF3",
  },
  route: [moves.kano.cutthroat.oneOneTwo, moves.kano.cutthroat.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroat112Exdb1Transition = {
  id: "kano:cutthroat:112-exdb1",
  label: {
    EN: "112+EXDB1",
    fallback: "112+EXDB1",
  },
  route: [moves.kano.cutthroat.oneOneTwo, moves.kano.cutthroat.exDBOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroat112Exdd3Transition = {
  id: "kano:cutthroat:112-exdd3",
  label: {
    EN: "112+EXDD3",
    fallback: "112+EXDD3",
  },
  route: [moves.kano.cutthroat.oneOneTwo, moves.kano.cutthroat.exDDThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroat2Db1Transition = {
  id: "kano:cutthroat:2-db1",
  label: {
    EN: "2+DB1",
    fallback: "2+DB1",
  },
  route: [moves.kano.cutthroat.two, moves.kano.cutthroat.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroat32Transition = {
  id: "kano:cutthroat:32",
  label: {
    EN: "32",
    fallback: "32",
  },
  route: [moves.kano.cutthroat.threeTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroat4Bf3Transition = {
  id: "kano:cutthroat:4-bf3",
  label: {
    EN: "4+BF3",
    fallback: "4+BF3",
  },
  route: [moves.kano.cutthroat.four, moves.kano.cutthroat.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroatB121Df2Transition = {
  id: "kano:cutthroat:b121-df2",
  label: {
    EN: "B121+DF2",
    fallback: "B121+DF2",
  },
  route: [moves.kano.cutthroat.bOneTwoOne, moves.kano.cutthroat.dFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroatB312Transition = {
  id: "kano:cutthroat:b312",
  label: {
    EN: "B312",
    fallback: "B312",
  },
  route: [moves.kano.cutthroat.bThreeOneTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroatD3Transition = {
  id: "kano:cutthroat:d3",
  label: {
    EN: "D3",
    fallback: "D3",
  },
  route: [moves.kano.cutthroat.dThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroatF212Transition = {
  id: "kano:cutthroat:f212",
  label: {
    EN: "F212",
    fallback: "F212",
  },
  route: [moves.kano.cutthroat.fTwoOneTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroatF4Bf3Transition = {
  id: "kano:cutthroat:f4-bf3",
  label: {
    EN: "F4+BF3",
    fallback: "F4+BF3",
  },
  route: [moves.kano.cutthroat.fFour, moves.kano.cutthroat.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessed114Transition = {
  id: "kenshi:possessed:114",
  label: {
    EN: "114",
    fallback: "114",
  },
  route: [moves.kenshi.possessed.oneOneFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessed4Transition = {
  id: "kenshi:possessed:4",
  label: {
    EN: "4",
    fallback: "4",
  },
  route: [moves.kenshi.possessed.four],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessed421Exdb4bTransition = {
  id: "kenshi:possessed:421-exdb4b",
  label: {
    EN: "421+EXDB4B",
    fallback: "421+EXDB4B",
  },
  route: [moves.kenshi.possessed.fourTwoOne, moves.kenshi.possessed.exDBFourB],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessed43Bf3Transition = {
  id: "kenshi:possessed:43-bf3",
  label: {
    EN: "43+BF3",
    fallback: "43+BF3",
  },
  route: [moves.kenshi.possessed.fourThree, moves.kenshi.possessed.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessedB32Df4Transition = {
  id: "kenshi:possessed:b32-df4",
  label: {
    EN: "B32+DF4",
    fallback: "B32+DF4",
  },
  route: [moves.kenshi.possessed.bThreeTwo, moves.kenshi.possessed.dFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessedB32Exdb4Transition = {
  id: "kenshi:possessed:b32-exdb4",
  label: {
    EN: "B32+EXDB4",
    fallback: "B32+EXDB4",
  },
  route: [moves.kenshi.possessed.bThreeTwo, moves.kenshi.possessed.exDBFour],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessedB32Exdb4bTransition = {
  id: "kenshi:possessed:b32-exdb4b",
  label: {
    EN: "B32+EXDB4B",
    fallback: "B32+EXDB4B",
  },
  route: [moves.kenshi.possessed.bThreeTwo, moves.kenshi.possessed.exDBFourB],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessedBf3Transition = {
  id: "kenshi:possessed:bf3",
  label: {
    EN: "BF3",
    fallback: "BF3",
  },
  route: [moves.kenshi.possessed.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessedD1Transition = {
  id: "kenshi:possessed:d1",
  label: {
    EN: "D1",
    fallback: "D1",
  },
  route: [moves.kenshi.possessed.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessedD2Transition = {
  id: "kenshi:possessed:d2",
  label: {
    EN: "D2",
    fallback: "D2",
  },
  route: [moves.kenshi.possessed.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessedF32Bf3Transition = {
  id: "kenshi:possessed:f32-bf3",
  label: {
    EN: "F32+BF3",
    fallback: "F32+BF3",
  },
  route: [moves.kenshi.possessed.fThreeTwo, moves.kenshi.possessed.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessedF32Exdb1Transition = {
  id: "kenshi:possessed:f32-exdb1",
  label: {
    EN: "F32+EXDB1",
    fallback: "F32+EXDB1",
  },
  route: [moves.kenshi.possessed.fThreeTwo, moves.kenshi.possessed.exDBOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGod1Transition = {
  id: "kotal-kahn:war-god:1",
  label: {
    EN: "1",
    fallback: "1",
  },
  route: [moves.kotalKahn.warGod.one],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGod114Db1Transition = {
  id: "kotal-kahn:war-god:114-db1",
  label: {
    EN: "114+DB1",
    fallback: "114+DB1",
  },
  route: [moves.kotalKahn.warGod.oneOneFour, moves.kotalKahn.warGod.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGod114Df1Transition = {
  id: "kotal-kahn:war-god:114-df1",
  label: {
    EN: "114+DF1",
    fallback: "114+DF1",
  },
  route: [moves.kotalKahn.warGod.oneOneFour, moves.kotalKahn.warGod.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGod114Exdf1Transition = {
  id: "kotal-kahn:war-god:114-exdf1",
  label: {
    EN: "114+EXDF1",
    fallback: "114+EXDF1",
  },
  route: [moves.kotalKahn.warGod.oneOneFour, moves.kotalKahn.warGod.exDFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGod114Exdf12Transition = {
  id: "kotal-kahn:war-god:114exdf1",
  label: {
    EN: "114EXDF1",
    fallback: "114EXDF1",
  },
  route: [moves.kotalKahn.warGod.oneOneFour, moves.kotalKahn.warGod.exDFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGod114Exdf3Transition = {
  id: "kotal-kahn:war-god:114-exdf3",
  label: {
    EN: "114+EXDF3",
    fallback: "114+EXDF3",
  },
  route: [moves.kotalKahn.warGod.oneOneFour, moves.kotalKahn.warGod.exDFThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGod1FTransition = {
  id: "kotal-kahn:war-god:1f",
  label: {
    EN: "1F",
    fallback: "1F",
  },
  route: [moves.kotalKahn.warGod.oneF],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGod2Transition = {
  id: "kotal-kahn:war-god:2",
  label: {
    EN: "2",
    fallback: "2",
  },
  route: [moves.kotalKahn.warGod.two],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodB122Db1Transition = {
  id: "kotal-kahn:war-god:b122-db1",
  label: {
    EN: "B122+DB1",
    fallback: "B122+DB1",
  },
  route: [moves.kotalKahn.warGod.bOneTwoTwo, moves.kotalKahn.warGod.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodB122Exdf3Transition = {
  id: "kotal-kahn:war-god:b122-exdf3",
  label: {
    EN: "B122+EXDF3",
    fallback: "B122+EXDF3",
  },
  route: [moves.kotalKahn.warGod.bOneTwoTwo, moves.kotalKahn.warGod.exDFThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodB14Df1Transition = {
  id: "kotal-kahn:war-god:b14-df1",
  label: {
    EN: "B14+DF1",
    fallback: "B14+DF1",
  },
  route: [moves.kotalKahn.warGod.bOneFour, moves.kotalKahn.warGod.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodB14Exdb1Transition = {
  id: "kotal-kahn:war-god:b14-exdb1",
  label: {
    EN: "B14+EXDB1",
    fallback: "B14+EXDB1",
  },
  route: [moves.kotalKahn.warGod.bOneFour, moves.kotalKahn.warGod.exDBOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodB14Exdf1Transition = {
  id: "kotal-kahn:war-god:b14-exdf1",
  label: {
    EN: "B14+EXDF1",
    fallback: "B14+EXDF1",
  },
  route: [moves.kotalKahn.warGod.bOneFour, moves.kotalKahn.warGod.exDFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodB1Exdb1Transition = {
  id: "kotal-kahn:war-god:b1-exdb1",
  label: {
    EN: "B1+EXDB1",
    fallback: "B1+EXDB1",
  },
  route: [moves.kotalKahn.warGod.bOne, moves.kotalKahn.warGod.exDBOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodD1Transition = {
  id: "kotal-kahn:war-god:d1",
  label: {
    EN: "D1",
    fallback: "D1",
  },
  route: [moves.kotalKahn.warGod.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodD2Transition = {
  id: "kotal-kahn:war-god:d2",
  label: {
    EN: "D2",
    fallback: "D2",
  },
  route: [moves.kotalKahn.warGod.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodD4Df1Transition = {
  id: "kotal-kahn:war-god:d4-df1",
  label: {
    EN: "D4+DF1",
    fallback: "D4+DF1",
  },
  route: [moves.kotalKahn.warGod.dFour, moves.kotalKahn.warGod.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodF1B2Transition = {
  id: "kotal-kahn:war-god:f1b2",
  label: {
    EN: "F1B2",
    fallback: "F1B2",
  },
  route: [moves.kotalKahn.warGod.fOneBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodF2Transition = {
  id: "kotal-kahn:war-god:f2",
  label: {
    EN: "F2",
    fallback: "F2",
  },
  route: [moves.kotalKahn.warGod.fTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodF34Df2Transition = {
  id: "kotal-kahn:war-god:f34-df2",
  label: {
    EN: "F34+DF2",
    fallback: "F34+DF2",
  },
  route: [moves.kotalKahn.warGod.fThreeFour, moves.kotalKahn.warGod.dFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodF3Exdb1Transition = {
  id: "kotal-kahn:war-god:f3-exdb1",
  label: {
    EN: "F3+EXDB1",
    fallback: "F3+EXDB1",
  },
  route: [moves.kotalKahn.warGod.fThree, moves.kotalKahn.warGod.exDBOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungJinBojutsu111Bf4Transition = {
  id: "kung-jin:bojutsu:111-bf4",
  label: {
    EN: "111+BF4",
    fallback: "111+BF4",
  },
  route: [moves.kungJin.bojutsu.oneOneOne, moves.kungJin.bojutsu.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungJinBojutsu221Db3Transition = {
  id: "kung-jin:bojutsu:221-db3",
  label: {
    EN: "221+DB3",
    fallback: "221+DB3",
  },
  route: [moves.kungJin.bojutsu.twoTwoOne, moves.kungJin.bojutsu.dBThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungJinBojutsu221Exdb3Transition = {
  id: "kung-jin:bojutsu:221-exdb3",
  label: {
    EN: "221+EXDB3",
    fallback: "221+EXDB3",
  },
  route: [moves.kungJin.bojutsu.twoTwoOne, moves.kungJin.bojutsu.exDBThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungJinBojutsu343Db3Transition = {
  id: "kung-jin:bojutsu:343-db3",
  label: {
    EN: "343+DB3",
    fallback: "343+DB3",
  },
  route: [moves.kungJin.bojutsu.threeFourThree, moves.kungJin.bojutsu.dBThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungJinBojutsu34Db3Transition = {
  id: "kung-jin:bojutsu:34-db3",
  label: {
    EN: "34+DB3",
    fallback: "34+DB3",
  },
  route: [moves.kungJin.bojutsu.threeFour, moves.kungJin.bojutsu.dBThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungJinBojutsu4Db1Transition = {
  id: "kung-jin:bojutsu:4-db1",
  label: {
    EN: "4+DB1",
    fallback: "4+DB1",
  },
  route: [moves.kungJin.bojutsu.four, moves.kungJin.bojutsu.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungJinBojutsu4Exdb1Transition = {
  id: "kung-jin:bojutsu:4-exdb1",
  label: {
    EN: "4+EXDB1",
    fallback: "4+EXDB1",
  },
  route: [moves.kungJin.bojutsu.four, moves.kungJin.bojutsu.exDBOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungJinBojutsuB14Bf4Transition = {
  id: "kung-jin:bojutsu:b14-bf4",
  label: {
    EN: "B14+BF4",
    fallback: "B14+BF4",
  },
  route: [moves.kungJin.bojutsu.bOneFour, moves.kungJin.bojutsu.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungJinBojutsuF24Bf4Transition = {
  id: "kung-jin:bojutsu:f24-bf4",
  label: {
    EN: "F24+BF4",
    fallback: "F24+BF4",
  },
  route: [moves.kungJin.bojutsu.fTwoFour, moves.kungJin.bojutsu.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungLaoTempestB12Db1Transition = {
  id: "kung-lao:tempest:b12-db1",
  label: {
    EN: "B12+DB1",
    fallback: "B12+DB1",
  },
  route: [moves.kungLao.tempest.bOneTwo, moves.kungLao.tempest.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungLaoTempestB12Df1Transition = {
  id: "kung-lao:tempest:b12-df1",
  label: {
    EN: "B12+DF1",
    fallback: "B12+DF1",
  },
  route: [moves.kungLao.tempest.bOneTwo, moves.kungLao.tempest.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungLaoTempestB2Db1Transition = {
  id: "kung-lao:tempest:b2-db1",
  label: {
    EN: "B2+DB1",
    fallback: "B2+DB1",
  },
  route: [moves.kungLao.tempest.bTwo, moves.kungLao.tempest.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungLaoTempestB321Transition = {
  id: "kung-lao:tempest:b321",
  label: {
    EN: "B321",
    fallback: "B321",
  },
  route: [moves.kungLao.tempest.bThreeTwoOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungLaoTempestB321Db1Transition = {
  id: "kung-lao:tempest:b321-db1",
  label: {
    EN: "B321+DB1",
    fallback: "B321+DB1",
  },
  route: [moves.kungLao.tempest.bThreeTwoOne, moves.kungLao.tempest.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungLaoTempestB321Exdf1Transition = {
  id: "kung-lao:tempest:b321-exdf1",
  label: {
    EN: "B321+EXDF1",
    fallback: "B321+EXDF1",
  },
  route: [moves.kungLao.tempest.bThreeTwoOne, moves.kungLao.tempest.exDFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungLaoTempestD2Transition = {
  id: "kung-lao:tempest:d2",
  label: {
    EN: "D2",
    fallback: "D2",
  },
  route: [moves.kungLao.tempest.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const kungLaoTempestF23Db1Transition = {
  id: "kung-lao:tempest:f23-db1",
  label: {
    EN: "F23+DB1",
    fallback: "F23+DB1",
  },
  route: [moves.kungLao.tempest.fTwoThree, moves.kungLao.tempest.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKiller122Transition = {
  id: "leatherface:killer:122",
  label: {
    EN: "122",
    fallback: "122",
  },
  route: [moves.leatherface.killer.oneTwoTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKiller12Bd4Transition = {
  id: "leatherface:killer:12-bd4",
  label: {
    EN: "12+BD4",
    fallback: "12+BD4",
  },
  route: [moves.leatherface.killer.oneTwo, moves.leatherface.killer.bDFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKillerB1Bd4Transition = {
  id: "leatherface:killer:b1-bd4",
  label: {
    EN: "B1+BD4",
    fallback: "B1+BD4",
  },
  route: [moves.leatherface.killer.bOne, moves.leatherface.killer.bDFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKillerB1Db31Transition = {
  id: "leatherface:killer:b1-db3-1",
  label: {
    EN: "B1+DB3+1",
    fallback: "B1+DB3+1",
  },
  route: [
    moves.leatherface.killer.bOne,
    moves.leatherface.killer.dBThree,
    moves.leatherface.killer.one,
  ],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKillerF12Bd4Transition = {
  id: "leatherface:killer:f12-bd4",
  label: {
    EN: "F12+BD4",
    fallback: "F12+BD4",
  },
  route: [moves.leatherface.killer.fOneTwo, moves.leatherface.killer.bDFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKillerF12Db1Transition = {
  id: "leatherface:killer:f12-db1",
  label: {
    EN: "F12+DB1",
    fallback: "F12+DB1",
  },
  route: [moves.leatherface.killer.fOneTwo, moves.leatherface.killer.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKillerF12Db31Transition = {
  id: "leatherface:killer:f12-db3-1",
  label: {
    EN: "F12+DB3+1",
    fallback: "F12+DB3+1",
  },
  route: [
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBThree,
    moves.leatherface.killer.one,
  ],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKillerF12Db4Transition = {
  id: "leatherface:killer:f12-db4",
  label: {
    EN: "F12+DB4",
    fallback: "F12+DB4",
  },
  route: [moves.leatherface.killer.fOneTwo, moves.leatherface.killer.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKillerF21D2Transition = {
  id: "leatherface:killer:f21d2",
  label: {
    EN: "F21D2",
    fallback: "F21D2",
  },
  route: [moves.leatherface.killer.fTwoOneDTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKillerF3Bd4Transition = {
  id: "leatherface:killer:f3-bd4",
  label: {
    EN: "F3+BD4",
    fallback: "F3+BD4",
  },
  route: [moves.leatherface.killer.fThree, moves.leatherface.killer.bDFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKillerF3Db31Transition = {
  id: "leatherface:killer:f3-db3-1",
  label: {
    EN: "F3+DB3+1",
    fallback: "F3+DB3+1",
  },
  route: [
    moves.leatherface.killer.fThree,
    moves.leatherface.killer.dBThree,
    moves.leatherface.killer.one,
  ],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKillerMb2Transition = {
  id: "leatherface:killer:mb",
  label: {
    EN: "(MB)",
    fallback: "(MB)",
  },
  route: [moves.leatherface.killer.mb],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFist112Transition = {
  id: "liu-kang:flame-fist:112",
  label: {
    EN: "112",
    fallback: "112",
  },
  route: [moves.liuKang.flameFist.oneOneTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFist112Exdd1Transition = {
  id: "liu-kang:flame-fist:112-exdd1",
  label: {
    EN: "112+EXDD1",
    fallback: "112+EXDD1",
  },
  route: [moves.liuKang.flameFist.oneOneTwo, moves.liuKang.flameFist.exDDOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFist112Fbf4Transition = {
  id: "liu-kang:flame-fist:112-fbf4",
  label: {
    EN: "112+FBF4",
    fallback: "112+FBF4",
  },
  route: [moves.liuKang.flameFist.oneOneTwo, moves.liuKang.flameFist.fBFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFist113Transition = {
  id: "liu-kang:flame-fist:113",
  label: {
    EN: "113",
    fallback: "113",
  },
  route: [moves.liuKang.flameFist.oneOneThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistB12Transition = {
  id: "liu-kang:flame-fist:b12",
  label: {
    EN: "B12",
    fallback: "B12",
  },
  route: [moves.liuKang.flameFist.bOneTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistB12Fbf4Transition = {
  id: "liu-kang:flame-fist:b12-fbf4",
  label: {
    EN: "B12+FBF4",
    fallback: "B12+FBF4",
  },
  route: [moves.liuKang.flameFist.bOneTwo, moves.liuKang.flameFist.fBFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistB34Transition = {
  id: "liu-kang:flame-fist:b34",
  label: {
    EN: "B34",
    fallback: "B34",
  },
  route: [moves.liuKang.flameFist.bThreeFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistBf3Transition = {
  id: "liu-kang:flame-fist:bf3",
  label: {
    EN: "BF3",
    fallback: "BF3",
  },
  route: [moves.liuKang.flameFist.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistD1Transition = {
  id: "liu-kang:flame-fist:d1",
  label: {
    EN: "D1",
    fallback: "D1",
  },
  route: [moves.liuKang.flameFist.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistD2Transition = {
  id: "liu-kang:flame-fist:d2",
  label: {
    EN: "D2",
    fallback: "D2",
  },
  route: [moves.liuKang.flameFist.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistDb2Transition = {
  id: "liu-kang:flame-fist:db2",
  label: {
    EN: "DB2",
    fallback: "DB2",
  },
  route: [moves.liuKang.flameFist.dBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistDd1Transition = {
  id: "liu-kang:flame-fist:dd1",
  label: {
    EN: "DD1",
    fallback: "DD1",
  },
  route: [moves.liuKang.flameFist.dDOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistExbf1Transition = {
  id: "liu-kang:flame-fist:exbf1",
  label: {
    EN: "EXBF1",
    fallback: "EXBF1",
  },
  route: [moves.liuKang.flameFist.exBFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistExdd1Transition = {
  id: "liu-kang:flame-fist:exdd1",
  label: {
    EN: "EXDD1",
    fallback: "EXDD1",
  },
  route: [moves.liuKang.flameFist.exDDOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistF12Exdd1Transition = {
  id: "liu-kang:flame-fist:f12-exdd1",
  label: {
    EN: "F12+EXDD1",
    fallback: "F12+EXDD1",
  },
  route: [moves.liuKang.flameFist.fOneTwo, moves.liuKang.flameFist.exDDOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistF213Db2Transition = {
  id: "liu-kang:flame-fist:f213-db2",
  label: {
    EN: "F213+DB2",
    fallback: "F213+DB2",
  },
  route: [moves.liuKang.flameFist.fTwoOneThree, moves.liuKang.flameFist.dBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistF213Exbf1Transition = {
  id: "liu-kang:flame-fist:f213-exbf1",
  label: {
    EN: "F213+EXBF1",
    fallback: "F213+EXBF1",
  },
  route: [moves.liuKang.flameFist.fTwoOneThree, moves.liuKang.flameFist.exBFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistF213Fbf4Transition = {
  id: "liu-kang:flame-fist:f213-fbf4",
  label: {
    EN: "F213+FBF4",
    fallback: "F213+FBF4",
  },
  route: [moves.liuKang.flameFist.fTwoOneThree, moves.liuKang.flameFist.fBFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistF44Exbf1Transition = {
  id: "liu-kang:flame-fist:f44-exbf1",
  label: {
    EN: "F44+EXBF1",
    fallback: "F44+EXBF1",
  },
  route: [moves.liuKang.flameFist.fFourFour, moves.liuKang.flameFist.exBFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistF44Exfbf4Transition = {
  id: "liu-kang:flame-fist:f44-exfbf4",
  label: {
    EN: "F44+EXFBF4",
    fallback: "F44+EXFBF4",
  },
  route: [moves.liuKang.flameFist.fFourFour, moves.liuKang.flameFist.exFBFFour],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistF44Fbf4Transition = {
  id: "liu-kang:flame-fist:f44-fbf4",
  label: {
    EN: "F44+FBF4",
    fallback: "F44+FBF4",
  },
  route: [moves.liuKang.flameFist.fFourFour, moves.liuKang.flameFist.fBFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistFbf4Transition = {
  id: "liu-kang:flame-fist:fbf4",
  label: {
    EN: "FBF4",
    fallback: "FBF4",
  },
  route: [moves.liuKang.flameFist.fBFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistXrayTransition = {
  id: "liu-kang:flame-fist:xray",
  label: {
    EN: "XRAY",
    fallback: "XRAY",
  },
  route: [moves.general.xray],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const predatorHunter32Exdb4Transition = {
  id: "predator:hunter:32-exdb4",
  label: {
    EN: "32+EXDB4",
    fallback: "32+EXDB4",
  },
  route: [moves.predator.hunter.threeTwo, moves.predator.hunter.exDBFour],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const predatorHunterB311Bf4Transition = {
  id: "predator:hunter:b311-bf4",
  label: {
    EN: "B311+BF4",
    fallback: "B311+BF4",
  },
  route: [moves.predator.hunter.bThreeOneOne, moves.predator.hunter.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const predatorHunterBf2Transition = {
  id: "predator:hunter:bf2",
  label: {
    EN: "BF2",
    fallback: "BF2",
  },
  route: [moves.predator.hunter.bFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const predatorHunterDd1Transition = {
  id: "predator:hunter:dd1",
  label: {
    EN: "DD1",
    fallback: "DD1",
  },
  route: [moves.predator.hunter.dDOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const predatorHunterF4Transition = {
  id: "predator:hunter:f4",
  label: {
    EN: "F4",
    fallback: "F4",
  },
  route: [moves.predator.hunter.fFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const quanChiSummoner12Bf3Transition = {
  id: "quan-chi:summoner:12-bf3",
  label: {
    EN: "12+BF3",
    fallback: "12+BF3",
  },
  route: [moves.quanChi.summoner.oneTwo, moves.quanChi.summoner.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const quanChiSummoner141Transition = {
  id: "quan-chi:summoner:141",
  label: {
    EN: "141",
    fallback: "141",
  },
  route: [moves.quanChi.summoner.oneFourOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const quanChiSummonerB324Transition = {
  id: "quan-chi:summoner:b324",
  label: {
    EN: "B324",
    fallback: "B324",
  },
  route: [moves.quanChi.summoner.bThreeTwoFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const quanChiSummonerF4Bf3Transition = {
  id: "quan-chi:summoner:f4-bf3",
  label: {
    EN: "F4+BF3",
    fallback: "F4+BF3",
  },
  route: [moves.quanChi.summoner.fFour, moves.quanChi.summoner.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGod213Transition = {
  id: "raiden:thunder-god:213",
  label: {
    EN: "213",
    fallback: "213",
  },
  route: [moves.raiden.thunderGod.twoOneThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGod214Transition = {
  id: "raiden:thunder-god:214",
  label: {
    EN: "214",
    fallback: "214",
  },
  route: [moves.raiden.thunderGod.twoOneFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGodB11Transition = {
  id: "raiden:thunder-god:b11",
  label: {
    EN: "B11",
    fallback: "B11",
  },
  route: [moves.raiden.thunderGod.bOneOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGodB14Transition = {
  id: "raiden:thunder-god:b14",
  label: {
    EN: "B14",
    fallback: "B14",
  },
  route: [moves.raiden.thunderGod.bOneFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGodB14Db2Transition = {
  id: "raiden:thunder-god:b14-db2",
  label: {
    EN: "B14 DB2",
    fallback: "B14 DB2",
  },
  route: [moves.raiden.thunderGod.bOneFour, moves.raiden.thunderGod.dBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGodB2Transition = {
  id: "raiden:thunder-god:b2",
  label: {
    EN: "B2",
    fallback: "B2",
  },
  route: [moves.raiden.thunderGod.bTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGodB32Transition = {
  id: "raiden:thunder-god:b32",
  label: {
    EN: "B32",
    fallback: "B32",
  },
  route: [moves.raiden.thunderGod.bThreeTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGodB34Transition = {
  id: "raiden:thunder-god:b34",
  label: {
    EN: "B34",
    fallback: "B34",
  },
  route: [moves.raiden.thunderGod.bThreeFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGodBf3Transition = {
  id: "raiden:thunder-god:bf3",
  label: {
    EN: "BF3",
    fallback: "BF3",
  },
  route: [moves.raiden.thunderGod.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGodDf2Transition = {
  id: "raiden:thunder-god:df2",
  label: {
    EN: "DF2",
    fallback: "DF2",
  },
  route: [moves.raiden.thunderGod.dFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGodExdf2Transition = {
  id: "raiden:thunder-god:exdf2",
  label: {
    EN: "EXDF2",
    fallback: "EXDF2",
  },
  route: [moves.raiden.thunderGod.exDFTwo],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGodF12B2Transition = {
  id: "raiden:thunder-god:f12b2",
  label: {
    EN: "F12B2",
    fallback: "F12B2",
  },
  route: [moves.raiden.thunderGod.fOneTwoBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversal12Df3Transition = {
  id: "reptile:universal:12-df3",
  label: {
    EN: "12+DF3",
    fallback: "12+DF3",
  },
  route: [moves.reptile.universal.oneTwo, moves.reptile.universal.dFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversal141Transition = {
  id: "reptile:universal:141",
  label: {
    EN: "141",
    fallback: "141",
  },
  route: [moves.reptile.universal.oneFourOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversal21Transition = {
  id: "reptile:universal:21",
  label: {
    EN: "21",
    fallback: "21",
  },
  route: [moves.reptile.universal.twoOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversal2124Transition = {
  id: "reptile:universal:2124",
  label: {
    EN: "2124",
    fallback: "2124",
  },
  route: [moves.reptile.universal.twoOneTwoFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalB2Transition = {
  id: "reptile:universal:b2",
  label: {
    EN: "B2",
    fallback: "B2",
  },
  route: [moves.reptile.universal.bTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalB3Exdd3Transition = {
  id: "reptile:universal:b3-exdd3",
  label: {
    EN: "B3+EXDD3",
    fallback: "B3+EXDD3",
  },
  route: [moves.reptile.universal.bThree, moves.reptile.universal.exDDThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalD1Transition = {
  id: "reptile:universal:d1",
  label: {
    EN: "D1",
    fallback: "D1",
  },
  route: [moves.reptile.universal.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalD2Transition = {
  id: "reptile:universal:d2",
  label: {
    EN: "D2",
    fallback: "D2",
  },
  route: [moves.reptile.universal.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalD3Transition = {
  id: "reptile:universal:d3",
  label: {
    EN: "D3",
    fallback: "D3",
  },
  route: [moves.reptile.universal.dThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalF21Db2Transition = {
  id: "reptile:universal:f21-db2",
  label: {
    EN: "F21+DB2",
    fallback: "F21+DB2",
  },
  route: [moves.reptile.universal.fTwoOne, moves.reptile.universal.dBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalF21Db4Transition = {
  id: "reptile:universal:f21-db4",
  label: {
    EN: "F21+DB4",
    fallback: "F21+DB4",
  },
  route: [moves.reptile.universal.fTwoOne, moves.reptile.universal.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalF21MbTransition = {
  id: "reptile:universal:f21-mb",
  label: {
    EN: "F21(MB)",
    fallback: "F21(MB)",
  },
  route: [moves.reptile.universal.fTwoOne, moves.reptile.universal.mb],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalF412Bf2Transition = {
  id: "reptile:universal:f412-bf2",
  label: {
    EN: "F412+BF2",
    fallback: "F412+BF2",
  },
  route: [moves.reptile.universal.fFourOneTwo, moves.reptile.universal.bFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalF412Bf4Transition = {
  id: "reptile:universal:f412-bf4",
  label: {
    EN: "F412+BF4",
    fallback: "F412+BF4",
  },
  route: [moves.reptile.universal.fFourOneTwo, moves.reptile.universal.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalF412Db3Transition = {
  id: "reptile:universal:f412-db3",
  label: {
    EN: "F412+DB3",
    fallback: "F412+DB3",
  },
  route: [moves.reptile.universal.fFourOneTwo, moves.reptile.universal.dBThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalF412Db4Transition = {
  id: "reptile:universal:f412-db4",
  label: {
    EN: "F412+DB4",
    fallback: "F412+DB4",
  },
  route: [moves.reptile.universal.fFourOneTwo, moves.reptile.universal.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalF41Exdd3Transition = {
  id: "reptile:universal:f41-exdd3",
  label: {
    EN: "F41+EXDD3",
    fallback: "F41+EXDD3",
  },
  route: [moves.reptile.universal.fFourOne, moves.reptile.universal.exDDThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const scorpionNinjutsu214Bf4Transition = {
  id: "scorpion:ninjutsu:214-bf4",
  label: {
    EN: "214+BF4",
    fallback: "214+BF4",
  },
  route: [moves.scorpion.ninjutsu.twoOneFour, moves.scorpion.ninjutsu.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const scorpionNinjutsu214Db3Transition = {
  id: "scorpion:ninjutsu:214-db3",
  label: {
    EN: "214+DB3",
    fallback: "214+DB3",
  },
  route: [moves.scorpion.ninjutsu.twoOneFour, moves.scorpion.ninjutsu.dBThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const scorpionNinjutsuB2Transition = {
  id: "scorpion:ninjutsu:b2",
  label: {
    EN: "B2",
    fallback: "B2",
  },
  route: [moves.scorpion.ninjutsu.bTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const scorpionNinjutsuB2D2Transition = {
  id: "scorpion:ninjutsu:b2-d2",
  label: {
    EN: "B2+D2",
    fallback: "B2+D2",
  },
  route: [moves.scorpion.ninjutsu.bTwo, moves.scorpion.ninjutsu.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const scorpionNinjutsuF2Transition = {
  id: "scorpion:ninjutsu:f2",
  label: {
    EN: "F2",
    fallback: "F2",
  },
  route: [moves.scorpion.ninjutsu.fTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaper112Bf3Transition = {
  id: "shinnok:bone-shaper:112-bf3",
  label: {
    EN: "112+BF3",
    fallback: "112+BF3",
  },
  route: [moves.shinnok.boneShaper.oneOneTwo, moves.shinnok.boneShaper.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaper112Db2MbTransition = {
  id: "shinnok:bone-shaper:112-db2-mb",
  label: {
    EN: "112+DB2(MB)",
    fallback: "112+DB2(MB)",
  },
  route: [
    moves.shinnok.boneShaper.oneOneTwo,
    moves.shinnok.boneShaper.dBTwo,
    moves.shinnok.boneShaper.mb,
  ],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaper11Bf3Transition = {
  id: "shinnok:bone-shaper:11-bf3",
  label: {
    EN: "11+BF3",
    fallback: "11+BF3",
  },
  route: [moves.shinnok.boneShaper.oneOne, moves.shinnok.boneShaper.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaper312Transition = {
  id: "shinnok:bone-shaper:312",
  label: {
    EN: "312",
    fallback: "312",
  },
  route: [moves.shinnok.boneShaper.threeOneTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaperB1Bf3Transition = {
  id: "shinnok:bone-shaper:b1-bf3",
  label: {
    EN: "B1+BF3",
    fallback: "B1+BF3",
  },
  route: [moves.shinnok.boneShaper.bOne, moves.shinnok.boneShaper.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaperB1Bf3MbTransition = {
  id: "shinnok:bone-shaper:b1-bf3-mb",
  label: {
    EN: "B1+BF3(MB)",
    fallback: "B1+BF3(MB)",
  },
  route: [
    moves.shinnok.boneShaper.bOne,
    moves.shinnok.boneShaper.bFThree,
    moves.shinnok.boneShaper.mb,
  ],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaperB3Transition = {
  id: "shinnok:bone-shaper:b3",
  label: {
    EN: "B3",
    fallback: "B3",
  },
  route: [moves.shinnok.boneShaper.bThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaperD1Transition = {
  id: "shinnok:bone-shaper:d1",
  label: {
    EN: "D1",
    fallback: "D1",
  },
  route: [moves.shinnok.boneShaper.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaperD2Transition = {
  id: "shinnok:bone-shaper:d2",
  label: {
    EN: "D2",
    fallback: "D2",
  },
  route: [moves.shinnok.boneShaper.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaperDashTransition = {
  id: "shinnok:bone-shaper:dash",
  label: {
    EN: "DASH",
    fallback: "DASH",
  },
  route: [moves.general.dash],
  tags: ["community", "movement"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaperF41d2Transition = {
  id: "shinnok:bone-shaper:f41d2",
  label: {
    EN: "F41D2",
    fallback: "F41D2",
  },
  route: [moves.shinnok.boneShaper.fFourOneDTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaperF41d2Bf3Transition = {
  id: "shinnok:bone-shaper:f41d2-bf3",
  label: {
    EN: "F41D2+BF3",
    fallback: "F41D2+BF3",
  },
  route: [moves.shinnok.boneShaper.fFourOneDTwo, moves.shinnok.boneShaper.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaperF41d2Db2MbTransition = {
  id: "shinnok:bone-shaper:f41d2-db2-mb",
  label: {
    EN: "F41D2+DB2(MB)",
    fallback: "F41D2+DB2(MB)",
  },
  route: [
    moves.shinnok.boneShaper.fFourOneDTwo,
    moves.shinnok.boneShaper.dBTwo,
    moves.shinnok.boneShaper.mb,
  ],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolition1Transition = {
  id: "sonya-blade:demolition:1",
  label: {
    EN: "1",
    fallback: "1",
  },
  route: [moves.sonyaBlade.demolition.one],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolition12Transition = {
  id: "sonya-blade:demolition:12",
  label: {
    EN: "12",
    fallback: "12",
  },
  route: [moves.sonyaBlade.demolition.oneTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolition121Db1Transition = {
  id: "sonya-blade:demolition:121-db1",
  label: {
    EN: "121+DB1",
    fallback: "121+DB1",
  },
  route: [moves.sonyaBlade.demolition.oneTwoOne, moves.sonyaBlade.demolition.dBOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolition121Df1Transition = {
  id: "sonya-blade:demolition:121-df1",
  label: {
    EN: "121+DF1",
    fallback: "121+DF1",
  },
  route: [moves.sonyaBlade.demolition.oneTwoOne, moves.sonyaBlade.demolition.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolition124Transition = {
  id: "sonya-blade:demolition:124",
  label: {
    EN: "124",
    fallback: "124",
  },
  route: [moves.sonyaBlade.demolition.oneTwoFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolition4Df1Transition = {
  id: "sonya-blade:demolition:4-df1",
  label: {
    EN: "4+DF1",
    fallback: "4+DF1",
  },
  route: [moves.sonyaBlade.demolition.four, moves.sonyaBlade.demolition.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolition4Exdd1Transition = {
  id: "sonya-blade:demolition:4-exdd1",
  label: {
    EN: "4+EXDD1",
    fallback: "4+EXDD1",
  },
  route: [moves.sonyaBlade.demolition.four, moves.sonyaBlade.demolition.exDDOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolitionB14Df1Transition = {
  id: "sonya-blade:demolition:b14-df1",
  label: {
    EN: "B14+DF1",
    fallback: "B14+DF1",
  },
  route: [moves.sonyaBlade.demolition.bOneFour, moves.sonyaBlade.demolition.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolitionB33212Df1Transition = {
  id: "sonya-blade:demolition:b33212-df1",
  label: {
    EN: "B33212+DF1",
    fallback: "B33212+DF1",
  },
  route: [moves.sonyaBlade.demolition.bThreeThreeTwoOneTwo, moves.sonyaBlade.demolition.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolitionDashTransition = {
  id: "sonya-blade:demolition:dash",
  label: {
    EN: "DASH",
    fallback: "DASH",
  },
  route: [moves.general.dash],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolitionF2Bf4Transition = {
  id: "sonya-blade:demolition:f2-bf4",
  label: {
    EN: "F2+BF4",
    fallback: "F2+BF4",
  },
  route: [moves.sonyaBlade.demolition.fTwo, moves.sonyaBlade.demolition.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolitionF2Df1Transition = {
  id: "sonya-blade:demolition:f2-df1",
  label: {
    EN: "F2+DF1",
    fallback: "F2+DF1",
  },
  route: [moves.sonyaBlade.demolition.fTwo, moves.sonyaBlade.demolition.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolitionF4Transition = {
  id: "sonya-blade:demolition:f4",
  label: {
    EN: "F4",
    fallback: "F4",
  },
  route: [moves.sonyaBlade.demolition.fFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const subZeroGrandmasterB12Bf4Transition = {
  id: "sub-zero:grandmaster:b12-bf4",
  label: {
    EN: "B12+BF4",
    fallback: "B12+BF4",
  },
  route: [moves.subZero.grandmaster.bOneTwo, moves.subZero.grandmaster.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const subZeroGrandmasterB2Transition = {
  id: "sub-zero:grandmaster:b2",
  label: {
    EN: "B2",
    fallback: "B2",
  },
  route: [moves.subZero.grandmaster.bTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const subZeroGrandmasterBf4Transition = {
  id: "sub-zero:grandmaster:bf4",
  label: {
    EN: "BF4",
    fallback: "BF4",
  },
  route: [moves.subZero.grandmaster.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const subZeroGrandmasterF42Bf4Transition = {
  id: "sub-zero:grandmaster:f42-bf4",
  label: {
    EN: "F42+BF4",
    fallback: "F42+BF4",
  },
  route: [moves.subZero.grandmaster.fFourTwo, moves.subZero.grandmaster.bFFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const takedaShiraiRyu112Bf1Transition = {
  id: "takeda:shirai-ryu:112-bf1",
  label: {
    EN: "112+BF1",
    fallback: "112+BF1",
  },
  route: [moves.takeda.shiraiRyu.oneOneTwo, moves.takeda.shiraiRyu.bFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const takedaShiraiRyu112Bf2Transition = {
  id: "takeda:shirai-ryu:112-bf2",
  label: {
    EN: "112+BF2",
    fallback: "112+BF2",
  },
  route: [moves.takeda.shiraiRyu.oneOneTwo, moves.takeda.shiraiRyu.bFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const takedaShiraiRyu112Exdb1Transition = {
  id: "takeda:shirai-ryu:112-exdb1",
  label: {
    EN: "112+EXDB1",
    fallback: "112+EXDB1",
  },
  route: [moves.takeda.shiraiRyu.oneOneTwo, moves.takeda.shiraiRyu.exDBOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const takedaShiraiRyuB21Exdb1Transition = {
  id: "takeda:shirai-ryu:b21-exdb1",
  label: {
    EN: "B21+EXDB1",
    fallback: "B21+EXDB1",
  },
  route: [moves.takeda.shiraiRyu.bTwoOne, moves.takeda.shiraiRyu.exDBOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const takedaShiraiRyuB3Exdb1Transition = {
  id: "takeda:shirai-ryu:b3-exdb1",
  label: {
    EN: "B3+EXDB1",
    fallback: "B3+EXDB1",
  },
  route: [moves.takeda.shiraiRyu.bThree, moves.takeda.shiraiRyu.exDBOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const takedaShiraiRyuD1Transition = {
  id: "takeda:shirai-ryu:d1",
  label: {
    EN: "D1",
    fallback: "D1",
  },
  route: [moves.takeda.shiraiRyu.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const takedaShiraiRyuD2Transition = {
  id: "takeda:shirai-ryu:d2",
  label: {
    EN: "D2",
    fallback: "D2",
  },
  route: [moves.takeda.shiraiRyu.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const takedaShiraiRyuDb3Transition = {
  id: "takeda:shirai-ryu:db3",
  label: {
    EN: "DB3",
    fallback: "DB3",
  },
  route: [moves.takeda.shiraiRyu.dBThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const takedaShiraiRyuF4D1Transition = {
  id: "takeda:shirai-ryu:f4-d1",
  label: {
    EN: "F4+D1",
    fallback: "F4+D1",
  },
  route: [moves.takeda.shiraiRyu.fFour, moves.takeda.shiraiRyu.dOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsu11Transition = {
  id: "tanya:kobu-jutsu:11",
  label: {
    EN: "11",
    fallback: "11",
  },
  route: [moves.tanya.kobuJutsu.oneOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsu112Df2Transition = {
  id: "tanya:kobu-jutsu:112-df2",
  label: {
    EN: "112+DF2",
    fallback: "112+DF2",
  },
  route: [moves.tanya.kobuJutsu.oneOneTwo, moves.tanya.kobuJutsu.dFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsu112Exdf1Transition = {
  id: "tanya:kobu-jutsu:112-exdf1",
  label: {
    EN: "112+EXDF1",
    fallback: "112+EXDF1",
  },
  route: [moves.tanya.kobuJutsu.oneOneTwo, moves.tanya.kobuJutsu.exDFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsu2U3Transition = {
  id: "tanya:kobu-jutsu:2u3",
  label: {
    EN: "2U3",
    fallback: "2U3",
  },
  route: [moves.tanya.kobuJutsu.twoUThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsu4Transition = {
  id: "tanya:kobu-jutsu:4",
  label: {
    EN: "4",
    fallback: "4",
  },
  route: [moves.tanya.kobuJutsu.four],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsu4Df2Transition = {
  id: "tanya:kobu-jutsu:4-df2",
  label: {
    EN: "4+DF2",
    fallback: "4+DF2",
  },
  route: [moves.tanya.kobuJutsu.four, moves.tanya.kobuJutsu.dFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsu4Exbf4Transition = {
  id: "tanya:kobu-jutsu:4-exbf4",
  label: {
    EN: "4+EXBF4",
    fallback: "4+EXBF4",
  },
  route: [moves.tanya.kobuJutsu.four, moves.tanya.kobuJutsu.exBFFour],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsuB31Df2Transition = {
  id: "tanya:kobu-jutsu:b31-df2",
  label: {
    EN: "B31+DF2",
    fallback: "B31+DF2",
  },
  route: [moves.tanya.kobuJutsu.bThreeOne, moves.tanya.kobuJutsu.dFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsuB31Exdf1Transition = {
  id: "tanya:kobu-jutsu:b31-exdf1",
  label: {
    EN: "B31+EXDF1",
    fallback: "B31+EXDF1",
  },
  route: [moves.tanya.kobuJutsu.bThreeOne, moves.tanya.kobuJutsu.exDFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsuDf1Transition = {
  id: "tanya:kobu-jutsu:df1",
  label: {
    EN: "DF1",
    fallback: "DF1",
  },
  route: [moves.tanya.kobuJutsu.dFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsuDf2Transition = {
  id: "tanya:kobu-jutsu:df2",
  label: {
    EN: "DF2",
    fallback: "DF2",
  },
  route: [moves.tanya.kobuJutsu.dFTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsuExdf2Transition = {
  id: "tanya:kobu-jutsu:exdf2",
  label: {
    EN: "EXDF2",
    fallback: "EXDF2",
  },
  route: [moves.tanya.kobuJutsu.exDFTwo],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsuF2Exdf1Transition = {
  id: "tanya:kobu-jutsu:f2-exdf1",
  label: {
    EN: "F2+EXDF1",
    fallback: "F2+EXDF1",
  },
  route: [moves.tanya.kobuJutsu.fTwo, moves.tanya.kobuJutsu.exDFOne],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsuF43Transition = {
  id: "tanya:kobu-jutsu:f43",
  label: {
    EN: "F43",
    fallback: "F43",
  },
  route: [moves.tanya.kobuJutsu.fFourThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystalline123Db2Transition = {
  id: "tremor:crystalline:123-db2",
  label: {
    EN: "123+DB2",
    fallback: "123+DB2",
  },
  route: [moves.tremor.crystalline.oneTwoThree, moves.tremor.crystalline.dBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystalline21d4Db2dTransition = {
  id: "tremor:crystalline:21d4-db2d",
  label: {
    EN: "21D4+DB2D",
    fallback: "21D4+DB2D",
  },
  route: [moves.tremor.crystalline.twoOneDFour, moves.tremor.crystalline.dBTwoD],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystalline21d4Exbf4Transition = {
  id: "tremor:crystalline:21d4-exbf4",
  label: {
    EN: "21D4+EXBF4",
    fallback: "21D4+EXBF4",
  },
  route: [moves.tremor.crystalline.twoOneDFour, moves.tremor.crystalline.exBFFour],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystalline21Db2dTransition = {
  id: "tremor:crystalline:21-db2d",
  label: {
    EN: "21+DB2D",
    fallback: "21+DB2D",
  },
  route: [moves.tremor.crystalline.twoOne, moves.tremor.crystalline.dBTwoD],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystalline4Db2uTransition = {
  id: "tremor:crystalline:4-db2u",
  label: {
    EN: "4+DB2U",
    fallback: "4+DB2U",
  },
  route: [moves.tremor.crystalline.four, moves.tremor.crystalline.dBTwoU],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystallineB12Db2dTransition = {
  id: "tremor:crystalline:b12-db2d",
  label: {
    EN: "B12+DB2D",
    fallback: "B12+DB2D",
  },
  route: [moves.tremor.crystalline.bOneTwo, moves.tremor.crystalline.dBTwoD],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystallineB2Transition = {
  id: "tremor:crystalline:b2",
  label: {
    EN: "B2",
    fallback: "B2",
  },
  route: [moves.tremor.crystalline.bTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystallineB2Db2Transition = {
  id: "tremor:crystalline:b2-db2",
  label: {
    EN: "B2+DB2",
    fallback: "B2+DB2",
  },
  route: [moves.tremor.crystalline.bTwo, moves.tremor.crystalline.dBTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystallineB32Db2dTransition = {
  id: "tremor:crystalline:b32-db2d",
  label: {
    EN: "B32+DB2D",
    fallback: "B32+DB2D",
  },
  route: [moves.tremor.crystalline.bThreeTwo, moves.tremor.crystalline.dBTwoD],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystallineB3Db2dTransition = {
  id: "tremor:crystalline:b3-db2d",
  label: {
    EN: "B3+DB2D",
    fallback: "B3+DB2D",
  },
  route: [moves.tremor.crystalline.bThree, moves.tremor.crystalline.dBTwoD],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystallineDb2dTransition = {
  id: "tremor:crystalline:db2d",
  label: {
    EN: "DB2D",
    fallback: "DB2D",
  },
  route: [moves.tremor.crystalline.dBTwoD],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystallineDDb2uTransition = {
  id: "tremor:crystalline:d-db2u",
  label: {
    EN: "D+DB2U",
    fallback: "D+DB2U",
  },
  route: [moves.tremor.crystalline.d, moves.tremor.crystalline.dBTwoU],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystallineF12Db2dTransition = {
  id: "tremor:crystalline:f12-db2d",
  label: {
    EN: "F12+DB2D",
    fallback: "F12+DB2D",
  },
  route: [moves.tremor.crystalline.fOneTwo, moves.tremor.crystalline.dBTwoD],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const tremorCrystallineF4Transition = {
  id: "tremor:crystalline:f4",
  label: {
    EN: "F4",
    fallback: "F4",
  },
  route: [moves.tremor.crystalline.fFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyrax114Bf1Transition = {
  id: "triborg:cyrax:114-bf1",
  label: {
    EN: "114+BF1",
    fallback: "114+BF1",
  },
  route: [moves.triborg.cyrax.oneOneFour, moves.triborg.cyrax.bFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyrax21Transition = {
  id: "triborg:cyrax:21",
  label: {
    EN: "21",
    fallback: "21",
  },
  route: [moves.triborg.cyrax.twoOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyrax4Transition = {
  id: "triborg:cyrax:4",
  label: {
    EN: "4",
    fallback: "4",
  },
  route: [moves.triborg.cyrax.four],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxBTransition = {
  id: "triborg:cyrax:b",
  label: {
    EN: "B",
    fallback: "B",
  },
  route: [moves.triborg.cyrax.b],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxB2Transition = {
  id: "triborg:cyrax:b2",
  label: {
    EN: "B2",
    fallback: "B2",
  },
  route: [moves.triborg.cyrax.bTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxD2Transition = {
  id: "triborg:cyrax:d2",
  label: {
    EN: "D2",
    fallback: "D2",
  },
  route: [moves.triborg.cyrax.dTwo],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxDb3Transition = {
  id: "triborg:cyrax:db3",
  label: {
    EN: "DB3",
    fallback: "DB3",
  },
  route: [moves.triborg.cyrax.dBThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxDd3Transition = {
  id: "triborg:cyrax:dd3",
  label: {
    EN: "DD3",
    fallback: "DD3",
  },
  route: [moves.triborg.cyrax.dDThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxF1Transition = {
  id: "triborg:cyrax:f1",
  label: {
    EN: "F1",
    fallback: "F1",
  },
  route: [moves.triborg.cyrax.fOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxF13Bf1Transition = {
  id: "triborg:cyrax:f13-bf1",
  label: {
    EN: "F13+BF1",
    fallback: "F13+BF1",
  },
  route: [moves.triborg.cyrax.fOneThree, moves.triborg.cyrax.bFOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxF34Transition = {
  id: "triborg:cyrax:f34",
  label: {
    EN: "F34",
    fallback: "F34",
  },
  route: [moves.triborg.cyrax.fThreeFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxF43Db4Transition = {
  id: "triborg:cyrax:f43-db4",
  label: {
    EN: "F43+DB4",
    fallback: "F43+DB4",
  },
  route: [moves.triborg.cyrax.fFourThree, moves.triborg.cyrax.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxF43Exdb4Transition = {
  id: "triborg:cyrax:f43-exdb4",
  label: {
    EN: "F43+EXDB4",
    fallback: "F43+EXDB4",
  },
  route: [moves.triborg.cyrax.fFourThree, moves.triborg.cyrax.exDBFour],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxFfTransition = {
  id: "triborg:cyrax:ff",
  label: {
    EN: "FF",
    fallback: "FF",
  },
  route: [moves.triborg.cyrax.fF],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgSektor114Db4Transition = {
  id: "triborg:sektor:114-db4",
  label: {
    EN: "114+DB4",
    fallback: "114+DB4",
  },
  route: [moves.triborg.sektor.oneOneFour, moves.triborg.sektor.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgSektor114Exdd3Transition = {
  id: "triborg:sektor:114-exdd3",
  label: {
    EN: "114+EXDD3",
    fallback: "114+EXDD3",
  },
  route: [moves.triborg.sektor.oneOneFour, moves.triborg.sektor.exDDThree],
  tags: ["community", "meter"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgSektor21Transition = {
  id: "triborg:sektor:21",
  label: {
    EN: "21",
    fallback: "21",
  },
  route: [moves.triborg.sektor.twoOne],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgSektorB1Db4Transition = {
  id: "triborg:sektor:b1-db4",
  label: {
    EN: "B1+DB4",
    fallback: "B1+DB4",
  },
  route: [moves.triborg.sektor.bOne, moves.triborg.sektor.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgSektorB3Db4Transition = {
  id: "triborg:sektor:b3-db4",
  label: {
    EN: "B3+DB4",
    fallback: "B3+DB4",
  },
  route: [moves.triborg.sektor.bThree, moves.triborg.sektor.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgSektorF13Db4Transition = {
  id: "triborg:sektor:f13-db4",
  label: {
    EN: "F13+DB4",
    fallback: "F13+DB4",
  },
  route: [moves.triborg.sektor.fOneThree, moves.triborg.sektor.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgSektorF34Bf3Transition = {
  id: "triborg:sektor:f34-bf3",
  label: {
    EN: "F34+BF3",
    fallback: "F34+BF3",
  },
  route: [moves.triborg.sektor.fThreeFour, moves.triborg.sektor.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgSektorF34Db4Transition = {
  id: "triborg:sektor:f34-db4",
  label: {
    EN: "F34+DB4",
    fallback: "F34+DB4",
  },
  route: [moves.triborg.sektor.fThreeFour, moves.triborg.sektor.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgSektorF43Bf3Transition = {
  id: "triborg:sektor:f43-bf3",
  label: {
    EN: "F43+BF3",
    fallback: "F43+BF3",
  },
  route: [moves.triborg.sektor.fFourThree, moves.triborg.sektor.bFThree],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const triborgSektorF43Db4Transition = {
  id: "triborg:sektor:f43-db4",
  label: {
    EN: "F43+DB4",
    fallback: "F43+DB4",
  },
  route: [moves.triborg.sektor.fFourThree, moves.triborg.sektor.dBFour],
  tags: ["community"],
  sourceIds: ["community-combo-source"],
} as const satisfies MkxlAuthoredTransition;

const alienAcidicAcidicTechniqueTransition = {
  id: "alien:acidic:acidic-technique",
  label: moves.alien.acidic.acidicTechnique.label,
  route: [moves.alien.acidic.acidicTechnique],
  tags: moves.alien.acidic.acidicTechnique.tags,
  sourceIds: moves.alien.acidic.acidicTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const alienKonjurerKonjurerTechniqueTransition = {
  id: "alien:konjurer:konjurer-technique",
  label: moves.alien.konjurer.konjurerTechnique.label,
  route: [moves.alien.konjurer.konjurerTechnique],
  tags: moves.alien.konjurer.konjurerTechnique.tags,
  sourceIds: moves.alien.konjurer.konjurerTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const alienTarkatanTarkatanTechniqueTransition = {
  id: "alien:tarkatan:tarkatan-technique",
  label: moves.alien.tarkatan.tarkatanTechnique.label,
  route: [moves.alien.tarkatan.tarkatanTechnique],
  tags: moves.alien.tarkatan.tarkatanTechnique.tags,
  sourceIds: moves.alien.tarkatan.tarkatanTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const alienUniversalClosingStrikeTransition = {
  id: "alien:universal:closing-strike",
  label: moves.alien.universal.closingStrike.label,
  route: [moves.alien.universal.closingStrike],
  tags: moves.alien.universal.closingStrike.tags,
  sourceIds: moves.alien.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const alienUniversalClosingStrikeEnhancedTransition = {
  id: "alien:universal:closing-strike-enhanced",
  label: moves.alien.universal.closingStrikeEnhanced.label,
  route: [moves.alien.universal.closingStrikeEnhanced],
  tags: moves.alien.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.alien.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const alienUniversalOpeningAssaultTransition = {
  id: "alien:universal:opening-assault",
  label: moves.alien.universal.openingAssault.label,
  route: [moves.alien.universal.openingAssault],
  tags: moves.alien.universal.openingAssault.tags,
  sourceIds: moves.alien.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const alienUniversalRisingAssaultTransition = {
  id: "alien:universal:rising-assault",
  label: moves.alien.universal.risingAssault.label,
  route: [moves.alien.universal.risingAssault],
  tags: moves.alien.universal.risingAssault.tags,
  sourceIds: moves.alien.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const boRaiChoBartitsuBartitsuTechniqueTransition = {
  id: "bo-rai-cho:bartitsu:bartitsu-technique",
  label: moves.boRaiCho.bartitsu.bartitsuTechnique.label,
  route: [moves.boRaiCho.bartitsu.bartitsuTechnique],
  tags: moves.boRaiCho.bartitsu.bartitsuTechnique.tags,
  sourceIds: moves.boRaiCho.bartitsu.bartitsuTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const boRaiChoDragonBreathDragonBreathTechniqueTransition = {
  id: "bo-rai-cho:dragon-breath:dragon-breath-technique",
  label: moves.boRaiCho.dragonBreath.dragonBreathTechnique.label,
  route: [moves.boRaiCho.dragonBreath.dragonBreathTechnique],
  tags: moves.boRaiCho.dragonBreath.dragonBreathTechnique.tags,
  sourceIds: moves.boRaiCho.dragonBreath.dragonBreathTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const boRaiChoDrunkenMasterDrunkenMasterTechniqueTransition = {
  id: "bo-rai-cho:drunken-master:drunken-master-technique",
  label: moves.boRaiCho.drunkenMaster.drunkenMasterTechnique.label,
  route: [moves.boRaiCho.drunkenMaster.drunkenMasterTechnique],
  tags: moves.boRaiCho.drunkenMaster.drunkenMasterTechnique.tags,
  sourceIds: moves.boRaiCho.drunkenMaster.drunkenMasterTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const boRaiChoUniversalClosingStrikeTransition = {
  id: "bo-rai-cho:universal:closing-strike",
  label: moves.boRaiCho.universal.closingStrike.label,
  route: [moves.boRaiCho.universal.closingStrike],
  tags: moves.boRaiCho.universal.closingStrike.tags,
  sourceIds: moves.boRaiCho.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const boRaiChoUniversalClosingStrikeEnhancedTransition = {
  id: "bo-rai-cho:universal:closing-strike-enhanced",
  label: moves.boRaiCho.universal.closingStrikeEnhanced.label,
  route: [moves.boRaiCho.universal.closingStrikeEnhanced],
  tags: moves.boRaiCho.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.boRaiCho.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const boRaiChoUniversalOpeningAssaultTransition = {
  id: "bo-rai-cho:universal:opening-assault",
  label: moves.boRaiCho.universal.openingAssault.label,
  route: [moves.boRaiCho.universal.openingAssault],
  tags: moves.boRaiCho.universal.openingAssault.tags,
  sourceIds: moves.boRaiCho.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const boRaiChoUniversalRisingAssaultTransition = {
  id: "bo-rai-cho:universal:rising-assault",
  label: moves.boRaiCho.universal.risingAssault.label,
  route: [moves.boRaiCho.universal.risingAssault],
  tags: moves.boRaiCho.universal.risingAssault.tags,
  sourceIds: moves.boRaiCho.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const cassieCageBrawlerBrawlerTechniqueTransition = {
  id: "cassie-cage:brawler:brawler-technique",
  label: moves.cassieCage.brawler.brawlerTechnique.label,
  route: [moves.cassieCage.brawler.brawlerTechnique],
  tags: moves.cassieCage.brawler.brawlerTechnique.tags,
  sourceIds: moves.cassieCage.brawler.brawlerTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const cassieCageHollywoodHollywoodTechniqueTransition = {
  id: "cassie-cage:hollywood:hollywood-technique",
  label: moves.cassieCage.hollywood.hollywoodTechnique.label,
  route: [moves.cassieCage.hollywood.hollywoodTechnique],
  tags: moves.cassieCage.hollywood.hollywoodTechnique.tags,
  sourceIds: moves.cassieCage.hollywood.hollywoodTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const cassieCageSpecOpsSpecOpsTechniqueTransition = {
  id: "cassie-cage:spec-ops:spec-ops-technique",
  label: moves.cassieCage.specOps.specOpsTechnique.label,
  route: [moves.cassieCage.specOps.specOpsTechnique],
  tags: moves.cassieCage.specOps.specOpsTechnique.tags,
  sourceIds: moves.cassieCage.specOps.specOpsTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const cassieCageUniversalClosingStrikeTransition = {
  id: "cassie-cage:universal:closing-strike",
  label: moves.cassieCage.universal.closingStrike.label,
  route: [moves.cassieCage.universal.closingStrike],
  tags: moves.cassieCage.universal.closingStrike.tags,
  sourceIds: moves.cassieCage.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const cassieCageUniversalClosingStrikeEnhancedTransition = {
  id: "cassie-cage:universal:closing-strike-enhanced",
  label: moves.cassieCage.universal.closingStrikeEnhanced.label,
  route: [moves.cassieCage.universal.closingStrikeEnhanced],
  tags: moves.cassieCage.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.cassieCage.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const cassieCageUniversalOpeningAssaultTransition = {
  id: "cassie-cage:universal:opening-assault",
  label: moves.cassieCage.universal.openingAssault.label,
  route: [moves.cassieCage.universal.openingAssault],
  tags: moves.cassieCage.universal.openingAssault.tags,
  sourceIds: moves.cassieCage.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const cassieCageUniversalRisingAssaultTransition = {
  id: "cassie-cage:universal:rising-assault",
  label: moves.cassieCage.universal.risingAssault.label,
  route: [moves.cassieCage.universal.risingAssault],
  tags: moves.cassieCage.universal.risingAssault.tags,
  sourceIds: moves.cassieCage.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const dvorahBroodMotherBroodMotherTechniqueTransition = {
  id: "dvorah:brood-mother:brood-mother-technique",
  label: moves.dvorah.broodMother.broodMotherTechnique.label,
  route: [moves.dvorah.broodMother.broodMotherTechnique],
  tags: moves.dvorah.broodMother.broodMotherTechnique.tags,
  sourceIds: moves.dvorah.broodMother.broodMotherTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const dvorahSwarmQueenSwarmQueenTechniqueTransition = {
  id: "dvorah:swarm-queen:swarm-queen-technique",
  label: moves.dvorah.swarmQueen.swarmQueenTechnique.label,
  route: [moves.dvorah.swarmQueen.swarmQueenTechnique],
  tags: moves.dvorah.swarmQueen.swarmQueenTechnique.tags,
  sourceIds: moves.dvorah.swarmQueen.swarmQueenTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const dvorahUniversalClosingStrikeTransition = {
  id: "dvorah:universal:closing-strike",
  label: moves.dvorah.universal.closingStrike.label,
  route: [moves.dvorah.universal.closingStrike],
  tags: moves.dvorah.universal.closingStrike.tags,
  sourceIds: moves.dvorah.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const dvorahUniversalOpeningAssaultTransition = {
  id: "dvorah:universal:opening-assault",
  label: moves.dvorah.universal.openingAssault.label,
  route: [moves.dvorah.universal.openingAssault],
  tags: moves.dvorah.universal.openingAssault.tags,
  sourceIds: moves.dvorah.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const dvorahUniversalRisingAssaultTransition = {
  id: "dvorah:universal:rising-assault",
  label: moves.dvorah.universal.risingAssault.label,
  route: [moves.dvorah.universal.risingAssault],
  tags: moves.dvorah.universal.risingAssault.tags,
  sourceIds: moves.dvorah.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const dvorahVenomousVenomousTechniqueTransition = {
  id: "dvorah:venomous:venomous-technique",
  label: moves.dvorah.venomous.venomousTechnique.label,
  route: [moves.dvorah.venomous.venomousTechnique],
  tags: moves.dvorah.venomous.venomousTechnique.tags,
  sourceIds: moves.dvorah.venomous.venomousTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ermacMasterOfSoulsMasterOfSoulsTechniqueTransition = {
  id: "ermac:master-of-souls:master-of-souls-technique",
  label: moves.ermac.masterOfSouls.masterOfSoulsTechnique.label,
  route: [moves.ermac.masterOfSouls.masterOfSoulsTechnique],
  tags: moves.ermac.masterOfSouls.masterOfSoulsTechnique.tags,
  sourceIds: moves.ermac.masterOfSouls.masterOfSoulsTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ermacMysticMysticTechniqueTransition = {
  id: "ermac:mystic:mystic-technique",
  label: moves.ermac.mystic.mysticTechnique.label,
  route: [moves.ermac.mystic.mysticTechnique],
  tags: moves.ermac.mystic.mysticTechnique.tags,
  sourceIds: moves.ermac.mystic.mysticTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ermacSpectralSpectralTechniqueTransition = {
  id: "ermac:spectral:spectral-technique",
  label: moves.ermac.spectral.spectralTechnique.label,
  route: [moves.ermac.spectral.spectralTechnique],
  tags: moves.ermac.spectral.spectralTechnique.tags,
  sourceIds: moves.ermac.spectral.spectralTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ermacUniversalClosingStrikeTransition = {
  id: "ermac:universal:closing-strike",
  label: moves.ermac.universal.closingStrike.label,
  route: [moves.ermac.universal.closingStrike],
  tags: moves.ermac.universal.closingStrike.tags,
  sourceIds: moves.ermac.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ermacUniversalClosingStrikeEnhancedTransition = {
  id: "ermac:universal:closing-strike-enhanced",
  label: moves.ermac.universal.closingStrikeEnhanced.label,
  route: [moves.ermac.universal.closingStrikeEnhanced],
  tags: moves.ermac.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.ermac.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ermacUniversalOpeningAssaultTransition = {
  id: "ermac:universal:opening-assault",
  label: moves.ermac.universal.openingAssault.label,
  route: [moves.ermac.universal.openingAssault],
  tags: moves.ermac.universal.openingAssault.tags,
  sourceIds: moves.ermac.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ermacUniversalRisingAssaultTransition = {
  id: "ermac:universal:rising-assault",
  label: moves.ermac.universal.risingAssault.label,
  route: [moves.ermac.universal.risingAssault],
  tags: moves.ermac.universal.risingAssault.tags,
  sourceIds: moves.ermac.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const erronBlackGunslingerGunslingerTechniqueTransition = {
  id: "erron-black:gunslinger:gunslinger-technique",
  label: moves.erronBlack.gunslinger.gunslingerTechnique.label,
  route: [moves.erronBlack.gunslinger.gunslingerTechnique],
  tags: moves.erronBlack.gunslinger.gunslingerTechnique.tags,
  sourceIds: moves.erronBlack.gunslinger.gunslingerTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const erronBlackMarksmanMarksmanTechniqueTransition = {
  id: "erron-black:marksman:marksman-technique",
  label: moves.erronBlack.marksman.marksmanTechnique.label,
  route: [moves.erronBlack.marksman.marksmanTechnique],
  tags: moves.erronBlack.marksman.marksmanTechnique.tags,
  sourceIds: moves.erronBlack.marksman.marksmanTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const erronBlackOutlawOutlawTechniqueTransition = {
  id: "erron-black:outlaw:outlaw-technique",
  label: moves.erronBlack.outlaw.outlawTechnique.label,
  route: [moves.erronBlack.outlaw.outlawTechnique],
  tags: moves.erronBlack.outlaw.outlawTechnique.tags,
  sourceIds: moves.erronBlack.outlaw.outlawTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const erronBlackUniversalClosingStrikeTransition = {
  id: "erron-black:universal:closing-strike",
  label: moves.erronBlack.universal.closingStrike.label,
  route: [moves.erronBlack.universal.closingStrike],
  tags: moves.erronBlack.universal.closingStrike.tags,
  sourceIds: moves.erronBlack.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const erronBlackUniversalClosingStrikeEnhancedTransition = {
  id: "erron-black:universal:closing-strike-enhanced",
  label: moves.erronBlack.universal.closingStrikeEnhanced.label,
  route: [moves.erronBlack.universal.closingStrikeEnhanced],
  tags: moves.erronBlack.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.erronBlack.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const erronBlackUniversalOpeningAssaultTransition = {
  id: "erron-black:universal:opening-assault",
  label: moves.erronBlack.universal.openingAssault.label,
  route: [moves.erronBlack.universal.openingAssault],
  tags: moves.erronBlack.universal.openingAssault.tags,
  sourceIds: moves.erronBlack.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const erronBlackUniversalRisingAssaultTransition = {
  id: "erron-black:universal:rising-assault",
  label: moves.erronBlack.universal.risingAssault.label,
  route: [moves.erronBlack.universal.risingAssault],
  tags: moves.erronBlack.universal.risingAssault.tags,
  sourceIds: moves.erronBlack.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ferraTorrLackeyLackeyTechniqueTransition = {
  id: "ferra-torr:lackey:lackey-technique",
  label: moves.ferraTorr.lackey.lackeyTechnique.label,
  route: [moves.ferraTorr.lackey.lackeyTechnique],
  tags: moves.ferraTorr.lackey.lackeyTechnique.tags,
  sourceIds: moves.ferraTorr.lackey.lackeyTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ferraTorrRuthlessRuthlessTechniqueTransition = {
  id: "ferra-torr:ruthless:ruthless-technique",
  label: moves.ferraTorr.ruthless.ruthlessTechnique.label,
  route: [moves.ferraTorr.ruthless.ruthlessTechnique],
  tags: moves.ferraTorr.ruthless.ruthlessTechnique.tags,
  sourceIds: moves.ferraTorr.ruthless.ruthlessTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ferraTorrUniversalClosingStrikeTransition = {
  id: "ferra-torr:universal:closing-strike",
  label: moves.ferraTorr.universal.closingStrike.label,
  route: [moves.ferraTorr.universal.closingStrike],
  tags: moves.ferraTorr.universal.closingStrike.tags,
  sourceIds: moves.ferraTorr.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ferraTorrUniversalClosingStrikeEnhancedTransition = {
  id: "ferra-torr:universal:closing-strike-enhanced",
  label: moves.ferraTorr.universal.closingStrikeEnhanced.label,
  route: [moves.ferraTorr.universal.closingStrikeEnhanced],
  tags: moves.ferraTorr.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.ferraTorr.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ferraTorrUniversalOpeningAssaultTransition = {
  id: "ferra-torr:universal:opening-assault",
  label: moves.ferraTorr.universal.openingAssault.label,
  route: [moves.ferraTorr.universal.openingAssault],
  tags: moves.ferraTorr.universal.openingAssault.tags,
  sourceIds: moves.ferraTorr.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ferraTorrUniversalRisingAssaultTransition = {
  id: "ferra-torr:universal:rising-assault",
  label: moves.ferraTorr.universal.risingAssault.label,
  route: [moves.ferraTorr.universal.risingAssault],
  tags: moves.ferraTorr.universal.risingAssault.tags,
  sourceIds: moves.ferraTorr.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const ferraTorrViciousViciousTechniqueTransition = {
  id: "ferra-torr:vicious:vicious-technique",
  label: moves.ferraTorr.vicious.viciousTechnique.label,
  route: [moves.ferraTorr.vicious.viciousTechnique],
  tags: moves.ferraTorr.vicious.viciousTechnique.tags,
  sourceIds: moves.ferraTorr.vicious.viciousTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const generalRunTransition = {
  id: "general:run",
  label: moves.general.run.label,
  route: [moves.general.run],
  tags: moves.general.run.tags,
  sourceIds: moves.general.run.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const goroDragonFangsDragonFangsTechniqueTransition = {
  id: "goro:dragon-fangs:dragon-fangs-technique",
  label: moves.goro.dragonFangs.dragonFangsTechnique.label,
  route: [moves.goro.dragonFangs.dragonFangsTechnique],
  tags: moves.goro.dragonFangs.dragonFangsTechnique.tags,
  sourceIds: moves.goro.dragonFangs.dragonFangsTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const goroKuatanWarriorKuatanWarriorTechniqueTransition = {
  id: "goro:kuatan-warrior:kuatan-warrior-technique",
  label: moves.goro.kuatanWarrior.kuatanWarriorTechnique.label,
  route: [moves.goro.kuatanWarrior.kuatanWarriorTechnique],
  tags: moves.goro.kuatanWarrior.kuatanWarriorTechnique.tags,
  sourceIds: moves.goro.kuatanWarrior.kuatanWarriorTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const goroTigrarFuryTigrarFuryTechniqueTransition = {
  id: "goro:tigrar-fury:tigrar-fury-technique",
  label: moves.goro.tigrarFury.tigrarFuryTechnique.label,
  route: [moves.goro.tigrarFury.tigrarFuryTechnique],
  tags: moves.goro.tigrarFury.tigrarFuryTechnique.tags,
  sourceIds: moves.goro.tigrarFury.tigrarFuryTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const goroUniversalClosingStrikeTransition = {
  id: "goro:universal:closing-strike",
  label: moves.goro.universal.closingStrike.label,
  route: [moves.goro.universal.closingStrike],
  tags: moves.goro.universal.closingStrike.tags,
  sourceIds: moves.goro.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const goroUniversalOpeningAssaultTransition = {
  id: "goro:universal:opening-assault",
  label: moves.goro.universal.openingAssault.label,
  route: [moves.goro.universal.openingAssault],
  tags: moves.goro.universal.openingAssault.tags,
  sourceIds: moves.goro.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const goroUniversalRisingAssaultTransition = {
  id: "goro:universal:rising-assault",
  label: moves.goro.universal.risingAssault.label,
  route: [moves.goro.universal.risingAssault],
  tags: moves.goro.universal.risingAssault.tags,
  sourceIds: moves.goro.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsFullAutoFullAutoTechniqueTransition = {
  id: "jacqui-briggs:full-auto:full-auto-technique",
  label: moves.jacquiBriggs.fullAuto.fullAutoTechnique.label,
  route: [moves.jacquiBriggs.fullAuto.fullAutoTechnique],
  tags: moves.jacquiBriggs.fullAuto.fullAutoTechnique.tags,
  sourceIds: moves.jacquiBriggs.fullAuto.fullAutoTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsHighTechHighTechTechniqueTransition = {
  id: "jacqui-briggs:high-tech:high-tech-technique",
  label: moves.jacquiBriggs.highTech.highTechTechnique.label,
  route: [moves.jacquiBriggs.highTech.highTechTechnique],
  tags: moves.jacquiBriggs.highTech.highTechTechnique.tags,
  sourceIds: moves.jacquiBriggs.highTech.highTechTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsShotgunShotgunTechniqueTransition = {
  id: "jacqui-briggs:shotgun:shotgun-technique",
  label: moves.jacquiBriggs.shotgun.shotgunTechnique.label,
  route: [moves.jacquiBriggs.shotgun.shotgunTechnique],
  tags: moves.jacquiBriggs.shotgun.shotgunTechnique.tags,
  sourceIds: moves.jacquiBriggs.shotgun.shotgunTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsUniversalClosingStrikeTransition = {
  id: "jacqui-briggs:universal:closing-strike",
  label: moves.jacquiBriggs.universal.closingStrike.label,
  route: [moves.jacquiBriggs.universal.closingStrike],
  tags: moves.jacquiBriggs.universal.closingStrike.tags,
  sourceIds: moves.jacquiBriggs.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsUniversalClosingStrikeEnhancedTransition = {
  id: "jacqui-briggs:universal:closing-strike-enhanced",
  label: moves.jacquiBriggs.universal.closingStrikeEnhanced.label,
  route: [moves.jacquiBriggs.universal.closingStrikeEnhanced],
  tags: moves.jacquiBriggs.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.jacquiBriggs.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsUniversalOpeningAssaultTransition = {
  id: "jacqui-briggs:universal:opening-assault",
  label: moves.jacquiBriggs.universal.openingAssault.label,
  route: [moves.jacquiBriggs.universal.openingAssault],
  tags: moves.jacquiBriggs.universal.openingAssault.tags,
  sourceIds: moves.jacquiBriggs.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jacquiBriggsUniversalRisingAssaultTransition = {
  id: "jacqui-briggs:universal:rising-assault",
  label: moves.jacquiBriggs.universal.risingAssault.label,
  route: [moves.jacquiBriggs.universal.risingAssault],
  tags: moves.jacquiBriggs.universal.risingAssault.tags,
  sourceIds: moves.jacquiBriggs.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesRelentlessRelentlessTechniqueTransition = {
  id: "jason-voorhees:relentless:relentless-technique",
  label: moves.jasonVoorhees.relentless.relentlessTechnique.label,
  route: [moves.jasonVoorhees.relentless.relentlessTechnique],
  tags: moves.jasonVoorhees.relentless.relentlessTechnique.tags,
  sourceIds: moves.jasonVoorhees.relentless.relentlessTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesSlasherSlasherTechniqueTransition = {
  id: "jason-voorhees:slasher:slasher-technique",
  label: moves.jasonVoorhees.slasher.slasherTechnique.label,
  route: [moves.jasonVoorhees.slasher.slasherTechnique],
  tags: moves.jasonVoorhees.slasher.slasherTechnique.tags,
  sourceIds: moves.jasonVoorhees.slasher.slasherTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesUniversalClosingStrikeTransition = {
  id: "jason-voorhees:universal:closing-strike",
  label: moves.jasonVoorhees.universal.closingStrike.label,
  route: [moves.jasonVoorhees.universal.closingStrike],
  tags: moves.jasonVoorhees.universal.closingStrike.tags,
  sourceIds: moves.jasonVoorhees.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesUniversalClosingStrikeEnhancedTransition = {
  id: "jason-voorhees:universal:closing-strike-enhanced",
  label: moves.jasonVoorhees.universal.closingStrikeEnhanced.label,
  route: [moves.jasonVoorhees.universal.closingStrikeEnhanced],
  tags: moves.jasonVoorhees.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.jasonVoorhees.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesUniversalOpeningAssaultTransition = {
  id: "jason-voorhees:universal:opening-assault",
  label: moves.jasonVoorhees.universal.openingAssault.label,
  route: [moves.jasonVoorhees.universal.openingAssault],
  tags: moves.jasonVoorhees.universal.openingAssault.tags,
  sourceIds: moves.jasonVoorhees.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesUniversalRisingAssaultTransition = {
  id: "jason-voorhees:universal:rising-assault",
  label: moves.jasonVoorhees.universal.risingAssault.label,
  route: [moves.jasonVoorhees.universal.risingAssault],
  tags: moves.jasonVoorhees.universal.risingAssault.tags,
  sourceIds: moves.jasonVoorhees.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jasonVoorheesUnstoppableUnstoppableTechniqueTransition = {
  id: "jason-voorhees:unstoppable:unstoppable-technique",
  label: moves.jasonVoorhees.unstoppable.unstoppableTechnique.label,
  route: [moves.jasonVoorhees.unstoppable.unstoppableTechnique],
  tags: moves.jasonVoorhees.unstoppable.unstoppableTechnique.tags,
  sourceIds: moves.jasonVoorhees.unstoppable.unstoppableTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jaxHeavyWeaponsHeavyWeaponsTechniqueTransition = {
  id: "jax:heavy-weapons:heavy-weapons-technique",
  label: moves.jax.heavyWeapons.heavyWeaponsTechnique.label,
  route: [moves.jax.heavyWeapons.heavyWeaponsTechnique],
  tags: moves.jax.heavyWeapons.heavyWeaponsTechnique.tags,
  sourceIds: moves.jax.heavyWeapons.heavyWeaponsTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jaxPumpedUpPumpedUpTechniqueTransition = {
  id: "jax:pumped-up:pumped-up-technique",
  label: moves.jax.pumpedUp.pumpedUpTechnique.label,
  route: [moves.jax.pumpedUp.pumpedUpTechnique],
  tags: moves.jax.pumpedUp.pumpedUpTechnique.tags,
  sourceIds: moves.jax.pumpedUp.pumpedUpTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jaxUniversalClosingStrikeTransition = {
  id: "jax:universal:closing-strike",
  label: moves.jax.universal.closingStrike.label,
  route: [moves.jax.universal.closingStrike],
  tags: moves.jax.universal.closingStrike.tags,
  sourceIds: moves.jax.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jaxUniversalClosingStrikeEnhancedTransition = {
  id: "jax:universal:closing-strike-enhanced",
  label: moves.jax.universal.closingStrikeEnhanced.label,
  route: [moves.jax.universal.closingStrikeEnhanced],
  tags: moves.jax.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.jax.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jaxUniversalOpeningAssaultTransition = {
  id: "jax:universal:opening-assault",
  label: moves.jax.universal.openingAssault.label,
  route: [moves.jax.universal.openingAssault],
  tags: moves.jax.universal.openingAssault.tags,
  sourceIds: moves.jax.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jaxUniversalRisingAssaultTransition = {
  id: "jax:universal:rising-assault",
  label: moves.jax.universal.risingAssault.label,
  route: [moves.jax.universal.risingAssault],
  tags: moves.jax.universal.risingAssault.tags,
  sourceIds: moves.jax.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const jaxWrestlerWrestlerTechniqueTransition = {
  id: "jax:wrestler:wrestler-technique",
  label: moves.jax.wrestler.wrestlerTechnique.label,
  route: [moves.jax.wrestler.wrestlerTechnique],
  tags: moves.jax.wrestler.wrestlerTechnique.tags,
  sourceIds: moves.jax.wrestler.wrestlerTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const johnnyCageAListAListTechniqueTransition = {
  id: "johnny-cage:a-list:a-list-technique",
  label: moves.johnnyCage.aList.aListTechnique.label,
  route: [moves.johnnyCage.aList.aListTechnique],
  tags: moves.johnnyCage.aList.aListTechnique.tags,
  sourceIds: moves.johnnyCage.aList.aListTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const johnnyCageFisticuffsFisticuffsTechniqueTransition = {
  id: "johnny-cage:fisticuffs:fisticuffs-technique",
  label: moves.johnnyCage.fisticuffs.fisticuffsTechnique.label,
  route: [moves.johnnyCage.fisticuffs.fisticuffsTechnique],
  tags: moves.johnnyCage.fisticuffs.fisticuffsTechnique.tags,
  sourceIds: moves.johnnyCage.fisticuffs.fisticuffsTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const johnnyCageStuntDoubleStuntDoubleTechniqueTransition = {
  id: "johnny-cage:stunt-double:stunt-double-technique",
  label: moves.johnnyCage.stuntDouble.stuntDoubleTechnique.label,
  route: [moves.johnnyCage.stuntDouble.stuntDoubleTechnique],
  tags: moves.johnnyCage.stuntDouble.stuntDoubleTechnique.tags,
  sourceIds: moves.johnnyCage.stuntDouble.stuntDoubleTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const johnnyCageUniversalClosingStrikeTransition = {
  id: "johnny-cage:universal:closing-strike",
  label: moves.johnnyCage.universal.closingStrike.label,
  route: [moves.johnnyCage.universal.closingStrike],
  tags: moves.johnnyCage.universal.closingStrike.tags,
  sourceIds: moves.johnnyCage.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const johnnyCageUniversalOpeningAssaultTransition = {
  id: "johnny-cage:universal:opening-assault",
  label: moves.johnnyCage.universal.openingAssault.label,
  route: [moves.johnnyCage.universal.openingAssault],
  tags: moves.johnnyCage.universal.openingAssault.tags,
  sourceIds: moves.johnnyCage.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const johnnyCageUniversalRisingAssaultTransition = {
  id: "johnny-cage:universal:rising-assault",
  label: moves.johnnyCage.universal.risingAssault.label,
  route: [moves.johnnyCage.universal.risingAssault],
  tags: moves.johnnyCage.universal.risingAssault.tags,
  sourceIds: moves.johnnyCage.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kanoCommandoCommandoTechniqueTransition = {
  id: "kano:commando:commando-technique",
  label: moves.kano.commando.commandoTechnique.label,
  route: [moves.kano.commando.commandoTechnique],
  tags: moves.kano.commando.commandoTechnique.tags,
  sourceIds: moves.kano.commando.commandoTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kanoCutthroatCutthroatTechniqueTransition = {
  id: "kano:cutthroat:cutthroat-technique",
  label: moves.kano.cutthroat.cutthroatTechnique.label,
  route: [moves.kano.cutthroat.cutthroatTechnique],
  tags: moves.kano.cutthroat.cutthroatTechnique.tags,
  sourceIds: moves.kano.cutthroat.cutthroatTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kanoCyberneticCyberneticTechniqueTransition = {
  id: "kano:cybernetic:cybernetic-technique",
  label: moves.kano.cybernetic.cyberneticTechnique.label,
  route: [moves.kano.cybernetic.cyberneticTechnique],
  tags: moves.kano.cybernetic.cyberneticTechnique.tags,
  sourceIds: moves.kano.cybernetic.cyberneticTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kanoUniversalClosingStrikeTransition = {
  id: "kano:universal:closing-strike",
  label: moves.kano.universal.closingStrike.label,
  route: [moves.kano.universal.closingStrike],
  tags: moves.kano.universal.closingStrike.tags,
  sourceIds: moves.kano.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kanoUniversalClosingStrikeEnhancedTransition = {
  id: "kano:universal:closing-strike-enhanced",
  label: moves.kano.universal.closingStrikeEnhanced.label,
  route: [moves.kano.universal.closingStrikeEnhanced],
  tags: moves.kano.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.kano.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kanoUniversalOpeningAssaultTransition = {
  id: "kano:universal:opening-assault",
  label: moves.kano.universal.openingAssault.label,
  route: [moves.kano.universal.openingAssault],
  tags: moves.kano.universal.openingAssault.tags,
  sourceIds: moves.kano.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kanoUniversalRisingAssaultTransition = {
  id: "kano:universal:rising-assault",
  label: moves.kano.universal.risingAssault.label,
  route: [moves.kano.universal.risingAssault],
  tags: moves.kano.universal.risingAssault.tags,
  sourceIds: moves.kano.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kenshiBalancedBalancedTechniqueTransition = {
  id: "kenshi:balanced:balanced-technique",
  label: moves.kenshi.balanced.balancedTechnique.label,
  route: [moves.kenshi.balanced.balancedTechnique],
  tags: moves.kenshi.balanced.balancedTechnique.tags,
  sourceIds: moves.kenshi.balanced.balancedTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kenshiKenjutsuKenjutsuTechniqueTransition = {
  id: "kenshi:kenjutsu:kenjutsu-technique",
  label: moves.kenshi.kenjutsu.kenjutsuTechnique.label,
  route: [moves.kenshi.kenjutsu.kenjutsuTechnique],
  tags: moves.kenshi.kenjutsu.kenjutsuTechnique.tags,
  sourceIds: moves.kenshi.kenjutsu.kenjutsuTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kenshiPossessedPossessedTechniqueTransition = {
  id: "kenshi:possessed:possessed-technique",
  label: moves.kenshi.possessed.possessedTechnique.label,
  route: [moves.kenshi.possessed.possessedTechnique],
  tags: moves.kenshi.possessed.possessedTechnique.tags,
  sourceIds: moves.kenshi.possessed.possessedTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kenshiUniversalClosingStrikeTransition = {
  id: "kenshi:universal:closing-strike",
  label: moves.kenshi.universal.closingStrike.label,
  route: [moves.kenshi.universal.closingStrike],
  tags: moves.kenshi.universal.closingStrike.tags,
  sourceIds: moves.kenshi.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kenshiUniversalClosingStrikeEnhancedTransition = {
  id: "kenshi:universal:closing-strike-enhanced",
  label: moves.kenshi.universal.closingStrikeEnhanced.label,
  route: [moves.kenshi.universal.closingStrikeEnhanced],
  tags: moves.kenshi.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.kenshi.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kenshiUniversalOpeningAssaultTransition = {
  id: "kenshi:universal:opening-assault",
  label: moves.kenshi.universal.openingAssault.label,
  route: [moves.kenshi.universal.openingAssault],
  tags: moves.kenshi.universal.openingAssault.tags,
  sourceIds: moves.kenshi.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kenshiUniversalRisingAssaultTransition = {
  id: "kenshi:universal:rising-assault",
  label: moves.kenshi.universal.risingAssault.label,
  route: [moves.kenshi.universal.risingAssault],
  tags: moves.kenshi.universal.risingAssault.tags,
  sourceIds: moves.kenshi.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kitanaAssassinAssassinTechniqueTransition = {
  id: "kitana:assassin:assassin-technique",
  label: moves.kitana.assassin.assassinTechnique.label,
  route: [moves.kitana.assassin.assassinTechnique],
  tags: moves.kitana.assassin.assassinTechnique.tags,
  sourceIds: moves.kitana.assassin.assassinTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kitanaMournfulMournfulTechniqueTransition = {
  id: "kitana:mournful:mournful-technique",
  label: moves.kitana.mournful.mournfulTechnique.label,
  route: [moves.kitana.mournful.mournfulTechnique],
  tags: moves.kitana.mournful.mournfulTechnique.tags,
  sourceIds: moves.kitana.mournful.mournfulTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kitanaRoyalStormRoyalStormTechniqueTransition = {
  id: "kitana:royal-storm:royal-storm-technique",
  label: moves.kitana.royalStorm.royalStormTechnique.label,
  route: [moves.kitana.royalStorm.royalStormTechnique],
  tags: moves.kitana.royalStorm.royalStormTechnique.tags,
  sourceIds: moves.kitana.royalStorm.royalStormTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kitanaUniversalClosingStrikeTransition = {
  id: "kitana:universal:closing-strike",
  label: moves.kitana.universal.closingStrike.label,
  route: [moves.kitana.universal.closingStrike],
  tags: moves.kitana.universal.closingStrike.tags,
  sourceIds: moves.kitana.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kitanaUniversalClosingStrikeEnhancedTransition = {
  id: "kitana:universal:closing-strike-enhanced",
  label: moves.kitana.universal.closingStrikeEnhanced.label,
  route: [moves.kitana.universal.closingStrikeEnhanced],
  tags: moves.kitana.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.kitana.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kitanaUniversalOpeningAssaultTransition = {
  id: "kitana:universal:opening-assault",
  label: moves.kitana.universal.openingAssault.label,
  route: [moves.kitana.universal.openingAssault],
  tags: moves.kitana.universal.openingAssault.tags,
  sourceIds: moves.kitana.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kitanaUniversalRisingAssaultTransition = {
  id: "kitana:universal:rising-assault",
  label: moves.kitana.universal.risingAssault.label,
  route: [moves.kitana.universal.risingAssault],
  tags: moves.kitana.universal.risingAssault.tags,
  sourceIds: moves.kitana.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kotalKahnBloodGodBloodGodTechniqueTransition = {
  id: "kotal-kahn:blood-god:blood-god-technique",
  label: moves.kotalKahn.bloodGod.bloodGodTechnique.label,
  route: [moves.kotalKahn.bloodGod.bloodGodTechnique],
  tags: moves.kotalKahn.bloodGod.bloodGodTechnique.tags,
  sourceIds: moves.kotalKahn.bloodGod.bloodGodTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kotalKahnSunGodSunGodTechniqueTransition = {
  id: "kotal-kahn:sun-god:sun-god-technique",
  label: moves.kotalKahn.sunGod.sunGodTechnique.label,
  route: [moves.kotalKahn.sunGod.sunGodTechnique],
  tags: moves.kotalKahn.sunGod.sunGodTechnique.tags,
  sourceIds: moves.kotalKahn.sunGod.sunGodTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kotalKahnUniversalClosingStrikeTransition = {
  id: "kotal-kahn:universal:closing-strike",
  label: moves.kotalKahn.universal.closingStrike.label,
  route: [moves.kotalKahn.universal.closingStrike],
  tags: moves.kotalKahn.universal.closingStrike.tags,
  sourceIds: moves.kotalKahn.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kotalKahnUniversalOpeningAssaultTransition = {
  id: "kotal-kahn:universal:opening-assault",
  label: moves.kotalKahn.universal.openingAssault.label,
  route: [moves.kotalKahn.universal.openingAssault],
  tags: moves.kotalKahn.universal.openingAssault.tags,
  sourceIds: moves.kotalKahn.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kotalKahnUniversalRisingAssaultTransition = {
  id: "kotal-kahn:universal:rising-assault",
  label: moves.kotalKahn.universal.risingAssault.label,
  route: [moves.kotalKahn.universal.risingAssault],
  tags: moves.kotalKahn.universal.risingAssault.tags,
  sourceIds: moves.kotalKahn.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kotalKahnWarGodWarGodTechniqueTransition = {
  id: "kotal-kahn:war-god:war-god-technique",
  label: moves.kotalKahn.warGod.warGodTechnique.label,
  route: [moves.kotalKahn.warGod.warGodTechnique],
  tags: moves.kotalKahn.warGod.warGodTechnique.tags,
  sourceIds: moves.kotalKahn.warGod.warGodTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungJinAncestralAncestralTechniqueTransition = {
  id: "kung-jin:ancestral:ancestral-technique",
  label: moves.kungJin.ancestral.ancestralTechnique.label,
  route: [moves.kungJin.ancestral.ancestralTechnique],
  tags: moves.kungJin.ancestral.ancestralTechnique.tags,
  sourceIds: moves.kungJin.ancestral.ancestralTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungJinBojutsuBojutsuTechniqueTransition = {
  id: "kung-jin:bojutsu:bojutsu-technique",
  label: moves.kungJin.bojutsu.bojutsuTechnique.label,
  route: [moves.kungJin.bojutsu.bojutsuTechnique],
  tags: moves.kungJin.bojutsu.bojutsuTechnique.tags,
  sourceIds: moves.kungJin.bojutsu.bojutsuTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungJinShaolinShaolinTechniqueTransition = {
  id: "kung-jin:shaolin:shaolin-technique",
  label: moves.kungJin.shaolin.shaolinTechnique.label,
  route: [moves.kungJin.shaolin.shaolinTechnique],
  tags: moves.kungJin.shaolin.shaolinTechnique.tags,
  sourceIds: moves.kungJin.shaolin.shaolinTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungJinUniversalClosingStrikeTransition = {
  id: "kung-jin:universal:closing-strike",
  label: moves.kungJin.universal.closingStrike.label,
  route: [moves.kungJin.universal.closingStrike],
  tags: moves.kungJin.universal.closingStrike.tags,
  sourceIds: moves.kungJin.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungJinUniversalClosingStrikeEnhancedTransition = {
  id: "kung-jin:universal:closing-strike-enhanced",
  label: moves.kungJin.universal.closingStrikeEnhanced.label,
  route: [moves.kungJin.universal.closingStrikeEnhanced],
  tags: moves.kungJin.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.kungJin.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungJinUniversalOpeningAssaultTransition = {
  id: "kung-jin:universal:opening-assault",
  label: moves.kungJin.universal.openingAssault.label,
  route: [moves.kungJin.universal.openingAssault],
  tags: moves.kungJin.universal.openingAssault.tags,
  sourceIds: moves.kungJin.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungJinUniversalRisingAssaultTransition = {
  id: "kung-jin:universal:rising-assault",
  label: moves.kungJin.universal.risingAssault.label,
  route: [moves.kungJin.universal.risingAssault],
  tags: moves.kungJin.universal.risingAssault.tags,
  sourceIds: moves.kungJin.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungLaoBuzzSawBuzzSawTechniqueTransition = {
  id: "kung-lao:buzz-saw:buzz-saw-technique",
  label: moves.kungLao.buzzSaw.buzzSawTechnique.label,
  route: [moves.kungLao.buzzSaw.buzzSawTechnique],
  tags: moves.kungLao.buzzSaw.buzzSawTechnique.tags,
  sourceIds: moves.kungLao.buzzSaw.buzzSawTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungLaoHatTrickHatTrickTechniqueTransition = {
  id: "kung-lao:hat-trick:hat-trick-technique",
  label: moves.kungLao.hatTrick.hatTrickTechnique.label,
  route: [moves.kungLao.hatTrick.hatTrickTechnique],
  tags: moves.kungLao.hatTrick.hatTrickTechnique.tags,
  sourceIds: moves.kungLao.hatTrick.hatTrickTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungLaoTempestTempestTechniqueTransition = {
  id: "kung-lao:tempest:tempest-technique",
  label: moves.kungLao.tempest.tempestTechnique.label,
  route: [moves.kungLao.tempest.tempestTechnique],
  tags: moves.kungLao.tempest.tempestTechnique.tags,
  sourceIds: moves.kungLao.tempest.tempestTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungLaoUniversalClosingStrikeTransition = {
  id: "kung-lao:universal:closing-strike",
  label: moves.kungLao.universal.closingStrike.label,
  route: [moves.kungLao.universal.closingStrike],
  tags: moves.kungLao.universal.closingStrike.tags,
  sourceIds: moves.kungLao.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungLaoUniversalClosingStrikeEnhancedTransition = {
  id: "kung-lao:universal:closing-strike-enhanced",
  label: moves.kungLao.universal.closingStrikeEnhanced.label,
  route: [moves.kungLao.universal.closingStrikeEnhanced],
  tags: moves.kungLao.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.kungLao.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungLaoUniversalOpeningAssaultTransition = {
  id: "kung-lao:universal:opening-assault",
  label: moves.kungLao.universal.openingAssault.label,
  route: [moves.kungLao.universal.openingAssault],
  tags: moves.kungLao.universal.openingAssault.tags,
  sourceIds: moves.kungLao.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const kungLaoUniversalRisingAssaultTransition = {
  id: "kung-lao:universal:rising-assault",
  label: moves.kungLao.universal.risingAssault.label,
  route: [moves.kungLao.universal.risingAssault],
  tags: moves.kungLao.universal.risingAssault.tags,
  sourceIds: moves.kungLao.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const leatherfaceButcherButcherTechniqueTransition = {
  id: "leatherface:butcher:butcher-technique",
  label: moves.leatherface.butcher.butcherTechnique.label,
  route: [moves.leatherface.butcher.butcherTechnique],
  tags: moves.leatherface.butcher.butcherTechnique.tags,
  sourceIds: moves.leatherface.butcher.butcherTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const leatherfaceKillerKillerTechniqueTransition = {
  id: "leatherface:killer:killer-technique",
  label: moves.leatherface.killer.killerTechnique.label,
  route: [moves.leatherface.killer.killerTechnique],
  tags: moves.leatherface.killer.killerTechnique.tags,
  sourceIds: moves.leatherface.killer.killerTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const leatherfacePrettyLadyPrettyLadyTechniqueTransition = {
  id: "leatherface:pretty-lady:pretty-lady-technique",
  label: moves.leatherface.prettyLady.prettyLadyTechnique.label,
  route: [moves.leatherface.prettyLady.prettyLadyTechnique],
  tags: moves.leatherface.prettyLady.prettyLadyTechnique.tags,
  sourceIds: moves.leatherface.prettyLady.prettyLadyTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const leatherfaceUniversalClosingStrikeTransition = {
  id: "leatherface:universal:closing-strike",
  label: moves.leatherface.universal.closingStrike.label,
  route: [moves.leatherface.universal.closingStrike],
  tags: moves.leatherface.universal.closingStrike.tags,
  sourceIds: moves.leatherface.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const leatherfaceUniversalClosingStrikeEnhancedTransition = {
  id: "leatherface:universal:closing-strike-enhanced",
  label: moves.leatherface.universal.closingStrikeEnhanced.label,
  route: [moves.leatherface.universal.closingStrikeEnhanced],
  tags: moves.leatherface.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.leatherface.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const leatherfaceUniversalOpeningAssaultTransition = {
  id: "leatherface:universal:opening-assault",
  label: moves.leatherface.universal.openingAssault.label,
  route: [moves.leatherface.universal.openingAssault],
  tags: moves.leatherface.universal.openingAssault.tags,
  sourceIds: moves.leatherface.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const leatherfaceUniversalRisingAssaultTransition = {
  id: "leatherface:universal:rising-assault",
  label: moves.leatherface.universal.risingAssault.label,
  route: [moves.leatherface.universal.risingAssault],
  tags: moves.leatherface.universal.risingAssault.tags,
  sourceIds: moves.leatherface.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const liuKangDragonsFireDragonsFireTechniqueTransition = {
  id: "liu-kang:dragons-fire:dragons-fire-technique",
  label: moves.liuKang.dragonsFire.dragonsFireTechnique.label,
  route: [moves.liuKang.dragonsFire.dragonsFireTechnique],
  tags: moves.liuKang.dragonsFire.dragonsFireTechnique.tags,
  sourceIds: moves.liuKang.dragonsFire.dragonsFireTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const liuKangDualistDualistTechniqueTransition = {
  id: "liu-kang:dualist:dualist-technique",
  label: moves.liuKang.dualist.dualistTechnique.label,
  route: [moves.liuKang.dualist.dualistTechnique],
  tags: moves.liuKang.dualist.dualistTechnique.tags,
  sourceIds: moves.liuKang.dualist.dualistTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const liuKangFlameFistFlameFistTechniqueTransition = {
  id: "liu-kang:flame-fist:flame-fist-technique",
  label: moves.liuKang.flameFist.flameFistTechnique.label,
  route: [moves.liuKang.flameFist.flameFistTechnique],
  tags: moves.liuKang.flameFist.flameFistTechnique.tags,
  sourceIds: moves.liuKang.flameFist.flameFistTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const liuKangUniversalClosingStrikeTransition = {
  id: "liu-kang:universal:closing-strike",
  label: moves.liuKang.universal.closingStrike.label,
  route: [moves.liuKang.universal.closingStrike],
  tags: moves.liuKang.universal.closingStrike.tags,
  sourceIds: moves.liuKang.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const liuKangUniversalOpeningAssaultTransition = {
  id: "liu-kang:universal:opening-assault",
  label: moves.liuKang.universal.openingAssault.label,
  route: [moves.liuKang.universal.openingAssault],
  tags: moves.liuKang.universal.openingAssault.tags,
  sourceIds: moves.liuKang.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const liuKangUniversalRisingAssaultTransition = {
  id: "liu-kang:universal:rising-assault",
  label: moves.liuKang.universal.risingAssault.label,
  route: [moves.liuKang.universal.risingAssault],
  tags: moves.liuKang.universal.risingAssault.tags,
  sourceIds: moves.liuKang.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const mileenaEtherealEtherealTechniqueTransition = {
  id: "mileena:ethereal:ethereal-technique",
  label: moves.mileena.ethereal.etherealTechnique.label,
  route: [moves.mileena.ethereal.etherealTechnique],
  tags: moves.mileena.ethereal.etherealTechnique.tags,
  sourceIds: moves.mileena.ethereal.etherealTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const mileenaPiercingPiercingTechniqueTransition = {
  id: "mileena:piercing:piercing-technique",
  label: moves.mileena.piercing.piercingTechnique.label,
  route: [moves.mileena.piercing.piercingTechnique],
  tags: moves.mileena.piercing.piercingTechnique.tags,
  sourceIds: moves.mileena.piercing.piercingTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const mileenaRavenousRavenousTechniqueTransition = {
  id: "mileena:ravenous:ravenous-technique",
  label: moves.mileena.ravenous.ravenousTechnique.label,
  route: [moves.mileena.ravenous.ravenousTechnique],
  tags: moves.mileena.ravenous.ravenousTechnique.tags,
  sourceIds: moves.mileena.ravenous.ravenousTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const mileenaUniversalClosingStrikeTransition = {
  id: "mileena:universal:closing-strike",
  label: moves.mileena.universal.closingStrike.label,
  route: [moves.mileena.universal.closingStrike],
  tags: moves.mileena.universal.closingStrike.tags,
  sourceIds: moves.mileena.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const mileenaUniversalClosingStrikeEnhancedTransition = {
  id: "mileena:universal:closing-strike-enhanced",
  label: moves.mileena.universal.closingStrikeEnhanced.label,
  route: [moves.mileena.universal.closingStrikeEnhanced],
  tags: moves.mileena.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.mileena.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const mileenaUniversalOpeningAssaultTransition = {
  id: "mileena:universal:opening-assault",
  label: moves.mileena.universal.openingAssault.label,
  route: [moves.mileena.universal.openingAssault],
  tags: moves.mileena.universal.openingAssault.tags,
  sourceIds: moves.mileena.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const mileenaUniversalRisingAssaultTransition = {
  id: "mileena:universal:rising-assault",
  label: moves.mileena.universal.risingAssault.label,
  route: [moves.mileena.universal.risingAssault],
  tags: moves.mileena.universal.risingAssault.tags,
  sourceIds: moves.mileena.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const predatorHishQuTenHishQuTenTechniqueTransition = {
  id: "predator:hish-qu-ten:hish-qu-ten-technique",
  label: moves.predator.hishQuTen.hishQuTenTechnique.label,
  route: [moves.predator.hishQuTen.hishQuTenTechnique],
  tags: moves.predator.hishQuTen.hishQuTenTechnique.tags,
  sourceIds: moves.predator.hishQuTen.hishQuTenTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const predatorHunterHunterTechniqueTransition = {
  id: "predator:hunter:hunter-technique",
  label: moves.predator.hunter.hunterTechnique.label,
  route: [moves.predator.hunter.hunterTechnique],
  tags: moves.predator.hunter.hunterTechnique.tags,
  sourceIds: moves.predator.hunter.hunterTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const predatorUniversalClosingStrikeTransition = {
  id: "predator:universal:closing-strike",
  label: moves.predator.universal.closingStrike.label,
  route: [moves.predator.universal.closingStrike],
  tags: moves.predator.universal.closingStrike.tags,
  sourceIds: moves.predator.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const predatorUniversalClosingStrikeEnhancedTransition = {
  id: "predator:universal:closing-strike-enhanced",
  label: moves.predator.universal.closingStrikeEnhanced.label,
  route: [moves.predator.universal.closingStrikeEnhanced],
  tags: moves.predator.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.predator.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const predatorUniversalOpeningAssaultTransition = {
  id: "predator:universal:opening-assault",
  label: moves.predator.universal.openingAssault.label,
  route: [moves.predator.universal.openingAssault],
  tags: moves.predator.universal.openingAssault.tags,
  sourceIds: moves.predator.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const predatorUniversalRisingAssaultTransition = {
  id: "predator:universal:rising-assault",
  label: moves.predator.universal.risingAssault.label,
  route: [moves.predator.universal.risingAssault],
  tags: moves.predator.universal.risingAssault.tags,
  sourceIds: moves.predator.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const predatorWarriorWarriorTechniqueTransition = {
  id: "predator:warrior:warrior-technique",
  label: moves.predator.warrior.warriorTechnique.label,
  route: [moves.predator.warrior.warriorTechnique],
  tags: moves.predator.warrior.warriorTechnique.tags,
  sourceIds: moves.predator.warrior.warriorTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const quanChiSorcererSorcererTechniqueTransition = {
  id: "quan-chi:sorcerer:sorcerer-technique",
  label: moves.quanChi.sorcerer.sorcererTechnique.label,
  route: [moves.quanChi.sorcerer.sorcererTechnique],
  tags: moves.quanChi.sorcerer.sorcererTechnique.tags,
  sourceIds: moves.quanChi.sorcerer.sorcererTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const quanChiSummonerSummonerTechniqueTransition = {
  id: "quan-chi:summoner:summoner-technique",
  label: moves.quanChi.summoner.summonerTechnique.label,
  route: [moves.quanChi.summoner.summonerTechnique],
  tags: moves.quanChi.summoner.summonerTechnique.tags,
  sourceIds: moves.quanChi.summoner.summonerTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const quanChiUniversalClosingStrikeTransition = {
  id: "quan-chi:universal:closing-strike",
  label: moves.quanChi.universal.closingStrike.label,
  route: [moves.quanChi.universal.closingStrike],
  tags: moves.quanChi.universal.closingStrike.tags,
  sourceIds: moves.quanChi.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const quanChiUniversalClosingStrikeEnhancedTransition = {
  id: "quan-chi:universal:closing-strike-enhanced",
  label: moves.quanChi.universal.closingStrikeEnhanced.label,
  route: [moves.quanChi.universal.closingStrikeEnhanced],
  tags: moves.quanChi.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.quanChi.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const quanChiUniversalOpeningAssaultTransition = {
  id: "quan-chi:universal:opening-assault",
  label: moves.quanChi.universal.openingAssault.label,
  route: [moves.quanChi.universal.openingAssault],
  tags: moves.quanChi.universal.openingAssault.tags,
  sourceIds: moves.quanChi.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const quanChiUniversalRisingAssaultTransition = {
  id: "quan-chi:universal:rising-assault",
  label: moves.quanChi.universal.risingAssault.label,
  route: [moves.quanChi.universal.risingAssault],
  tags: moves.quanChi.universal.risingAssault.tags,
  sourceIds: moves.quanChi.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const quanChiWarlockWarlockTechniqueTransition = {
  id: "quan-chi:warlock:warlock-technique",
  label: moves.quanChi.warlock.warlockTechnique.label,
  route: [moves.quanChi.warlock.warlockTechnique],
  tags: moves.quanChi.warlock.warlockTechnique.tags,
  sourceIds: moves.quanChi.warlock.warlockTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const raidenDisplacerDisplacerTechniqueTransition = {
  id: "raiden:displacer:displacer-technique",
  label: moves.raiden.displacer.displacerTechnique.label,
  route: [moves.raiden.displacer.displacerTechnique],
  tags: moves.raiden.displacer.displacerTechnique.tags,
  sourceIds: moves.raiden.displacer.displacerTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const raidenMasterOfStormsMasterOfStormsTechniqueTransition = {
  id: "raiden:master-of-storms:master-of-storms-technique",
  label: moves.raiden.masterOfStorms.masterOfStormsTechnique.label,
  route: [moves.raiden.masterOfStorms.masterOfStormsTechnique],
  tags: moves.raiden.masterOfStorms.masterOfStormsTechnique.tags,
  sourceIds: moves.raiden.masterOfStorms.masterOfStormsTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const raidenThunderGodThunderGodTechniqueTransition = {
  id: "raiden:thunder-god:thunder-god-technique",
  label: moves.raiden.thunderGod.thunderGodTechnique.label,
  route: [moves.raiden.thunderGod.thunderGodTechnique],
  tags: moves.raiden.thunderGod.thunderGodTechnique.tags,
  sourceIds: moves.raiden.thunderGod.thunderGodTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const raidenUniversalClosingStrikeTransition = {
  id: "raiden:universal:closing-strike",
  label: moves.raiden.universal.closingStrike.label,
  route: [moves.raiden.universal.closingStrike],
  tags: moves.raiden.universal.closingStrike.tags,
  sourceIds: moves.raiden.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const raidenUniversalOpeningAssaultTransition = {
  id: "raiden:universal:opening-assault",
  label: moves.raiden.universal.openingAssault.label,
  route: [moves.raiden.universal.openingAssault],
  tags: moves.raiden.universal.openingAssault.tags,
  sourceIds: moves.raiden.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const raidenUniversalRisingAssaultTransition = {
  id: "raiden:universal:rising-assault",
  label: moves.raiden.universal.risingAssault.label,
  route: [moves.raiden.universal.risingAssault],
  tags: moves.raiden.universal.risingAssault.tags,
  sourceIds: moves.raiden.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const reptileDeceptiveDeceptiveTechniqueTransition = {
  id: "reptile:deceptive:deceptive-technique",
  label: moves.reptile.deceptive.deceptiveTechnique.label,
  route: [moves.reptile.deceptive.deceptiveTechnique],
  tags: moves.reptile.deceptive.deceptiveTechnique.tags,
  sourceIds: moves.reptile.deceptive.deceptiveTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const reptileNimbleNimbleTechniqueTransition = {
  id: "reptile:nimble:nimble-technique",
  label: moves.reptile.nimble.nimbleTechnique.label,
  route: [moves.reptile.nimble.nimbleTechnique],
  tags: moves.reptile.nimble.nimbleTechnique.tags,
  sourceIds: moves.reptile.nimble.nimbleTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const reptileNoxiousNoxiousTechniqueTransition = {
  id: "reptile:noxious:noxious-technique",
  label: moves.reptile.noxious.noxiousTechnique.label,
  route: [moves.reptile.noxious.noxiousTechnique],
  tags: moves.reptile.noxious.noxiousTechnique.tags,
  sourceIds: moves.reptile.noxious.noxiousTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalClosingStrikeTransition = {
  id: "reptile:universal:closing-strike",
  label: moves.reptile.universal.closingStrike.label,
  route: [moves.reptile.universal.closingStrike],
  tags: moves.reptile.universal.closingStrike.tags,
  sourceIds: moves.reptile.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalClosingStrikeEnhancedTransition = {
  id: "reptile:universal:closing-strike-enhanced",
  label: moves.reptile.universal.closingStrikeEnhanced.label,
  route: [moves.reptile.universal.closingStrikeEnhanced],
  tags: moves.reptile.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.reptile.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalOpeningAssaultTransition = {
  id: "reptile:universal:opening-assault",
  label: moves.reptile.universal.openingAssault.label,
  route: [moves.reptile.universal.openingAssault],
  tags: moves.reptile.universal.openingAssault.tags,
  sourceIds: moves.reptile.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const reptileUniversalRisingAssaultTransition = {
  id: "reptile:universal:rising-assault",
  label: moves.reptile.universal.risingAssault.label,
  route: [moves.reptile.universal.risingAssault],
  tags: moves.reptile.universal.risingAssault.tags,
  sourceIds: moves.reptile.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const scorpionHellfireHellfireTechniqueTransition = {
  id: "scorpion:hellfire:hellfire-technique",
  label: moves.scorpion.hellfire.hellfireTechnique.label,
  route: [moves.scorpion.hellfire.hellfireTechnique],
  tags: moves.scorpion.hellfire.hellfireTechnique.tags,
  sourceIds: moves.scorpion.hellfire.hellfireTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const scorpionInfernoInfernoTechniqueTransition = {
  id: "scorpion:inferno:inferno-technique",
  label: moves.scorpion.inferno.infernoTechnique.label,
  route: [moves.scorpion.inferno.infernoTechnique],
  tags: moves.scorpion.inferno.infernoTechnique.tags,
  sourceIds: moves.scorpion.inferno.infernoTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const scorpionNinjutsuNinjutsuTechniqueTransition = {
  id: "scorpion:ninjutsu:ninjutsu-technique",
  label: moves.scorpion.ninjutsu.ninjutsuTechnique.label,
  route: [moves.scorpion.ninjutsu.ninjutsuTechnique],
  tags: moves.scorpion.ninjutsu.ninjutsuTechnique.tags,
  sourceIds: moves.scorpion.ninjutsu.ninjutsuTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const scorpionUniversalClosingStrikeTransition = {
  id: "scorpion:universal:closing-strike",
  label: moves.scorpion.universal.closingStrike.label,
  route: [moves.scorpion.universal.closingStrike],
  tags: moves.scorpion.universal.closingStrike.tags,
  sourceIds: moves.scorpion.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const scorpionUniversalClosingStrikeEnhancedTransition = {
  id: "scorpion:universal:closing-strike-enhanced",
  label: moves.scorpion.universal.closingStrikeEnhanced.label,
  route: [moves.scorpion.universal.closingStrikeEnhanced],
  tags: moves.scorpion.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.scorpion.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const scorpionUniversalOpeningAssaultTransition = {
  id: "scorpion:universal:opening-assault",
  label: moves.scorpion.universal.openingAssault.label,
  route: [moves.scorpion.universal.openingAssault],
  tags: moves.scorpion.universal.openingAssault.tags,
  sourceIds: moves.scorpion.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const scorpionUniversalRisingAssaultTransition = {
  id: "scorpion:universal:rising-assault",
  label: moves.scorpion.universal.risingAssault.label,
  route: [moves.scorpion.universal.risingAssault],
  tags: moves.scorpion.universal.risingAssault.tags,
  sourceIds: moves.scorpion.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const shinnokBoneShaperBoneShaperTechniqueTransition = {
  id: "shinnok:bone-shaper:bone-shaper-technique",
  label: moves.shinnok.boneShaper.boneShaperTechnique.label,
  route: [moves.shinnok.boneShaper.boneShaperTechnique],
  tags: moves.shinnok.boneShaper.boneShaperTechnique.tags,
  sourceIds: moves.shinnok.boneShaper.boneShaperTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const shinnokImpostorImpostorTechniqueTransition = {
  id: "shinnok:impostor:impostor-technique",
  label: moves.shinnok.impostor.impostorTechnique.label,
  route: [moves.shinnok.impostor.impostorTechnique],
  tags: moves.shinnok.impostor.impostorTechnique.tags,
  sourceIds: moves.shinnok.impostor.impostorTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const shinnokNecromancerNecromancerTechniqueTransition = {
  id: "shinnok:necromancer:necromancer-technique",
  label: moves.shinnok.necromancer.necromancerTechnique.label,
  route: [moves.shinnok.necromancer.necromancerTechnique],
  tags: moves.shinnok.necromancer.necromancerTechnique.tags,
  sourceIds: moves.shinnok.necromancer.necromancerTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const shinnokUniversalClosingStrikeTransition = {
  id: "shinnok:universal:closing-strike",
  label: moves.shinnok.universal.closingStrike.label,
  route: [moves.shinnok.universal.closingStrike],
  tags: moves.shinnok.universal.closingStrike.tags,
  sourceIds: moves.shinnok.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const shinnokUniversalClosingStrikeEnhancedTransition = {
  id: "shinnok:universal:closing-strike-enhanced",
  label: moves.shinnok.universal.closingStrikeEnhanced.label,
  route: [moves.shinnok.universal.closingStrikeEnhanced],
  tags: moves.shinnok.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.shinnok.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const shinnokUniversalOpeningAssaultTransition = {
  id: "shinnok:universal:opening-assault",
  label: moves.shinnok.universal.openingAssault.label,
  route: [moves.shinnok.universal.openingAssault],
  tags: moves.shinnok.universal.openingAssault.tags,
  sourceIds: moves.shinnok.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const shinnokUniversalRisingAssaultTransition = {
  id: "shinnok:universal:rising-assault",
  label: moves.shinnok.universal.risingAssault.label,
  route: [moves.shinnok.universal.risingAssault],
  tags: moves.shinnok.universal.risingAssault.tags,
  sourceIds: moves.shinnok.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeCovertOpsCovertOpsTechniqueTransition = {
  id: "sonya-blade:covert-ops:covert-ops-technique",
  label: moves.sonyaBlade.covertOps.covertOpsTechnique.label,
  route: [moves.sonyaBlade.covertOps.covertOpsTechnique],
  tags: moves.sonyaBlade.covertOps.covertOpsTechnique.tags,
  sourceIds: moves.sonyaBlade.covertOps.covertOpsTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeDemolitionDemolitionTechniqueTransition = {
  id: "sonya-blade:demolition:demolition-technique",
  label: moves.sonyaBlade.demolition.demolitionTechnique.label,
  route: [moves.sonyaBlade.demolition.demolitionTechnique],
  tags: moves.sonyaBlade.demolition.demolitionTechnique.tags,
  sourceIds: moves.sonyaBlade.demolition.demolitionTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeSpecialForcesSpecialForcesTechniqueTransition = {
  id: "sonya-blade:special-forces:special-forces-technique",
  label: moves.sonyaBlade.specialForces.specialForcesTechnique.label,
  route: [moves.sonyaBlade.specialForces.specialForcesTechnique],
  tags: moves.sonyaBlade.specialForces.specialForcesTechnique.tags,
  sourceIds: moves.sonyaBlade.specialForces.specialForcesTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeUniversalClosingStrikeTransition = {
  id: "sonya-blade:universal:closing-strike",
  label: moves.sonyaBlade.universal.closingStrike.label,
  route: [moves.sonyaBlade.universal.closingStrike],
  tags: moves.sonyaBlade.universal.closingStrike.tags,
  sourceIds: moves.sonyaBlade.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeUniversalOpeningAssaultTransition = {
  id: "sonya-blade:universal:opening-assault",
  label: moves.sonyaBlade.universal.openingAssault.label,
  route: [moves.sonyaBlade.universal.openingAssault],
  tags: moves.sonyaBlade.universal.openingAssault.tags,
  sourceIds: moves.sonyaBlade.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const sonyaBladeUniversalRisingAssaultTransition = {
  id: "sonya-blade:universal:rising-assault",
  label: moves.sonyaBlade.universal.risingAssault.label,
  route: [moves.sonyaBlade.universal.risingAssault],
  tags: moves.sonyaBlade.universal.risingAssault.tags,
  sourceIds: moves.sonyaBlade.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const subZeroCryomancerCryomancerTechniqueTransition = {
  id: "sub-zero:cryomancer:cryomancer-technique",
  label: moves.subZero.cryomancer.cryomancerTechnique.label,
  route: [moves.subZero.cryomancer.cryomancerTechnique],
  tags: moves.subZero.cryomancer.cryomancerTechnique.tags,
  sourceIds: moves.subZero.cryomancer.cryomancerTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const subZeroGrandmasterGrandmasterTechniqueTransition = {
  id: "sub-zero:grandmaster:grandmaster-technique",
  label: moves.subZero.grandmaster.grandmasterTechnique.label,
  route: [moves.subZero.grandmaster.grandmasterTechnique],
  tags: moves.subZero.grandmaster.grandmasterTechnique.tags,
  sourceIds: moves.subZero.grandmaster.grandmasterTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const subZeroUnbreakableUnbreakableTechniqueTransition = {
  id: "sub-zero:unbreakable:unbreakable-technique",
  label: moves.subZero.unbreakable.unbreakableTechnique.label,
  route: [moves.subZero.unbreakable.unbreakableTechnique],
  tags: moves.subZero.unbreakable.unbreakableTechnique.tags,
  sourceIds: moves.subZero.unbreakable.unbreakableTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const subZeroUniversalClosingStrikeTransition = {
  id: "sub-zero:universal:closing-strike",
  label: moves.subZero.universal.closingStrike.label,
  route: [moves.subZero.universal.closingStrike],
  tags: moves.subZero.universal.closingStrike.tags,
  sourceIds: moves.subZero.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const subZeroUniversalClosingStrikeEnhancedTransition = {
  id: "sub-zero:universal:closing-strike-enhanced",
  label: moves.subZero.universal.closingStrikeEnhanced.label,
  route: [moves.subZero.universal.closingStrikeEnhanced],
  tags: moves.subZero.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.subZero.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const subZeroUniversalOpeningAssaultTransition = {
  id: "sub-zero:universal:opening-assault",
  label: moves.subZero.universal.openingAssault.label,
  route: [moves.subZero.universal.openingAssault],
  tags: moves.subZero.universal.openingAssault.tags,
  sourceIds: moves.subZero.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const subZeroUniversalRisingAssaultTransition = {
  id: "sub-zero:universal:rising-assault",
  label: moves.subZero.universal.risingAssault.label,
  route: [moves.subZero.universal.risingAssault],
  tags: moves.subZero.universal.risingAssault.tags,
  sourceIds: moves.subZero.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const takedaLasherLasherTechniqueTransition = {
  id: "takeda:lasher:lasher-technique",
  label: moves.takeda.lasher.lasherTechnique.label,
  route: [moves.takeda.lasher.lasherTechnique],
  tags: moves.takeda.lasher.lasherTechnique.tags,
  sourceIds: moves.takeda.lasher.lasherTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const takedaRoninRoninTechniqueTransition = {
  id: "takeda:ronin:ronin-technique",
  label: moves.takeda.ronin.roninTechnique.label,
  route: [moves.takeda.ronin.roninTechnique],
  tags: moves.takeda.ronin.roninTechnique.tags,
  sourceIds: moves.takeda.ronin.roninTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const takedaShiraiRyuShiraiRyuTechniqueTransition = {
  id: "takeda:shirai-ryu:shirai-ryu-technique",
  label: moves.takeda.shiraiRyu.shiraiRyuTechnique.label,
  route: [moves.takeda.shiraiRyu.shiraiRyuTechnique],
  tags: moves.takeda.shiraiRyu.shiraiRyuTechnique.tags,
  sourceIds: moves.takeda.shiraiRyu.shiraiRyuTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const takedaUniversalClosingStrikeTransition = {
  id: "takeda:universal:closing-strike",
  label: moves.takeda.universal.closingStrike.label,
  route: [moves.takeda.universal.closingStrike],
  tags: moves.takeda.universal.closingStrike.tags,
  sourceIds: moves.takeda.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const takedaUniversalClosingStrikeEnhancedTransition = {
  id: "takeda:universal:closing-strike-enhanced",
  label: moves.takeda.universal.closingStrikeEnhanced.label,
  route: [moves.takeda.universal.closingStrikeEnhanced],
  tags: moves.takeda.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.takeda.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const takedaUniversalOpeningAssaultTransition = {
  id: "takeda:universal:opening-assault",
  label: moves.takeda.universal.openingAssault.label,
  route: [moves.takeda.universal.openingAssault],
  tags: moves.takeda.universal.openingAssault.tags,
  sourceIds: moves.takeda.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const takedaUniversalRisingAssaultTransition = {
  id: "takeda:universal:rising-assault",
  label: moves.takeda.universal.risingAssault.label,
  route: [moves.takeda.universal.risingAssault],
  tags: moves.takeda.universal.risingAssault.tags,
  sourceIds: moves.takeda.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tanyaDragonNaginataDragonNaginataTechniqueTransition = {
  id: "tanya:dragon-naginata:dragon-naginata-technique",
  label: moves.tanya.dragonNaginata.dragonNaginataTechnique.label,
  route: [moves.tanya.dragonNaginata.dragonNaginataTechnique],
  tags: moves.tanya.dragonNaginata.dragonNaginataTechnique.tags,
  sourceIds: moves.tanya.dragonNaginata.dragonNaginataTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tanyaKobuJutsuKobuJutsuTechniqueTransition = {
  id: "tanya:kobu-jutsu:kobu-jutsu-technique",
  label: moves.tanya.kobuJutsu.kobuJutsuTechnique.label,
  route: [moves.tanya.kobuJutsu.kobuJutsuTechnique],
  tags: moves.tanya.kobuJutsu.kobuJutsuTechnique.tags,
  sourceIds: moves.tanya.kobuJutsu.kobuJutsuTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tanyaPyromancerPyromancerTechniqueTransition = {
  id: "tanya:pyromancer:pyromancer-technique",
  label: moves.tanya.pyromancer.pyromancerTechnique.label,
  route: [moves.tanya.pyromancer.pyromancerTechnique],
  tags: moves.tanya.pyromancer.pyromancerTechnique.tags,
  sourceIds: moves.tanya.pyromancer.pyromancerTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tanyaUniversalClosingStrikeTransition = {
  id: "tanya:universal:closing-strike",
  label: moves.tanya.universal.closingStrike.label,
  route: [moves.tanya.universal.closingStrike],
  tags: moves.tanya.universal.closingStrike.tags,
  sourceIds: moves.tanya.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tanyaUniversalClosingStrikeEnhancedTransition = {
  id: "tanya:universal:closing-strike-enhanced",
  label: moves.tanya.universal.closingStrikeEnhanced.label,
  route: [moves.tanya.universal.closingStrikeEnhanced],
  tags: moves.tanya.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.tanya.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tanyaUniversalOpeningAssaultTransition = {
  id: "tanya:universal:opening-assault",
  label: moves.tanya.universal.openingAssault.label,
  route: [moves.tanya.universal.openingAssault],
  tags: moves.tanya.universal.openingAssault.tags,
  sourceIds: moves.tanya.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tanyaUniversalRisingAssaultTransition = {
  id: "tanya:universal:rising-assault",
  label: moves.tanya.universal.risingAssault.label,
  route: [moves.tanya.universal.risingAssault],
  tags: moves.tanya.universal.risingAssault.tags,
  sourceIds: moves.tanya.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tremorAftershockAftershockTechniqueTransition = {
  id: "tremor:aftershock:aftershock-technique",
  label: moves.tremor.aftershock.aftershockTechnique.label,
  route: [moves.tremor.aftershock.aftershockTechnique],
  tags: moves.tremor.aftershock.aftershockTechnique.tags,
  sourceIds: moves.tremor.aftershock.aftershockTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tremorCrystallineCrystallineTechniqueTransition = {
  id: "tremor:crystalline:crystalline-technique",
  label: moves.tremor.crystalline.crystallineTechnique.label,
  route: [moves.tremor.crystalline.crystallineTechnique],
  tags: moves.tremor.crystalline.crystallineTechnique.tags,
  sourceIds: moves.tremor.crystalline.crystallineTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tremorMetallicMetallicTechniqueTransition = {
  id: "tremor:metallic:metallic-technique",
  label: moves.tremor.metallic.metallicTechnique.label,
  route: [moves.tremor.metallic.metallicTechnique],
  tags: moves.tremor.metallic.metallicTechnique.tags,
  sourceIds: moves.tremor.metallic.metallicTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tremorUniversalClosingStrikeTransition = {
  id: "tremor:universal:closing-strike",
  label: moves.tremor.universal.closingStrike.label,
  route: [moves.tremor.universal.closingStrike],
  tags: moves.tremor.universal.closingStrike.tags,
  sourceIds: moves.tremor.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tremorUniversalOpeningAssaultTransition = {
  id: "tremor:universal:opening-assault",
  label: moves.tremor.universal.openingAssault.label,
  route: [moves.tremor.universal.openingAssault],
  tags: moves.tremor.universal.openingAssault.tags,
  sourceIds: moves.tremor.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const tremorUniversalRisingAssaultTransition = {
  id: "tremor:universal:rising-assault",
  label: moves.tremor.universal.risingAssault.label,
  route: [moves.tremor.universal.risingAssault],
  tags: moves.tremor.universal.risingAssault.tags,
  sourceIds: moves.tremor.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const triborgCyberSubZeroCyberSubZeroTechniqueTransition = {
  id: "triborg:cyber-sub-zero:cyber-sub-zero-technique",
  label: moves.triborg.cyberSubZero.cyberSubZeroTechnique.label,
  route: [moves.triborg.cyberSubZero.cyberSubZeroTechnique],
  tags: moves.triborg.cyberSubZero.cyberSubZeroTechnique.tags,
  sourceIds: moves.triborg.cyberSubZero.cyberSubZeroTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const triborgCyraxCyraxTechniqueTransition = {
  id: "triborg:cyrax:cyrax-technique",
  label: moves.triborg.cyrax.cyraxTechnique.label,
  route: [moves.triborg.cyrax.cyraxTechnique],
  tags: moves.triborg.cyrax.cyraxTechnique.tags,
  sourceIds: moves.triborg.cyrax.cyraxTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const triborgSektorSektorTechniqueTransition = {
  id: "triborg:sektor:sektor-technique",
  label: moves.triborg.sektor.sektorTechnique.label,
  route: [moves.triborg.sektor.sektorTechnique],
  tags: moves.triborg.sektor.sektorTechnique.tags,
  sourceIds: moves.triborg.sektor.sektorTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const triborgSmokeSmokeTechniqueTransition = {
  id: "triborg:smoke:smoke-technique",
  label: moves.triborg.smoke.smokeTechnique.label,
  route: [moves.triborg.smoke.smokeTechnique],
  tags: moves.triborg.smoke.smokeTechnique.tags,
  sourceIds: moves.triborg.smoke.smokeTechnique.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const triborgUniversalClosingStrikeTransition = {
  id: "triborg:universal:closing-strike",
  label: moves.triborg.universal.closingStrike.label,
  route: [moves.triborg.universal.closingStrike],
  tags: moves.triborg.universal.closingStrike.tags,
  sourceIds: moves.triborg.universal.closingStrike.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const triborgUniversalClosingStrikeEnhancedTransition = {
  id: "triborg:universal:closing-strike-enhanced",
  label: moves.triborg.universal.closingStrikeEnhanced.label,
  route: [moves.triborg.universal.closingStrikeEnhanced],
  tags: moves.triborg.universal.closingStrikeEnhanced.tags,
  sourceIds: moves.triborg.universal.closingStrikeEnhanced.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const triborgUniversalOpeningAssaultTransition = {
  id: "triborg:universal:opening-assault",
  label: moves.triborg.universal.openingAssault.label,
  route: [moves.triborg.universal.openingAssault],
  tags: moves.triborg.universal.openingAssault.tags,
  sourceIds: moves.triborg.universal.openingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

const triborgUniversalRisingAssaultTransition = {
  id: "triborg:universal:rising-assault",
  label: moves.triborg.universal.risingAssault.label,
  route: [moves.triborg.universal.risingAssault],
  tags: moves.triborg.universal.risingAssault.tags,
  sourceIds: moves.triborg.universal.risingAssault.sourceIds,
} as const satisfies MkxlAuthoredTransition;

export const mkxlXlFinalTransitionRegistry = {
  alien: {
    tarkatan: {
      oneTwoIntoExBFFour: alienTarkatan12Exbf4Transition,
      twoOneFourIntoDFThree: alienTarkatan214Df3Transition,
      twoOneFourIntoExBFOne: alienTarkatan214Exbf1Transition,
      bOneOneUFour: alienTarkatanB11u4Transition,
      bThreeIntoExBFFour: alienTarkatanB3Exbf4Transition,
      fOneThreeFourIntoDFThree: alienTarkatanF134Df3Transition,
      fOneThreeFourIntoExBFOne: alienTarkatanF134Exbf1Transition,
      fFourIntoExBFFour: alienTarkatanF4Exbf4Transition,
      uThree: alienTarkatanU3Transition,
      tarkatanTechnique: alienTarkatanTarkatanTechniqueTransition,
    },
    acidic: {
      acidicTechnique: alienAcidicAcidicTechniqueTransition,
    },
    konjurer: {
      konjurerTechnique: alienKonjurerKonjurerTechniqueTransition,
    },
    universal: {
      closingStrike: alienUniversalClosingStrikeTransition,
      closingStrikeEnhanced: alienUniversalClosingStrikeEnhancedTransition,
      openingAssault: alienUniversalOpeningAssaultTransition,
      risingAssault: alienUniversalRisingAssaultTransition,
    },
  },
  boRaiCho: {
    bartitsu: {
      twoOne: boRaiChoBartitsu21Transition,
      threeFourOne: boRaiChoBartitsu341Transition,
      bTwoThreeThreeIntoBFFour: boRaiChoBartitsuB233Bf4Transition,
      fTwoIntoBFFour: boRaiChoBartitsuF2Bf4Transition,
      bartitsuTechnique: boRaiChoBartitsuBartitsuTechniqueTransition,
    },
    dragonBreath: {
      dragonBreathTechnique: boRaiChoDragonBreathDragonBreathTechniqueTransition,
    },
    drunkenMaster: {
      drunkenMasterTechnique: boRaiChoDrunkenMasterDrunkenMasterTechniqueTransition,
    },
    universal: {
      closingStrike: boRaiChoUniversalClosingStrikeTransition,
      closingStrikeEnhanced: boRaiChoUniversalClosingStrikeEnhancedTransition,
      openingAssault: boRaiChoUniversalOpeningAssaultTransition,
      risingAssault: boRaiChoUniversalRisingAssaultTransition,
    },
  },
  cassieCage: {
    hollywood: {
      oneOneTwoIntoOneTwoOne: cassieCageHollywood112121Transition,
      oneTwoOne: cassieCageHollywood121Transition,
      oneTwoThreeIntoDBTwo: cassieCageHollywood123Db2Transition,
      twoOneUFour: cassieCageHollywood21U4Transition,
      twoFourTwo: cassieCageHollywood242Transition,
      bOneTwoIntoDBTwo: cassieCageHollywoodB12Db2Transition,
      bOneIntoDBTwo: cassieCageHollywoodB1Db2Transition,
      fThreeIntoExDBTwo: cassieCageHollywoodF3Exdb2Transition,
      fFourFourIntoBFFour: cassieCageHollywoodF44Bf4Transition,
      hollywoodTechnique: cassieCageHollywoodHollywoodTechniqueTransition,
    },
    brawler: {
      brawlerTechnique: cassieCageBrawlerBrawlerTechniqueTransition,
    },
    specOps: {
      specOpsTechnique: cassieCageSpecOpsSpecOpsTechniqueTransition,
    },
    universal: {
      closingStrike: cassieCageUniversalClosingStrikeTransition,
      closingStrikeEnhanced: cassieCageUniversalClosingStrikeEnhancedTransition,
      openingAssault: cassieCageUniversalOpeningAssaultTransition,
      risingAssault: cassieCageUniversalRisingAssaultTransition,
    },
  },
  dvorah: {
    broodMother: {
      oneOneTwoIntoExDFOne: dvorahBroodMother112Exdf1Transition,
      oneOneBTwo: dvorahBroodMother11B2Transition,
      oneOneBTwoIntoFOneOneTwoIntoDBFour: dvorahBroodMother11B2F112Db4Transition,
      twoOneTwoIntoDBOne: dvorahBroodMother212Db1Transition,
      twoOneTwoIntoDFThree: dvorahBroodMother212Df3Transition,
      fourFourIntoDBFour: dvorahBroodMother44Db4Transition,
      bOneIntoExDFOne: dvorahBroodMotherB1Exdf1Transition,
      dOne: dvorahBroodMotherD1Transition,
      fOneOneTwoIntoDBFour: dvorahBroodMotherF112Db4Transition,
      fOneOneIntoDFThree: dvorahBroodMotherF11Df3Transition,
      fOneOneIntoDFFour: dvorahBroodMotherF11Df4Transition,
      fThreeFour: dvorahBroodMotherF34Transition,
      fFourFour: dvorahBroodMotherF44Transition,
      fFourFourIntoDBFour: dvorahBroodMotherF44Db4Transition,
      broodMotherTechnique: dvorahBroodMotherBroodMotherTechniqueTransition,
    },
    swarmQueen: {
      swarmQueenTechnique: dvorahSwarmQueenSwarmQueenTechniqueTransition,
    },
    universal: {
      closingStrike: dvorahUniversalClosingStrikeTransition,
      openingAssault: dvorahUniversalOpeningAssaultTransition,
      risingAssault: dvorahUniversalRisingAssaultTransition,
    },
    venomous: {
      venomousTechnique: dvorahVenomousVenomousTechniqueTransition,
    },
  },
  ermac: {
    masterOfSouls: {
      oneOneTwoIntoBFTwo: ermacMasterOfSouls112Bf2Transition,
      dTwo: ermacMasterOfSoulsD2Transition,
      dBFour: ermacMasterOfSoulsDb4Transition,
      masterOfSoulsTechnique: ermacMasterOfSoulsMasterOfSoulsTechniqueTransition,
    },
    mystic: {
      mysticTechnique: ermacMysticMysticTechniqueTransition,
    },
    spectral: {
      spectralTechnique: ermacSpectralSpectralTechniqueTransition,
    },
    universal: {
      closingStrike: ermacUniversalClosingStrikeTransition,
      closingStrikeEnhanced: ermacUniversalClosingStrikeEnhancedTransition,
      openingAssault: ermacUniversalOpeningAssaultTransition,
      risingAssault: ermacUniversalRisingAssaultTransition,
    },
  },
  erronBlack: {
    outlaw: {
      oneOneTwo: erronBlackOutlaw112Transition,
      oneOneBThreeIntoDBFour: erronBlackOutlaw11B3Db4Transition,
      twoOneOneTwoTwoIntoBFFour: erronBlackOutlaw21122Bf4Transition,
      twoOneOneTwoTwoIntoDBFTwo: erronBlackOutlaw21122Dbf2Transition,
      twoOneOneTwoTwoIntoExDBFour: erronBlackOutlaw21122Exdb4Transition,
      bThreeThreeIntoDBFour: erronBlackOutlawB33Db4Transition,
      bThreeThreeIntoDFTwo: erronBlackOutlawB33Df2Transition,
      bThreeThreeIntoExBFThree: erronBlackOutlawB33Exbf3Transition,
      bFFour: erronBlackOutlawBf4Transition,
      dOne: erronBlackOutlawD1Transition,
      dTwo: erronBlackOutlawD2Transition,
      fOneThreeIntoDBFour: erronBlackOutlawF13Db4Transition,
      outlawTechnique: erronBlackOutlawOutlawTechniqueTransition,
    },
    gunslinger: {
      gunslingerTechnique: erronBlackGunslingerGunslingerTechniqueTransition,
    },
    marksman: {
      marksmanTechnique: erronBlackMarksmanMarksmanTechniqueTransition,
    },
    universal: {
      closingStrike: erronBlackUniversalClosingStrikeTransition,
      closingStrikeEnhanced: erronBlackUniversalClosingStrikeEnhancedTransition,
      openingAssault: erronBlackUniversalOpeningAssaultTransition,
      risingAssault: erronBlackUniversalRisingAssaultTransition,
    },
  },
  ferraTorr: {
    ruthless: {
      oneOne: ferraTorrRuthless11Transition,
      oneOneIntoExBFTwo: ferraTorrRuthless11Exbf2Transition,
      oneOneIntoExDBTwo: ferraTorrRuthless11Exdb2Transition,
      fourIntoBFThree: ferraTorrRuthless4Bf3Transition,
      bOneTwoOneIntoExBFTwo: ferraTorrRuthlessB121Exbf2Transition,
      bOneTwoOneIntoExDBTwo: ferraTorrRuthlessB121Exdb2Transition,
      dTwo: ferraTorrRuthlessD2Transition,
      fTwo: ferraTorrRuthlessF2Transition,
      fThreeIntoDBFOne: ferraTorrRuthlessF3Dbf1Transition,
      ruthlessTechnique: ferraTorrRuthlessRuthlessTechniqueTransition,
    },
    lackey: {
      lackeyTechnique: ferraTorrLackeyLackeyTechniqueTransition,
    },
    universal: {
      closingStrike: ferraTorrUniversalClosingStrikeTransition,
      closingStrikeEnhanced: ferraTorrUniversalClosingStrikeEnhancedTransition,
      openingAssault: ferraTorrUniversalOpeningAssaultTransition,
      risingAssault: ferraTorrUniversalRisingAssaultTransition,
    },
    vicious: {
      viciousTechnique: ferraTorrViciousViciousTechniqueTransition,
    },
  },
  goro: {
    kuatanWarrior: {
      oneTwoOneIntoDBFThree: goroKuatanWarrior121Dbf3Transition,
      oneTwoOneIntoExDBFThree: goroKuatanWarrior121Exdbf3Transition,
      threeDThree: goroKuatanWarrior3D3Transition,
      threeDThreeIntoBFFour: goroKuatanWarrior3D3Bf4Transition,
      fourIntoDBFThree: goroKuatanWarrior4Dbf3Transition,
      fourIntoExBFOne: goroKuatanWarrior4Exbf1Transition,
      bOneTwoUTwo: goroKuatanWarriorB12U2Transition,
      bTwo: goroKuatanWarriorB2Transition,
      dOne: goroKuatanWarriorD1Transition,
      fThreeIntoBFTwo: goroKuatanWarriorF3Bf2Transition,
      fThreeIntoDBFThree: goroKuatanWarriorF3Dbf3Transition,
      mb: goroKuatanWarriorMbTransition,
      kuatanWarriorTechnique: goroKuatanWarriorKuatanWarriorTechniqueTransition,
    },
    dragonFangs: {
      dragonFangsTechnique: goroDragonFangsDragonFangsTechniqueTransition,
    },
    tigrarFury: {
      tigrarFuryTechnique: goroTigrarFuryTigrarFuryTechniqueTransition,
    },
    universal: {
      closingStrike: goroUniversalClosingStrikeTransition,
      openingAssault: goroUniversalOpeningAssaultTransition,
      risingAssault: goroUniversalRisingAssaultTransition,
    },
  },
  jacquiBriggs: {
    fullAuto: {
      oneOne: jacquiBriggsFullAuto11Transition,
      oneOneFourIntoBFFour: jacquiBriggsFullAuto114Bf4Transition,
      oneTwoOneTwoIntoBFFour: jacquiBriggsFullAuto1212Bf4Transition,
      oneTwoOneIntoDBThree: jacquiBriggsFullAuto121Db3Transition,
      oneTwoOneIntoExDBThree: jacquiBriggsFullAuto121Exdb3Transition,
      oneIntoFTwoUTwo: jacquiBriggsFullAuto1F2U2Transition,
      twoThreeIntoDBThree: jacquiBriggsFullAuto23Db3Transition,
      threeThreeIntoBFFour: jacquiBriggsFullAuto33Bf4Transition,
      threeThreeIntoDBTwo: jacquiBriggsFullAuto33Db2Transition,
      fourIntoBFFour: jacquiBriggsFullAuto4Bf4Transition,
      bTwoIntoExDBTwo: jacquiBriggsFullAutoB2Exdb2Transition,
      bTwoIntoExDBThree: jacquiBriggsFullAutoB2Exdb3Transition,
      bThreeThreeIntoDBThree: jacquiBriggsFullAutoB33Db3Transition,
      bThreeThreeIntoExDBThree: jacquiBriggsFullAutoB33Exdb3Transition,
      bFOne: jacquiBriggsFullAutoBf1Transition,
      bFTwo: jacquiBriggsFullAutoBf2Transition,
      dash: jacquiBriggsFullAutoDashTransition,
      dUFour: jacquiBriggsFullAutoDu4Transition,
      fOneTwoIntoDBTwo: jacquiBriggsFullAutoF12Db2Transition,
      fOneIntoBFFour: jacquiBriggsFullAutoF1Bf4Transition,
      fTwoUTwo: jacquiBriggsFullAutoF2U2Transition,
      fullAutoTechnique: jacquiBriggsFullAutoFullAutoTechniqueTransition,
    },
    highTech: {
      highTechTechnique: jacquiBriggsHighTechHighTechTechniqueTransition,
    },
    shotgun: {
      shotgunTechnique: jacquiBriggsShotgunShotgunTechniqueTransition,
    },
    universal: {
      closingStrike: jacquiBriggsUniversalClosingStrikeTransition,
      closingStrikeEnhanced: jacquiBriggsUniversalClosingStrikeEnhancedTransition,
      openingAssault: jacquiBriggsUniversalOpeningAssaultTransition,
      risingAssault: jacquiBriggsUniversalRisingAssaultTransition,
    },
  },
  jasonVoorhees: {
    slasher: {
      oneOneOneIntoDFOne: jasonVoorheesSlasher111Df1Transition,
      oneOneOneIntoExBFTwo: jasonVoorheesSlasher111Exbf2Transition,
      oneOneOneIntoExDFOne: jasonVoorheesSlasher111Exdf1Transition,
      oneOneIntoDFOne: jasonVoorheesSlasher11Df1Transition,
      oneOneIntoExDFOne: jasonVoorheesSlasher11Exdf1Transition,
      oneTwoTwoIntoBFThree: jasonVoorheesSlasher122Bf3Transition,
      twoFour: jasonVoorheesSlasher24Transition,
      bOneTwoTwo: jasonVoorheesSlasherB122Transition,
      bTwo: jasonVoorheesSlasherB2Transition,
      dOne: jasonVoorheesSlasherD1Transition,
      fTwoIntoDFOne: jasonVoorheesSlasherF2Df1Transition,
      fTwoIntoExBFTwo: jasonVoorheesSlasherF2Exbf2Transition,
      fFourTwo: jasonVoorheesSlasherF42Transition,
      slasherTechnique: jasonVoorheesSlasherSlasherTechniqueTransition,
    },
    relentless: {
      relentlessTechnique: jasonVoorheesRelentlessRelentlessTechniqueTransition,
    },
    universal: {
      closingStrike: jasonVoorheesUniversalClosingStrikeTransition,
      closingStrikeEnhanced: jasonVoorheesUniversalClosingStrikeEnhancedTransition,
      openingAssault: jasonVoorheesUniversalOpeningAssaultTransition,
      risingAssault: jasonVoorheesUniversalRisingAssaultTransition,
    },
    unstoppable: {
      unstoppableTechnique: jasonVoorheesUnstoppableUnstoppableTechniqueTransition,
    },
  },
  jax: {
    heavyWeapons: {
      oneOne: jaxHeavyWeapons11Transition,
      oneOneIntoDBOne: jaxHeavyWeapons11Db1Transition,
      oneTwoFourIntoDBOne: jaxHeavyWeapons124Db1Transition,
      oneTwoFourIntoExDBOne: jaxHeavyWeapons124Exdb1Transition,
      oneTwoIntoDBOne: jaxHeavyWeapons12Db1Transition,
      threeBTwo: jaxHeavyWeapons3b2Transition,
      bTwoIntoExBFTwoD: jaxHeavyWeaponsB2Exbf2dTransition,
      bThreeFourIntoExBFTwoD: jaxHeavyWeaponsB34Exbf2dTransition,
      bThreeFourIntoExDBOne: jaxHeavyWeaponsB34Exdb1Transition,
      bThreeIntoBFTwoD: jaxHeavyWeaponsB3Bf2dTransition,
      dOneTwo: jaxHeavyWeaponsD12Transition,
      fTwoOne: jaxHeavyWeaponsF21Transition,
      fTwoOneTwo: jaxHeavyWeaponsF212Transition,
      fTwoOneTwoDIntoTwoIntoFour: jaxHeavyWeaponsF212d24Transition,
      heavyWeaponsTechnique: jaxHeavyWeaponsHeavyWeaponsTechniqueTransition,
    },
    pumpedUp: {
      pumpedUpTechnique: jaxPumpedUpPumpedUpTechniqueTransition,
    },
    universal: {
      closingStrike: jaxUniversalClosingStrikeTransition,
      closingStrikeEnhanced: jaxUniversalClosingStrikeEnhancedTransition,
      openingAssault: jaxUniversalOpeningAssaultTransition,
      risingAssault: jaxUniversalRisingAssaultTransition,
    },
    wrestler: {
      wrestlerTechnique: jaxWrestlerWrestlerTechniqueTransition,
    },
  },
  johnnyCage: {
    stuntDouble: {
      oneOneThreeIntoBDThree: johnnyCageStuntDouble113Bd3Transition,
      oneOneThreeIntoDBOne: johnnyCageStuntDouble113Db1Transition,
      oneOneThreeIntoExBDThree: johnnyCageStuntDouble113Exbd3Transition,
      oneOneFourIntoDBOne: johnnyCageStuntDouble114Db1Transition,
      oneTwo: johnnyCageStuntDouble12Transition,
      oneTwoIntoBDThree: johnnyCageStuntDouble12Bd3Transition,
      fourIntoDBOne: johnnyCageStuntDouble4Db1Transition,
      dOne: johnnyCageStuntDoubleD1Transition,
      dash: johnnyCageStuntDoubleDashTransition,
      dBFour: johnnyCageStuntDoubleDb4Transition,
      fTwoFour: johnnyCageStuntDoubleF24Transition,
      fTwoFourIntoExBFFour: johnnyCageStuntDoubleF24Exbf4Transition,
      fTwoFourIntoExDBTwo: johnnyCageStuntDoubleF24Exdb2Transition,
      fThreeIntoBDThree: johnnyCageStuntDoubleF3Bd3Transition,
      fThreeIntoDBOne: johnnyCageStuntDoubleF3Db1Transition,
      fThreeIntoExBDThree: johnnyCageStuntDoubleF3Exbd3Transition,
      stuntDoubleTechnique: johnnyCageStuntDoubleStuntDoubleTechniqueTransition,
    },
    aList: {
      aListTechnique: johnnyCageAListAListTechniqueTransition,
    },
    fisticuffs: {
      fisticuffsTechnique: johnnyCageFisticuffsFisticuffsTechniqueTransition,
    },
    universal: {
      closingStrike: johnnyCageUniversalClosingStrikeTransition,
      openingAssault: johnnyCageUniversalOpeningAssaultTransition,
      risingAssault: johnnyCageUniversalRisingAssaultTransition,
    },
  },
  kano: {
    cutthroat: {
      oneOneTwoIntoBFThree: kanoCutthroat112Bf3Transition,
      oneOneTwoIntoExDBOne: kanoCutthroat112Exdb1Transition,
      oneOneTwoIntoExDDThree: kanoCutthroat112Exdd3Transition,
      twoIntoDBOne: kanoCutthroat2Db1Transition,
      threeTwo: kanoCutthroat32Transition,
      fourIntoBFThree: kanoCutthroat4Bf3Transition,
      bOneTwoOneIntoDFTwo: kanoCutthroatB121Df2Transition,
      bThreeOneTwo: kanoCutthroatB312Transition,
      dThree: kanoCutthroatD3Transition,
      fTwoOneTwo: kanoCutthroatF212Transition,
      fFourIntoBFThree: kanoCutthroatF4Bf3Transition,
      cutthroatTechnique: kanoCutthroatCutthroatTechniqueTransition,
    },
    commando: {
      commandoTechnique: kanoCommandoCommandoTechniqueTransition,
    },
    cybernetic: {
      cyberneticTechnique: kanoCyberneticCyberneticTechniqueTransition,
    },
    universal: {
      closingStrike: kanoUniversalClosingStrikeTransition,
      closingStrikeEnhanced: kanoUniversalClosingStrikeEnhancedTransition,
      openingAssault: kanoUniversalOpeningAssaultTransition,
      risingAssault: kanoUniversalRisingAssaultTransition,
    },
  },
  kenshi: {
    possessed: {
      oneOneFour: kenshiPossessed114Transition,
      four: kenshiPossessed4Transition,
      fourTwoOneIntoExDBFourB: kenshiPossessed421Exdb4bTransition,
      fourThreeIntoBFThree: kenshiPossessed43Bf3Transition,
      bThreeTwoIntoDFFour: kenshiPossessedB32Df4Transition,
      bThreeTwoIntoExDBFour: kenshiPossessedB32Exdb4Transition,
      bThreeTwoIntoExDBFourB: kenshiPossessedB32Exdb4bTransition,
      bFThree: kenshiPossessedBf3Transition,
      dOne: kenshiPossessedD1Transition,
      dTwo: kenshiPossessedD2Transition,
      fThreeTwoIntoBFThree: kenshiPossessedF32Bf3Transition,
      fThreeTwoIntoExDBOne: kenshiPossessedF32Exdb1Transition,
      possessedTechnique: kenshiPossessedPossessedTechniqueTransition,
    },
    balanced: {
      balancedTechnique: kenshiBalancedBalancedTechniqueTransition,
    },
    kenjutsu: {
      kenjutsuTechnique: kenshiKenjutsuKenjutsuTechniqueTransition,
    },
    universal: {
      closingStrike: kenshiUniversalClosingStrikeTransition,
      closingStrikeEnhanced: kenshiUniversalClosingStrikeEnhancedTransition,
      openingAssault: kenshiUniversalOpeningAssaultTransition,
      risingAssault: kenshiUniversalRisingAssaultTransition,
    },
  },
  kotalKahn: {
    warGod: {
      one: kotalKahnWarGod1Transition,
      oneOneFourIntoDBOne: kotalKahnWarGod114Db1Transition,
      oneOneFourIntoDFOne: kotalKahnWarGod114Df1Transition,
      oneOneFourIntoExDFOne: kotalKahnWarGod114Exdf1Transition,
      oneOneFourEXDFOne: kotalKahnWarGod114Exdf12Transition,
      oneOneFourIntoExDFThree: kotalKahnWarGod114Exdf3Transition,
      oneF: kotalKahnWarGod1FTransition,
      two: kotalKahnWarGod2Transition,
      bOneTwoTwoIntoDBOne: kotalKahnWarGodB122Db1Transition,
      bOneTwoTwoIntoExDFThree: kotalKahnWarGodB122Exdf3Transition,
      bOneFourIntoDFOne: kotalKahnWarGodB14Df1Transition,
      bOneFourIntoExDBOne: kotalKahnWarGodB14Exdb1Transition,
      bOneFourIntoExDFOne: kotalKahnWarGodB14Exdf1Transition,
      bOneIntoExDBOne: kotalKahnWarGodB1Exdb1Transition,
      dOne: kotalKahnWarGodD1Transition,
      dTwo: kotalKahnWarGodD2Transition,
      dFourIntoDFOne: kotalKahnWarGodD4Df1Transition,
      fOneBTwo: kotalKahnWarGodF1B2Transition,
      fTwo: kotalKahnWarGodF2Transition,
      fThreeFourIntoDFTwo: kotalKahnWarGodF34Df2Transition,
      fThreeIntoExDBOne: kotalKahnWarGodF3Exdb1Transition,
      warGodTechnique: kotalKahnWarGodWarGodTechniqueTransition,
    },
    bloodGod: {
      bloodGodTechnique: kotalKahnBloodGodBloodGodTechniqueTransition,
    },
    sunGod: {
      sunGodTechnique: kotalKahnSunGodSunGodTechniqueTransition,
    },
    universal: {
      closingStrike: kotalKahnUniversalClosingStrikeTransition,
      openingAssault: kotalKahnUniversalOpeningAssaultTransition,
      risingAssault: kotalKahnUniversalRisingAssaultTransition,
    },
  },
  kungJin: {
    bojutsu: {
      oneOneOneIntoBFFour: kungJinBojutsu111Bf4Transition,
      twoTwoOneIntoDBThree: kungJinBojutsu221Db3Transition,
      twoTwoOneIntoExDBThree: kungJinBojutsu221Exdb3Transition,
      threeFourThreeIntoDBThree: kungJinBojutsu343Db3Transition,
      threeFourIntoDBThree: kungJinBojutsu34Db3Transition,
      fourIntoDBOne: kungJinBojutsu4Db1Transition,
      fourIntoExDBOne: kungJinBojutsu4Exdb1Transition,
      bOneFourIntoBFFour: kungJinBojutsuB14Bf4Transition,
      fTwoFourIntoBFFour: kungJinBojutsuF24Bf4Transition,
      bojutsuTechnique: kungJinBojutsuBojutsuTechniqueTransition,
    },
    ancestral: {
      ancestralTechnique: kungJinAncestralAncestralTechniqueTransition,
    },
    shaolin: {
      shaolinTechnique: kungJinShaolinShaolinTechniqueTransition,
    },
    universal: {
      closingStrike: kungJinUniversalClosingStrikeTransition,
      closingStrikeEnhanced: kungJinUniversalClosingStrikeEnhancedTransition,
      openingAssault: kungJinUniversalOpeningAssaultTransition,
      risingAssault: kungJinUniversalRisingAssaultTransition,
    },
  },
  kungLao: {
    tempest: {
      bOneTwoIntoDBOne: kungLaoTempestB12Db1Transition,
      bOneTwoIntoDFOne: kungLaoTempestB12Df1Transition,
      bTwoIntoDBOne: kungLaoTempestB2Db1Transition,
      bThreeTwoOne: kungLaoTempestB321Transition,
      bThreeTwoOneIntoDBOne: kungLaoTempestB321Db1Transition,
      bThreeTwoOneIntoExDFOne: kungLaoTempestB321Exdf1Transition,
      dTwo: kungLaoTempestD2Transition,
      fTwoThreeIntoDBOne: kungLaoTempestF23Db1Transition,
      tempestTechnique: kungLaoTempestTempestTechniqueTransition,
    },
    buzzSaw: {
      buzzSawTechnique: kungLaoBuzzSawBuzzSawTechniqueTransition,
    },
    hatTrick: {
      hatTrickTechnique: kungLaoHatTrickHatTrickTechniqueTransition,
    },
    universal: {
      closingStrike: kungLaoUniversalClosingStrikeTransition,
      closingStrikeEnhanced: kungLaoUniversalClosingStrikeEnhancedTransition,
      openingAssault: kungLaoUniversalOpeningAssaultTransition,
      risingAssault: kungLaoUniversalRisingAssaultTransition,
    },
  },
  leatherface: {
    killer: {
      oneTwoTwo: leatherfaceKiller122Transition,
      oneTwoIntoBDFour: leatherfaceKiller12Bd4Transition,
      bOneIntoBDFour: leatherfaceKillerB1Bd4Transition,
      bOneIntoDBThreeIntoOne: leatherfaceKillerB1Db31Transition,
      fOneTwoIntoBDFour: leatherfaceKillerF12Bd4Transition,
      fOneTwoIntoDBOne: leatherfaceKillerF12Db1Transition,
      fOneTwoIntoDBThreeIntoOne: leatherfaceKillerF12Db31Transition,
      fOneTwoIntoDBFour: leatherfaceKillerF12Db4Transition,
      fTwoOneDTwo: leatherfaceKillerF21D2Transition,
      fThreeIntoBDFour: leatherfaceKillerF3Bd4Transition,
      fThreeIntoDBThreeIntoOne: leatherfaceKillerF3Db31Transition,
      mb: leatherfaceKillerMb2Transition,
      killerTechnique: leatherfaceKillerKillerTechniqueTransition,
    },
    butcher: {
      butcherTechnique: leatherfaceButcherButcherTechniqueTransition,
    },
    prettyLady: {
      prettyLadyTechnique: leatherfacePrettyLadyPrettyLadyTechniqueTransition,
    },
    universal: {
      closingStrike: leatherfaceUniversalClosingStrikeTransition,
      closingStrikeEnhanced: leatherfaceUniversalClosingStrikeEnhancedTransition,
      openingAssault: leatherfaceUniversalOpeningAssaultTransition,
      risingAssault: leatherfaceUniversalRisingAssaultTransition,
    },
  },
  liuKang: {
    flameFist: {
      oneOneTwo: liuKangFlameFist112Transition,
      oneOneTwoIntoExDDOne: liuKangFlameFist112Exdd1Transition,
      oneOneTwoIntoFBFFour: liuKangFlameFist112Fbf4Transition,
      oneOneThree: liuKangFlameFist113Transition,
      bOneTwo: liuKangFlameFistB12Transition,
      bOneTwoIntoFBFFour: liuKangFlameFistB12Fbf4Transition,
      bThreeFour: liuKangFlameFistB34Transition,
      bFThree: liuKangFlameFistBf3Transition,
      dOne: liuKangFlameFistD1Transition,
      dTwo: liuKangFlameFistD2Transition,
      dBTwo: liuKangFlameFistDb2Transition,
      dDOne: liuKangFlameFistDd1Transition,
      exBFOne: liuKangFlameFistExbf1Transition,
      exDDOne: liuKangFlameFistExdd1Transition,
      fOneTwoIntoExDDOne: liuKangFlameFistF12Exdd1Transition,
      fTwoOneThreeIntoDBTwo: liuKangFlameFistF213Db2Transition,
      fTwoOneThreeIntoExBFOne: liuKangFlameFistF213Exbf1Transition,
      fTwoOneThreeIntoFBFFour: liuKangFlameFistF213Fbf4Transition,
      fFourFourIntoExBFOne: liuKangFlameFistF44Exbf1Transition,
      fFourFourIntoExFBFFour: liuKangFlameFistF44Exfbf4Transition,
      fFourFourIntoFBFFour: liuKangFlameFistF44Fbf4Transition,
      fBFFour: liuKangFlameFistFbf4Transition,
      xray: liuKangFlameFistXrayTransition,
      flameFistTechnique: liuKangFlameFistFlameFistTechniqueTransition,
    },
    dragonsFire: {
      dragonsFireTechnique: liuKangDragonsFireDragonsFireTechniqueTransition,
    },
    dualist: {
      dualistTechnique: liuKangDualistDualistTechniqueTransition,
    },
    universal: {
      closingStrike: liuKangUniversalClosingStrikeTransition,
      openingAssault: liuKangUniversalOpeningAssaultTransition,
      risingAssault: liuKangUniversalRisingAssaultTransition,
    },
  },
  predator: {
    hunter: {
      threeTwoIntoExDBFour: predatorHunter32Exdb4Transition,
      bThreeOneOneIntoBFFour: predatorHunterB311Bf4Transition,
      bFTwo: predatorHunterBf2Transition,
      dDOne: predatorHunterDd1Transition,
      fFour: predatorHunterF4Transition,
      hunterTechnique: predatorHunterHunterTechniqueTransition,
    },
    hishQuTen: {
      hishQuTenTechnique: predatorHishQuTenHishQuTenTechniqueTransition,
    },
    universal: {
      closingStrike: predatorUniversalClosingStrikeTransition,
      closingStrikeEnhanced: predatorUniversalClosingStrikeEnhancedTransition,
      openingAssault: predatorUniversalOpeningAssaultTransition,
      risingAssault: predatorUniversalRisingAssaultTransition,
    },
    warrior: {
      warriorTechnique: predatorWarriorWarriorTechniqueTransition,
    },
  },
  quanChi: {
    summoner: {
      oneTwoIntoBFThree: quanChiSummoner12Bf3Transition,
      oneFourOne: quanChiSummoner141Transition,
      bThreeTwoFour: quanChiSummonerB324Transition,
      fFourIntoBFThree: quanChiSummonerF4Bf3Transition,
      summonerTechnique: quanChiSummonerSummonerTechniqueTransition,
    },
    sorcerer: {
      sorcererTechnique: quanChiSorcererSorcererTechniqueTransition,
    },
    universal: {
      closingStrike: quanChiUniversalClosingStrikeTransition,
      closingStrikeEnhanced: quanChiUniversalClosingStrikeEnhancedTransition,
      openingAssault: quanChiUniversalOpeningAssaultTransition,
      risingAssault: quanChiUniversalRisingAssaultTransition,
    },
    warlock: {
      warlockTechnique: quanChiWarlockWarlockTechniqueTransition,
    },
  },
  raiden: {
    thunderGod: {
      twoOneThree: raidenThunderGod213Transition,
      twoOneFour: raidenThunderGod214Transition,
      bOneOne: raidenThunderGodB11Transition,
      bOneFour: raidenThunderGodB14Transition,
      bOneFourIntoDBTwo: raidenThunderGodB14Db2Transition,
      bTwo: raidenThunderGodB2Transition,
      bThreeTwo: raidenThunderGodB32Transition,
      bThreeFour: raidenThunderGodB34Transition,
      bFThree: raidenThunderGodBf3Transition,
      dFTwo: raidenThunderGodDf2Transition,
      exDFTwo: raidenThunderGodExdf2Transition,
      fOneTwoBTwo: raidenThunderGodF12B2Transition,
      thunderGodTechnique: raidenThunderGodThunderGodTechniqueTransition,
    },
    displacer: {
      displacerTechnique: raidenDisplacerDisplacerTechniqueTransition,
    },
    masterOfStorms: {
      masterOfStormsTechnique: raidenMasterOfStormsMasterOfStormsTechniqueTransition,
    },
    universal: {
      closingStrike: raidenUniversalClosingStrikeTransition,
      openingAssault: raidenUniversalOpeningAssaultTransition,
      risingAssault: raidenUniversalRisingAssaultTransition,
    },
  },
  reptile: {
    universal: {
      oneTwoIntoDFThree: reptileUniversal12Df3Transition,
      oneFourOne: reptileUniversal141Transition,
      twoOne: reptileUniversal21Transition,
      twoOneTwoFour: reptileUniversal2124Transition,
      bTwo: reptileUniversalB2Transition,
      bThreeIntoExDDThree: reptileUniversalB3Exdd3Transition,
      dOne: reptileUniversalD1Transition,
      dTwo: reptileUniversalD2Transition,
      dThree: reptileUniversalD3Transition,
      fTwoOneIntoDBTwo: reptileUniversalF21Db2Transition,
      fTwoOneIntoDBFour: reptileUniversalF21Db4Transition,
      fTwoOneMb: reptileUniversalF21MbTransition,
      fFourOneTwoIntoBFTwo: reptileUniversalF412Bf2Transition,
      fFourOneTwoIntoBFFour: reptileUniversalF412Bf4Transition,
      fFourOneTwoIntoDBThree: reptileUniversalF412Db3Transition,
      fFourOneTwoIntoDBFour: reptileUniversalF412Db4Transition,
      fFourOneIntoExDDThree: reptileUniversalF41Exdd3Transition,
      closingStrike: reptileUniversalClosingStrikeTransition,
      closingStrikeEnhanced: reptileUniversalClosingStrikeEnhancedTransition,
      openingAssault: reptileUniversalOpeningAssaultTransition,
      risingAssault: reptileUniversalRisingAssaultTransition,
    },
    deceptive: {
      deceptiveTechnique: reptileDeceptiveDeceptiveTechniqueTransition,
    },
    nimble: {
      nimbleTechnique: reptileNimbleNimbleTechniqueTransition,
    },
    noxious: {
      noxiousTechnique: reptileNoxiousNoxiousTechniqueTransition,
    },
  },
  scorpion: {
    ninjutsu: {
      twoOneFourIntoBFFour: scorpionNinjutsu214Bf4Transition,
      twoOneFourIntoDBThree: scorpionNinjutsu214Db3Transition,
      bTwo: scorpionNinjutsuB2Transition,
      bTwoIntoDTwo: scorpionNinjutsuB2D2Transition,
      fTwo: scorpionNinjutsuF2Transition,
      ninjutsuTechnique: scorpionNinjutsuNinjutsuTechniqueTransition,
    },
    hellfire: {
      hellfireTechnique: scorpionHellfireHellfireTechniqueTransition,
    },
    inferno: {
      infernoTechnique: scorpionInfernoInfernoTechniqueTransition,
    },
    universal: {
      closingStrike: scorpionUniversalClosingStrikeTransition,
      closingStrikeEnhanced: scorpionUniversalClosingStrikeEnhancedTransition,
      openingAssault: scorpionUniversalOpeningAssaultTransition,
      risingAssault: scorpionUniversalRisingAssaultTransition,
    },
  },
  shinnok: {
    boneShaper: {
      oneOneTwoIntoBFThree: shinnokBoneShaper112Bf3Transition,
      oneOneTwoDBTwoMb: shinnokBoneShaper112Db2MbTransition,
      oneOneIntoBFThree: shinnokBoneShaper11Bf3Transition,
      threeOneTwo: shinnokBoneShaper312Transition,
      bOneIntoBFThree: shinnokBoneShaperB1Bf3Transition,
      bOneBFThreeMb: shinnokBoneShaperB1Bf3MbTransition,
      bThree: shinnokBoneShaperB3Transition,
      dOne: shinnokBoneShaperD1Transition,
      dTwo: shinnokBoneShaperD2Transition,
      dash: shinnokBoneShaperDashTransition,
      fFourOneDTwo: shinnokBoneShaperF41d2Transition,
      fFourOneDTwoIntoBFThree: shinnokBoneShaperF41d2Bf3Transition,
      fFourOneDTwoDBTwoMb: shinnokBoneShaperF41d2Db2MbTransition,
      boneShaperTechnique: shinnokBoneShaperBoneShaperTechniqueTransition,
    },
    impostor: {
      impostorTechnique: shinnokImpostorImpostorTechniqueTransition,
    },
    necromancer: {
      necromancerTechnique: shinnokNecromancerNecromancerTechniqueTransition,
    },
    universal: {
      closingStrike: shinnokUniversalClosingStrikeTransition,
      closingStrikeEnhanced: shinnokUniversalClosingStrikeEnhancedTransition,
      openingAssault: shinnokUniversalOpeningAssaultTransition,
      risingAssault: shinnokUniversalRisingAssaultTransition,
    },
  },
  sonyaBlade: {
    demolition: {
      one: sonyaBladeDemolition1Transition,
      oneTwo: sonyaBladeDemolition12Transition,
      oneTwoOneIntoDBOne: sonyaBladeDemolition121Db1Transition,
      oneTwoOneIntoDFOne: sonyaBladeDemolition121Df1Transition,
      oneTwoFour: sonyaBladeDemolition124Transition,
      fourIntoDFOne: sonyaBladeDemolition4Df1Transition,
      fourIntoExDDOne: sonyaBladeDemolition4Exdd1Transition,
      bOneFourIntoDFOne: sonyaBladeDemolitionB14Df1Transition,
      bThreeThreeTwoOneTwoIntoDFOne: sonyaBladeDemolitionB33212Df1Transition,
      dash: sonyaBladeDemolitionDashTransition,
      fTwoIntoBFFour: sonyaBladeDemolitionF2Bf4Transition,
      fTwoIntoDFOne: sonyaBladeDemolitionF2Df1Transition,
      fFour: sonyaBladeDemolitionF4Transition,
      demolitionTechnique: sonyaBladeDemolitionDemolitionTechniqueTransition,
    },
    covertOps: {
      covertOpsTechnique: sonyaBladeCovertOpsCovertOpsTechniqueTransition,
    },
    specialForces: {
      specialForcesTechnique: sonyaBladeSpecialForcesSpecialForcesTechniqueTransition,
    },
    universal: {
      closingStrike: sonyaBladeUniversalClosingStrikeTransition,
      openingAssault: sonyaBladeUniversalOpeningAssaultTransition,
      risingAssault: sonyaBladeUniversalRisingAssaultTransition,
    },
  },
  subZero: {
    grandmaster: {
      bOneTwoIntoBFFour: subZeroGrandmasterB12Bf4Transition,
      bTwo: subZeroGrandmasterB2Transition,
      bFFour: subZeroGrandmasterBf4Transition,
      fFourTwoIntoBFFour: subZeroGrandmasterF42Bf4Transition,
      grandmasterTechnique: subZeroGrandmasterGrandmasterTechniqueTransition,
    },
    cryomancer: {
      cryomancerTechnique: subZeroCryomancerCryomancerTechniqueTransition,
    },
    unbreakable: {
      unbreakableTechnique: subZeroUnbreakableUnbreakableTechniqueTransition,
    },
    universal: {
      closingStrike: subZeroUniversalClosingStrikeTransition,
      closingStrikeEnhanced: subZeroUniversalClosingStrikeEnhancedTransition,
      openingAssault: subZeroUniversalOpeningAssaultTransition,
      risingAssault: subZeroUniversalRisingAssaultTransition,
    },
  },
  takeda: {
    shiraiRyu: {
      oneOneTwoIntoBFOne: takedaShiraiRyu112Bf1Transition,
      oneOneTwoIntoBFTwo: takedaShiraiRyu112Bf2Transition,
      oneOneTwoIntoExDBOne: takedaShiraiRyu112Exdb1Transition,
      bTwoOneIntoExDBOne: takedaShiraiRyuB21Exdb1Transition,
      bThreeIntoExDBOne: takedaShiraiRyuB3Exdb1Transition,
      dOne: takedaShiraiRyuD1Transition,
      dTwo: takedaShiraiRyuD2Transition,
      dBThree: takedaShiraiRyuDb3Transition,
      fFourIntoDOne: takedaShiraiRyuF4D1Transition,
      shiraiRyuTechnique: takedaShiraiRyuShiraiRyuTechniqueTransition,
    },
    lasher: {
      lasherTechnique: takedaLasherLasherTechniqueTransition,
    },
    ronin: {
      roninTechnique: takedaRoninRoninTechniqueTransition,
    },
    universal: {
      closingStrike: takedaUniversalClosingStrikeTransition,
      closingStrikeEnhanced: takedaUniversalClosingStrikeEnhancedTransition,
      openingAssault: takedaUniversalOpeningAssaultTransition,
      risingAssault: takedaUniversalRisingAssaultTransition,
    },
  },
  tanya: {
    kobuJutsu: {
      oneOne: tanyaKobuJutsu11Transition,
      oneOneTwoIntoDFTwo: tanyaKobuJutsu112Df2Transition,
      oneOneTwoIntoExDFOne: tanyaKobuJutsu112Exdf1Transition,
      twoUThree: tanyaKobuJutsu2U3Transition,
      four: tanyaKobuJutsu4Transition,
      fourIntoDFTwo: tanyaKobuJutsu4Df2Transition,
      fourIntoExBFFour: tanyaKobuJutsu4Exbf4Transition,
      bThreeOneIntoDFTwo: tanyaKobuJutsuB31Df2Transition,
      bThreeOneIntoExDFOne: tanyaKobuJutsuB31Exdf1Transition,
      dFOne: tanyaKobuJutsuDf1Transition,
      dFTwo: tanyaKobuJutsuDf2Transition,
      exDFTwo: tanyaKobuJutsuExdf2Transition,
      fTwoIntoExDFOne: tanyaKobuJutsuF2Exdf1Transition,
      fFourThree: tanyaKobuJutsuF43Transition,
      kobuJutsuTechnique: tanyaKobuJutsuKobuJutsuTechniqueTransition,
    },
    dragonNaginata: {
      dragonNaginataTechnique: tanyaDragonNaginataDragonNaginataTechniqueTransition,
    },
    pyromancer: {
      pyromancerTechnique: tanyaPyromancerPyromancerTechniqueTransition,
    },
    universal: {
      closingStrike: tanyaUniversalClosingStrikeTransition,
      closingStrikeEnhanced: tanyaUniversalClosingStrikeEnhancedTransition,
      openingAssault: tanyaUniversalOpeningAssaultTransition,
      risingAssault: tanyaUniversalRisingAssaultTransition,
    },
  },
  tremor: {
    crystalline: {
      oneTwoThreeIntoDBTwo: tremorCrystalline123Db2Transition,
      twoOneDFourIntoDBTwoD: tremorCrystalline21d4Db2dTransition,
      twoOneDFourIntoExBFFour: tremorCrystalline21d4Exbf4Transition,
      twoOneIntoDBTwoD: tremorCrystalline21Db2dTransition,
      fourIntoDBTwoU: tremorCrystalline4Db2uTransition,
      bOneTwoIntoDBTwoD: tremorCrystallineB12Db2dTransition,
      bTwo: tremorCrystallineB2Transition,
      bTwoIntoDBTwo: tremorCrystallineB2Db2Transition,
      bThreeTwoIntoDBTwoD: tremorCrystallineB32Db2dTransition,
      bThreeIntoDBTwoD: tremorCrystallineB3Db2dTransition,
      dBTwoD: tremorCrystallineDb2dTransition,
      dIntoDBTwoU: tremorCrystallineDDb2uTransition,
      fOneTwoIntoDBTwoD: tremorCrystallineF12Db2dTransition,
      fFour: tremorCrystallineF4Transition,
      crystallineTechnique: tremorCrystallineCrystallineTechniqueTransition,
    },
    aftershock: {
      aftershockTechnique: tremorAftershockAftershockTechniqueTransition,
    },
    metallic: {
      metallicTechnique: tremorMetallicMetallicTechniqueTransition,
    },
    universal: {
      closingStrike: tremorUniversalClosingStrikeTransition,
      openingAssault: tremorUniversalOpeningAssaultTransition,
      risingAssault: tremorUniversalRisingAssaultTransition,
    },
  },
  triborg: {
    cyrax: {
      oneOneFourIntoBFOne: triborgCyrax114Bf1Transition,
      twoOne: triborgCyrax21Transition,
      four: triborgCyrax4Transition,
      b: triborgCyraxBTransition,
      bTwo: triborgCyraxB2Transition,
      dTwo: triborgCyraxD2Transition,
      dBThree: triborgCyraxDb3Transition,
      dDThree: triborgCyraxDd3Transition,
      fOne: triborgCyraxF1Transition,
      fOneThreeIntoBFOne: triborgCyraxF13Bf1Transition,
      fThreeFour: triborgCyraxF34Transition,
      fFourThreeIntoDBFour: triborgCyraxF43Db4Transition,
      fFourThreeIntoExDBFour: triborgCyraxF43Exdb4Transition,
      fF: triborgCyraxFfTransition,
      cyraxTechnique: triborgCyraxCyraxTechniqueTransition,
    },
    sektor: {
      oneOneFourIntoDBFour: triborgSektor114Db4Transition,
      oneOneFourIntoExDDThree: triborgSektor114Exdd3Transition,
      twoOne: triborgSektor21Transition,
      bOneIntoDBFour: triborgSektorB1Db4Transition,
      bThreeIntoDBFour: triborgSektorB3Db4Transition,
      fOneThreeIntoDBFour: triborgSektorF13Db4Transition,
      fThreeFourIntoBFThree: triborgSektorF34Bf3Transition,
      fThreeFourIntoDBFour: triborgSektorF34Db4Transition,
      fFourThreeIntoBFThree: triborgSektorF43Bf3Transition,
      fFourThreeIntoDBFour: triborgSektorF43Db4Transition,
      sektorTechnique: triborgSektorSektorTechniqueTransition,
    },
    cyberSubZero: {
      cyberSubZeroTechnique: triborgCyberSubZeroCyberSubZeroTechniqueTransition,
    },
    smoke: {
      smokeTechnique: triborgSmokeSmokeTechniqueTransition,
    },
    universal: {
      closingStrike: triborgUniversalClosingStrikeTransition,
      closingStrikeEnhanced: triborgUniversalClosingStrikeEnhancedTransition,
      openingAssault: triborgUniversalOpeningAssaultTransition,
      risingAssault: triborgUniversalRisingAssaultTransition,
    },
  },
  general: {
    run: generalRunTransition,
  },
  kitana: {
    assassin: {
      assassinTechnique: kitanaAssassinAssassinTechniqueTransition,
    },
    mournful: {
      mournfulTechnique: kitanaMournfulMournfulTechniqueTransition,
    },
    royalStorm: {
      royalStormTechnique: kitanaRoyalStormRoyalStormTechniqueTransition,
    },
    universal: {
      closingStrike: kitanaUniversalClosingStrikeTransition,
      closingStrikeEnhanced: kitanaUniversalClosingStrikeEnhancedTransition,
      openingAssault: kitanaUniversalOpeningAssaultTransition,
      risingAssault: kitanaUniversalRisingAssaultTransition,
    },
  },
  mileena: {
    ethereal: {
      etherealTechnique: mileenaEtherealEtherealTechniqueTransition,
    },
    piercing: {
      piercingTechnique: mileenaPiercingPiercingTechniqueTransition,
    },
    ravenous: {
      ravenousTechnique: mileenaRavenousRavenousTechniqueTransition,
    },
    universal: {
      closingStrike: mileenaUniversalClosingStrikeTransition,
      closingStrikeEnhanced: mileenaUniversalClosingStrikeEnhancedTransition,
      openingAssault: mileenaUniversalOpeningAssaultTransition,
      risingAssault: mileenaUniversalRisingAssaultTransition,
    },
  },
} as const;

export const mkxlXlFinalTransitions = [
  alienTarkatan12Exbf4Transition,
  alienTarkatan214Df3Transition,
  alienTarkatan214Exbf1Transition,
  alienTarkatanB11u4Transition,
  alienTarkatanB3Exbf4Transition,
  alienTarkatanF134Df3Transition,
  alienTarkatanF134Exbf1Transition,
  alienTarkatanF4Exbf4Transition,
  alienTarkatanU3Transition,
  boRaiChoBartitsu21Transition,
  boRaiChoBartitsu341Transition,
  boRaiChoBartitsuB233Bf4Transition,
  boRaiChoBartitsuF2Bf4Transition,
  cassieCageHollywood112121Transition,
  cassieCageHollywood121Transition,
  cassieCageHollywood123Db2Transition,
  cassieCageHollywood21U4Transition,
  cassieCageHollywood242Transition,
  cassieCageHollywoodB12Db2Transition,
  cassieCageHollywoodB1Db2Transition,
  cassieCageHollywoodF3Exdb2Transition,
  cassieCageHollywoodF44Bf4Transition,
  dvorahBroodMother112Exdf1Transition,
  dvorahBroodMother11B2Transition,
  dvorahBroodMother11B2F112Db4Transition,
  dvorahBroodMother212Db1Transition,
  dvorahBroodMother212Df3Transition,
  dvorahBroodMother44Db4Transition,
  dvorahBroodMotherB1Exdf1Transition,
  dvorahBroodMotherD1Transition,
  dvorahBroodMotherF112Db4Transition,
  dvorahBroodMotherF11Df3Transition,
  dvorahBroodMotherF11Df4Transition,
  dvorahBroodMotherF34Transition,
  dvorahBroodMotherF44Transition,
  dvorahBroodMotherF44Db4Transition,
  ermacMasterOfSouls112Bf2Transition,
  ermacMasterOfSoulsD2Transition,
  ermacMasterOfSoulsDb4Transition,
  erronBlackOutlaw112Transition,
  erronBlackOutlaw11B3Db4Transition,
  erronBlackOutlaw21122Bf4Transition,
  erronBlackOutlaw21122Dbf2Transition,
  erronBlackOutlaw21122Exdb4Transition,
  erronBlackOutlawB33Db4Transition,
  erronBlackOutlawB33Df2Transition,
  erronBlackOutlawB33Exbf3Transition,
  erronBlackOutlawBf4Transition,
  erronBlackOutlawD1Transition,
  erronBlackOutlawD2Transition,
  erronBlackOutlawF13Db4Transition,
  ferraTorrRuthless11Transition,
  ferraTorrRuthless11Exbf2Transition,
  ferraTorrRuthless11Exdb2Transition,
  ferraTorrRuthless4Bf3Transition,
  ferraTorrRuthlessB121Exbf2Transition,
  ferraTorrRuthlessB121Exdb2Transition,
  ferraTorrRuthlessD2Transition,
  ferraTorrRuthlessF2Transition,
  ferraTorrRuthlessF3Dbf1Transition,
  goroKuatanWarrior121Dbf3Transition,
  goroKuatanWarrior121Exdbf3Transition,
  goroKuatanWarrior3D3Transition,
  goroKuatanWarrior3D3Bf4Transition,
  goroKuatanWarrior4Dbf3Transition,
  goroKuatanWarrior4Exbf1Transition,
  goroKuatanWarriorB12U2Transition,
  goroKuatanWarriorB2Transition,
  goroKuatanWarriorD1Transition,
  goroKuatanWarriorF3Bf2Transition,
  goroKuatanWarriorF3Dbf3Transition,
  goroKuatanWarriorMbTransition,
  jacquiBriggsFullAuto11Transition,
  jacquiBriggsFullAuto114Bf4Transition,
  jacquiBriggsFullAuto1212Bf4Transition,
  jacquiBriggsFullAuto121Db3Transition,
  jacquiBriggsFullAuto121Exdb3Transition,
  jacquiBriggsFullAuto1F2U2Transition,
  jacquiBriggsFullAuto23Db3Transition,
  jacquiBriggsFullAuto33Bf4Transition,
  jacquiBriggsFullAuto33Db2Transition,
  jacquiBriggsFullAuto4Bf4Transition,
  jacquiBriggsFullAutoB2Exdb2Transition,
  jacquiBriggsFullAutoB2Exdb3Transition,
  jacquiBriggsFullAutoB33Db3Transition,
  jacquiBriggsFullAutoB33Exdb3Transition,
  jacquiBriggsFullAutoBf1Transition,
  jacquiBriggsFullAutoBf2Transition,
  jacquiBriggsFullAutoDashTransition,
  jacquiBriggsFullAutoDu4Transition,
  jacquiBriggsFullAutoF12Db2Transition,
  jacquiBriggsFullAutoF1Bf4Transition,
  jacquiBriggsFullAutoF2U2Transition,
  jasonVoorheesSlasher111Df1Transition,
  jasonVoorheesSlasher111Exbf2Transition,
  jasonVoorheesSlasher111Exdf1Transition,
  jasonVoorheesSlasher11Df1Transition,
  jasonVoorheesSlasher11Exdf1Transition,
  jasonVoorheesSlasher122Bf3Transition,
  jasonVoorheesSlasher24Transition,
  jasonVoorheesSlasherB122Transition,
  jasonVoorheesSlasherB2Transition,
  jasonVoorheesSlasherD1Transition,
  jasonVoorheesSlasherF2Df1Transition,
  jasonVoorheesSlasherF2Exbf2Transition,
  jasonVoorheesSlasherF42Transition,
  jaxHeavyWeapons11Transition,
  jaxHeavyWeapons11Db1Transition,
  jaxHeavyWeapons124Db1Transition,
  jaxHeavyWeapons124Exdb1Transition,
  jaxHeavyWeapons12Db1Transition,
  jaxHeavyWeapons3b2Transition,
  jaxHeavyWeaponsB2Exbf2dTransition,
  jaxHeavyWeaponsB34Exbf2dTransition,
  jaxHeavyWeaponsB34Exdb1Transition,
  jaxHeavyWeaponsB3Bf2dTransition,
  jaxHeavyWeaponsD12Transition,
  jaxHeavyWeaponsF21Transition,
  jaxHeavyWeaponsF212Transition,
  jaxHeavyWeaponsF212d24Transition,
  johnnyCageStuntDouble113Bd3Transition,
  johnnyCageStuntDouble113Db1Transition,
  johnnyCageStuntDouble113Exbd3Transition,
  johnnyCageStuntDouble114Db1Transition,
  johnnyCageStuntDouble12Transition,
  johnnyCageStuntDouble12Bd3Transition,
  johnnyCageStuntDouble4Db1Transition,
  johnnyCageStuntDoubleD1Transition,
  johnnyCageStuntDoubleDashTransition,
  johnnyCageStuntDoubleDb4Transition,
  johnnyCageStuntDoubleF24Transition,
  johnnyCageStuntDoubleF24Exbf4Transition,
  johnnyCageStuntDoubleF24Exdb2Transition,
  johnnyCageStuntDoubleF3Bd3Transition,
  johnnyCageStuntDoubleF3Db1Transition,
  johnnyCageStuntDoubleF3Exbd3Transition,
  kanoCutthroat112Bf3Transition,
  kanoCutthroat112Exdb1Transition,
  kanoCutthroat112Exdd3Transition,
  kanoCutthroat2Db1Transition,
  kanoCutthroat32Transition,
  kanoCutthroat4Bf3Transition,
  kanoCutthroatB121Df2Transition,
  kanoCutthroatB312Transition,
  kanoCutthroatD3Transition,
  kanoCutthroatF212Transition,
  kanoCutthroatF4Bf3Transition,
  kenshiPossessed114Transition,
  kenshiPossessed4Transition,
  kenshiPossessed421Exdb4bTransition,
  kenshiPossessed43Bf3Transition,
  kenshiPossessedB32Df4Transition,
  kenshiPossessedB32Exdb4Transition,
  kenshiPossessedB32Exdb4bTransition,
  kenshiPossessedBf3Transition,
  kenshiPossessedD1Transition,
  kenshiPossessedD2Transition,
  kenshiPossessedF32Bf3Transition,
  kenshiPossessedF32Exdb1Transition,
  kotalKahnWarGod1Transition,
  kotalKahnWarGod114Db1Transition,
  kotalKahnWarGod114Df1Transition,
  kotalKahnWarGod114Exdf1Transition,
  kotalKahnWarGod114Exdf12Transition,
  kotalKahnWarGod114Exdf3Transition,
  kotalKahnWarGod1FTransition,
  kotalKahnWarGod2Transition,
  kotalKahnWarGodB122Db1Transition,
  kotalKahnWarGodB122Exdf3Transition,
  kotalKahnWarGodB14Df1Transition,
  kotalKahnWarGodB14Exdb1Transition,
  kotalKahnWarGodB14Exdf1Transition,
  kotalKahnWarGodB1Exdb1Transition,
  kotalKahnWarGodD1Transition,
  kotalKahnWarGodD2Transition,
  kotalKahnWarGodD4Df1Transition,
  kotalKahnWarGodF1B2Transition,
  kotalKahnWarGodF2Transition,
  kotalKahnWarGodF34Df2Transition,
  kotalKahnWarGodF3Exdb1Transition,
  kungJinBojutsu111Bf4Transition,
  kungJinBojutsu221Db3Transition,
  kungJinBojutsu221Exdb3Transition,
  kungJinBojutsu343Db3Transition,
  kungJinBojutsu34Db3Transition,
  kungJinBojutsu4Db1Transition,
  kungJinBojutsu4Exdb1Transition,
  kungJinBojutsuB14Bf4Transition,
  kungJinBojutsuF24Bf4Transition,
  kungLaoTempestB12Db1Transition,
  kungLaoTempestB12Df1Transition,
  kungLaoTempestB2Db1Transition,
  kungLaoTempestB321Transition,
  kungLaoTempestB321Db1Transition,
  kungLaoTempestB321Exdf1Transition,
  kungLaoTempestD2Transition,
  kungLaoTempestF23Db1Transition,
  leatherfaceKiller122Transition,
  leatherfaceKiller12Bd4Transition,
  leatherfaceKillerB1Bd4Transition,
  leatherfaceKillerB1Db31Transition,
  leatherfaceKillerF12Bd4Transition,
  leatherfaceKillerF12Db1Transition,
  leatherfaceKillerF12Db31Transition,
  leatherfaceKillerF12Db4Transition,
  leatherfaceKillerF21D2Transition,
  leatherfaceKillerF3Bd4Transition,
  leatherfaceKillerF3Db31Transition,
  leatherfaceKillerMb2Transition,
  liuKangFlameFist112Transition,
  liuKangFlameFist112Exdd1Transition,
  liuKangFlameFist112Fbf4Transition,
  liuKangFlameFist113Transition,
  liuKangFlameFistB12Transition,
  liuKangFlameFistB12Fbf4Transition,
  liuKangFlameFistB34Transition,
  liuKangFlameFistBf3Transition,
  liuKangFlameFistD1Transition,
  liuKangFlameFistD2Transition,
  liuKangFlameFistDb2Transition,
  liuKangFlameFistDd1Transition,
  liuKangFlameFistExbf1Transition,
  liuKangFlameFistExdd1Transition,
  liuKangFlameFistF12Exdd1Transition,
  liuKangFlameFistF213Db2Transition,
  liuKangFlameFistF213Exbf1Transition,
  liuKangFlameFistF213Fbf4Transition,
  liuKangFlameFistF44Exbf1Transition,
  liuKangFlameFistF44Exfbf4Transition,
  liuKangFlameFistF44Fbf4Transition,
  liuKangFlameFistFbf4Transition,
  liuKangFlameFistXrayTransition,
  predatorHunter32Exdb4Transition,
  predatorHunterB311Bf4Transition,
  predatorHunterBf2Transition,
  predatorHunterDd1Transition,
  predatorHunterF4Transition,
  quanChiSummoner12Bf3Transition,
  quanChiSummoner141Transition,
  quanChiSummonerB324Transition,
  quanChiSummonerF4Bf3Transition,
  raidenThunderGod213Transition,
  raidenThunderGod214Transition,
  raidenThunderGodB11Transition,
  raidenThunderGodB14Transition,
  raidenThunderGodB14Db2Transition,
  raidenThunderGodB2Transition,
  raidenThunderGodB32Transition,
  raidenThunderGodB34Transition,
  raidenThunderGodBf3Transition,
  raidenThunderGodDf2Transition,
  raidenThunderGodExdf2Transition,
  raidenThunderGodF12B2Transition,
  reptileUniversal12Df3Transition,
  reptileUniversal141Transition,
  reptileUniversal21Transition,
  reptileUniversal2124Transition,
  reptileUniversalB2Transition,
  reptileUniversalB3Exdd3Transition,
  reptileUniversalD1Transition,
  reptileUniversalD2Transition,
  reptileUniversalD3Transition,
  reptileUniversalF21Db2Transition,
  reptileUniversalF21Db4Transition,
  reptileUniversalF21MbTransition,
  reptileUniversalF412Bf2Transition,
  reptileUniversalF412Bf4Transition,
  reptileUniversalF412Db3Transition,
  reptileUniversalF412Db4Transition,
  reptileUniversalF41Exdd3Transition,
  scorpionNinjutsu214Bf4Transition,
  scorpionNinjutsu214Db3Transition,
  scorpionNinjutsuB2Transition,
  scorpionNinjutsuB2D2Transition,
  scorpionNinjutsuF2Transition,
  shinnokBoneShaper112Bf3Transition,
  shinnokBoneShaper112Db2MbTransition,
  shinnokBoneShaper11Bf3Transition,
  shinnokBoneShaper312Transition,
  shinnokBoneShaperB1Bf3Transition,
  shinnokBoneShaperB1Bf3MbTransition,
  shinnokBoneShaperB3Transition,
  shinnokBoneShaperD1Transition,
  shinnokBoneShaperD2Transition,
  shinnokBoneShaperDashTransition,
  shinnokBoneShaperF41d2Transition,
  shinnokBoneShaperF41d2Bf3Transition,
  shinnokBoneShaperF41d2Db2MbTransition,
  sonyaBladeDemolition1Transition,
  sonyaBladeDemolition12Transition,
  sonyaBladeDemolition121Db1Transition,
  sonyaBladeDemolition121Df1Transition,
  sonyaBladeDemolition124Transition,
  sonyaBladeDemolition4Df1Transition,
  sonyaBladeDemolition4Exdd1Transition,
  sonyaBladeDemolitionB14Df1Transition,
  sonyaBladeDemolitionB33212Df1Transition,
  sonyaBladeDemolitionDashTransition,
  sonyaBladeDemolitionF2Bf4Transition,
  sonyaBladeDemolitionF2Df1Transition,
  sonyaBladeDemolitionF4Transition,
  subZeroGrandmasterB12Bf4Transition,
  subZeroGrandmasterB2Transition,
  subZeroGrandmasterBf4Transition,
  subZeroGrandmasterF42Bf4Transition,
  takedaShiraiRyu112Bf1Transition,
  takedaShiraiRyu112Bf2Transition,
  takedaShiraiRyu112Exdb1Transition,
  takedaShiraiRyuB21Exdb1Transition,
  takedaShiraiRyuB3Exdb1Transition,
  takedaShiraiRyuD1Transition,
  takedaShiraiRyuD2Transition,
  takedaShiraiRyuDb3Transition,
  takedaShiraiRyuF4D1Transition,
  tanyaKobuJutsu11Transition,
  tanyaKobuJutsu112Df2Transition,
  tanyaKobuJutsu112Exdf1Transition,
  tanyaKobuJutsu2U3Transition,
  tanyaKobuJutsu4Transition,
  tanyaKobuJutsu4Df2Transition,
  tanyaKobuJutsu4Exbf4Transition,
  tanyaKobuJutsuB31Df2Transition,
  tanyaKobuJutsuB31Exdf1Transition,
  tanyaKobuJutsuDf1Transition,
  tanyaKobuJutsuDf2Transition,
  tanyaKobuJutsuExdf2Transition,
  tanyaKobuJutsuF2Exdf1Transition,
  tanyaKobuJutsuF43Transition,
  tremorCrystalline123Db2Transition,
  tremorCrystalline21d4Db2dTransition,
  tremorCrystalline21d4Exbf4Transition,
  tremorCrystalline21Db2dTransition,
  tremorCrystalline4Db2uTransition,
  tremorCrystallineB12Db2dTransition,
  tremorCrystallineB2Transition,
  tremorCrystallineB2Db2Transition,
  tremorCrystallineB32Db2dTransition,
  tremorCrystallineB3Db2dTransition,
  tremorCrystallineDb2dTransition,
  tremorCrystallineDDb2uTransition,
  tremorCrystallineF12Db2dTransition,
  tremorCrystallineF4Transition,
  triborgCyrax114Bf1Transition,
  triborgCyrax21Transition,
  triborgCyrax4Transition,
  triborgCyraxBTransition,
  triborgCyraxB2Transition,
  triborgCyraxD2Transition,
  triborgCyraxDb3Transition,
  triborgCyraxDd3Transition,
  triborgCyraxF1Transition,
  triborgCyraxF13Bf1Transition,
  triborgCyraxF34Transition,
  triborgCyraxF43Db4Transition,
  triborgCyraxF43Exdb4Transition,
  triborgCyraxFfTransition,
  triborgSektor114Db4Transition,
  triborgSektor114Exdd3Transition,
  triborgSektor21Transition,
  triborgSektorB1Db4Transition,
  triborgSektorB3Db4Transition,
  triborgSektorF13Db4Transition,
  triborgSektorF34Bf3Transition,
  triborgSektorF34Db4Transition,
  triborgSektorF43Bf3Transition,
  triborgSektorF43Db4Transition,
  alienAcidicAcidicTechniqueTransition,
  alienKonjurerKonjurerTechniqueTransition,
  alienTarkatanTarkatanTechniqueTransition,
  alienUniversalClosingStrikeTransition,
  alienUniversalClosingStrikeEnhancedTransition,
  alienUniversalOpeningAssaultTransition,
  alienUniversalRisingAssaultTransition,
  boRaiChoBartitsuBartitsuTechniqueTransition,
  boRaiChoDragonBreathDragonBreathTechniqueTransition,
  boRaiChoDrunkenMasterDrunkenMasterTechniqueTransition,
  boRaiChoUniversalClosingStrikeTransition,
  boRaiChoUniversalClosingStrikeEnhancedTransition,
  boRaiChoUniversalOpeningAssaultTransition,
  boRaiChoUniversalRisingAssaultTransition,
  cassieCageBrawlerBrawlerTechniqueTransition,
  cassieCageHollywoodHollywoodTechniqueTransition,
  cassieCageSpecOpsSpecOpsTechniqueTransition,
  cassieCageUniversalClosingStrikeTransition,
  cassieCageUniversalClosingStrikeEnhancedTransition,
  cassieCageUniversalOpeningAssaultTransition,
  cassieCageUniversalRisingAssaultTransition,
  dvorahBroodMotherBroodMotherTechniqueTransition,
  dvorahSwarmQueenSwarmQueenTechniqueTransition,
  dvorahUniversalClosingStrikeTransition,
  dvorahUniversalOpeningAssaultTransition,
  dvorahUniversalRisingAssaultTransition,
  dvorahVenomousVenomousTechniqueTransition,
  ermacMasterOfSoulsMasterOfSoulsTechniqueTransition,
  ermacMysticMysticTechniqueTransition,
  ermacSpectralSpectralTechniqueTransition,
  ermacUniversalClosingStrikeTransition,
  ermacUniversalClosingStrikeEnhancedTransition,
  ermacUniversalOpeningAssaultTransition,
  ermacUniversalRisingAssaultTransition,
  erronBlackGunslingerGunslingerTechniqueTransition,
  erronBlackMarksmanMarksmanTechniqueTransition,
  erronBlackOutlawOutlawTechniqueTransition,
  erronBlackUniversalClosingStrikeTransition,
  erronBlackUniversalClosingStrikeEnhancedTransition,
  erronBlackUniversalOpeningAssaultTransition,
  erronBlackUniversalRisingAssaultTransition,
  ferraTorrLackeyLackeyTechniqueTransition,
  ferraTorrRuthlessRuthlessTechniqueTransition,
  ferraTorrUniversalClosingStrikeTransition,
  ferraTorrUniversalClosingStrikeEnhancedTransition,
  ferraTorrUniversalOpeningAssaultTransition,
  ferraTorrUniversalRisingAssaultTransition,
  ferraTorrViciousViciousTechniqueTransition,
  generalRunTransition,
  goroDragonFangsDragonFangsTechniqueTransition,
  goroKuatanWarriorKuatanWarriorTechniqueTransition,
  goroTigrarFuryTigrarFuryTechniqueTransition,
  goroUniversalClosingStrikeTransition,
  goroUniversalOpeningAssaultTransition,
  goroUniversalRisingAssaultTransition,
  jacquiBriggsFullAutoFullAutoTechniqueTransition,
  jacquiBriggsHighTechHighTechTechniqueTransition,
  jacquiBriggsShotgunShotgunTechniqueTransition,
  jacquiBriggsUniversalClosingStrikeTransition,
  jacquiBriggsUniversalClosingStrikeEnhancedTransition,
  jacquiBriggsUniversalOpeningAssaultTransition,
  jacquiBriggsUniversalRisingAssaultTransition,
  jasonVoorheesRelentlessRelentlessTechniqueTransition,
  jasonVoorheesSlasherSlasherTechniqueTransition,
  jasonVoorheesUniversalClosingStrikeTransition,
  jasonVoorheesUniversalClosingStrikeEnhancedTransition,
  jasonVoorheesUniversalOpeningAssaultTransition,
  jasonVoorheesUniversalRisingAssaultTransition,
  jasonVoorheesUnstoppableUnstoppableTechniqueTransition,
  jaxHeavyWeaponsHeavyWeaponsTechniqueTransition,
  jaxPumpedUpPumpedUpTechniqueTransition,
  jaxUniversalClosingStrikeTransition,
  jaxUniversalClosingStrikeEnhancedTransition,
  jaxUniversalOpeningAssaultTransition,
  jaxUniversalRisingAssaultTransition,
  jaxWrestlerWrestlerTechniqueTransition,
  johnnyCageAListAListTechniqueTransition,
  johnnyCageFisticuffsFisticuffsTechniqueTransition,
  johnnyCageStuntDoubleStuntDoubleTechniqueTransition,
  johnnyCageUniversalClosingStrikeTransition,
  johnnyCageUniversalOpeningAssaultTransition,
  johnnyCageUniversalRisingAssaultTransition,
  kanoCommandoCommandoTechniqueTransition,
  kanoCutthroatCutthroatTechniqueTransition,
  kanoCyberneticCyberneticTechniqueTransition,
  kanoUniversalClosingStrikeTransition,
  kanoUniversalClosingStrikeEnhancedTransition,
  kanoUniversalOpeningAssaultTransition,
  kanoUniversalRisingAssaultTransition,
  kenshiBalancedBalancedTechniqueTransition,
  kenshiKenjutsuKenjutsuTechniqueTransition,
  kenshiPossessedPossessedTechniqueTransition,
  kenshiUniversalClosingStrikeTransition,
  kenshiUniversalClosingStrikeEnhancedTransition,
  kenshiUniversalOpeningAssaultTransition,
  kenshiUniversalRisingAssaultTransition,
  kitanaAssassinAssassinTechniqueTransition,
  kitanaMournfulMournfulTechniqueTransition,
  kitanaRoyalStormRoyalStormTechniqueTransition,
  kitanaUniversalClosingStrikeTransition,
  kitanaUniversalClosingStrikeEnhancedTransition,
  kitanaUniversalOpeningAssaultTransition,
  kitanaUniversalRisingAssaultTransition,
  kotalKahnBloodGodBloodGodTechniqueTransition,
  kotalKahnSunGodSunGodTechniqueTransition,
  kotalKahnUniversalClosingStrikeTransition,
  kotalKahnUniversalOpeningAssaultTransition,
  kotalKahnUniversalRisingAssaultTransition,
  kotalKahnWarGodWarGodTechniqueTransition,
  kungJinAncestralAncestralTechniqueTransition,
  kungJinBojutsuBojutsuTechniqueTransition,
  kungJinShaolinShaolinTechniqueTransition,
  kungJinUniversalClosingStrikeTransition,
  kungJinUniversalClosingStrikeEnhancedTransition,
  kungJinUniversalOpeningAssaultTransition,
  kungJinUniversalRisingAssaultTransition,
  kungLaoBuzzSawBuzzSawTechniqueTransition,
  kungLaoHatTrickHatTrickTechniqueTransition,
  kungLaoTempestTempestTechniqueTransition,
  kungLaoUniversalClosingStrikeTransition,
  kungLaoUniversalClosingStrikeEnhancedTransition,
  kungLaoUniversalOpeningAssaultTransition,
  kungLaoUniversalRisingAssaultTransition,
  leatherfaceButcherButcherTechniqueTransition,
  leatherfaceKillerKillerTechniqueTransition,
  leatherfacePrettyLadyPrettyLadyTechniqueTransition,
  leatherfaceUniversalClosingStrikeTransition,
  leatherfaceUniversalClosingStrikeEnhancedTransition,
  leatherfaceUniversalOpeningAssaultTransition,
  leatherfaceUniversalRisingAssaultTransition,
  liuKangDragonsFireDragonsFireTechniqueTransition,
  liuKangDualistDualistTechniqueTransition,
  liuKangFlameFistFlameFistTechniqueTransition,
  liuKangUniversalClosingStrikeTransition,
  liuKangUniversalOpeningAssaultTransition,
  liuKangUniversalRisingAssaultTransition,
  mileenaEtherealEtherealTechniqueTransition,
  mileenaPiercingPiercingTechniqueTransition,
  mileenaRavenousRavenousTechniqueTransition,
  mileenaUniversalClosingStrikeTransition,
  mileenaUniversalClosingStrikeEnhancedTransition,
  mileenaUniversalOpeningAssaultTransition,
  mileenaUniversalRisingAssaultTransition,
  predatorHishQuTenHishQuTenTechniqueTransition,
  predatorHunterHunterTechniqueTransition,
  predatorUniversalClosingStrikeTransition,
  predatorUniversalClosingStrikeEnhancedTransition,
  predatorUniversalOpeningAssaultTransition,
  predatorUniversalRisingAssaultTransition,
  predatorWarriorWarriorTechniqueTransition,
  quanChiSorcererSorcererTechniqueTransition,
  quanChiSummonerSummonerTechniqueTransition,
  quanChiUniversalClosingStrikeTransition,
  quanChiUniversalClosingStrikeEnhancedTransition,
  quanChiUniversalOpeningAssaultTransition,
  quanChiUniversalRisingAssaultTransition,
  quanChiWarlockWarlockTechniqueTransition,
  raidenDisplacerDisplacerTechniqueTransition,
  raidenMasterOfStormsMasterOfStormsTechniqueTransition,
  raidenThunderGodThunderGodTechniqueTransition,
  raidenUniversalClosingStrikeTransition,
  raidenUniversalOpeningAssaultTransition,
  raidenUniversalRisingAssaultTransition,
  reptileDeceptiveDeceptiveTechniqueTransition,
  reptileNimbleNimbleTechniqueTransition,
  reptileNoxiousNoxiousTechniqueTransition,
  reptileUniversalClosingStrikeTransition,
  reptileUniversalClosingStrikeEnhancedTransition,
  reptileUniversalOpeningAssaultTransition,
  reptileUniversalRisingAssaultTransition,
  scorpionHellfireHellfireTechniqueTransition,
  scorpionInfernoInfernoTechniqueTransition,
  scorpionNinjutsuNinjutsuTechniqueTransition,
  scorpionUniversalClosingStrikeTransition,
  scorpionUniversalClosingStrikeEnhancedTransition,
  scorpionUniversalOpeningAssaultTransition,
  scorpionUniversalRisingAssaultTransition,
  shinnokBoneShaperBoneShaperTechniqueTransition,
  shinnokImpostorImpostorTechniqueTransition,
  shinnokNecromancerNecromancerTechniqueTransition,
  shinnokUniversalClosingStrikeTransition,
  shinnokUniversalClosingStrikeEnhancedTransition,
  shinnokUniversalOpeningAssaultTransition,
  shinnokUniversalRisingAssaultTransition,
  sonyaBladeCovertOpsCovertOpsTechniqueTransition,
  sonyaBladeDemolitionDemolitionTechniqueTransition,
  sonyaBladeSpecialForcesSpecialForcesTechniqueTransition,
  sonyaBladeUniversalClosingStrikeTransition,
  sonyaBladeUniversalOpeningAssaultTransition,
  sonyaBladeUniversalRisingAssaultTransition,
  subZeroCryomancerCryomancerTechniqueTransition,
  subZeroGrandmasterGrandmasterTechniqueTransition,
  subZeroUnbreakableUnbreakableTechniqueTransition,
  subZeroUniversalClosingStrikeTransition,
  subZeroUniversalClosingStrikeEnhancedTransition,
  subZeroUniversalOpeningAssaultTransition,
  subZeroUniversalRisingAssaultTransition,
  takedaLasherLasherTechniqueTransition,
  takedaRoninRoninTechniqueTransition,
  takedaShiraiRyuShiraiRyuTechniqueTransition,
  takedaUniversalClosingStrikeTransition,
  takedaUniversalClosingStrikeEnhancedTransition,
  takedaUniversalOpeningAssaultTransition,
  takedaUniversalRisingAssaultTransition,
  tanyaDragonNaginataDragonNaginataTechniqueTransition,
  tanyaKobuJutsuKobuJutsuTechniqueTransition,
  tanyaPyromancerPyromancerTechniqueTransition,
  tanyaUniversalClosingStrikeTransition,
  tanyaUniversalClosingStrikeEnhancedTransition,
  tanyaUniversalOpeningAssaultTransition,
  tanyaUniversalRisingAssaultTransition,
  tremorAftershockAftershockTechniqueTransition,
  tremorCrystallineCrystallineTechniqueTransition,
  tremorMetallicMetallicTechniqueTransition,
  tremorUniversalClosingStrikeTransition,
  tremorUniversalOpeningAssaultTransition,
  tremorUniversalRisingAssaultTransition,
  triborgCyberSubZeroCyberSubZeroTechniqueTransition,
  triborgCyraxCyraxTechniqueTransition,
  triborgSektorSektorTechniqueTransition,
  triborgSmokeSmokeTechniqueTransition,
  triborgUniversalClosingStrikeTransition,
  triborgUniversalClosingStrikeEnhancedTransition,
  triborgUniversalOpeningAssaultTransition,
  triborgUniversalRisingAssaultTransition,
] as const;
