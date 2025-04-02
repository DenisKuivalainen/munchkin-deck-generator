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
    arr.sort((a, b) => Number(a.id.split("_")[1]) - Number(b.id.split("_")[1]));

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

  private getCategory = (cardType: DeckCardType) => {
    const categorySize = this.deckSize[cardType];
    const [type, subtype] = cardType.split("-");
    const categoryCards = this.cards.filter(
      (card) => card.cardType == type && card.cardSubtype == subtype
    );

    if (!this.options.undeads)
      return this.getRandomCards(categoryCards, categorySize);

    const undeads = this.getRandomCards(
      categoryCards.filter((card) => card.undeadRelated),
      categorySize
    );
    if (undeads.length == categorySize) return undeads;

    const undeadsIds = undeads.map((card) => card.id);

    return this.sortById([
      ...undeads,
      ...this.getRandomCards(
        categoryCards.filter((card) =>
          undeadsIds.every((id) => id !== card.id)
        ),
        categorySize - undeads.length
      ),
    ]);
  };

  private getClassOrRace = (classOrRace: "CLASS" | "RACE") => {
    const categorySize = this.deckSize[`DOOR-${classOrRace}`];

    const classRaceGroups: Record<string, Card[]> = {};
    this.cards
      .filter(
        (card) => card.cardType == "DOOR" && card.cardSubtype == classOrRace
      )
      .forEach((card) => {
        if (!classRaceGroups[card.name]) classRaceGroups[card.name] = [];
        classRaceGroups[card.name].push(card);
      });

    let result: Card[] = [];
    for (const group of Object.values(classRaceGroups)) {
      const selected = this.getRandomCards(group, categorySize / 4);
      result = result.concat(selected);
    }

    return this.sortById(result);
  };

  private getClassRaceModifiers = () => {
    if (!this.options.ultramanchkins)
      return [
        ...this.cards.filter((card) => card.name === "Полукровка").slice(0, 2),
        ...this.cards
          .filter((card) => card.name === "Суперманчкин")
          .slice(0, 2),
      ];

    const categorySize = this.deckSize["DOOR-MODIFIER"];
    const categoryCards = this.cards.filter(
      (card) => card.cardType == "DOOR" && card.cardSubtype == "MODIFIER"
    );

    const classModifiers = this.getRandomCards(
      categoryCards.filter((c) => c.classModifier),
      categorySize / 2
    );

    const raceModifiers = this.getRandomCards(
      categoryCards.filter(
        (card) =>
          card.raceModifier &&
          classModifiers.every((modifierCard) => modifierCard.id !== card.id)
      ),
      categorySize / 2
    );

    return this.sortById([...classModifiers, ...raceModifiers]);
  };

  private getMonsterBoost = () => {
    if (!this.options.undeads) return this.getCategory("DOOR-MONSTER_BOOST");

    const undeads = this.cards
      .filter((card) => card.name === "Андед")
      .slice(0, 2)
      .map((card) => card.id);
    const categorySize = this.deckSize["DOOR-MONSTER_BOOST"];
    const categoryCards = this.cards.filter(
      (card) => card.cardType == "DOOR" && card.cardSubtype == "MONSTER_BOOST"
    );

    return [
      ...categoryCards.filter((card) => undeads.some((id) => id === card.id)),
      ...this.getRandomCards(
        categoryCards.filter((card) => undeads.every((id) => id !== card.id)),
        categorySize - 2
      ),
    ];
  };

  private getPet = () => {
    const categorySize =
      this.deckSize["DOOR-PET"] *
      (this.options.hirelings && this.options.mounts ? 0.5 : 1);
    let categoryCards = this.cards.filter(
      (card) => card.cardType == "DOOR" && card.cardSubtype == "PET"
    );

    let hirelings: Card[] = [],
      mounts: Card[] = [];

    if (this.options.hirelings) {
      hirelings = this.getRandomCards(
        categoryCards
          .filter((card) => card.isHireling)
          .filter((card) => (this.options.undeads ? card.undeadRelated : true)),
        categorySize
      );

      if (this.options.undeads) {
        hirelings = [
          ...hirelings,
          ...this.getRandomCards(
            categoryCards
              .filter((card) => card.isHireling)
              .filter((card) =>
                hirelings.every((hirelingCard) => hirelingCard.id !== card.id)
              ),
            categorySize - hirelings.length
          ),
        ];
      }
    }

    if (this.options.mounts) {
      categoryCards = categoryCards.filter((card) =>
        hirelings.every((hirelingCard) => hirelingCard.id !== card.id)
      );

      mounts = this.getRandomCards(
        categoryCards
          .filter((card) => card.isMount)
          .filter((card) => (this.options.undeads ? card.undeadRelated : true)),
        categorySize
      );

      if (this.options.undeads) {
        mounts = [
          ...mounts,
          ...this.getRandomCards(
            categoryCards
              .filter((card) => card.isMount)
              .filter((card) =>
                mounts.every((mountCard) => mountCard.id !== card.id)
              ),
            categorySize - mounts.length
          ),
        ];
      }
    }

    return this.sortById([...mounts, ...hirelings]);
  };

  private getMonsters = () => {
    const categorySize = this.deckSize["DOOR-MONSTER"];
    let categoryCards = this.cards.filter(
      (card) => card.cardType == "DOOR" && card.cardSubtype == "MONSTER"
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

    const monsterGradesIncrease = {
      F: 1,
      E: 2,
      D: 2,
      C: 2,
      B: 2,
      A: 1,
      S: 1,
    };

    let monstersByGradeCount = this.options.stronger_monsters
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
        };

    while (true) {
      const monstersByGradeCountArray = Object.entries(monstersByGradeCount)
        .map(([k, v]) => [k, v] as [keyof typeof monster_grades, number])
        .filter(([k, v]) => v > 0);
      let monsterAmountDifference =
        categorySize -
        monstersByGradeCountArray.reduce((sum, [k, v]) => sum + v, 0);

      for (const [k, v] of monstersByGradeCountArray) {
        const increase =
          monsterGradesIncrease[k] <= monsterAmountDifference
            ? monsterGradesIncrease[k]
            : monsterAmountDifference;

        monstersByGradeCount[k] = v + increase;
        monsterAmountDifference -= increase;
        if (monsterAmountDifference == 0) break;
      }

      if (monsterAmountDifference == 0) break;
    }

    const res = Object.entries(monstersByGradeCount)
      .map(([k, v]) => [k, v] as [keyof typeof monster_grades, number])
      .map(([k, v]) => {
        const gradeCards = categoryCards.filter((card) =>
          monster_grades[k].some((a) => a == card.level)
        );

        if (!this.options.undeads) return this.getRandomCards(gradeCards, v);

        const undeads = this.getRandomCards(
          gradeCards.filter((card) => card.undeadRelated),
          v
        );
        if (undeads.length == v) return undeads;

        const undeadsIds = undeads.map((undeadCard) => undeadCard.id);

        return this.sortById([
          ...undeads,
          ...this.getRandomCards(
            gradeCards.filter((gradeCard) =>
              undeadsIds.every((undeadId) => undeadId !== gradeCard.id)
            ),
            v - undeads.length
          ),
        ]);
      })
      .flat();

    return this.sortById(res).sort((a, b) => a.level - b.level);
  };

  private getPortal = () => {
    const categorySize = this.deckSize["DOOR-PORTAL"];
    let categoryCards = this.cards.filter(
      (card) => card.cardType == "DOOR" && card.cardSubtype == "PORTAL"
    );

    const unique = [
      ...new Map(categoryCards.map((card) => [card.name, card])).values(),
    ];

    return this.getRandomCards(
      unique.length >= categorySize ? unique : categoryCards,
      categorySize
    );
  };

  private getGainLevel = () => {
    const categorySize = this.deckSize["TREASURE-GAIN_LVL"];
    let categoryCards = this.cards.filter(
      (card) => card.cardType == "TREASURE" && card.cardSubtype == "GAIN_LVL"
    );

    const withEffect = Math.ceil(categorySize / 3);
    const noEffect = categorySize - withEffect;

    return this.sortById([
      ...this.getRandomCards(
        categoryCards.filter((card) => card.withEffect),
        withEffect
      ),
      ...this.getRandomCards(
        categoryCards.filter((card) => !card.withEffect),
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
