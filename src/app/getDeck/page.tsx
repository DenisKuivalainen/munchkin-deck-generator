"use client";
import { useCards } from "@/Components";
import { getDeck } from "@/deckGenerator";
import { Card } from "@/types";
import { Typography } from "@mui/material";

export default () => {
  const cards = useCards();

  console.log();

  return (
    <>
      {Object.entries(getDeck(cards)).map(([deck, types]) => (
        <>
          <Typography variant="h3">{deck}</Typography>
          {Object.entries(types as any).map(([type, _cards]) => (
            <>
              <Typography variant="h4">{type}</Typography>
              {((_cards || []) as any[])
                .map((c) => new Card(c))
                .map((c) => (
                  <p>
                    {c.name.ru.length ? c.name.ru : c.name.en}{" "}
                    {`(${c.subtype})`}
                    {" - "}
                    {c.reprints.map((r) => r.expansion).join(" ")}
                  </p>
                ))}
            </>
          ))}
        </>
      ))}
    </>
  );
};
