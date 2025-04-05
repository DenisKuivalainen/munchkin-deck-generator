type TypeFromConst<T extends readonly unknown[]> = T[number];

export enum Expansion {
  original = "original",
  m2 = "m2",
  m3 = "m3",
  m4 = "m4",
  m5 = "m5",
  m6 = "m6",
  m65 = "m65",
  m7 = "m7",
  m8 = "m8",
  puppy = "puppy",
  partypack = "partypack",
}

export enum Lang {
  En = "en",
  Ru = "ru",
}

type Name = Record<Lang, string>;

type Reprints = { id: string; expansion: Expansion };

type CardId = string;

enum Deck {
  Door = "door",
  Treasure = "treasure",
}
enum Type {
  Curse = "curse",
  Race = "race",
  Class = "class",
  Monster = "monster",
  Portal = "portal",
  RoleModifier = "role_modifier",
  Cheat = "cheat",
  Pet = "pet",
  Wandering = "wandering",
}

enum Subtype {
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
  Gear = "gear",
  Other = "other",
  ClassModifier = "class_modifier",
  RaceModifier = "race_modifier",
  ClassEnhancer = "class_enhancer",
  RaceEnhancer = "race_enhancer",
  // ...other keys-values
  Aaa = "aaa",
}

const curseSubtypes = [
  Subtype.Level,
  Subtype.Steed,
  Subtype.Hireling,
  Subtype.Role,
  Subtype.Gender,
  Subtype.Headgear,
  Subtype.Armor,
  Subtype.BigItem,
  Subtype.SmallItem,
  Subtype.Footgear,
  Subtype.Gear,
  Subtype.Other,
] as const;
type CurseSubtype = (typeof curseSubtypes)[number];

const roleModifierSubtypes = [
  Subtype.ClassModifier,
  Subtype.RaceModifier,
  Subtype.ClassEnhancer,
  Subtype.RaceEnhancer,
  Subtype.Other,
] as const;
type RoleModifierSubtype = (typeof roleModifierSubtypes)[number];

enum CharRelation {
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
  Stead = "stead",
  Hireling = "hireling",
}

const classes = [
  CharRelation.Bard,
  CharRelation.Ranger,
  CharRelation.Warrior,
  CharRelation.Wizard,
  CharRelation.Thief,
  CharRelation.Cleric,
] as const;
type Class = (typeof classes)[number];

const races = [
  CharRelation.Lizard,
  CharRelation.Centaur,
  CharRelation.Elf,
  CharRelation.Orc,
  CharRelation.Gnome,
  CharRelation.Dwarf,
  CharRelation.Halfling,
] as const;
type Race = (typeof classes)[number];

enum OtherRelation {
  Undead = "undead",
  FromHell = "from_hell",
  ClassModifier = "class_modifier",
  RaceModifier = "race_modifier",
}

class Card {
  deck: Deck;
  type: Type;
  subtype: Subtype;
  name: Name;
  id: CardId;
  reprints: Reprints;
  required: CardId[];
  char_relations: CharRelation[];
  other_relations: OtherRelation[];
  level: number;

  constructor(c: Card) {
    this.deck = c.deck;
    this.type = c.type;
    this.subtype = c.subtype;
    this.name = c.name;
    this.id = c.id;
    this.reprints = c.reprints;
    this.required = c.required;
    this.char_relations = c.char_relations;
    this.other_relations = c.other_relations;
    this.level = c.level;
  }
}

class CurseCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Curse = Type.Curse;
  override level = 0;

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
  }
}

class RaceCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Race = Type.Race;
  override subtype: Subtype.None = Subtype.None;
  override level = 0;

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
  }
}

class ClassCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Class = Type.Class;
  override subtype: Subtype.None = Subtype.None;
  override level = 0;

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
  }
}

class MonsterCard extends Card {
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

class PortalCard extends Card {
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

class RoleModifierCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.RoleModifier = Type.RoleModifier;
  override level = 0;

  constructor(props: Omit<Card, "subtype"> & { subtype: RoleModifierSubtype }) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.RoleModifier,
      level: 0,
    });
  }
}

class CheatCard extends Card {
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

class PetCard extends Card {
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

class WanderingCard extends Card {
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
