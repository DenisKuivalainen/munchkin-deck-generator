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

  withEffect: boolean;

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

    // Only for DOOR MODIFIER
    this.classModifier = d.classModifier ?? false;
    this.raceModifier = d.raceModifier ?? false;

    // Only for DOOR PET
    this.isHireling = d.isHireling ?? false;
    this.isMount = d.isMount ?? false;

    // Only for TREASURE GAIN_LVL
    this.withEffect = d.withEffect ?? false;

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

export const DECK_CARD_TYPES = [
  "DOOR-WALKING",
  "DOOR-CHEAT",
  "DOOR-RACE",
  "DOOR-CLASS",
  "DOOR-MODIFIER",
  "DOOR-MONSTER",
  "DOOR-COMMON",
  "DOOR-MONSTER_BOOST",
  "DOOR-CURSE",
  "DOOR-PORTAL",
  "DOOR-PET",
  "TREASURE-ONE_HAND",
  "TREASURE-TWO_HANDS",
  "TREASURE-BOOTS",
  "TREASURE-BODY",
  "TREASURE-HAT",
  "TREASURE-OTHER",
  "TREASURE-RING",
  "TREASURE-DICE",
  "TREASURE-FREE",
  "TREASURE-ONE_TIME",
  "TREASURE-GAIN_LVL",
  "TREASURE-HIRELING_BOOST",
  "TREASURE-HIRELING",
  "TREASURE-MOUNT_BOOST",
  "TREASURE-GEAR_BOOST",
] as const;

export type DeckCardType = (typeof DECK_CARD_TYPES)[number];

export type DeckSize = Record<DeckCardType, number>;
