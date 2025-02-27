import { Card, DisplayCard, Options } from "./types";

export default (input: any[], options: Options) => {
  const getDeckSize = (cards: Card[]) => {
    const getMaxCardsNumber = (category: string, n: number) => {
      const [type, subtype] = category.split("-");
      const maxNumber = cards.filter(
        (c) => c.cardType == type && c.cardSubtype == subtype
      ).length;

      return maxNumber > n ? n : maxNumber;
    };

    const modificationCategories = [
      "DOOR-PORTAL",
      "DOOR-PET",
      "TREASURE-HIRELING_BOOST",
      "TREASURE-MOUNT_BOOST",
      "TREASURE-GEAR_BOOST",
    ];

    const deck: Record<string, number> = {
      "DOOR-WALKING": 3,
      "DOOR-CHEAT": 1,
      "DOOR-RACE": 12,
      "DOOR-CLASS": 12,
      "DOOR-MODIFIER": 4 + (options.ultramanchkins ? 6 : 0),
      "DOOR-MONSTER": options.stronger_monsters ? 38 : 37,
      "DOOR-COMMON": 5,
      "DOOR-MONSTER_BOOST": 5,
      "DOOR-CURSE": 19,
      "DOOR-PORTAL": options.dungeons ? 8 : 0,
      "DOOR-PET": (options.mounts ? 5 : 0) + (options.hirelings ? 5 : 0),
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
      "TREASURE-HIRELING_BOOST": options.hirelings ? 1 : 0,
      "TREASURE-HIRELING": 0,
      "TREASURE-MOUNT_BOOST": options.mounts ? 3 : 0,
      "TREASURE-GEAR_BOOST": options.sharper_weapons ? 5 : 0,
    };

    const countIncrease = (prefix: "DOOR" | "TREASURE") => {
      const total = Object.entries(deck)
        .filter(([key]) => key.startsWith(prefix))
        .reduce((sum, [, value]) => sum + value, 0);

      const modified =
        ["DOOR-MODIFIER", ...modificationCategories]
          .filter((category) => category.startsWith(prefix))
          .reduce((sum, category) => sum + (deck[category] || 0), 0) -
        (prefix == "DOOR" ? 4 : 0);

      return total / (total - modified);
    };

    const doorsIncrease = countIncrease("DOOR");
    const treasuresIncrease = countIncrease("TREASURE");

    return Object.fromEntries(
      Object.entries(deck).map(([k, v]) => {
        if (modificationCategories.some((c) => c == k))
          return [k, Math.ceil(options.extended_deck ? 1.5 * v : v)];

        const modifier =
          (k.startsWith("DOOR") ? doorsIncrease : treasuresIncrease) *
          (options.extended_deck ? 1.5 : 1);

        let _v = Math.ceil(v * modifier);

        if (k == "DOOR-RACE" || k == "DOOR-CLASS")
          _v = Math.floor((v * modifier) / 4) * 4;

        if (k == "DOOR-PET" && options.hirelings && options.mounts)
          _v = Math.ceil((v * modifier) / 2) * 2;

        if (k == "DOOR-MODIFIER")
          _v = Math.ceil(((v - 4) * modifier + 4) / 2) * 2;

        return [k, getMaxCardsNumber(k, _v)];
      })
    );
  };

  const filters: Partial<Record<keyof Card, boolean>> = {
    mountRelated: options.mounts,
    hirelingRelated: options.hirelings,
    clerRelated: options.cler,
    thiefRelated: options.thief,
    warriorRelated: options.warrior,
    mageRelated: options.mage,
    rangerRelated: options.ranger,
    bardRelated: options.bard,
    dwarfRelated: options.dward,
    haflingRelated: options.hafling,
    gnomeRelated: options.gnome,
    orkRelated: options.ork,
    elfRelated: options.elf,
    kentRelated: options.kent,
    lizardRelated: options.lizard,
  };

  const cards = input
    .map((i) => new Card(i))
    .filter((c) => !c.unused)
    .filter((c) =>
      Object.entries(filters)
        .map((a) =>
          c.cardSubtype === "MONSTER" &&
          c.cardType === "DOOR" &&
          a[0] === "haflingRelated"
            ? ["haflingRelated", options.hafling || options.gnome]
            : a
        )
        .every(
          ([key, value]) =>
            !c[key as keyof Card] || c[key as keyof Card] === value
        )
    );

  const deckSize: Record<string, number> = getDeckSize(cards);

  const getRandomElements = (arr: Card[], n: number) => {
    if (!arr.length) return arr;

    if (n > arr.length) {
      n = arr.length;
    }

    return Array.from({ length: arr.length }, (_, i) => i)
      .map((num) => ({
        num,
        weight:
          Math.random() *
          Math.random() *
          Math.random() *
          Math.random() *
          Math.random(),
      }))
      .sort((a, b) => a.weight - b.weight)
      .slice(0, n)
      .map((item) => arr[item.num])
      .sort((a, b) => (a.id > b.id ? 1 : -1));
  };

  const sortById = (arr: Card[]) => arr.sort((a, b) => (a.id > b.id ? 1 : -1));

  const getCategory = (k: string) => {
    const n = deckSize[k];
    const [type, subtype] = k.split("-");
    const c = cards.filter(
      (a) => a.cardType == type && a.cardSubtype == subtype
    );

    if (!options.undeads) return getRandomElements(c, n);

    const undeads = getRandomElements(
      c.filter((a) => a.undeadRelated),
      n
    );
    if (undeads.length == n) return undeads;

    const undeadsIds = undeads.map((a) => a.id);

    return sortById([
      ...undeads,
      ...getRandomElements(
        c.filter((a) => undeadsIds.every((o) => o !== a.id)),
        n - undeads.length
      ),
    ]);
  };

  const getClassOrRace = (t: "CLASS" | "RACE") => {
    const n = deckSize[`DOOR-${t}`];

    const groups: Record<string, Card[]> = {};
    cards
      .filter((a) => a.cardType == "DOOR" && a.cardSubtype == t)
      .forEach((item) => {
        if (!groups[item.name]) groups[item.name] = [];
        groups[item.name].push(item);
      });

    let result: Card[] = [];
    for (const group of Object.values(groups)) {
      const selected = getRandomElements(group, n / 4);
      result = result.concat(selected);
    }

    return sortById(result);
  };

  const getClassRaceModifiers = () => {
    if (!options.ultramanchkins)
      return cards.filter((a) =>
        ["D155", "D156", "D173", "D174"].some((x) => x == a.id)
      );

    const n = deckSize["DOOR-MODIFIER"];
    const c = cards.filter(
      (a) => a.cardType == "DOOR" && a.cardSubtype == "MODIFIER"
    );

    const classMod = getRandomElements(
      c.filter((x) => x.classModifier),
      n / 2
    );

    const raceMod = getRandomElements(
      c.filter(
        (x) =>
          x.raceModifier && classMod.map((o) => o.id).every((o) => o !== x.id)
      ),
      n / 2
    );

    return sortById([...classMod, ...raceMod]);
  };

  const getMonsterBoost = () => {
    if (!options.undeads) return getCategory("DOOR-MONSTER_BOOST");

    const undeads = ["D427", "D428"];
    const n = deckSize["DOOR-MONSTER_BOOST"];
    const c = cards.filter(
      (a) => a.cardType == "DOOR" && a.cardSubtype == "MONSTER_BOOST"
    );

    return [
      ...c.filter((o) => undeads.some((u) => u === o.id)),
      ...getRandomElements(
        c.filter((o) => undeads.every((u) => u !== o.id)),
        n - 2
      ),
    ];
  };

  const getPet = () => {
    const n =
      deckSize["DOOR-PET"] * (options.hirelings && options.mounts ? 0.5 : 1);
    let c = cards.filter((a) => a.cardType == "DOOR" && a.cardSubtype == "PET");

    let hirelings: Card[] = [],
      mounts: Card[] = [];

    if (options.hirelings) {
      hirelings = getRandomElements(
        c
          .filter((a) => a.isHireling)
          .filter((a) => (options.undeads ? a.undeadRelated : true)),
        n
      );

      if (options.undeads) {
        hirelings = [
          ...hirelings,
          ...getRandomElements(
            c
              .filter((a) => a.isHireling)
              .filter((a) =>
                hirelings.map((o) => o.id).every((o) => o !== a.id)
              ),
            n - hirelings.length
          ),
        ];
      }
    }

    if (options.mounts) {
      c = c.filter((a) => hirelings.map((o) => o.id).every((o) => o !== a.id));

      mounts = getRandomElements(
        c
          .filter((a) => a.isMount)
          .filter((a) => (options.undeads ? a.undeadRelated : true)),
        n
      );

      if (options.undeads) {
        mounts = [
          ...mounts,
          ...getRandomElements(
            c
              .filter((a) => a.isMount)
              .filter((a) => mounts.map((o) => o.id).every((o) => o !== a.id)),
            n - mounts.length
          ),
        ];
      }
    }

    return sortById([...mounts, ...hirelings]);
  };

  const getMonsters = () => {
    const n = deckSize["DOOR-MONSTER"];
    let c = cards.filter(
      (a) => a.cardType == "DOOR" && a.cardSubtype == "MONSTER"
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

    const res = Object.entries(
      options.stronger_monsters
        ? {
            F: 0,
            E: 0,
            D: 14,
            C: 12,
            B: 6,
            A: 4,
            S: 2,
          }
        : {
            F: 10,
            E: 8,
            D: 7,
            C: 6,
            B: 3,
            A: 2,
            S: 1,
          }
    )
      .map(
        ([k, v]) =>
          // Something strange happens on this line, but it work absolutely correct for some reason
          [k, (v * n) / (options.stronger_monsters ? 38 : 37)] as [
            keyof typeof monster_grades,
            number
          ]
      )
      .map(([k, v]) => {
        const _c = c.filter((o) => monster_grades[k].some((a) => a == o.level));

        if (!options.undeads) return getRandomElements(_c, v);

        const undeads = getRandomElements(
          _c.filter((a) => a.undeadRelated),
          v
        );
        if (undeads.length == v) return undeads;

        const undeadsIds = undeads.map((a) => a.id);

        return sortById([
          ...undeads,
          ...getRandomElements(
            _c.filter((a) => undeadsIds.every((o) => o !== a.id)),
            v - undeads.length
          ),
        ]);
      })
      .flat();

    return (
      sortById(res)
        // TODO: remove when all card will be numerated
        .sort((a, b) => a.level - b.level)
    );
  };

  const getPortal = () => {
    const n = deckSize["DOOR-PORTAL"];
    let c = cards.filter(
      (a) => a.cardType == "DOOR" && a.cardSubtype == "PORTAL"
    );

    const unique = [...new Map(c.map((item) => [item.name, item])).values()];

    return getRandomElements(unique.length >= n ? unique : c, n);
  };

  return [
    getCategory("DOOR-WALKING"),
    getCategory("DOOR-CHEAT"),
    getClassOrRace("RACE"),
    getClassOrRace("CLASS"),
    getClassRaceModifiers(),
    getMonsters(),
    getCategory("DOOR-COMMON"),
    getMonsterBoost(),
    getCategory("DOOR-CURSE"),
    getPortal(),
    getPet(),
    getCategory("TREASURE-ONE_HAND"),
    getCategory("TREASURE-TWO_HANDS"),
    getCategory("TREASURE-BOOTS"),
    getCategory("TREASURE-BODY"),
    getCategory("TREASURE-HAT"),
    getCategory("TREASURE-OTHER"),
    getCategory("TREASURE-RING"),
    getCategory("TREASURE-DICE"),
    getCategory("TREASURE-FREE"),
    getCategory("TREASURE-ONE_TIME"),
    getCategory("TREASURE-GAIN_LVL"),
    getCategory("TREASURE-HIRELING_BOOST"),
    getCategory("TREASURE-HIRELING"),
    getCategory("TREASURE-MOUNT_BOOST"),
    getCategory("TREASURE-GEAR_BOOST"),
  ]
    .flat()
    .map((c) => new DisplayCard(c));
};
