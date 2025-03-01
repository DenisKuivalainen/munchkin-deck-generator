import { Card } from "@/types";
import fs from "fs";

export async function POST(req: any) {
  try {
    const body = await req.json();
    const json = JSON.parse(
      fs.readFileSync(`public/${body.cardType}S.json`).toString()
    );

    fs.writeFileSync(
      `public/${body.cardType}S.json`,
      JSON.stringify(
        [
          ...json,
          new Card({
            ...body,
            id: `${body.cardType.slice(0, 1)}${(json.length + 1)
              .toString()
              .padStart(3, "0")}`,
          }),
        ],
        null,
        2
      )
    );

    return Response.json({ message: "Data received", receivedData: body });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
