import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import type { Note } from "@/Types/note";
import { useNotes } from "@/hooks/useNotes";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { NotesGrid } from "@/components/dashboard/NotesGrid";
import { NotesSkeleton } from "@/components/dashboard/NotesSkeleton";
import CreateNoteModal from "@/components/modals/CreateNoteModal";
import EditNoteModal from "@/components/modals/EditNoteModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { clearAuth } from "@/auth/auth";
import { toast } from "sonner";

export default function Dashboard() {
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Note | null>(null);

  // welcome toast once
  const welcomed = useRef(false);
  useEffect(() => {
    if (!welcomed.current && user?.username) {
      welcomed.current = true;
      toast.success(`Welcome ${user.username}!`, { duration: 2000, id: "welcome" });
    }
  }, [user?.username]);

  const onAdd = useCallback(() => setCreateOpen(true), []);
  const onLogout = useCallback(() => {
    clearAuth();
    window.location.replace("/login");
  }, []);
  const onEdit = useCallback((n: Note) => { setSelected(n); setEditOpen(true); }, []);
  const onAskDelete = useCallback((n: Note) => { setSelected(n); setDeleteOpen(true); }, []);

  const handleCreate = useCallback(async (data: { title: string; content: string }) => {
    await createNote(data);
    setCreateOpen(false);
  }, [createNote]);

  const handleEdit = useCallback(async (id: number, data: { title: string; content: string }) => {
    await updateNote(id, data);
    setEditOpen(false);
  }, [updateNote]);

  const handleConfirmDelete = useCallback(async () => {
    if (!selected) return;
    await deleteNote(selected.id);
    setSelected(null);
    setDeleteOpen(false);
  }, [deleteNote, selected]);

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader username={user?.username || "User"} onAdd={onAdd} onLogout={onLogout} />

      <main className="mx-auto max-w-6xl w-full p-4 flex-1">
        {loading ? (
          <NotesSkeleton />
        ) : notes.length === 0 ? (
          <EmptyState />
        ) : (
          <NotesGrid notes={notes} onEdit={onEdit} onDelete={onAskDelete} />
        )}
      </main>

      <CreateNoteModal open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreate} />
      <EditNoteModal open={editOpen} onOpenChange={setEditOpen} note={selected} onSubmit={handleEdit} />
      <ConfirmDeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        noteTitle={selected?.title || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
