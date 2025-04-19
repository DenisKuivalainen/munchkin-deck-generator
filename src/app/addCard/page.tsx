"use client";
import { CardEditor } from "@/Components";
import axios from "axios";
import React from "react";

export default () => {
  const onSave: React.ComponentProps<typeof CardEditor>["onSave"] = (card) =>
    axios.post("/api/addCard", card);
  // .then(() => window.location.reload());

  return <CardEditor onSave={onSave} />;
};
