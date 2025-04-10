"use client";

import { CardEditor } from "@/Components";
import { CardId } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<CardId>();
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, []);

  const onSave: React.ComponentProps<typeof CardEditor>["onSave"] = (card) =>
    axios.post("/api/editCard", card);

  if (!id) return <></>;
  return <CardEditor onSave={onSave} cardId={id} />;
};
