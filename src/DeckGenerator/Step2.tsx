import { T } from "@/translations";
import { Options } from "@/types";
import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";

const races = ["dward", "hafling", "gnome", "elf", "ork", "lizard", "kent"];

export const selectedRaces = (options: Options) =>
  ["dward", "hafling", "gnome", "elf", "ork", "kent", "lizard"].filter(
    (r) => options[r as keyof Options]
  );

export default ({
  options,
  onChangeHandler,
}: {
  options: Options;
  onChangeHandler: (key: keyof Options) => void;
}) => {
  const selected = selectedRaces(options);

  return (
    <>
      <Typography
        variant="h6"
        color={selected.length !== 4 ? "error" : "textPrimary"}
      >
        Выберите расы ({selected.length}/4)
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2 }} textAlign={"left"}>
        {races.map(
          (race) =>
            !(race === "kent" && !options.mounts) && (
              <Grid item xs={6} key={race}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options[race as keyof Options]}
                      onChange={() => onChangeHandler(race as keyof Options)}
                    />
                  }
                  label={T(race)}
                  disabled={
                    !options[race as keyof Options] && selected.length == 4
                  }
                />
              </Grid>
            )
        )}
      </Grid>
    </>
  );
};
