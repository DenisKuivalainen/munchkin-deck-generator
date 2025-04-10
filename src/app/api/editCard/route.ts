"use server";

import { Card } from "@/types";
import fs from "fs";

export async function POST(req: any) {
  try {
    const cards: Card[] = JSON.parse(
      fs.readFileSync(`public/CARDS.json`).toString()
    ).map((c: any) => new Card(c));

    const data = await req.json();
    const card: Card = new Card(data);

    if (!cards.find((c) => c.id === card.id)) {
      console.log(cards.find((c) => c.id === card.id));
      throw Error();
    }

    fs.writeFileSync(
      `public/CARDS.json`,
      JSON.stringify(
        cards.map((c) => (c.id === card.id ? card : c)),
        null,
        2
      )
    );

    return Response.json({ message: "Data received", receivedData: card });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
