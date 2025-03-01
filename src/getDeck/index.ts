import { Options } from "@/types";
import deckSetup from "./deckSetup";
import { GenerateDeck } from "./generateDeck";

export default (input: any[], options: Options) => {
  const { cards, deckSize } = deckSetup(input, options);

  return new GenerateDeck(cards, deckSize, options).deck;
};
