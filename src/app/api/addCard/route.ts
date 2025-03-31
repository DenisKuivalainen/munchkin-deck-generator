"use server";

import { Card } from "@/types";
import fs from "fs";

const getIdPrefix = (c: any) => {
  let subtype = "";

  if (c.cardSubtype.includes("_")) {
    let parts = c.cardSubtype.split("_");
    subtype = parts[0].slice(0, 2) + parts[1].slice(0, 1);
  } else {
    subtype = c.cardSubtype.slice(0, 3);
  }

  return `${c.cardType.slice(0, 1)}${subtype}`;
};

const getId = (card: any, cards: any[]) => {
  const idPrefix = getIdPrefix(card);
  const idNumber =
    card.cardType == "DOOR" && card.cardSubtype == "MONSTER"
      ? cards.filter((c) => c.id.startsWith(idPrefix) && c.level == card.level)
          .length +
        1 +
        (card.level - 1) * 50
      : cards.filter((c) => c.id.startsWith(idPrefix)).length + 1;

  return `${idPrefix}_${idNumber.toString().padStart(3, "0")}`;
};

export async function POST(req: any) {
  try {
    const card = await req.json();
    const cards = JSON.parse(fs.readFileSync(`public/CARDS.json`).toString());

    fs.writeFileSync(
      `public/CARDS.json`,
      JSON.stringify(
        [
          ...cards,
          new Card({
            ...card,
            id: getId(card, cards),
          }),
        ],
        null,
        2
      )
    );

    return Response.json({ message: "Data received", receivedData: card });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
