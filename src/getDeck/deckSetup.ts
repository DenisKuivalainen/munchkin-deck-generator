import { Card, DeckCardType, DeckSize, Options } from "../types";

const getDeckSize = (cards: Card[], options: Options): DeckSize => {
  const getMaxCardsNumber = (category: string, n: number) => {
    const [type, subtype] = category.split("-");
    const maxNumber = cards.filter(
      (c) => c.cardType == type && c.cardSubtype == subtype
    ).length;

    return maxNumber > n ? n : maxNumber;
  };

  const modificationCategories: DeckCardType[] = [
    "DOOR-PORTAL",
    "DOOR-PET",
    "TREASURE-HIRELING_BOOST",
    "TREASURE-MOUNT_BOOST",
    "TREASURE-GEAR_BOOST",
  ];

  const deck: DeckSize = {
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
      (["DOOR-MODIFIER", ...modificationCategories] as DeckCardType[])
        .filter((category) => category.startsWith(prefix))
        .reduce((sum, category) => sum + (deck[category] || 0), 0) -
      (prefix == "DOOR" ? 4 : 0);

    return total / (total - modified);
  };

  const doorsIncrease = countIncrease("DOOR");
  const treasuresIncrease = countIncrease("TREASURE");

  return Object.fromEntries(
    (Object.entries(deck) as [DeckCardType, number][]).map(([k, v]) => {
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
  ) as DeckSize;
};

const filterInput = (input: any[], options: Options) =>
  input
    .map((i) => new Card(i))
    .filter(
      (c) =>
        !c.unused &&
        Object.entries({
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
        } as Partial<Record<keyof Card, boolean>>)
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

export default (input: any[], options: Options) => {
  const cards = filterInput(input, options);

  return {
    cards,
    deckSize: getDeckSize(cards, options),
  };
};
