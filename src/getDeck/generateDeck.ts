import {
  Card,
  DECK_CARD_TYPES,
  DeckCardType,
  DeckSize,
  DisplayCard,
  Options,
} from "@/types";

export class GenerateDeck {
  private cards: Card[];
  private deckSize: DeckSize;
  private options: Options;

  constructor(cards: Card[], deckSize: DeckSize, options: Options) {
    this.cards = cards;
    this.deckSize = deckSize;
    this.options = options;
  }

  private sortById = (arr: Card[]) =>
    arr.sort((a, b) => (a.id > b.id ? 1 : -1));

  private getRandomCards = (arr: Card[], n: number) => {
    if (!arr.length) return arr;

    if (n > arr.length) {
      n = arr.length;
    }

    const pickedCards = Array.from({ length: arr.length }, (_, i) => i)
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
      .map((item) => arr[item.num]);

    return this.sortById(pickedCards);
  };

  private getCategory = (k: DeckCardType) => {
    const n = this.deckSize[k];
    const [type, subtype] = k.split("-");
    const c = this.cards.filter(
      (a) => a.cardType == type && a.cardSubtype == subtype
    );

    if (!this.options.undeads) return this.getRandomCards(c, n);

    const undeads = this.getRandomCards(
      c.filter((a) => a.undeadRelated),
      n
    );
    if (undeads.length == n) return undeads;

    const undeadsIds = undeads.map((a) => a.id);

    return this.sortById([
      ...undeads,
      ...this.getRandomCards(
        c.filter((a) => undeadsIds.every((o) => o !== a.id)),
        n - undeads.length
      ),
    ]);
  };

  private getClassOrRace = (t: "CLASS" | "RACE") => {
    const n = this.deckSize[`DOOR-${t}`];

    const groups: Record<string, Card[]> = {};
    this.cards
      .filter((a) => a.cardType == "DOOR" && a.cardSubtype == t)
      .forEach((item) => {
        if (!groups[item.name]) groups[item.name] = [];
        groups[item.name].push(item);
      });

    let result: Card[] = [];
    for (const group of Object.values(groups)) {
      const selected = this.getRandomCards(group, n / 4);
      result = result.concat(selected);
    }

    return this.sortById(result);
  };

  private getClassRaceModifiers = () => {
    if (!this.options.ultramanchkins)
      return this.cards.filter((a) =>
        ["D155", "D156", "D173", "D174"].some((x) => x == a.id)
      );

    const n = this.deckSize["DOOR-MODIFIER"];
    const c = this.cards.filter(
      (a) => a.cardType == "DOOR" && a.cardSubtype == "MODIFIER"
    );

    const classMod = this.getRandomCards(
      c.filter((x) => x.classModifier),
      n / 2
    );

    const raceMod = this.getRandomCards(
      c.filter(
        (x) =>
          x.raceModifier && classMod.map((o) => o.id).every((o) => o !== x.id)
      ),
      n / 2
    );

    return this.sortById([...classMod, ...raceMod]);
  };

  private getMonsterBoost = () => {
    if (!this.options.undeads) return this.getCategory("DOOR-MONSTER_BOOST");

    const undeads = ["D427", "D428"];
    const n = this.deckSize["DOOR-MONSTER_BOOST"];
    const c = this.cards.filter(
      (a) => a.cardType == "DOOR" && a.cardSubtype == "MONSTER_BOOST"
    );

    return [
      ...c.filter((o) => undeads.some((u) => u === o.id)),
      ...this.getRandomCards(
        c.filter((o) => undeads.every((u) => u !== o.id)),
        n - 2
      ),
    ];
  };

  private getPet = () => {
    const n =
      this.deckSize["DOOR-PET"] *
      (this.options.hirelings && this.options.mounts ? 0.5 : 1);
    let c = this.cards.filter(
      (a) => a.cardType == "DOOR" && a.cardSubtype == "PET"
    );

    let hirelings: Card[] = [],
      mounts: Card[] = [];

    if (this.options.hirelings) {
      hirelings = this.getRandomCards(
        c
          .filter((a) => a.isHireling)
          .filter((a) => (this.options.undeads ? a.undeadRelated : true)),
        n
      );

      if (this.options.undeads) {
        hirelings = [
          ...hirelings,
          ...this.getRandomCards(
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

    if (this.options.mounts) {
      c = c.filter((a) => hirelings.map((o) => o.id).every((o) => o !== a.id));

      mounts = this.getRandomCards(
        c
          .filter((a) => a.isMount)
          .filter((a) => (this.options.undeads ? a.undeadRelated : true)),
        n
      );

      if (this.options.undeads) {
        mounts = [
          ...mounts,
          ...this.getRandomCards(
            c
              .filter((a) => a.isMount)
              .filter((a) => mounts.map((o) => o.id).every((o) => o !== a.id)),
            n - mounts.length
          ),
        ];
      }
    }

    return this.sortById([...mounts, ...hirelings]);
  };

  private getMonsters = () => {
    const n = this.deckSize["DOOR-MONSTER"];
    let c = this.cards.filter(
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
      this.options.stronger_monsters
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
          [k, (v * n) / (this.options.stronger_monsters ? 38 : 37)] as [
            keyof typeof monster_grades,
            number
          ]
      )
      .map(([k, v]) => {
        const _c = c.filter((o) => monster_grades[k].some((a) => a == o.level));

        if (!this.options.undeads) return this.getRandomCards(_c, v);

        const undeads = this.getRandomCards(
          _c.filter((a) => a.undeadRelated),
          v
        );
        if (undeads.length == v) return undeads;

        const undeadsIds = undeads.map((a) => a.id);

        return this.sortById([
          ...undeads,
          ...this.getRandomCards(
            _c.filter((a) => undeadsIds.every((o) => o !== a.id)),
            v - undeads.length
          ),
        ]);
      })
      .flat();

    return this.sortById(res).sort((a, b) => a.level - b.level);
  };

  private getPortal = () => {
    const n = this.deckSize["DOOR-PORTAL"];
    let c = this.cards.filter(
      (a) => a.cardType == "DOOR" && a.cardSubtype == "PORTAL"
    );

    const unique = [...new Map(c.map((item) => [item.name, item])).values()];

    return this.getRandomCards(unique.length >= n ? unique : c, n);
  };

  private getGainLevel = () => {
    const n = this.deckSize["TREASURE-GAIN_LVL"];
    let c = this.cards.filter(
      (a) => a.cardType == "TREASURE" && a.cardSubtype == "GAIN_LVL"
    );

    const withEffect = Math.ceil(n / 3);
    const noEffect = n - withEffect;

    return this.sortById([
      ...this.getRandomCards(
        c.filter((a) => a.withEffect),
        withEffect
      ),
      ...this.getRandomCards(
        c.filter((a) => !a.withEffect),
        noEffect
      ),
    ]);
  };

  private getCardsOfCatedory = (category: DeckCardType) => {
    switch (category) {
      case "DOOR-CLASS":
        return this.getClassOrRace("CLASS");
      case "DOOR-RACE":
        return this.getClassOrRace("RACE");
      case "DOOR-MODIFIER":
        return this.getClassRaceModifiers();
      case "DOOR-MONSTER":
        return this.getMonsters();
      case "DOOR-MONSTER_BOOST":
        return this.getMonsterBoost();
      case "DOOR-PORTAL":
        return this.getPortal();
      case "DOOR-PET":
        return this.getPet();
      case "TREASURE-GAIN_LVL":
        return this.getGainLevel();
      default:
        return this.getCategory(category);
    }
  };

  get deck() {
    return DECK_CARD_TYPES.map(this.getCardsOfCatedory)
      .flat()
      .map((c) => new DisplayCard(c));
  }
}
