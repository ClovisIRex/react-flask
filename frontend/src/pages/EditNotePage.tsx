import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import type { Note } from "../types";
import NoteForm from "../components/NoteForm";

export default function EditNotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    api.getNotes().then(ns => {
      const n = ns.find(x => x.id === Number(id));
      if (mounted) setNote(n || null);
    }).catch(e => setErr(String(e)));
    return () => { mounted = false; };
  }, [id]);

  async function save(data: { title: string; content: string }) {
    if (!id) return;
    const updated = await api.updateNote(Number(id), data);
    setNote(updated);
    navigate("/");
  }

  if (err) return <p style={{ color: "red" }}>{err}</p>;
  if (!note) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Note</h1>
      <NoteForm initial={note} onSubmit={save} />
    </div>
  );
}
