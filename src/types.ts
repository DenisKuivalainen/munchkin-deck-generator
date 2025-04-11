type TypeFromConst<T extends readonly unknown[]> = T[number];

export enum Expansion {
  original = "original",
  promo = "promo",
  m2 = "m2",
  m3 = "m3",
  m4 = "m4",
  m5 = "m5",
  m6 = "m6",
  m65 = "m65",
  m7 = "m7",
  m8 = "m8",
  partypack = "partypack",
  curses = "curses",
  dice = "dice",
  enhancers = "enhancers",
  gmanechangers = "gamechangers",
  fairy = "fairy",
  munchkinomicon = "munchkinomicon",
  quests = "quests",
  puppy = "puppy",
}

export enum Lang {
  En = "en",
  Ru = "ru",
}

export type Name = Record<Lang, string>;

export type Reprint = { id: string; expansion: Expansion };

export type CardId = string;

export enum Deck {
  Door = "door",
  Treasure = "treasure",
  FairyDust = "fairy_dust",
  Spell = "spell",
  Quest = "quest",
}
export enum Type {
  Curse = "curse",
  Race = "race",
  Class = "class",
  Monster = "monster",
  Portal = "portal",
  RoleModifier = "role_modifier",
  Cheat = "cheat",
  Pet = "pet",
  Wandering = "wandering",
  MonsterBoost = "monster_boost",
  Common = "common",
  Gear = "gear",
  Boost = "boost",
  Hireling = "hireling",
  GoUpALvl = "go_up_a_lvl",
  OneShot = "one_shot",
  None = "none",
}

export const doorsTypes = [
  Type.Curse,
  Type.Race,
  Type.Class,
  Type.Monster,
  Type.Portal,
  Type.RoleModifier,
  Type.Cheat,
  Type.Pet,
  Type.Wandering,
  Type.MonsterBoost,
  Type.Common,
] as const;

export const treasureTypes = [
  Type.Gear,
  Type.Boost,
  Type.Hireling,
  Type.GoUpALvl,
  Type.Common,
  Type.OneShot,
] as const;

export enum Subtype {
  None = "none",
  Level = "level",
  Steed = "steed",
  Hireling = "hireling",
  Role = "role", // Class or race
  Gender = "gender",
  Headgear = "headgear",
  Armor = "armor",
  BigItem = "big_item",
  SmallItem = "small_item",
  Footgear = "footgear",
  OneHand = "one_hand",
  TwoHand = "two_hand",
  Gear = "gear",
  Other = "other",
  ClassModifier = "class_modifier",
  RaceModifier = "race_modifier",
  ClassEnhancer = "class_enhancer",
  RaceEnhancer = "race_enhancer",
  Minus5 = "minus_5",
  Plus5 = "plus_5",
  Plus10 = "plus_10",
  Boost = "boost",
  Weapon = "weapon",
  WithEffect = "with_effect",
  NoEffect = "no_effect",
  Combat = "combat",
  RunAway = "run_away",
  AgainstCurse = "against_curse",
}

export const oneShotSubtypes = [
  Subtype.Boost,
  Subtype.Combat,
  Subtype.RunAway,
  Subtype.Other,
  Subtype.AgainstCurse,
] as const;
type OneShotSubtype = (typeof oneShotSubtypes)[number];

export const goUpALvlSubtypes = [Subtype.WithEffect, Subtype.NoEffect] as const;
type GoUpALvlSubtype = (typeof goUpALvlSubtypes)[number];

export const boostSubtypes = [
  Subtype.Hireling,
  Subtype.Steed,
  Subtype.Gear,
  Subtype.Armor,
  Subtype.Headgear,
  Subtype.Footgear,
  Subtype.Weapon,
] as const;
type BoostSubtype = (typeof boostSubtypes)[number];

export const gearSubtypes = [
  Subtype.Headgear,
  Subtype.Armor,
  Subtype.Footgear,
  Subtype.OneHand,
  Subtype.TwoHand,
  Subtype.Other,
] as const;
type GearSubtype = (typeof gearSubtypes)[number];

export const curseSubtypes = [
  Subtype.Level, // Reduces level
  Subtype.Steed, // Steed related
  Subtype.Hireling, // Hireling related
  Subtype.Role, // Class or race related
  Subtype.Gender, // Gender related
  Subtype.Headgear, // Affects headgear
  Subtype.Armor, // Affects Armor
  Subtype.BigItem, // Affects big item
  Subtype.SmallItem, // Affects small item
  Subtype.Footgear, // Affects footgear
  Subtype.Gear, // Affects any gear
  Subtype.Other,
] as const;
type CurseSubtype = (typeof curseSubtypes)[number];

export const roleModifierSubtypes = [
  Subtype.ClassModifier,
  Subtype.RaceModifier,
  Subtype.ClassEnhancer,
  Subtype.RaceEnhancer,
  Subtype.Other,
] as const;
type RoleModifierSubtype = (typeof roleModifierSubtypes)[number];

export const monsterBoostSubtypes = [
  Subtype.Plus10,
  Subtype.Plus5,
  Subtype.Minus5,
  Subtype.Boost,
] as const;
type MonsterBoostSubtype = (typeof monsterBoostSubtypes)[number];

export enum CharRelation {
  Bard = "bard",
  Ranger = "ranger",
  Warrior = "warrior",
  Wizard = "wizard",
  Thief = "thief",
  Cleric = "cleric",
  Lizard = "lizard",
  Centaur = "centaur",
  Elf = "elf",
  Orc = "orc",
  Gnome = "gnome",
  Dwarf = "dwarf",
  Halfling = "halfling",
  RoleModifier = "role_modifier",
  Steed = "steed",
  Hireling = "hireling",
}

export const classes = [
  CharRelation.Bard,
  CharRelation.Ranger,
  CharRelation.Warrior,
  CharRelation.Wizard,
  CharRelation.Thief,
  CharRelation.Cleric,
] as const;
type Class = (typeof classes)[number];

export const races = [
  CharRelation.Lizard,
  CharRelation.Centaur,
  CharRelation.Elf,
  CharRelation.Orc,
  CharRelation.Gnome,
  CharRelation.Dwarf,
  CharRelation.Halfling,
] as const;
type Race = (typeof races)[number];

export enum OtherRelation {
  Undead = "undead",
  FromHell = "from_hell",
  Santa = "santa",
  Unicorn = "unicorn",
  ClassModifier = "class_modifier",
  RaceModifier = "race_modifier",
  Steed = "steed",
  Hireling = "hireling",
  Merch = "merch",
}

export class Card {
  deck: Deck;
  type: Type;
  subtype: Subtype;
  name: Name;
  id: CardId;
  reprints: Reprint[];
  required: CardId[];
  char_relations: CharRelation[];
  other_relations: OtherRelation[];
  level: number;

  constructor(c: Card) {
    this.id = c.id;
    this.deck = c.deck;
    this.type = c.type;
    this.subtype = c.subtype;
    this.name = c.name;
    this.reprints = c.reprints;
    this.required = c.required;
    this.char_relations = c.char_relations;
    this.other_relations = c.other_relations;
    this.level = c.level;
  }
}

export class CurseCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Curse = Type.Curse;
  override level = 0;
  override subtype: CurseSubtype;

  constructor(
    props: Omit<Card, "subtype"> & {
      subtype: CurseSubtype;
    }
  ) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Curse,
      level: 0,
    });
    this.subtype = props.subtype;
  }
}

export class RaceCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Race = Type.Race;
  override subtype: Subtype.None = Subtype.None;
  override level = 0;
  override char_relations: [Race];

  constructor(
    props: Omit<Card, "char_relations"> & { char_relations: [Race] }
  ) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Race,
      level: 0,
      subtype: Subtype.None,
    });
    this.char_relations = props.char_relations;
  }
}

export class ClassCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Class = Type.Class;
  override subtype: Subtype.None = Subtype.None;
  override level = 0;
  override char_relations: [Class];

  constructor(
    props: Omit<Card, "char_relations"> & { char_relations: [Class] }
  ) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Class,
      level: 0,
      subtype: Subtype.None,
    });
    this.char_relations = props.char_relations;
  }
}

export class MonsterCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Monster = Type.Monster;
  override subtype: Subtype.None = Subtype.None;

  constructor(props: Card) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Monster,
      subtype: Subtype.None,
    });
  }
}

export class PortalCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Portal = Type.Portal;
  override subtype: Subtype.None = Subtype.None;
  override level = 0;
  override char_relations = [];
  override other_relations = [];

  constructor(props: Card) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Portal,
      level: 0,
      subtype: Subtype.None,
      char_relations: [],
      other_relations: [],
    });
  }
}

export class RoleModifierCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.RoleModifier = Type.RoleModifier;
  override level = 0;
  override subtype: RoleModifierSubtype;

  constructor(props: Omit<Card, "subtype"> & { subtype: RoleModifierSubtype }) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.RoleModifier,
      level: 0,
    });
    this.subtype = props.subtype;
  }
}

export class CheatCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Cheat = Type.Cheat;
  override subtype: Subtype.None = Subtype.None;
  override level = 0;
  override char_relations = [];
  override other_relations = [];

  constructor(props: Card) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Cheat,
      level: 0,
      subtype: Subtype.None,
      required: [],
      char_relations: [],
      other_relations: [],
    });
  }
}

export class PetCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Pet = Type.Pet;
  override subtype: Subtype.None = Subtype.None;
  override level = 0;

  constructor(props: Card) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Pet,
      subtype: Subtype.None,
      level: 0,
    });
  }
}

export class WanderingCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Wandering = Type.Wandering;
  override subtype: Subtype.None = Subtype.None;
  override level = 0;

  constructor(props: Card) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Wandering,
      subtype: Subtype.None,
      level: 0,
    });
  }
}

export class MonsterBoostCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.MonsterBoost = Type.MonsterBoost;
  override level = 0;
  override subtype: MonsterBoostSubtype;

  constructor(props: Omit<Card, "subtype"> & { subtype: MonsterBoostSubtype }) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.MonsterBoost,
      level: 0,
    });
    this.subtype = props.subtype;
  }
}

export class CommonDoorCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Common = Type.Common;
  override subtype: Subtype.None = Subtype.None;
  override level = 0;

  constructor(props: Card) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Common,
      subtype: Subtype.None,
      level: 0,
    });
  }
}

export class GearCard extends Card {
  override deck: Deck.Treasure = Deck.Treasure;
  override type: Type.Gear = Type.Gear;
  override subtype: GearSubtype;

  constructor(props: Omit<Card, "subtype"> & { subtype: GearSubtype }) {
    super({
      ...props,
      deck: Deck.Treasure,
      type: Type.Gear,
    });
    this.subtype = props.subtype;
  }
}

export class BoostCard extends Card {
  override deck: Deck.Treasure = Deck.Treasure;
  override type: Type.Boost = Type.Boost;
  override level = 0;
  override subtype: BoostSubtype;

  constructor(props: Omit<Card, "subtype"> & { subtype: BoostSubtype }) {
    let char_relations = props.char_relations;
    if (props.subtype === Subtype.Hireling)
      char_relations = [
        ...props.char_relations.filter((c) => c !== CharRelation.Hireling),
        CharRelation.Hireling,
      ];

    if (props.subtype === Subtype.Steed)
      char_relations = [
        ...props.char_relations.filter((c) => c !== CharRelation.Steed),
        CharRelation.Steed,
      ];

    super({
      ...props,
      deck: Deck.Treasure,
      type: Type.Boost,
      level: 0,
      char_relations,
    });
    this.subtype = props.subtype;
  }
}

export class HirelingCard extends Card {
  override deck: Deck.Treasure = Deck.Treasure;
  override type: Type.Hireling = Type.Hireling;
  override level = 0;
  override subtype: Subtype.None = Subtype.None;

  constructor(props: Card) {
    super({
      ...props,
      deck: Deck.Treasure,
      type: Type.Hireling,
      level: 0,
      subtype: Subtype.None,
      char_relations: [
        ...props.char_relations.filter((c) => c !== CharRelation.Hireling),
        CharRelation.Hireling,
      ],
    });
  }
}

export class GoUpALvlCard extends Card {
  override deck: Deck.Treasure = Deck.Treasure;
  override type: Type.GoUpALvl = Type.GoUpALvl;
  override level = 0;
  override subtype: GoUpALvlSubtype;

  constructor(props: Omit<Card, "subtype"> & { subtype: GoUpALvlSubtype }) {
    super({
      ...props,
      deck: Deck.Treasure,
      type: Type.GoUpALvl,
      level: 0,
    });
    this.subtype = props.subtype;
  }
}

export class CommonTreasureCard extends Card {
  override deck: Deck.Treasure = Deck.Treasure;
  override type: Type.Common = Type.Common;
  override level = 0;
  override subtype: Subtype.None = Subtype.None;

  constructor(props: Card) {
    super({
      ...props,
      deck: Deck.Treasure,
      type: Type.Common,
      level: 0,
      subtype: Subtype.None,
    });
  }
}

export class OneShotCard extends Card {
  override deck: Deck.Treasure = Deck.Treasure;
  override type: Type.OneShot = Type.OneShot;
  override subtype: OneShotSubtype;

  constructor(props: Omit<Card, "subtype"> & { subtype: OneShotSubtype }) {
    super({
      ...props,
      deck: Deck.Treasure,
      type: Type.OneShot,
    });
    this.subtype = props.subtype;
  }
}
