"use client";

import { useCards } from "@/Components";
import { Expansion } from "@/types";
import {
  Card,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default () => {
  const [search, setSearch] = useState("");

  const cards = useCards();
  const router = useRouter();

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#fff",
          zIndex: 2,
          padding: "8px 0",
        }}
      >
        <TextField
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          sx={{ marginBottom: 2 }}
        />
      </div>

      <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 120px)" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "#fff",
              zIndex: 1,
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell></TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Deck</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Subtype</TableCell>
              {process.env.NODE_ENV === "development" && (
                <TableCell></TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {cards
              .filter((card) => {
                if (!search) return true;
                return (
                  card.name.ru.toLowerCase().includes(search.toLowerCase()) ||
                  card.name.en.toLowerCase().includes(search.toLowerCase())
                );
              })
              .map((card) => {
                const expansionCounts = card.reprints.reduce((acc, r) => {
                  acc[r.expansion] = (acc[r.expansion] || 0) + 1;
                  return acc;
                }, Object.fromEntries(Object.values(Expansion).map((v) => [v, 0])) as Record<Expansion, number>);

                return (
                  <TableRow key={card.id}>
                    <TableCell>
                      {card.name.ru.length ? card.name.ru : card.name.en}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        {Object.entries(expansionCounts)
                          .filter(([_, count]) => count > 0)
                          .map(([expansion, count]) => (
                            <Box
                              key={expansion}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Avatar
                                variant="square"
                                src={`${window.location.origin}/icons/${expansion}.gif`}
                                alt={expansion}
                                sx={{ height: 23, width: 23 }}
                              />
                              <Typography variant="caption">
                                x{count}
                              </Typography>
                            </Box>
                          ))}
                      </Box>
                    </TableCell>
                    <TableCell>{card.deck}</TableCell>
                    <TableCell>{card.type}</TableCell>
                    <TableCell>{card.subtype}</TableCell>
                    {process.env.NODE_ENV === "development" && (
                      <TableCell>
                        <Button
                          color="primary"
                          size="small"
                          onClick={() => router.push(`/editCard/${card.id}`)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
