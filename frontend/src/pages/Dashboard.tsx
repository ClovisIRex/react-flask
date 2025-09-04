import { useCallback, useState } from "react";
import type { Note } from "@/Types/note";
import { useNotes } from "@/hooks/useNotes";
import { useUser } from "@/hooks/useUser";
import { useWelcomeToast } from "@/hooks/useWelcomeToast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { NotesGrid } from "@/components/dashboard/NotesGrid";
import { NotesSkeleton } from "@/components/dashboard/NotesSkeleton";
import CreateNoteModal from "@/components/modals/CreateNoteModal";
import EditNoteModal from "@/components/modals/EditNoteModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { clearAuth } from "@/auth/auth";

export default function Dashboard() {
  const { username } = useUser();
  useWelcomeToast(username, 2000);

  const { notes, loading, createNote, updateNote, deleteNote } = useNotes();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Note | null>(null);

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
      <DashboardHeader username={username} onAdd={onAdd} onLogout={onLogout} />

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
