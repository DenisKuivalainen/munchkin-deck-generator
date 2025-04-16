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
  monsterBoostSubtypes,
  oneShotSubtypes,
  races,
  roleModifierSubtypes,
  treasureTypes,
} from "@/types";
import axios from "axios";
import { cardFactory } from "@/cardFactory";
import _CARDS from "../public/CARDS.json";
import { enToRu } from "@/translator";
import { useRouter } from "next/navigation";
import { _Object } from "./objectHelpers";

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    axios
      .get(`${window.location.origin}/CARDS.json`)
      .then((res) => res.data)
      .then((data) => data.map((d: any) => new Card(d)))
      .then((data) => setCards(data));
  }, []);

  return cards;
};

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
          value={deck ?? ""}
          label="Deck"
          onChange={(e: SelectChangeEvent) => setDeck(e.target.value as Deck)}
        >
          {_Object.values(Deck).map((v) => (
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
  const [types, setTypes] = useState<Type[]>([]);

  useEffect(() => {
    switch (deck) {
      case Deck.Door:
        setTypes([...doorsTypes]);
        break;
      case Deck.Treasure:
        setTypes([...treasureTypes]);
        break;
      default:
        setTypes([]);
        setType(Type.None);
        break;
    }
  }, []);

  return (
    <>
      {types.length ? (
        <FormControl margin="normal" fullWidth size="small">
          <InputLabel id="deck-label">Type</InputLabel>
          <Select
            labelId="deck-label"
            id="demo-simple-select"
            value={type}
            label="Type"
            onChange={(e: SelectChangeEvent) => setType(e.target.value as Type)}
          >
            {types.map((v) => (
              <MenuItem value={v}>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <></>
      )}
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
        setSubtypes(roleModifierSubtypes);
        break;

      case Type.MonsterBoost:
        setSubtypes(monsterBoostSubtypes);
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
      {_Object
        .entries(name)
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
                  [k]: k === Lang.Ru ? enToRu(e.target.value) : e.target.value,
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
            style={{ width: 70 }}
            value={newExpansion || ""}
            onChange={(e) => setNewExpansion(e.target.value as Expansion)}
            renderValue={() =>
              newExpansion ? (
                <Avatar
                  variant="square"
                  src={`${window.location.origin}/icons/${newExpansion}.gif`}
                  alt={newExpansion}
                  sx={{ height: 23 }}
                />
              ) : (
                <></>
              )
            }
          >
            {_Object.values(Expansion).map((expansion) => (
              <MenuItem key={expansion} value={expansion}>
                <Avatar
                  variant="square"
                  src={`${window.location.origin}/icons/${expansion}.gif`}
                  alt={expansion}
                  sx={{ height: 23 }}
                />
                {expansion}
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
                style={{ width: 70 }}
                value={r.expansion}
                onChange={(e) =>
                  updateReprint(r.id, e.target.value as Expansion)
                }
                renderValue={(selected) =>
                  selected ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        variant="square"
                        src={`${window.location.origin}/icons/${selected}.gif`}
                        alt={selected}
                        sx={{ height: 23 }}
                      />
                    </Box>
                  ) : (
                    <></>
                  )
                }
              >
                {_Object.values(Expansion).map((expansion) => (
                  <MenuItem key={expansion} value={expansion}>
                    <Avatar
                      variant="square"
                      src={`${window.location.origin}/icons/${expansion}.gif`}
                      alt={expansion}
                      sx={{ height: 23 }}
                    />
                    {expansion}
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

  const renderGroup = (items: CharRelation[]) =>
    items.map((relation) => (
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
    ));

  const join = (arrays: React.JSX.Element[][]): React.JSX.Element[] => {
    return arrays.reduce((acc, curr) => {
      if (!acc.length) return curr;
      return [
        ...acc,
        <Grid item xs={12}>
          <div style={{ height: 16 }} />
        </Grid>,
        ...curr,
      ];
    }, []);
  };

  const getElements = () => {
    switch (type) {
      case Type.Class:
        return renderGroup(classes);
      case Type.Race:
        return renderGroup(races);

      default:
        return join(
          [
            classes,
            races,
            _Object
              .values(CharRelation)
              .filter((r) => !classes.includes(r) && !races.includes(r)),
          ].map((r) => renderGroup(r))
        );
    }
  };

  return (
    <>
      <FormControl component="fieldset" fullWidth>
        <Grid container>{getElements()}</Grid>
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
  const cards = useCards();
  const selectedValues = cards.filter((c) => required.includes(c.id));

  return (
    <>
      <Box sx={{ width: 600, marginTop: "16px", marginBottom: "8px" }}>
        <Autocomplete
          multiple
          options={cards}
          getOptionLabel={(option) =>
            option.name.ru.length ? option.name.ru : option.name.en
          }
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
                size="small"
                label={option.name.ru.length ? option.name.ru : option.name.en}
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

export const CardEditor = ({
  cardId,
  onSave,
}: {
  cardId?: CardId;
  onSave: (card: Card) => Promise<void> | void;
}) => {
  const router = useRouter();
  const cards = useCards();
  const [isCardLoading, setIsCardLoading] = useState(true);

  const [selectedDeck, setSelectedDeck] = useState<Deck>();
  const [selectedType, setSelectedType] = useState<Type>();
  const [selectedSybtype, setSelectedSubtype] = useState<Subtype>();
  const defaultName = _Object.fromEntries(
    _Object.values(Lang).map((l) => [l, ""] as [Lang, string])
  ) as Name;
  const [name, setName] = useState<Name>(defaultName);
  const [id, setId] = useState<CardId>("");
  const [level, setLevel] = useState<number>(0);
  const [reprints, setReprints] = useState<Reprint[]>([]);
  const [charRelations, setCharRelations] = useState<CharRelation[]>([]);
  const [otherRelations, setOtherRelations] = useState<OtherRelation[]>([]);
  const [required, setRequired] = useState<CardId[]>([]);

  useEffect(() => {
    if (!cards.length) return;
    if (!cardId) return setIsCardLoading(false);

    const card = cards.find((c) => c.id === cardId);
    if (!card) {
      router.push("/404");
      return;
    }

    setSelectedDeck(card.deck);
    setSelectedType(card.type);
    setSelectedSubtype(card.subtype);
    setName(card.name);
    setId(card.id);
    setLevel(card.level);
    setReprints(card.reprints);
    setCharRelations(card.char_relations);
    setOtherRelations(card.other_relations);
    setRequired(card.required);

    setTimeout(() => setIsCardLoading(false), 0);
  }, [cards]);
  useEffect(() => {
    if (isCardLoading) return;
    setSelectedType(undefined);
  }, [selectedDeck]);
  useEffect(() => {
    if (isCardLoading) return;
    setSelectedSubtype(undefined);
  }, [selectedType]);
  useEffect(() => {
    if (isCardLoading || cardId) return;

    setLevel(0);
    setReprints([]);
    setCharRelations([]);
    setOtherRelations([]);
  }, [selectedSybtype]);

  const saveCard = async () => {
    const card = cardFactory({
      deck: selectedDeck!,
      type: selectedType!,
      subtype: selectedSybtype!,
      name,
      id,
      level,
      reprints,
      char_relations: charRelations,
      other_relations: otherRelations,
      required,
    });

    await onSave(card);

    router.back();
  };

  const matchingCard = cards.find((c) => c.name.en === name.en);

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
            {matchingCard && matchingCard.id !== cardId ? (
              <div style={{ marginTop: 16 }}>
                <Typography color="error">
                  Card with such name already exists, edit it instead
                </Typography>
                <Button
                  onClick={() => router.push(`/editCard/${matchingCard.id}`)}
                  color="error"
                  variant="contained"
                >
                  Edit "{matchingCard.name.en}" card
                </Button>
              </div>
            ) : (
              <></>
            )}
            {name.en.length && reprints.length ? (
              <Button
                onClick={saveCard}
                variant="contained"
                style={{ marginTop: 16, marginBottom: 40 }}
              >
                Save card
              </Button>
            ) : (
              <></>
            )}
          </SubtypeSelect>
        </TypeSelect>
      </DeckSelect>
    </Box>
  );
};
