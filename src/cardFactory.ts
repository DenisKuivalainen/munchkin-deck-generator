import {
  BoostCard,
  Card,
  CardId,
  CharRelation,
  CheatCard,
  ClassCard,
  CommonDoorCard,
  CommonTreasureCard,
  CurseCard,
  Deck,
  GearCard,
  GoUpALvlCard,
  HirelingCard,
  MonsterBoostCard,
  MonsterCard,
  Name,
  OneShotCard,
  OtherRelation,
  PetCard,
  PortalCard,
  RaceCard,
  Reprint,
  RoleModifierCard,
  Subtype,
  Type,
  WanderingCard,
} from "@/types";

export const cardFactory = (card: {
  deck: Deck;
  type: Type;
  subtype: Subtype;
  name: Name;
  id: string;
  level: number;
  reprints: Reprint[];
  char_relations: CharRelation[];
  other_relations: OtherRelation[];
  required: CardId[];
}) => {
  switch (card.deck) {
    case Deck.Door:
      switch (card.type) {
        case Type.Common:
          return new CommonDoorCard(card);
        case Type.MonsterBoost:
          return new MonsterBoostCard(card);
        case Type.Wandering:
          return new WanderingCard(card);
        case Type.Pet:
          return new PetCard(card);
        case Type.Cheat:
          return new CheatCard(card);
        case Type.RoleModifier:
          return new RoleModifierCard(card);
        case Type.Portal:
          return new PortalCard(card);
        case Type.Monster:
          return new MonsterCard(card);
        case Type.Class:
          return new ClassCard(card);
        case Type.Race:
          return new RaceCard(card);
        case Type.Curse:
          return new CurseCard(card);
      }
    case Deck.Treasure:
      switch (card.type) {
        case Type.OneShot:
          return new OneShotCard(card);
        case Type.Common:
          return new CommonTreasureCard(card);
        case Type.GoUpALvl:
          return new GoUpALvlCard(card);
        case Type.Hireling:
          return new HirelingCard(card);
        case Type.Boost:
          return new BoostCard(card);
        case Type.Gear:
          return new GearCard(card);
      }
    default:
      return new Card(card);
  }
};
