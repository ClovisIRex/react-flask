import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import type { Note } from "../types";
import NoteForm from "../components/NoteForm";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function load() {
    try {
      setLoading(true);
      const data = await api.getNotes();
      setNotes(data);
      setErr("");
    } catch (e: any) {
      setErr(e.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createNote(data: { title: string; content: string }) {
    const n = await api.createNote(data);
    setNotes([n, ...notes]);
  }

  async function remove(id: number) {
    if (!confirm("Delete this note?")) return;
    await api.deleteNote(id);
    setNotes(notes.filter(n => n.id !== id));
  }

  return (
    <>
      <h1>My Notes</h1>
      <NoteForm onSubmit={createNote} />
      {loading ? <p>Loading...</p> : err ? <p style={{ color: "red" }}>{err}</p> : (
        <>
          {notes.length === 0 ? <p>No notes yet.</p> : notes.map(n => (
            <div key={n.id} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ margin: 0, flex: 1 }}>{n.title}</h3>
                <button className="btn" onClick={() => navigate(`/notes/${n.id}`)}>Edit</button>
                <button className="btn" onClick={() => remove(n.id)}>Delete</button>
              </div>
              <p style={{ whiteSpace: "pre-wrap" }}>{n.content}</p>
              <small>Updated {new Date(n.updated_at).toLocaleString()}</small>
            </div>
          ))}
        </>
      )}
    </>
  );
}
