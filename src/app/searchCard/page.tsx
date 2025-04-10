"use client";

import { useCards } from "@/Components";
import {
  Card,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
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
        padding: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Sticky TextField Container */}
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

      {/* Scrollable Table Container */}
      <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 120px)" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              position: "sticky",
              //   top: "56px", // Space for the sticky TextField
              top: 0,
              backgroundColor: "#fff",
              zIndex: 1,
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
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
              .map((card) => (
                <TableRow key={card.id}>
                  <TableCell>
                    {card.name.ru.length ? card.name.ru : card.name.en}
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
              ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
