import { Card } from "./types";
import * as R from "ramda";

const originalSetCards = {
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
    one_shot: { boost: 11, combat: 5, run_away: 3, other: 2, against_curse: 2 },
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
      other: 3,
    },
    monster: { none: 14 },
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

export const getDeck = (_cards: Card[]) => {
  const cards = _cards.filter((c) =>
    isSubset(
      ["elf", "orc", "dwarf", "gnome", "bard", "thief", "cleric", "wizard"],
      c.char_relations
    )
  );

  let res: any = {};

  for (const [deck, types] of Object.entries(originalSetCards)) {
    res[deck] ??= {};
    for (const [type, subtypes] of Object.entries(types)) {
      res[deck][type] ??= [];

      for (const [subtype, amount] of Object.entries(subtypes)) {
        if (deck === "treasure" && type === "gear") {
          res[deck][type] = [
            ...res[deck][type],
            ...getRandomCardsByTotalPower(
              cards.filter(
                (c) =>
                  c.deck === deck && c.type === type && c.subtype === subtype
              ),
              amount as number,
              boosts.gear[subtype as keyof (typeof boosts)["gear"]]
            ),
          ];
        } else if (
          deck === "treasure" &&
          type === "one_shot" &&
          subtype === "boost"
        ) {
          res[deck][type] = [
            ...res[deck][type],
            ...getRandomCardsByTotalPower(
              cards.filter(
                (c) =>
                  c.deck === deck && c.type === type && c.subtype === subtype
              ),
              amount as number,
              boosts.one_shot.boost
            ),
          ];
        } else if (
          deck === "door" &&
          type === "monster" &&
          subtype === "none"
        ) {
          const monsters = cards.filter(
            (c) => c.deck === deck && c.type === type && c.subtype === subtype
          );

          const monster_grades = {
            F: [1, 2, 3],
            E: [4, 5, 6, 7],
            D: [8, 9, 10, 11],
            C: [12, 13, 14, 15],
            B: [16, 17],
            A: [18, 19],
            S: [20],
          };
          let monstersByGradeCount = {
            F: 10,
            E: 8,
            D: 7,
            C: 6,
            B: 3,
            A: 2,
            S: 1,
          };

          for (const [grade, lvls] of Object.entries(monster_grades)) {
            res[deck][type] = [
              ...res[deck][type],
              ...shuffleArray(
                monsters.filter((m) => lvls.some((l) => l == m.level))
              ).slice(
                0,
                monstersByGradeCount[grade as keyof typeof monstersByGradeCount]
              ),
            ];
          }
        } else {
          res[deck][type] = [
            ...res[deck][type],
            ...shuffleArray(
              cards.filter(
                (c) =>
                  c.deck === deck && c.type === type && c.subtype === subtype
              )
            ).slice(0, amount as number),
          ];
        }
      }
    }
  }

  return res;
};
