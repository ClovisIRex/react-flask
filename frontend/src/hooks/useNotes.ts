import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Note } from "@/Types/note";
import { api } from "@/API/api";
import { clearAuth } from "@/auth/auth";
import { toast } from "sonner";

export function useNotes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getNotes();
      setNotes(data);
    } catch (e: any) {
      toast.error("Failed to load notes");
      if (String(e?.message || "").includes("401")) {
        clearAuth();
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const createNote = useCallback(async (payload: { title: string; content: string }) => {
    // optimistic create
    const temp: Note = { id: Math.random(), title: payload.title, content: payload.content };
    setNotes(prev => [temp, ...prev]);
    try {
      const created = await api.createNote(payload);
      setNotes(prev => [created, ...prev.filter(n => n.id !== temp.id)]);
      toast.success("Note created.");
    } catch (e) {
      // rollback
      setNotes(prev => prev.filter(n => n.id !== temp.id));
      toast.error("Create failed.");
      throw e;
    }
  }, []);

  const updateNote = useCallback(async (id: number, payload: { title: string; content: string }) => {
    // optimistic update
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...payload } as Note : n));
    try {
      const updated = await api.updateNote(id, payload);
      setNotes(prev => prev.map(n => n.id === id ? updated : n));
      toast.success("Note updated.");
    } catch (e) {
      toast.error("Update failed.");
      await fetchNotes(); // simple restore
      throw e;
    }
  }, [fetchNotes]);

  const deleteNote = useCallback(async (id: number) => {
    // optimistic delete
    const snapshot = notes;
    setNotes(prev => prev.filter(n => n.id !== id));
    try {
      await api.deleteNote(id);
      toast.success("Note deleted.");
    } catch (e) {
      setNotes(snapshot); // rollback
      toast.error("Delete failed.");
      throw e;
    }
  }, [notes]);

  return { notes, loading, fetchNotes, createNote, updateNote, deleteNote };
}
