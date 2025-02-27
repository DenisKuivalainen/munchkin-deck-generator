"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export default () => {
  const [formData, setFormData] = useState<
    Record<string, string | number | boolean>
  >({
    cardType: "",
    cardSubtype: "",
    name: "",
    level: 0,
    undeadRelated: false,
    mountRelated: false,
    hirelingRelated: false,
    clerRelated: false,
    thiefRelated: false,
    warriorRelated: false,
    mageRelated: false,
    rangerRelated: false,
    bardRelated: false,
    dwarfRelated: false,
    haflingRelated: false,
    gnomeRelated: false,
    orkRelated: false,
    elfRelated: false,
    kentRelated: false,
    lizardRelated: false,
    classModifier: false,
    raceModifier: false,
    isHireling: false,
    isMount: false,
    unused: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          mx: "auto",
          boxShadow: 3,
          padding: "10 !important",
        }}
      >
        <CardContent>
          <TextField
            select
            label="Card Type"
            name="cardType"
            value={formData.cardType}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="" sx={{ display: "none" }} />{" "}
            <MenuItem key="DOOR" value="DOOR">
              DOOR
            </MenuItem>
            <MenuItem key="TREASURE" value="TREASURE">
              TREASURE
            </MenuItem>
          </TextField>
          <TextField
            select
            name="cardSubtype"
            value={formData.cardSubtype}
            onChange={handleChange}
            label="Card Subtype"
            fullWidth
            margin="normal"
            disabled={!(formData.cardType as string).length}
          >
            <MenuItem value="" sx={{ display: "none" }} />
            {(formData.cardType === ""
              ? []
              : formData.cardType === "DOOR"
              ? [
                  "WALKING",
                  "CHEAT",
                  "PORTAL",
                  "RACE",
                  "CLASS",
                  "MODIFIER",
                  "PET",
                  "MONSTER",
                  "COMMON",
                  "MONSTER_BOOST",
                  "CURSE",
                ]
              : [
                  "ONE_HAND",
                  "TWO_HANDS",
                  "BOOTS",
                  "BODY",
                  "HAT",
                  "OTHER",
                  "RING",
                  "DICE",
                  "FREE",
                  "HIRELING_BOOST",
                  "HIRELING",
                  "MOUNT_BOOST",
                  "GEAR_BOOST",
                  "ONE_TIME",
                  "GAIN_LVL",
                ]
            ).map((k) => (
              <MenuItem key={`${formData.cardType}-${k}`} value={k}>
                {k}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            onFocus={(e) => e.target.select()}
            fullWidth
            margin="normal"
            type="number"
            disabled={
              !(
                formData.cardType === "DOOR" &&
                formData.cardSubtype === "MONSTER"
              )
            }
          />

          <Grid container key="qweqwe">
            {["undeadRelated", "mountRelated", "hirelingRelated"].map((key) => (
              <Grid item xs={4} key={key}>
                {" "}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData[key] as boolean}
                      onChange={handleChange}
                      name={key}
                    />
                  }
                  label={key
                    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                    .toLowerCase()}
                />
              </Grid>
            ))}
          </Grid>
          <Divider />
          <Grid container key="asasd">
            {[
              "clerRelated",
              "thiefRelated",
              "warriorRelated",
              "mageRelated",
              "rangerRelated",
              "bardRelated",
            ].map((key) => (
              <Grid item xs={4} key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData[key] as boolean}
                      onChange={handleChange}
                      name={key}
                    />
                  }
                  label={key
                    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                    .toLowerCase()}
                />
              </Grid>
            ))}
          </Grid>
          <Divider />
          <Grid container key="zcxzxc">
            {[
              "dwarfRelated",
              "haflingRelated",
              "gnomeRelated",
              "orkRelated",
              "elfRelated",
              "kentRelated",
              "lizardRelated",
            ].map((key) => (
              <Grid item xs={4} key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData[key] as boolean}
                      onChange={handleChange}
                      name={key}
                    />
                  }
                  label={key
                    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                    .toLowerCase()}
                />
              </Grid>
            ))}
          </Grid>
          <Divider />
          <Grid container style={{ marginBottom: 20 }} key="sdfsdf">
            {[
              "classModifier",
              "raceModifier",
              "isHireling",
              "isMount",
              "unused",
            ].map((key) => (
              <Grid item xs={4} key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData[key] as boolean}
                      onChange={handleChange}
                      name={key}
                    />
                  }
                  label={key
                    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                    .toLowerCase()}
                />
              </Grid>
            ))}
          </Grid>

          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            disabled={
              (formData.cardType as string).length === 0 ||
              (formData.cardSubtype as string).length === 0 ||
              (formData.name as string).length === 0 ||
              (formData.cardType === "DOOR" &&
                formData.cardSubtype === "MONSTER" &&
                (formData.level == 0 || (formData.level as number) > 20))
            }
          >
            Submit
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
