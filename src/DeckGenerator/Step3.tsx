import { T } from "@/translations";
import { Options } from "@/types";
import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";

const classes = ["cler", "mage", "warrior", "thief", "ranger", "bard"];

export const selectedClasses = (options: Options) =>
  classes.filter((c) => options[c as keyof Options]);

export default ({
  options,
  onChangeHandler,
}: {
  options: Options;
  onChangeHandler: (key: keyof Options) => void;
}) => {
  const selected = selectedClasses(options);

  return (
    <>
      <Typography
        variant="h6"
        color={selected.length !== 4 ? "error" : "textPrimary"}
      >
        Выберите классы ({selected.length}/4)
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2 }} textAlign={"left"}>
        {["cler", "mage", "warrior", "thief", "ranger", "bard"].map((cls) => (
          <Grid item xs={6} key={cls}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options[cls as keyof Options]}
                  onChange={() => onChangeHandler(cls as keyof Options)}
                  disabled={
                    (cls === "cler" && options.undeads) ||
                    (!options[cls as keyof Options] && selected.length == 4)
                  } // Cleric always selected if undeads
                />
              }
              label={T(cls)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
