import { T } from "@/translations";
import { Options } from "@/types";
import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";

const gameOptions = [
  "mounts",
  "hirelings",
  "ultramanchkins",
  "dungeons",
  "undeads",
  "stronger_monsters",
  "sharper_weapons",
  "extended_deck",
];

export default ({
  options,
  onChangeHandler,
}: {
  options: Options;
  onChangeHandler: (key: keyof Options) => void;
}) => {
  return (
    <>
      <Typography variant="h6">
        Выберите опции игры (рекомендуется максимум 2)
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2 }} textAlign={"left"}>
        {gameOptions.map((option) => (
          <Grid item xs={6} key={option}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options[option as keyof Options]}
                  onChange={() => onChangeHandler(option as keyof Options)}
                />
              }
              label={T(option)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
