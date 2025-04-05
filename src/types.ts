type TypeFromConst<T extends readonly unknown[]> = T[number];

export enum Expansion {
  Original = "original",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  SixPointFive = "6.5",
  Seven = "7",
  Eight = "8",
  Puppies = "puppies",
  PartyPack = "party_pack",
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
}

enum Subtype {
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
    curseSubtype: CurseSubtype,
    props: Omit<Card, "type" | "card" | "level" | "subtype">
  ) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Curse,
      level: 0,
      subtype: curseSubtype,
    });
  }
}

class RaceCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Race = Type.Race;
  override subtype: Subtype.Other = Subtype.Other;
  override level = 0;

  constructor(
    race: Race,
    props: Omit<Card, "type" | "card" | "level" | "subtype" | "char_relations">
  ) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Race,
      level: 0,
      subtype: Subtype.Other,
      char_relations: [race],
    });
  }
}

class ClassCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Class = Type.Class;
  override subtype: Subtype.Other = Subtype.Other;
  override level = 0;

  constructor(
    _class: Class,
    props: Omit<Card, "type" | "card" | "level" | "subtype" | "char_relations">
  ) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Class,
      level: 0,
      subtype: Subtype.Other,
      char_relations: [_class],
    });
  }
}

class MonsterCard extends Card {
  override deck: Deck.Door = Deck.Door;
  override type: Type.Monster = Type.Monster;
  override subtype: Subtype.Other = Subtype.Other;

  constructor(_class: Class, props: Omit<Card, "type" | "card" | "subtype">) {
    super({
      ...props,
      deck: Deck.Door,
      type: Type.Monster,
      subtype: Subtype.Other,
    });
  }
}
