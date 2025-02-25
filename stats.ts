const fs = require("fs");

const countLevels = (arr: { level: number; isBase: boolean }[]) => {
  const levelMap = arr.reduce((acc, obj) => {
    if (!acc[obj.level]) {
      acc[obj.level] = { level: obj.level, total: 0, original: 0 };
    }
    acc[obj.level].total += 1;
    if (obj.isBase) {
      acc[obj.level].original += 1;
    }
    return acc;
  }, {} as Record<number, { level: number; total: number; original: number }>);

  const result = Object.values(levelMap);

  // Calculate total counts across all levels
  const summary = result.reduce(
    (acc, obj) => {
      acc.total += obj.total;
      acc.original += obj.original;
      return acc;
    },
    { level: "total", total: 0, original: 0 } as {
      level: string;
      total: number;
      original: number;
    }
  );

  result.push(summary as any);

  return result;
};

const cards: any[] = JSON.parse(
  fs.readFileSync("public/CARDS.json").toString()
);

// const monsters = doors.filter((d) => d.cardSubtype == "MONSTER");

// console.table(countLevels(monsters));

// console.table(
//   doors.map(({ id, name, cardSubtype }) => ({
//     id,
//     name: name.length > 40 ? (name as string).slice(0, 37) + "..." : name,
//     cardSubtype,
//   }))
// );

// const res = cards
//   .filter((c) => c.isBase)
//   .reduce<Record<string, number>>((acc, card) => {
//     const key = `${card.cardType}-${card.cardSubtype}`;
//     acc[key] = (acc[key] || 0) + 1;
//     return acc;
//   }, {});

// console.log(res);

const monster_grades = {
  F: [1, 2, 3],
  E: [4, 5, 6, 7],
  D: [8, 9, 10, 11],
  C: [12, 13, 14, 15],
  B: [16, 17],
  A: [18, 19],
  S: [20],
};

const monster_amounts = {
  F: 10,
  E: 8,
  D: 7,
  C: 6,
  B: 3,
  A: 2,
  S: 1,
};

const monster_special_amounts = {
  F: 0,
  E: 0,
  D: 14,
  C: 12,
  B: 6,
  A: 4,
  S: 2,
};

const baseCards = {
  "DOOR-WALKING": 3,
  "DOOR-CHEAT": 1,
  "DOOR-RACE": 12,
  "DOOR-CLASS": 12,
  "DOOR-MODIFIER": 4,
  "DOOR-MONSTER": 37,
  "DOOR-COMMON": 5,
  "DOOR-MONSTER_BOOST": 5,
  "DOOR-CURSE": 19,
  "TREASURE-ONE_HAND": 12,
  "TREASURE-TWO_HANDS": 5,
  "TREASURE-BOOTS": 4,
  "TREASURE-BODY": 5,
  "TREASURE-HAT": 4,
  "TREASURE-OTHER": 7,
  "TREASURE-RING": 2,
  "TREASURE-DICE": 1,
  "TREASURE-FREE": 6,
  "TREASURE-ONE_TIME": 20,
  "TREASURE-GAIN_LVL": 9,
};

let n = 0;

cards
  .filter((c) => c.cardType == "DOOR" && c.cardSubtype == "CURSE")
  .forEach((c) => {
    if (c.undeadRelated) n++;
  });

console.log(n);
