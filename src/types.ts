export type DOOR_WALKING = {
  cardType: "DOOR";
  cardSubtype: "WALKING";
  name: string;
  isBase: boolean;
};

export type DOOR_CHEAT = {
  cardType: "DOOR";
  cardSubtype: "CHEAT";
  name: "Чит";
  isBase: boolean;
};

export type DOOR_PORTAL = {
  cardType: "DOOR";
  cardSubtype: "PORTAL";
  name: string;
  isBase: false;
  undeadRelated: boolean;
  dwarfRelated: boolean;
  haflingRelated: boolean;
  gnomeRelated: boolean;
};

export type DOOR_RACE = {
  cardType: "DOOR";
  cardSubtype: "RACE";
  name: string;
  isBase: boolean;
  mountRelated: boolean;
};

export type DOOR_CLASS = {
  cardType: "DOOR";
  cardSubtype: "CLASS";
  name: string;
  isBase: boolean;
  undeadRelated: boolean;
  mountRelated: boolean;
};

export type DOOR_MODIFIER = {
  cardType: "DOOR";
  cardSubtype: "MODIFIER";
  name: string;
  isBase: boolean;
  classModifier: boolean;
  raceModifier: boolean;
};

export type DOOR_PET = {
  cardType: "DOOR";
  cardSubtype: "PET";
  name: string;
  isBase: boolean;
  isHireling: boolean;
  isMount: boolean;
};

export type DOOR_MONSTER = {
  cardType: "DOOR";
  cardSubtype: "MONSTER";
  name: string;
  isBase: boolean;

  level: number;

  undeadRelated: boolean;
  hirelingRelated: boolean;
  mountRelated: boolean;

  clerRelated: boolean;
  thiefRelated: boolean;
  warriorRelated: boolean;
  mageRelated: boolean;
  rangerRelated: boolean;
  bardRelated: boolean;

  dwarfRelated: boolean;
  haflingRelated: boolean;
  gnomeRelated: boolean;
  orkRelated: boolean;
  elfRelated: boolean;
  kentRelated: boolean;
  lizardRelated: boolean;
};

export type DOOR_COMMON = {
  cardType: "DOOR";
  cardSubtype: "COMMON";
  name: string;
  isBase: boolean;

  undeadRelated: boolean;
  hirelingRelated: boolean;
  mountRelated: boolean;

  clerRelated: boolean;
  thiefRelated: boolean;
  warriorRelated: boolean;
  mageRelated: boolean;
  rangerRelated: boolean;
  bardRelated: boolean;

  dwarfRelated: boolean;
  haflingRelated: boolean;
  gnomeRelated: boolean;
  orkRelated: boolean;
  elfRelated: boolean;
  kentRelated: boolean;
  lizardRelated: boolean;
};

export type DOOR_MONSTER_BOOST = {
  cardType: "DOOR";
  cardSubtype: "MONSTER_BOOST";
  name: string;
  isBase: boolean;

  undeadRelated: boolean;
  hirelingRelated: boolean;
  mountRelated: boolean;

  clerRelated: boolean;
  thiefRelated: boolean;
  warriorRelated: boolean;
  mageRelated: boolean;
  rangerRelated: boolean;
  bardRelated: boolean;

  dwarfRelated: boolean;
  haflingRelated: boolean;
  gnomeRelated: boolean;
  orkRelated: boolean;
  elfRelated: boolean;
  kentRelated: boolean;
  lizardRelated: boolean;
};

export type DOOR_CURSE = {
  cardType: "DOOR";
  cardSubtype: "CURSE";
  name: string;
  isBase: boolean;

  undeadRelated: boolean;
  hirelingRelated: boolean;
  mountRelated: boolean;

  clerRelated: boolean;
  thiefRelated: boolean;
  warriorRelated: boolean;
  mageRelated: boolean;
  rangerRelated: boolean;
  bardRelated: boolean;

  dwarfRelated: boolean;
  haflingRelated: boolean;
  gnomeRelated: boolean;
  orkRelated: boolean;
  elfRelated: boolean;
  kentRelated: boolean;
  lizardRelated: boolean;
};

export type DOOR = {
  cardType: "DOOR";
  cardSubtype:
    | "WALKING"
    | "CHEAT"
    | "PORTAL"
    | "RACE"
    | "CLASS"
    | "MODIFIER"
    | "PET"
    | "MONSTER"
    | "COMMON"
    | "MONSTER_BOOST"
    | "CURSE";
  name: string;
  isBase: boolean;

  level?: number;

  undeadRelated?: boolean;
  hirelingRelated?: boolean;
  mountRelated?: boolean;

  clerRelated?: boolean;
  thiefRelated?: boolean;
  warriorRelated?: boolean;
  mageRelated?: boolean;
  rangerRelated?: boolean;
  bardRelated?: boolean;

  dwarfRelated?: boolean;
  haflingRelated?: boolean;
  gnomeRelated?: boolean;
  orkRelated?: boolean;
  elfRelated?: boolean;
  kentRelated?: boolean;
  lizardRelated?: boolean;

  classModifier?: boolean;
  raceModifier?: boolean;

  isHireling?: boolean;
  isMount?: boolean;
};

export class Door {
  cardType = "DOOR";
  cardSubtype: DOOR["cardSubtype"];
  name: string;
  isBase: boolean;

  undeadRelated: boolean = false;
  mountRelated: boolean = false;

  dwarfRelated: boolean = false;
  haflingRelated: boolean = false;
  gnomeRelated: boolean = false;
  orkRelated: boolean = false;
  elfRelated: boolean = false;
  kentRelated: boolean = false;
  lizardRelated: boolean = false;

  classModifier: boolean = false;
  raceModifier: boolean = false;

  isHireling: boolean = false;
  isMount: boolean = false;

  constructor(d: DOOR) {
    this.cardSubtype = d.cardSubtype;
    this.name = d.name;
    this.isBase = d.isBase;

    this.undeadRelated = d.undeadRelated ?? false;
    this.mountRelated = d.mountRelated ?? false;

    this.dwarfRelated = d.dwarfRelated ?? false;
    this.haflingRelated = d.haflingRelated ?? false;
    this.gnomeRelated = d.gnomeRelated ?? false;
    this.orkRelated = d.orkRelated ?? false;
    this.elfRelated = d.elfRelated ?? false;
    this.kentRelated = d.kentRelated ?? false;
    this.lizardRelated = d.lizardRelated ?? false;

    this.classModifier = d.classModifier ?? false;
    this.raceModifier = d.raceModifier ?? false;

    this.isHireling = d.isHireling ?? false;
    this.isMount = d.isMount ?? false;
  }
}

export type CARD = DOOR | TREASURE;

export type TREASURE = {
  cardType: "TREASURE";
  cardSubtype:
    | "ONE_HAND"
    | "TWO_HANDS"
    | "HAT"
    | "BODY"
    | "BOOTS"
    | "OTHER"
    | "ONE_TIME"
    | "DICE"
    | "RING"
    | "GAIN_LVL"
    | "FREE"
    | "MOUNT_BOOST"
    | "HIRELING_BOOST"
    | "GEAR_BOOST"
    | "HIRELING";
  name: string;
  isBase: boolean;

  undeadRelated: boolean;
  hirelingRelated: boolean;
  mountRelated: boolean;

  clerRelated: boolean;
  thiefRelated: boolean;
  warriorRelated: boolean;
  mageRelated: boolean;
  rangerRelated: boolean;
  bardRelated: boolean;

  dwarfRelated: boolean;
  haflingRelated: boolean;
  gnomeRelated: boolean;
  orkRelated: boolean;
  elfRelated: boolean;
  kentRelated: boolean;
  lizardRelated: boolean;
};

export class Card {
  id: string;
  cardType: string;
  cardSubtype: string;
  name: string;
  isBase: boolean;

  level: number;

  undeadRelated: boolean;
  mountRelated: boolean;
  hirelingRelated: boolean;

  clerRelated: boolean;
  thiefRelated: boolean;
  warriorRelated: boolean;
  mageRelated: boolean;
  rangerRelated: boolean;
  bardRelated: boolean;

  dwarfRelated: boolean;
  haflingRelated: boolean;
  gnomeRelated: boolean;
  orkRelated: boolean;
  elfRelated: boolean;
  kentRelated: boolean;
  lizardRelated: boolean;

  classModifier: boolean;
  raceModifier: boolean;

  isHireling: boolean;
  isMount: boolean;
  unused: boolean;

  constructor(d: any) {
    this.id = d.id;
    this.cardType = d.cardType;
    this.cardSubtype = d.cardSubtype;
    this.name = d.name;
    this.isBase = d.isBase;

    this.level = parseInt(d.level ?? 0);

    this.undeadRelated = d.undeadRelated ?? false;
    this.mountRelated = (d.mountRelated || d.isMount) ?? false;
    this.hirelingRelated = (d.hirelingRelated || d.isHireling) ?? false;

    this.clerRelated = d.clerRelated ?? false;
    this.thiefRelated = d.thiefRelated ?? false;
    this.warriorRelated = d.warriorRelated ?? false;
    this.mageRelated = d.mageRelated ?? false;
    this.rangerRelated = d.rangerRelated ?? false;
    this.bardRelated = d.bardRelated ?? false;

    this.dwarfRelated = d.dwarfRelated ?? false;
    this.haflingRelated = d.haflingRelated ?? false;
    this.gnomeRelated = d.gnomeRelated ?? false;
    this.orkRelated = d.orkRelated ?? false;
    this.elfRelated = d.elfRelated ?? false;
    this.kentRelated = d.kentRelated ?? false;
    this.lizardRelated = d.lizardRelated ?? false;

    this.classModifier = d.classModifier ?? false;
    this.raceModifier = d.raceModifier ?? false;

    this.isHireling = d.isHireling ?? false;
    this.isMount = d.isMount ?? false;

    // if card is temporary removed from deck generation
    this.unused = d.unused ?? false;
  }
}

export type Options = {
  mounts: boolean;
  hirelings: boolean;
  ultramanchkins: boolean;
  dungeons: boolean;
  undeads: boolean;
  stronger_monsters: boolean;
  sharper_weapons: boolean;
  extended_deck: boolean;
  cler: boolean;
  mage: boolean;
  warrior: boolean;
  thief: boolean;
  ranger: boolean;
  bard: boolean;
  dward: boolean;
  hafling: boolean;
  gnome: boolean;
  elf: boolean;
  ork: boolean;
  kent: boolean;
  lizard: boolean;
};

export class DisplayCard {
  id: string;
  cardType: string;
  cardSubtype: string;
  level: number;
  name: string;

  constructor(c: Card) {
    this.id = c.id;
    this.cardType = c.cardType;
    this.cardSubtype = c.cardSubtype;
    this.level = c.level;
    this.name = c.name;
  }
}
