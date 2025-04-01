"use client";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { T } from "@/translations";

export default () => {
  const [search, setSearch] = useState<string>("");
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    fetch("/CARDS.json")
      .then((response) => response.json())
      .then((data) => setCards(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards
              .sort((a, b) => {
                const [prefixA, numA] = a.id.split("_");
                const [prefixB, numB] = b.id.split("_");

                if (prefixA === prefixB) {
                  return Number(numA) - Number(numB);
                }

                return prefixA.localeCompare(prefixB);
              })
              .filter(
                (c) =>
                  c.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                  c.id.toLowerCase().indexOf(search.toLowerCase()) !== -1
              )
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    {row.level > 0
                      ? `Уровень ${row.level} - ${row.name}`
                      : row.name}
                  </TableCell>
                  <TableCell>
                    {T(row.cardType)} -{" "}
                    {T(`${row.cardType}-${row.cardSubtype}`)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
