"use client";
import { Fragment, RefObject, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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
import { DisplayCard, Options } from "@/types";
import getDeck from "@/getDeck";
import html2canvas from "html2canvas";
import { Download, LinkRounded, Replay } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import { cesarDecode, cesarEncode } from "@/xor";

const initialOptions: Options = {
  mounts: false,
  hirelings: false,
  ultramanchkins: false,
  dungeons: false,
  undeads: false,
  stronger_monsters: false,
  sharper_weapons: false,
  extended_deck: false,
  cler: false,
  mage: false,
  warrior: false,
  thief: false,
  ranger: false,
  bard: false,
  dward: false,
  hafling: false,
  gnome: false,
  elf: false,
  ork: false,
  kent: false,
  lizard: false,
};

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

const T: Record<string, string> = {
  DOOR: "Карты дверей",
  TREASURE: "Карты сокровищ",
  "DOOR-WALKING": "Бродячие",
  "DOOR-CHEAT": "Читы",
  "DOOR-RACE": "Расы",
  "DOOR-CLASS": "Классы",
  "DOOR-MODIFIER": "Модификаторы расы и класса",
  "DOOR-MONSTER": "Монстры",
  "DOOR-COMMON": "Прочее",
  "DOOR-MONSTER_BOOST": "Усилители монстров",
  "DOOR-CURSE": "Проклятия",
  "DOOR-PORTAL": "Порталы",
  "DOOR-PET": "Скакуны и наемнички",
  "TREASURE-ONE_HAND": "1 рука",
  "TREASURE-TWO_HANDS": "2 руки",
  "TREASURE-BOOTS": "Обувки",
  "TREASURE-BODY": "Броники",
  "TREASURE-HAT": "Головняки",
  "TREASURE-OTHER": "Прочие шмотки",
  "TREASURE-RING": "Кольца",
  "TREASURE-DICE": "Кубики",
  "TREASURE-FREE": "Прочее",
  "TREASURE-ONE_TIME": "Одноразовые",
  "TREASURE-GAIN_LVL": "Получи уровень",
  "TREASURE-HIRELING_BOOST": "Усилители наемничков",
  "TREASURE-HIRELING": "Hаемнички",
  "TREASURE-MOUNT_BOOST": "Усилители скакунов",
  "TREASURE-GEAR_BOOST": "Усилители шмоток",
  mounts: "Скакуны",
  hirelings: "Hаемнички",
  ultramanchkins: "Ультраманчкины",
  dungeons: "Подземелья",
  undeads: "Андеды",
  stronger_monsters: "Опасные монстры",
  sharper_weapons: "Усиленные шмотки",
  extended_deck: "Большая колода",
  cler: "Клирики",
  mage: "Волшебники",
  warrior: "Воины",
  thief: "Воры",
  ranger: "Следопыты",
  bard: "Барды",
  dward: "Дварфы",
  hafling: "Хафлинги",
  gnome: "Гномы",
  elf: "Эльфы",
  ork: "Орки",
  lizard: "Ящерки",
  kent: "Кентавры",
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
      {T[title]}
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
                {T[`${title}-${subtype}`]} {`(${cards.length})`}
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

const Deck = ({
  deckOptions,
  imgRef: ref,
  queryDeck,
}: {
  deckOptions: Options;
  imgRef: RefObject<any>;
  queryDeck: string | null;
}) => {
  const [cards, setCards] = useState<any[]>([]);
  const [deck, setDeck] = useState<DisplayCard[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/DOORS.json").then((response) => response.json()),
      fetch("/TREASURES.json").then((response) => response.json()),
    ])
      .then((res) => res.flat() as any[])
      .then((data) => setCards(data))
      .catch((error) => console.error("Error loading cards:", error));
  }, []);

  useEffect(() => {
    if (
      !queryDeck
      // || queryDeck.length % 4 != 0
    )
      setDeck(getDeck(cards, deckOptions));
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

  const saveAs = () => {
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
            Переделать
          </Button>
          <Button
            variant="contained"
            onClick={saveAs}
            style={{ marginRight: 20, marginBottom: 20, width: 200 }}
            endIcon={<Download />}
          >
            Скачать .png
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
            Копировать URL
          </Button>
        </div>
      )}
      <div ref={ref}>
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

export default function DeckSetup() {
  const [step, setStep] = useState(1);
  const [options, setOptions] = useState<Options>(initialOptions);

  const router = useSearchParams();
  const queryDeck = router.get("deck");

  const handleToggle = (key: keyof Options) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
      ...(key == "undeads" ? { cler: !prev[key] } : {}),
    }));
  };

  const selectedClasses = () =>
    ["cler", "mage", "warrior", "thief", "ranger", "bard"].filter(
      (c) => options[c as keyof Options]
    );
  const selectedRaces = () =>
    ["dward", "hafling", "gnome", "elf", "ork", "kent", "lizard"].filter(
      (r) => options[r as keyof Options]
    );

  const handleNext = () => {
    if (step === 3 && selectedClasses().length !== 4) {
      alert("Please select exactly 4 classes.");
      return;
    }
    if (step === 2 && selectedRaces().length !== 4) {
      alert("Please select exactly 4 races.");
      return;
    }
    setStep(step + 1);
  };

  const ref = useRef(null);

  if (step === 4 || queryDeck)
    return <Deck deckOptions={options} imgRef={ref} queryDeck={queryDeck} />;

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        textAlign: "center",
      }}
      style={{ padding: 20 }}
    >
      <Box style={{ height: 500 }}>
        {/* Step 1: Select Game Options */}
        {step === 1 && (
          <>
            {" "}
            <Typography variant="h6">
              Выберите опции игры (рекомендуется максимум 2)
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }} textAlign={"left"}>
              {[
                "mounts",
                "hirelings",
                "ultramanchkins",
                "dungeons",
                "undeads",
                "stronger_monsters",
                "sharper_weapons",
                "extended_deck",
              ].map((option) => (
                <Grid item xs={6} key={option}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={options[option as keyof Options]}
                        onChange={() => handleToggle(option as keyof Options)}
                      />
                    }
                    label={T[option]}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Step 3: Select Classes (4 Required) */}
        {step === 3 && (
          <>
            <Typography
              variant="h6"
              color={selectedClasses().length !== 4 ? "error" : "textPrimary"}
            >
              Выберите классы ({selectedClasses().length}/4)
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }} textAlign={"left"}>
              {["cler", "mage", "warrior", "thief", "ranger", "bard"].map(
                (cls) => (
                  <Grid item xs={6} key={cls}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={options[cls as keyof Options]}
                          onChange={() => handleToggle(cls as keyof Options)}
                          disabled={
                            (cls === "cler" && options.undeads) ||
                            (!options[cls as keyof Options] &&
                              selectedClasses().length == 4)
                          } // Cleric always selected if undeads
                        />
                      }
                      label={T[cls]}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </>
        )}

        {step === 2 && (
          <>
            <Typography
              variant="h6"
              color={selectedRaces().length !== 4 ? "error" : "textPrimary"}
            >
              Выберите расы ({selectedRaces().length}/4)
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }} textAlign={"left"}>
              {[
                "dward",
                "hafling",
                "gnome",
                "elf",
                "ork",
                "lizard",
                "kent",
              ].map(
                (race) =>
                  !(race === "kent" && !options.mounts) && (
                    <Grid item xs={6} key={race}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={options[race as keyof Options]}
                            onChange={() => handleToggle(race as keyof Options)}
                          />
                        }
                        label={T[race]}
                        disabled={
                          !options[race as keyof Options] &&
                          selectedRaces().length == 4
                        }
                      />
                    </Grid>
                  )
              )}
            </Grid>
          </>
        )}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        {
          <Button
            variant="contained"
            onClick={() => setStep(step - 1)}
            style={{ visibility: step > 1 ? "visible" : "hidden" }}
          >
            Back
          </Button>
        }
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={
            (step === 3 && selectedClasses().length !== 4) ||
            (step === 2 && selectedRaces().length !== 4)
          }
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
