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
  const grouped = { DOOR: {}, TREASURE: {} };

  data.forEach((card) => {
    const { cardType, cardSubtype, id, name, level } = card;
    const displayName = level > 0 ? `Level ${level} - ${name}` : name;

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
      {title}
    </Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
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
                {subtype} {`(${cards.length})`}
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
}: {
  deckOptions: Options;
  imgRef: RefObject<any>;
}) => {
  const [cards, setCards] = useState<any>([]);

  useEffect(() => {
    Promise.all([
      fetch("/DOORS.json").then((response) => response.json()),
      fetch("/TREASURES.json").then((response) => response.json()),
    ])
      .then((res) => res.flat() as any[])
      .then((data) => setCards(data))
      .catch((error) => console.error("Error loading cards:", error));
  }, []);

  if (cards.length == 0) return <></>;

  const cardsData = getDeck(cards, deckOptions);

  const groupedData = categorizeData(cardsData);

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
    <div style={{ padding: 40 }}>
      <Button variant="contained" onClick={saveAs} style={{ marginBottom: 20 }}>
        Download
      </Button>
      <div ref={ref}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CardsTable title="Doors" data={groupedData.DOOR} />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardsTable title="Treasures" data={groupedData.TREASURE} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default function DeckSetup() {
  const [step, setStep] = useState(1);
  const [options, setOptions] = useState<Options>(initialOptions);

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

  if (step === 4) return <Deck deckOptions={options} imgRef={ref} />;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, textAlign: "center" }}>
      <Box style={{ height: 500 }}>
        {/* Step 1: Select Game Options */}
        {step === 1 && (
          <>
            {" "}
            <Typography variant="h6">
              Select Game Options (recomended maximum 2)
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
                <Grid item xs={4} key={option}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={options[option as keyof Options]}
                        onChange={() => handleToggle(option as keyof Options)}
                      />
                    }
                    label={(
                      option.charAt(0).toUpperCase() + option.slice(1)
                    ).replace("_", " ")}
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
              Select exactly 4 classes ({selectedClasses().length}/4)
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
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
                      label={cls.charAt(0).toUpperCase() + cls.slice(1)}
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
              Select exactly 4 races ({selectedRaces().length}/4)
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {[
                "dward",
                "hafling",
                "gnome",
                "elf",
                "ork",
                "kent",
                "lizard",
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
                        label={race.charAt(0).toUpperCase() + race.slice(1)}
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
