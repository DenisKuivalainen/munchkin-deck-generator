"use client";
import { useCards } from "@/Components";
import { GeneratedDeck, countOriginalCardsOfType } from "@/deckGenerator";
import {
  Card,
  CharRelation,
  DeckOptions,
  Expansion,
  GameOptions,
} from "@/types";
import { Typography } from "@mui/material";

export default () => {
  const cards = useCards();

  let gd = new GeneratedDeck(
    new DeckOptions(
      [GameOptions.Hirelings, GameOptions.Steeds],
      // [GameOptions.RoleEnhancers],
      // [GameOptions.GearBoosts],
      [
        CharRelation.Warrior,
        CharRelation.Wizard,
        CharRelation.Thief,
        CharRelation.Cleric,
      ],
      [
        CharRelation.Dwarf,
        CharRelation.Elf,
        // CharRelation.Halfling,
        CharRelation.Gnome,
      ],
      [Expansion.puppy]
    ),
    cards
  );
  return (
    <>
      {gd.deck.map((c) => (
        <p>
          {c.deck} {c.type} - {c.id} {c.name.ru.length ? c.name.ru : c.name.en}{" "}
          ({c.level}) - {c.reprint.expansion} ({c.reprint.id})
        </p>
      ))}
    </>
  );
};
