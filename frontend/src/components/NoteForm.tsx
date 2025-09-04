import { FormEvent, useState } from "react";
import type { Note } from "../types";

type Props = {
  initial?: Partial<Pick<Note, "title" | "content">>;
  onSubmit: (data: { title: string; content: string }) => Promise<void> | void;
};

export default function NoteForm({ initial, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await onSubmit({ title: title.trim(), content: content.trim() });
    } catch (e: any) {
      setErr(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="card">
      <div style={{ marginBottom: 8 }}>
        <label>Title</label>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Content</label>
        <textarea className="input" rows={6} value={content} onChange={e => setContent(e.target.value)} />
      </div>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <button className="btn" disabled={saving} type="submit">{saving ? "Saving..." : "Save"}</button>
    </form>
  );
}
