import { cesarDecode, cesarEncode } from "@/coder";
import getDeck from "@/getDeck";
import { T } from "@/translations";
import { DECK_CARD_TYPES, DisplayCard, Options } from "@/types";
import { Download, LinkRounded, Replay } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
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
  const grouped: Record<string, any> = {
    DOOR: {
      RACE: [],
      CLASS: [],
      MODIFIER: [],
      MONSTER: [],
      MONSTER_BOOST: [],
      WALKING: [],
      CURSE: [],
      COMMON: [],
      CHEAT: [],
      PORTAL: [],
      PET: [],
    } as any,
    TREASURE: {
      ONE_HAND: [],
      TWO_HANDS: [],
      BOOTS: [],
      BODY: [],
      HAT: [],
      OTHER: [],
      FREE: [],
      RING: [],
      DICE: [],
      ONE_TIME: [],
      GAIN_LVL: [],
      HIRELING: [],
      HIRELING_BOOST: [],
      MOUNT_BOOST: [],
      GEAR_BOOST: [],
    },
  };

  data.forEach((card) => {
    const { cardType, cardSubtype, id, name, level } = card;
    const displayName = level > 0 ? `Уровень ${level} - ${name}` : name;

    grouped[cardType][cardSubtype].push({ id, name: displayName });
  });

  return grouped;
};

const CardsTable = ({
  title,
  data,
  reloadCategory,
}: {
  title: string;
  data: Record<string, DisplayCard[]>;
  reloadCategory: (type: string, subType: string) => void;
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
                sx={{
                  backgroundColor: "#f0f0f0",
                  fontWeight: "bold",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <a>
                    {T(`${title}-${subtype}`)} {`(${cards.length})`}
                  </a>
                  <IconButton
                    size="small"
                    style={{ marginLeft: "auto" }}
                    id="TableCategoryReload"
                    onClick={() => reloadCategory(title, subtype)}
                  >
                    <Replay />
                  </IconButton>
                </div>
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

const saveAs = async (ref: RefObject<HTMLElement>) => {
  const input = ref.current;
  if (!input) return;

  var buttons = document.querySelectorAll("#TableCategoryReload");

  buttons.forEach((button) => {
    (button as any).style.display = "none";
  });

  await html2canvas(input, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imgData;
    link.download = `deck_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  buttons.forEach((button) => {
    (button as any).style.removeProperty("display");
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
  const cardListRef = useRef(null) as any;

  useEffect(() => {
    fetch("/CARDS.json")
      .then((response) => response.json())
      .then((data) => setCards(data));
  }, []);

  useEffect(() => {
    // if (!queryDeck)
    setDeck(getDeck(cards, deckOptions));
    // else {
    //   const _deck: Record<string, any> = Object.fromEntries(
    //     cards.map((c) => [c.id, c])
    //   );

    //   setDeck(
    //     (cesarDecode(queryDeck).match(/.{1,4}/g) || [])
    //       .map((id) => _deck[id] && new DisplayCard(_deck[id]))
    //       .filter((a) => a)
    //   );
    // }
  }, [cards]);

  const reloadCategory = (type: string, subType: string) => {
    const newDeck = getDeck(cards, deckOptions);

    setDeck((prev) => [
      ...prev.filter(
        (c) => !(c.cardType === type && c.cardSubtype === subType)
      ),
      ...newDeck.filter(
        (c) => c.cardType === type && c.cardSubtype === subType
      ),
    ]);
  };

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
          {/* TODO: Update url generation logic */}
          {/* <Button
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
          </Button> */}
        </div>
      )}
      <div ref={cardListRef}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CardsTable
              title="DOOR"
              data={groupedData.DOOR}
              reloadCategory={reloadCategory}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardsTable
              title="TREASURE"
              data={groupedData.TREASURE}
              reloadCategory={reloadCategory}
            />
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};
