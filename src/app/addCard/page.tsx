"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Typography,
  Avatar,
  ListItemAvatar,
  SelectChangeEvent,
  Divider as MuiDivider,
  Button,
  FormControlLabel,
  Autocomplete,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
  Card,
  CardId,
  CharRelation,
  Deck,
  Expansion,
  Lang,
  Name,
  OtherRelation,
  Reprint,
  Subtype,
  Type,
  boostSubtypes,
  classes,
  curseSubtypes,
  doorsTypes,
  gearSubtypes,
  goUpALvlSubtypes,
  oneShotSubtypes,
  races,
  treasureTypes,
} from "@/types";
import axios from "axios";
import { cardFactory } from "@/cardFactory";
import _CARDS from "../../../public/CARDS.json";
const CARDS: Card[] = _CARDS.map((c: any) => new Card(c));

const DeckSelect = ({
  children,
  deck,
  setDeck,
}: {
  children: React.ReactNode;
  deck: Deck | undefined;
  setDeck: (deck: Deck) => void;
}) => {
  return (
    <>
      <FormControl margin="normal" fullWidth size="small">
        <InputLabel id="deck-label">Deck</InputLabel>
        <Select
          labelId="deck-label"
          id="demo-simple-select"
          value={deck}
          label="Deck"
          onChange={(e: SelectChangeEvent) => setDeck(e.target.value as Deck)}
        >
          {Object.values(Deck).map((v) => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {deck ? children : <></>}
    </>
  );
};

const TypeSelect = ({
  children,
  deck,
  type,
  setType,
}: {
  children: React.ReactNode;
  deck: Deck;
  type: Type | undefined;
  setType: (type: Type) => void;
}) => {
  const getTypes = () => {
    switch (deck) {
      case Deck.Door:
        return doorsTypes;
      case Deck.Treasure:
        return treasureTypes;
    }
  };

  return (
    <>
      <FormControl margin="normal" fullWidth size="small">
        <InputLabel id="deck-label">Type</InputLabel>
        <Select
          labelId="deck-label"
          id="demo-simple-select"
          value={type}
          label="Type"
          onChange={(e: SelectChangeEvent) => setType(e.target.value as Type)}
        >
          {getTypes().map((v) => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {type ? children : <></>}
    </>
  );
};

const SubtypeSelect = ({
  children,
  type,
  subtype,
  setSubtype,
}: {
  children: React.ReactNode;
  type: Type | undefined;
  subtype: Subtype | undefined;
  setSubtype: (subtype: Subtype) => void;
}) => {
  const [subtypes, _setSubtypes] = useState<Subtype[]>([]);
  const setSubtypes = <T,>(s: T) => _setSubtypes(s as Subtype[]);

  useEffect(() => {
    switch (type) {
      case Type.OneShot:
        setSubtypes(oneShotSubtypes);
        break;

      case Type.GoUpALvl:
        setSubtypes(goUpALvlSubtypes);
        break;

      case Type.Boost:
        setSubtypes(boostSubtypes);
        break;

      case Type.Gear:
        setSubtypes(gearSubtypes);
        break;

      case Type.Curse:
        setSubtypes(curseSubtypes);
        break;

      case Type.RoleModifier:
        setSubtypes(curseSubtypes);
        break;

      case Type.MonsterBoost:
        setSubtypes(curseSubtypes);
        break;

      default:
        setSubtypes([]);
        setSubtype(Subtype.None);
        break;
    }
  }, [type, subtype]);

  return (
    <>
      {subtypes.length ? (
        <FormControl margin="normal" fullWidth size="small">
          <InputLabel id="deck-label">Subtype</InputLabel>
          <Select
            labelId="deck-label"
            id="demo-simple-select"
            value={subtype}
            label="Subtype"
            onChange={(e: SelectChangeEvent) =>
              setSubtype(e.target.value as Subtype)
            }
          >
            {subtypes.map((v) => (
              <MenuItem value={v}>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <></>
      )}
      {subtype ? children : <></>}
    </>
  );
};

const NameInput = ({
  name,
  setName,
}: {
  name: Name;
  setName: React.Dispatch<React.SetStateAction<Name>>;
}) => {
  return (
    <>
      <Divider />
      {Object.entries(name)
        .map(([k, v]) => [k, v] as [Lang, string])
        .map(([k, v]) => (
          <>
            <TextField
              label={`Name in ${k}`}
              variant="outlined"
              value={v}
              onChange={(e) =>
                setName((prev) => ({
                  ...prev,
                  [k]: e.target.value,
                }))
              }
              size="small"
              fullWidth
              margin="normal"
            />
          </>
        ))}{" "}
      <Divider />
    </>
  );
};

const LevelInput = ({
  type,
  level,
  setLevel,
}: {
  type: Type;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}) => {
  switch (type) {
    case Type.OneShot:
    case Type.Gear:
    case Type.Monster:
      return (
        <>
          <TextField
            label="Level"
            type="number"
            variant="outlined"
            value={level.toString()}
            onChange={(e) => setLevel(parseInt(e.target.value) || 0)}
            size="small"
            fullWidth
            margin="normal"
          />
          <Divider />
        </>
      );

    default:
      return <></>;
  }
};

const Divider = () => <MuiDivider style={{ marginTop: 8 }} />;

const ReprintsInput = ({
  reprints,
  setReprints,
}: {
  reprints: Reprint[];
  setReprints: React.Dispatch<React.SetStateAction<Reprint[]>>;
}) => {
  const [newExpansion, setNewExpansion] = useState<Expansion>();

  useEffect(() => {
    if (!reprints.length) setNewExpansion(undefined);
  }, [reprints]);

  const addReprint = (expansion: Expansion) =>
    setReprints((prev) => [
      ...prev,
      { id: prev.length.toString().padStart(2, "0"), expansion },
    ]);

  const updateReprint = (id: string, expansion: Expansion) =>
    setReprints((prev) =>
      [...prev.filter((p) => p.id !== id), { id, expansion }].sort((a, b) =>
        a.id.localeCompare(b.id)
      )
    );

  return (
    <>
      <FormControl fullWidth margin="normal">
        <Box display="flex" alignItems="center" gap={1}>
          <Select
            size="small"
            style={{ width: 70, height: 56 }}
            value={newExpansion || ""}
            onChange={(e) => setNewExpansion(e.target.value as Expansion)}
            renderValue={() =>
              newExpansion ? (
                <Box display="flex" alignItems="center">
                  <Avatar
                    variant="square"
                    src={`icons/${newExpansion}.gif`}
                    alt={newExpansion}
                    sx={{ width: 23, height: 23 }}
                  />
                </Box>
              ) : (
                <></>
              )
            }
          >
            {Object.values(Expansion).map((expansion) => (
              <MenuItem key={expansion} value={expansion}>
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    src={`icons/${expansion}.gif`}
                    alt={expansion}
                  />
                </ListItemAvatar>
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="outlined"
            disabled={!newExpansion}
            onClick={() => {
              if (!newExpansion) return;
              addReprint(newExpansion);
              setNewExpansion(undefined);
            }}
            sx={{ height: 40 }}
          >
            Add
          </Button>
        </Box>
      </FormControl>
      <Typography variant="body2" style={{ marginTop: 8 }}>
        Coopies of card: {reprints.length}
      </Typography>
      <Grid container>
        {reprints.map((r) => (
          <Grid item xs={2}>
            <FormControl fullWidth margin="normal">
              <Select
                size="small"
                style={{ width: 70, height: 56 }}
                value={r.expansion}
                onChange={(e) =>
                  updateReprint(r.id, e.target.value as Expansion)
                }
                renderValue={(selected) =>
                  selected ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        variant="square"
                        src={`icons/${selected}.gif`}
                        alt={selected}
                        sx={{ width: 23, height: 23 }}
                      />
                    </Box>
                  ) : (
                    <></>
                  )
                }
              >
                {Object.values(Expansion).map((expansion) => (
                  <MenuItem key={expansion} value={expansion}>
                    <ListItemAvatar>
                      <Avatar
                        variant="square"
                        src={`icons/${expansion}.gif`}
                        alt={expansion}
                      />
                    </ListItemAvatar>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>
      <Divider />
    </>
  );
};

const CharRelationSelect = ({
  type,
  charRelations,
  setCharRelations,
}: {
  type: Type;
  charRelations: CharRelation[];
  setCharRelations: React.Dispatch<React.SetStateAction<CharRelation[]>>;
}) => {
  const isSingleSelect = type === Type.Class || type === Type.Race;

  const handleToggle = (relation: CharRelation) => {
    if (isSingleSelect) {
      setCharRelations((prev) => (prev.length ? [] : [relation]));
    } else {
      if (charRelations.includes(relation)) {
        setCharRelations(charRelations.filter((r) => r !== relation));
      } else {
        setCharRelations([...charRelations, relation]);
      }
    }
  };

  const getItems = () => {
    switch (type) {
      case Type.Class:
        return classes;
      case Type.Race:
        return races;
      default:
        return Object.values(CharRelation);
    }
  };

  return (
    <>
      <FormControl component="fieldset" fullWidth>
        <Grid container spacing={1}>
          {getItems().map((relation) => (
            <Grid item xs={6} sm={4} md={3} key={relation}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={charRelations.includes(relation)}
                    onChange={() => handleToggle(relation)}
                    disabled={
                      isSingleSelect &&
                      charRelations.length === 1 &&
                      !charRelations.includes(relation)
                    }
                  />
                }
                label={relation}
              />
            </Grid>
          ))}
        </Grid>
      </FormControl>
      <Divider />
    </>
  );
};

const OtherRelationSelect = ({
  otherRelations,
  setOtherRelations,
}: {
  otherRelations: OtherRelation[];
  setOtherRelations: React.Dispatch<React.SetStateAction<OtherRelation[]>>;
}) => {
  const handleToggle = (relation: OtherRelation) => {
    if (otherRelations.includes(relation)) {
      setOtherRelations(otherRelations.filter((r) => r !== relation));
    } else {
      setOtherRelations([...otherRelations, relation]);
    }
  };

  return (
    <>
      <FormControl component="fieldset" fullWidth>
        <Grid container spacing={1}>
          {Object.values(OtherRelation).map((relation) => (
            <Grid item xs={6} sm={4} md={3} key={relation}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={otherRelations.includes(relation)}
                    onChange={() => handleToggle(relation)}
                  />
                }
                label={relation}
              />
            </Grid>
          ))}
        </Grid>
      </FormControl>
      <Divider />
    </>
  );
};

const Required = ({
  required,
  setRequired,
}: {
  required: CardId[];
  setRequired: React.Dispatch<React.SetStateAction<CardId[]>>;
}) => {
  const selectedValues = CARDS.filter((c) => required.includes(c.id));

  return (
    <>
      <Box sx={{ width: 600, marginTop: "16px", marginBottom: "8px" }}>
        <Autocomplete
          multiple
          options={CARDS}
          getOptionLabel={(option) => option.name.en}
          value={selectedValues}
          onChange={(e, newValue) => {
            const newIds = newValue.map((item) => item.id);
            setRequired(newIds);
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option.name.en}
                {...getTagProps({ index })}
                key={option.id}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Select Items"
              placeholder="Search..."
            />
          )}
          filterSelectedOptions
        />
      </Box>
      <Divider />
    </>
  );
};

export default () => {
  const [selectedDeck, setSelectedDeck] = useState<Deck>();
  const [selectedType, setSelectedType] = useState<Type>();
  const [selectedSybtype, setSelectedSubtype] = useState<Subtype>();
  const defaultName = Object.fromEntries(
    Object.values(Lang).map((e) => [e, ""] as [Lang, string])
  ) as Name;
  const [name, setName] = useState<Name>(defaultName);
  const [level, setLevel] = useState<number>(0);
  const [reprints, setReprints] = useState<Reprint[]>([]);
  const [charRelations, setCharRelations] = useState<CharRelation[]>([]);
  const [otherRelations, setOtherRelations] = useState<OtherRelation[]>([]);
  const [required, setRequired] = useState<CardId[]>([]);

  useEffect(() => setSelectedType(undefined), [selectedDeck]);
  useEffect(() => setSelectedSubtype(undefined), [selectedType]);
  useEffect(() => {
    setName(defaultName);
    setLevel(0);
    setReprints([]);
    setCharRelations([]);
  }, [selectedSybtype]);

  const saveCard = () => {
    const card = cardFactory({
      deck: selectedDeck!,
      type: selectedType!,
      subtype: selectedSybtype!,
      name,
      id: "",
      level,
      reprints,
      char_relations: charRelations,
      other_relations: otherRelations,
      required,
    });

    axios.post("/api/addCard", card).then(() => window.location.reload());
  };

  return (
    <Box p={4} maxWidth={600} mx="auto">
      <DeckSelect deck={selectedDeck} setDeck={setSelectedDeck}>
        <TypeSelect
          deck={selectedDeck as Deck}
          type={selectedType}
          setType={setSelectedType}
        >
          <SubtypeSelect
            type={selectedType}
            subtype={selectedSybtype}
            setSubtype={setSelectedSubtype}
          >
            <NameInput name={name} setName={setName} />
            <LevelInput
              type={selectedType as Type}
              level={level}
              setLevel={setLevel}
            />
            <ReprintsInput reprints={reprints} setReprints={setReprints} />
            <CharRelationSelect
              type={selectedType as Type}
              charRelations={charRelations}
              setCharRelations={setCharRelations}
            />
            <OtherRelationSelect
              otherRelations={otherRelations}
              setOtherRelations={setOtherRelations}
            />
            <Required required={required} setRequired={setRequired} />
            {name.en.length && reprints.length ? (
              <Button onClick={saveCard}>Add card</Button>
            ) : (
              <></>
            )}
          </SubtypeSelect>
        </TypeSelect>
      </DeckSelect>
    </Box>
  );
};
