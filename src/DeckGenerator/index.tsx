import { Options } from "@/types";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import Step3, { selectedClasses } from "./Step3";
import Step2, { selectedRaces } from "./Step2";
import { T } from "@/translations";
import Step1 from "./Step1";
import { useSearchParams } from "next/navigation";
import Deck from "./Deck";

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

const Steps = ({
  step,
  options,
  onChangeHandler,
}: {
  step: number;
  options: Options;
  onChangeHandler: (key: keyof Options) => void;
}) => {
  switch (step) {
    case 1:
      return <Step1 options={options} onChangeHandler={onChangeHandler} />;
    case 2:
      return <Step2 options={options} onChangeHandler={onChangeHandler} />;
    case 3:
      return <Step3 options={options} onChangeHandler={onChangeHandler} />;
    default:
      return <></>;
  }
};

export default () => {
  const [step, setStep] = useState(1);
  const [options, setOptions] = useState<Options>(initialOptions);

  const router = useSearchParams();
  const queryDeck = router.get("deck");

  const onChangeHandler = (key: keyof Options) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
      ...(key == "undeads" ? { cler: !prev[key] } : {}),
    }));
  };

  if (step === 4 || queryDeck)
    return <Deck deckOptions={options} queryDeck={queryDeck} />;

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
        <Steps
          step={step}
          options={options}
          onChangeHandler={onChangeHandler}
        />
      </Box>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        {
          <Button
            variant="contained"
            onClick={() => setStep((prev) => prev - 1)}
            style={{ visibility: step > 1 ? "visible" : "hidden" }}
          >
            {T("back")}
          </Button>
        }
        <Button
          variant="contained"
          color="primary"
          onClick={() => setStep((prev) => prev + 1)}
          disabled={
            (step === 3 && selectedClasses(options).length !== 4) ||
            (step === 2 && selectedRaces(options).length !== 4)
          }
        >
          {T("continue")}
        </Button>
      </Box>
    </Box>
  );
};
