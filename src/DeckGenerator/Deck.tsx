import { cesarDecode, cesarEncode } from "@/coder";
import getDeck from "@/getDeck";
import { T } from "@/translations";
import { DisplayCard, Options } from "@/types";
import { Download, LinkRounded, Replay } from "@mui/icons-material";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import html2canvas from "html2canvas";
import { Fragment, RefObject, useEffect, useRef, useState } from "react";

const categorizeData = (data: DisplayCard[]) => {
  const grouped: Record<string, any> = { DOOR: {} as any, TREASURE: {} as any };

  data.forEach((card) => {
    const { cardType, cardSubtype, id, name, level } = card;
    const displayName = level > 0 ? `Уровень ${level} - ${name}` : name;

    if (!grouped[cardType][cardSubtype]) {
      grouped[cardType][cardSubtype] = [];
    }

    grouped[cardType][cardSubtype].push({ id, name: displayName });
  });

  return grouped;
};

const CardsTable = ({
  title,
  data,
}: {
  title: string;
  data: Record<string, DisplayCard[]>;
}) => (
  <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
    <Typography variant="h6" sx={{ padding: 2 }}>
      {T(title)}
    </Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell style={{ width: 40 }}>ID</TableCell>
          <TableCell>Название</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(data).map(([subtype, cards]) => (
          <Fragment key={subtype}>
            <TableRow>
              <TableCell
                colSpan={2}
                sx={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}
              >
                {T(`${title}-${subtype}`)} {`(${cards.length})`}
              </TableCell>
            </TableRow>
            {cards.map(({ id, name }) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{name}</TableCell>
              </TableRow>
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const saveAs = (ref: RefObject<any>) => {
  const input = ref.current;
  html2canvas(input as any, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imgData;
    link.download = `deck_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

export default ({
  deckOptions,
  queryDeck,
}: {
  deckOptions: Options;
  queryDeck: string | null;
}) => {
  const [cards, setCards] = useState<any[]>([]);
  const [deck, setDeck] = useState<DisplayCard[]>([]);
  const cardListRef = useRef(null);

  useEffect(() => {
    fetch("/CARDS.json")
      .then((response) => response.json())
      .then((data) => setCards(data));
  }, []);

  useEffect(() => {
    if (!queryDeck) setDeck(getDeck(cards, deckOptions));
    else {
      const _deck: Record<string, any> = Object.fromEntries(
        cards.map((c) => [c.id, c])
      );

      setDeck(
        (cesarDecode(queryDeck).match(/.{1,4}/g) || [])
          .map((id) => _deck[id] && new DisplayCard(_deck[id]))
          .filter((a) => a)
      );
    }
  }, [cards]);

  if (cards.length == 0) return <></>;

  const groupedData = categorizeData(deck);

  return (
    <Paper elevation={0} style={{ padding: 20 }}>
      {queryDeck ? (
        <></>
      ) : (
        <div style={{ textAlign: "right" }}>
          <Button
            variant="contained"
            onClick={() => setDeck(getDeck(cards, deckOptions))}
            style={{ marginRight: 20, marginBottom: 20, width: 200 }}
            endIcon={<Replay />}
          >
            {T("redo")}
          </Button>
          <Button
            variant="contained"
            onClick={() => saveAs(cardListRef)}
            style={{ marginRight: 20, marginBottom: 20, width: 200 }}
            endIcon={<Download />}
          >
            {T("download")}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              navigator?.clipboard?.writeText(
                `${window.location.protocol}//${
                  window.location.host
                }?deck=${cesarEncode(deck.map((c) => c.id).join(""))}`
              );
            }}
            style={{ marginRight: 20, marginBottom: 20, width: 200 }}
            endIcon={<LinkRounded />}
          >
            {T("copyUrl")}
          </Button>
        </div>
      )}
      <div ref={cardListRef}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CardsTable title="DOOR" data={groupedData.DOOR} />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardsTable title="TREASURE" data={groupedData.TREASURE} />
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};
