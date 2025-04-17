import { common } from "@mui/material/colors";
import { _Object } from "./objectHelpers";
import {
  BoostSubtype,
  Card,
  CardId,
  CardRepresentation,
  CharRelation,
  CurseSubtype,
  Deck,
  DeckOptions,
  GameOptions,
  MonsterBoostSubtype,
  OneShotSubtype,
  OtherRelation,
  Reprint,
  Subtype,
  Type,
} from "./types";
import * as R from "ramda";

type PartialRecord<K extends string, V> = Partial<Record<K, V>>;
const originalSetCards: PartialRecord<
  Deck,
  PartialRecord<Type, PartialRecord<Subtype, number>>
> = {
  treasure: {
    gear: {
      one_hand: 13,
      two_hand: 5,
      footgear: 3,
      armor: 5,
      headgear: 4,
      other: 8,
    },
    go_up_a_lvl: { with_effect: 3, no_effect: 6 },
    one_shot: {
      boost: 11,
      combat: 5,
      run_away: 3,
      other: 2,
      against_curse: 2,
    },
    common: { none: 4 },
    hireling: { none: 0 },
    boost: {
      headgear: 0,
      armor: 0,
      footgear: 0,
      weapon: 0,
      gear: 0,
      steed: 0,
      hireling: 0,
    },
  },
  door: {
    wandering: { none: 3 },
    cheat: { none: 1 },
    portal: { none: 0 },
    race: { none: 9 },
    class: { none: 12 },
    role_modifier: {
      class_modifier: 2,
      class_enhancer: 0,
      race_modifier: 2,
      race_enhancer: 0,
      other: 0,
    },
    pet: { none: 0 },
    common: { none: 5 },
    monster_boost: { minus_5: 1, plus_5: 2, plus_10: 2, boost: 0 },
    curse: {
      level: 3,
      steed: 0,
      hireling: 0,
      role: 4,
      gender: 1,
      headgear: 1,
      armor: 1,
      big_item: 1,
      small_item: 2,
      footgear: 1,
      gear: 2,
      other: 4,
    },
    monster: { none: 37 },
  },
};

const boosts = {
  gear: {
    one_hand: 37,
    two_hand: 15,
    footgear: 6,
    armor: 10,
    headgear: 8,
    other: 19,
  },
  one_shot: { boost: 34 },
};

const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const getRandomCardsByTotalPower = (
  arr: Card[],
  amount: number,
  boost: number
) => {
  const minBoost = Math.floor(boost * 0.95);
  const maxBoost = Math.ceil(boost * 1.05);
  let res = shuffleArray(arr).slice(0, amount);
  let retries = 0;

  while (retries < 1000) {
    const filteredArr = arr.filter((a) => res.every((r) => r.id !== a.id));

    const resBoost = res.reduce((acc, c) => acc + c.level, 0);

    if (minBoost <= resBoost && resBoost <= maxBoost) return res;

    const boostIsBigger = resBoost > boost;

    const toReplace = shuffleArray(
      res.filter((r) =>
        (boostIsBigger ? R.gte : R.lte)(
          r.level,
          (boostIsBigger ? R.subtract : R.add)(resBoost / amount, 2)
        )
      )
    )[0];
    const replacement = shuffleArray(
      filteredArr.filter((r) =>
        (boostIsBigger ? R.lt : R.gt)(r.level, toReplace.level)
      )
    )[0];

    if (toReplace && replacement) {
      res = [...res.filter((r) => r.id !== toReplace.id), replacement];
    }

    retries++;
  }

  return res;
};

const isSubset = <T>(a: T[], b: T[]): boolean => {
  return b.every((item) => a.includes(item));
};

const countAmountsInSubobject = <
  T extends Record<string, Record<string, number>>
>(
  obj: T
) => {
  let res = _Object.fromEntries(_Object.keys(obj).map((k) => [k, 0]));

  for (const k in obj) {
    for (const s in obj[k]) {
      res[k] += obj[k][s];
    }
  }

  return res;
};

export const countOriginalCardsOfType = () => {
  let os = originalSetCards as any;
  let res: any = {};

  for (const deck in os) {
    res[deck] = countAmountsInSubobject(
      originalSetCards[deck as keyof typeof originalSetCards]!
    );
  }

  return res as PartialRecord<Deck, PartialRecord<Type, number>>;
};

export class GeneratedDeck {
  private gameOptions: DeckOptions["gameOptions"];
  private cards: Card[];
  deck: CardRepresentation[];

  constructor(deckOptions: DeckOptions, cards: Card[]) {
    this.cards = this.filterCards(deckOptions, cards);
    this.gameOptions = deckOptions.gameOptions;

    this.deck = this.getDeckCards(this.getSubtypeCounts(this.getTypeCounts()));
  }

  private filterCards = (deckOptions: DeckOptions, cards: Card[]): Card[] => {
    const { classes, races, gameOptions, excludedExpansions } = deckOptions;
    const charRelations: Record<CharRelation, boolean> = {
      ...classes,
      ...races,
      role_modifier: gameOptions.role_enhancers,
      steed: gameOptions.steeds,
      hireling: gameOptions.hirelings,
      unused: false,
    };

    const res = cards
      .map((card) => {
        return new Card({
          ...card,
          reprints: card.reprints.filter(
            (r) => !excludedExpansions[r.expansion]
          ),
        });
      })
      .filter(
        (card) =>
          card.char_relations.every((r) => charRelations[r]) &&
          card.reprints.length
      );

    let cardsToRemove: CardId[] = [];
    for (const card of res) {
      if (card.required.length) {
        if (!card.required.every((r) => !!res.find((c) => c.id === r))) {
          cardsToRemove.push(card.id);
        }
      }
    }

    return res.filter((r) => !cardsToRemove.includes(r.id));
  };

  doorHirelings: number = 0;
  steeds: number = 0;

  private increaseRawCards = <
    T extends Record<string, Record<string, number>>,
    OuterKey extends keyof T = keyof T,
    InnerKey extends keyof T[OuterKey] = keyof T[OuterKey]
  >(
    typeCards: T,
    deck: OuterKey,
    keysToUpdate: InnerKey[]
  ) => {
    const a = typeCards[deck];
    while (true) {
      const inRaw = countAmountsInSubobject(typeCards)[deck];
      if (
        keysToUpdate
          .map((k) => {
            const b =
              typeCards[deck][k] / inRaw >=
              (0.95 *
                countOriginalCardsOfType()?.[deck as Deck]?.[k as Type]!) /
                countAmountsInSubobject(countOriginalCardsOfType())[
                  deck as Deck
                ];

            if (!b) (typeCards[deck][k] as number) += 1;

            return b;
          })
          .every((b) => b)
      )
        break;
    }
  };

  private getTypeCounts = () => {
    const treasureHirelings = this.gameOptions[GameOptions.Hirelings]
      ? Math.floor(Math.random() * 3)
      : 0;
    this.doorHirelings =
      (this.gameOptions[GameOptions.Hirelings] ? 5 : 0) - treasureHirelings;
    this.steeds = this.gameOptions[GameOptions.Steeds] ? 5 : 0;
    const boost =
      (this.gameOptions[GameOptions.GearBoosts] ? 7 : 0) +
      (this.gameOptions[GameOptions.Steeds] ? 2 : 0) +
      (this.gameOptions[GameOptions.Hirelings] ? 1 : 0);

    let typeCards = {
      treasure: {
        gear: 38,
        go_up_a_lvl: 9,
        one_shot: 23,
        common: 4,
        hireling: treasureHirelings,
        boost: boost,
      },
      door: {
        wandering: _Object.values(this.gameOptions).some((b) => b) ? 4 : 3,
        cheat: _Object.values(this.gameOptions).some((b) => b) ? 2 : 1,
        portal: this.gameOptions[GameOptions.Dungeons] ? 8 : 0,
        race: this.gameOptions[GameOptions.RoleEnhancers] ? 12 : 9,
        class: 12,
        role_modifier: this.gameOptions[GameOptions.RoleEnhancers] ? 12 : 4,
        pet: this.doorHirelings + this.steeds,
        common: 5,
        monster_boost: 5,
        curse: 20,
        monster: 37,
      },
    };

    this.increaseRawCards(typeCards, Deck.Door, [
      // "wandering",
      // "cheat",
      "common",
      "monster",
      // "monster_boost",
      "curse",
    ]);
    this.increaseRawCards(typeCards, Deck.Treasure, ["one_shot", "common"]);

    for (const [option, boost] of _Object.entries({
      [GameOptions.Dungeons]: 1,
      [GameOptions.Hirelings]: 1,
      [GameOptions.Steeds]: 2,
      [GameOptions.GearBoosts]: 2,
    })) {
      if (this.gameOptions[option as GameOptions]) {
        typeCards.door.monster_boost += boost;
      }
    }

    return typeCards;
  };

  private switchValue = (deck: Deck, type: Type) => `${deck}-${type}`;

  private getSubtypeCounts = (
    typeCards: PartialRecord<Deck, PartialRecord<Type, number>>
  ): [Deck, Type, Partial<Record<Subtype, number>>][] => {
    const switchValue = this.switchValue;

    return _Object
      .entries(typeCards)
      .map(([deck, v]) =>
        _Object
          .entries(v as Record<Type, number>)
          .map(([type, amount]) => [deck, type, amount] as [Deck, Type, number])
      )
      .flat()
      .map(([deck, type, amount]) => {
        let subtypesCards: Partial<Record<Subtype, number>> = {};

        switch (switchValue(deck, type)) {
          case switchValue(Deck.Treasure, Type.OneShot):
            let oneShotCards = { ...originalSetCards[deck]![type]! } as Record<
              OneShotSubtype,
              number
            >;
            let oneShotIncrease: OneShotSubtype[] = [
              Subtype.Other,
              Subtype.Combat,
              Subtype.AgainstCurse,
              Subtype.RunAway,
              Subtype.Boost,
            ];

            for (let i = 0; i < amount - 23; i++) {
              oneShotCards[oneShotIncrease[i % oneShotIncrease.length]] += 1;
            }

            subtypesCards = oneShotCards;
            break;
          case switchValue(Deck.Treasure, Type.Boost):
            let boostCards = {
              headgear: 0,
              armor: 0,
              footgear: 0,
              weapon: 0,
              gear: 0,
              steed: 0,
              hireling: 0,
            } as Record<BoostSubtype, number>;

            if (this.gameOptions.hirelings)
              boostCards = { ...boostCards, [Subtype.Hireling]: 1 };
            if (this.gameOptions.steeds)
              boostCards = { ...boostCards, [Subtype.Hireling]: 2 };
            if (this.gameOptions.gear_boosts)
              boostCards = {
                ...boostCards,
                headgear: 1,
                armor: 1,
                footgear: 1,
                weapon: 1,
                gear: 3,
              };
            subtypesCards = boostCards;
            break;
          case switchValue(Deck.Door, Type.RoleModifier):
            subtypesCards = this.gameOptions.role_enhancers
              ? {
                  class_modifier: 2,
                  class_enhancer: 3,
                  race_modifier: 2,
                  race_enhancer: 3,
                  other: 2,
                }
              : { ...originalSetCards[deck]![type]! };
            break;
          case switchValue(Deck.Door, Type.MonsterBoost):
            let monsterBoostCards = {
              ...originalSetCards[deck]![type]!,
            } as Record<MonsterBoostSubtype, number>;
            let monsterBoostIncrease: MonsterBoostSubtype[] = [
              Subtype.Plus5,
              Subtype.Plus10,
              Subtype.Plus5,
              Subtype.Minus5,
            ];

            for (let i = 0; i < amount - 5; i++) {
              monsterBoostCards[
                monsterBoostIncrease[i % monsterBoostIncrease.length]
              ] += 1;
            }

            if (
              this.gameOptions.hirelings ||
              this.gameOptions.steeds ||
              this.gameOptions.gear_boosts
            )
              monsterBoostCards[Subtype.Boost] = Math.ceil(amount / 7);

            subtypesCards = monsterBoostCards;
            break;
          case switchValue(Deck.Door, Type.Curse):
            let curseCards = { ...originalSetCards.door?.curse } as Record<
              CurseSubtype,
              number
            >;
            let curseIncrease: CurseSubtype[] = [
              Subtype.Other,
              ...(this.gameOptions.steeds
                ? ([Subtype.Steed] as [CurseSubtype])
                : []),
              ...(this.gameOptions.hirelings
                ? ([Subtype.Hireling] as [CurseSubtype])
                : []),
              Subtype.Other,
              Subtype.Gear,
              Subtype.Level,
            ];

            for (let i = 0; i < amount - 20; i++) {
              curseCards[curseIncrease[i % curseIncrease.length]] += 1;
            }

            subtypesCards = curseCards;
            break;

          case switchValue(Deck.Treasure, Type.Gear):
          case switchValue(Deck.Treasure, Type.GoUpALvl):
            subtypesCards = { ...originalSetCards[deck]![type]! };
            break;

          default:
            subtypesCards.none = amount;
            break;
        }

        return [deck, type, subtypesCards];
      });
  };

  private getCardsOfSubtype = (
    deck: Deck,
    type: Type,
    subtype: Partial<Record<Subtype, number>>
  ): [Card, Reprint][] => {
    const cardsOfType = this.cards
      .filter((c) => c.deck === deck && c.type === type)
      .filter(
        (c) =>
          ![OtherRelation.Munchkinomicon, OtherRelation.SGF].some((r) =>
            c.other_relations.includes(r)
          )
      );

    let res: [Card, Reprint][] = [];

    const switchValue = this.switchValue;

    switch (switchValue(deck, type)) {
      case switchValue(Deck.Treasure, Type.Gear):
        const gearIncrease =
          ((this.gameOptions.hirelings ? 6 : 0) +
            (this.gameOptions.hirelings ? 7 : 0) +
            (this.gameOptions.gear_boosts ? 7 : 0)) *
          1.5;

        for (const a of _Object.entries(subtype)) {
          const gearCards = cardsOfType.filter((c) => c.subtype === a[0]);
          const b =
            boosts.gear[a[0] as keyof typeof boosts.gear] -
            Math.floor((gearIncrease * a[1]!) / 38) -
            (a[0] === Subtype.Other && this.gameOptions.munchkinomicon ? 5 : 0);

          res = [
            ...res,
            ...getRandomCardsByTotalPower(gearCards, a[1]!, b).map(
              (c) => [c, shuffleArray(c.reprints)[0]] as [Card, Reprint]
            ),
          ];
        }
        break;

      case switchValue(Deck.Treasure, Type.OneShot):
        for (const a of _Object.entries(subtype)) {
          const oneShotCards = cardsOfType.filter((c) => c.subtype === a[0]);

          if (a[0] == Subtype.Boost) {
            res = [
              ...res,
              ...getRandomCardsByTotalPower(
                oneShotCards,
                a[1]!,
                (a[1]! * boosts.one_shot.boost) /
                  originalSetCards.treasure?.one_shot?.boost!
              ).map((c) => [c, shuffleArray(c.reprints)[0]] as [Card, Reprint]),
            ];
          } else if (a[0] == Subtype.AgainstCurse) {
            const againstCurseCards = cardsOfType.filter(
              (c) => c.subtype === a[0]
            );
            const wishingRing = againstCurseCards.find((c) => c.id === "WIRI")!;
            const wishingRingReprint = shuffleArray(wishingRing.reprints)[0];

            res = [
              ...res,
              [wishingRing, wishingRingReprint],
              ...shuffleArray(
                againstCurseCards
                  .map((c) =>
                    c.reprints
                      .filter(
                        (r) =>
                          !(c.id === "WIRi" && r.id === wishingRingReprint.id)
                      )
                      .map((r) => [c, r] as [Card, Reprint])
                  )
                  .flat()
              ).slice(0, a[1]! - 1),
            ];
          } else {
            res = [
              ...res,
              ...shuffleArray(oneShotCards)
                .slice(0, a[1] || 0)
                .map(
                  (c) => [c, shuffleArray(c.reprints)[0]] as [Card, Reprint]
                ),
            ];
          }
        }
        break;

      case switchValue(Deck.Door, Type.Cheat):
        for (const a of _Object.entries(subtype)) {
          res = cardsOfType
            .filter((c) => c.subtype === a[0])
            .map((card) =>
              shuffleArray(card.reprints)
                .slice(0, a[1]!)
                .map((r) => [card, r] as [Card, Reprint])
            )
            .flat();
        }
        break;
      case switchValue(Deck.Door, Type.Class):
      case switchValue(Deck.Door, Type.Race):
        for (const a of _Object.entries(subtype)) {
          res = cardsOfType
            .filter((c) => c.subtype === a[0])
            .map((card) =>
              shuffleArray(card.reprints)
                .slice(0, 3)
                .map((r) => [card, r] as [Card, Reprint])
            )
            .flat();
        }
        break;
      case switchValue(Deck.Door, Type.Wandering):
        const wanderingMonster = shuffleArray(
          cardsOfType.find((c) => c.id === "WAMO")!.reprints
        ).slice(0, 2);

        res = [
          ...wanderingMonster.map(
            (r) =>
              [cardsOfType.find((c) => c.id === "WAMO")!, r] as [Card, Reprint]
          ),
          ...shuffleArray(cardsOfType)
            .slice(0, subtype.none! - 2)
            .map(
              (c) =>
                [
                  c,
                  shuffleArray(
                    c.reprints.filter((r) =>
                      c.id === "WAMO"
                        ? wanderingMonster.every((m) => m.id !== r.id)
                        : true
                    )
                  )[0],
                ] as [Card, Reprint]
            ),
        ];
        break;

      case switchValue(Deck.Door, Type.Pet):
        const hirelings = shuffleArray(
          cardsOfType.filter((c) =>
            c.other_relations.includes(OtherRelation.Hireling)
          )
        ).slice(0, this.doorHirelings);
        const steeds = shuffleArray(
          cardsOfType
            .filter((c) => c.other_relations.includes(OtherRelation.Steed))
            .filter((c) => hirelings.every((h) => h.id !== c.id))
        ).slice(0, this.steeds);

        res = [...hirelings, ...steeds].map((c) => [c, c.reprints[0]]);
        break;

      case switchValue(Deck.Door, Type.RoleModifier):
        if (!this.gameOptions.role_enhancers) {
          res = [
            ...cardsOfType
              .filter((c) => c.id === "HABR")
              .map((c) =>
                shuffleArray(c.reprints)
                  .slice(0, 2)
                  .map((r) => [c, r] as [Card, Reprint])
              )[0],
            ...cardsOfType
              .filter((c) => c.id === "SUMU")
              .map((c) =>
                shuffleArray(c.reprints)
                  .slice(0, 2)
                  .map((r) => [c, r] as [Card, Reprint])
              )[0],
          ];
        } else {
          for (const a of _Object.entries(subtype)) {
            res = [
              ...res,
              ...shuffleArray(cardsOfType.filter((c) => c.subtype === a[0]))
                .slice(0, a[1] || 0)
                .map(
                  (c) => [c, shuffleArray(c.reprints)[0]] as [Card, Reprint]
                ),
            ];
          }
        }
        break;

      case switchValue(Deck.Door, Type.Monster):
        const monster_grades = {
          F: [1, 2, 3],
          E: [4, 5, 6, 7],
          D: [8, 9, 10, 11],
          C: [12, 13, 14],
          B: [15, 16],
          A: [17, 18],
          S: [19, 20],
        };
        let monstersByGradeCount: Record<keyof typeof monster_grades, number> =
          {
            F: 10,
            E: 8,
            D: 7,
            C: 6,
            B: 3,
            A: 2,
            S: 1,
          };
        let increaseMonsters: (keyof typeof monster_grades)[] = [
          "B",
          "C",
          "A",
          "S",
          "D",
        ];
        if (subtype.none! > 37) {
          for (let i = 0; i < subtype.none! - 37; i++) {
            monstersByGradeCount[
              increaseMonsters[i % increaseMonsters.length]
            ] += 1;
          }
        }

        for (const [grade, count] of _Object.entries(monstersByGradeCount)) {
          res = [
            ...res,
            ...shuffleArray(
              cardsOfType.filter((c) =>
                monster_grades[grade].some((g) => g === c.level)
              )
            )
              .slice(0, count)
              .map((c) => [c, c.reprints[0]] as [Card, Reprint]),
          ];
        }
        break;

      default:
        for (const a of _Object.entries(subtype)) {
          res = [
            ...res,
            ...shuffleArray(cardsOfType.filter((c) => c.subtype === a[0]))
              .slice(0, a[1] || 0)
              .map((c) => [c, shuffleArray(c.reprints)[0]] as [Card, Reprint]),
          ];
        }
        break;
    }

    return res;
  };

  private findReplacement = (
    arr: [Card, Reprint][],
    target: Card,
    excludeId: string
  ): Card | undefined => {
    const candidates = shuffleArray(
      arr.filter(
        ([c]) =>
          c.deck === target.deck &&
          c.type === target.type &&
          c.subtype === target.subtype &&
          c.id !== excludeId
      )
    );

    const levelMatch = candidates.filter(([c]) => c.level === target.level);
    const nearLevelMatch =
      levelMatch.length > 0
        ? levelMatch
        : candidates.filter(([c]) => Math.abs(c.level - target.level) <= 1);

    return nearLevelMatch[0]?.[0];
  };

  private checkRequired = (
    arr: [Card, Reprint][],
    depth: number = 0
  ): [Card, Reprint][] => {
    depth++;
    if (depth > 1000) return arr;

    for (const [card, _] of arr) {
      const requiredIds = card.required;

      if (requiredIds.length === 0) continue;

      const currentCardIds = arr.map(([c]) => c.id);
      const isAnyRequiredMissing = !requiredIds.some((id) =>
        currentCardIds.includes(id)
      );

      if (isAnyRequiredMissing) {
        const requiredId = shuffleArray(requiredIds)[0];
        const replacement = this.cards.find((c) => c.id === requiredId)!;

        let toReplace =
          this.findReplacement(arr, replacement, card.id) ??
          this.findReplacement(arr, card, card.id)!;

        const updatedArr: [Card, Reprint][] = [
          ...arr.filter(([c]) => c.id !== toReplace.id),
          [replacement, shuffleArray(replacement.reprints)[0]],
        ];

        return this.checkRequired(updatedArr, depth);
      }
    }

    return arr;
  };

  private getDeckCards = (
    subtypeCounts: ReturnType<typeof this.getSubtypeCounts>
  ) => {
    if (!this.cards.length) return [];

    let res: [Card, Reprint][] = [];

    for (const [deck, type, subtype] of subtypeCounts) {
      res = [...res, ...this.getCardsOfSubtype(deck, type, subtype)];
    }

    // Add munchkinomicon and fairy

    res = this.checkRequired(res);
    return res.map((r) => new CardRepresentation(...r));
  };
}
