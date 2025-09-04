import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Note } from "@/Types/note";
import { api } from "@/API/api";
import { clearAuth } from "@/Login/auth";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import NoteCard from "@/components/NoteCard";
import { Skeleton } from "@/components/ui/skeleton";
import CreateNoteModal from "@/components/modals/CreateNoteModal";
import EditNoteModal from "@/components/modals/EditNoteModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Annoyed, StickyNote} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Note | null>(null);
  const welcomeOnce = useRef(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (!welcomeOnce.current && user?.username) {
      welcomeOnce.current = true;
      toast.success(`Welcome ${user.username}!`, { duration: 2000, id: "welcome" });
    }
  }, [user?.username]);

  async function fetchNotes() {
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
  }

  async function handleCreate(payload: { title: string; content: string }) {
    await api.createNote(payload);
    toast.success(`Note Created.`);
    await fetchNotes();
  }

  async function handleEdit(id: number, payload: { title: string; content: string }) {
    await api.updateNote(id, payload);
    toast.success(`Note Updated.`);
    await fetchNotes();
  }

  async function handleConfirmDelete() {
    if (!selected) return;
    await api.deleteNote(selected.id);
    toast.success(`Note Deleted.`);
    setDeleteOpen(false);
    setSelected(null);
    await fetchNotes();
  }

  function logout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="h-[60vh] flex items-center justify-center text-slate-600 gap-2">
            <StickyNote className="h-6 w-6" />
            <span className="font-semibold">{user.username}'s Notes</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={logout} className="clickable">Logout
              <LogOut className="clickable h-4 w-4" />
            </Button>
            <Button onClick={() => setCreateOpen(true)} className="clickable inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add note
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl w-full p-4 flex-1">
        {loading ? (
          <div className="grid gap-4 md:gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="rounded-lg p-4 bg-yellow-50 border border-yellow-100 shadow-sm">
                  <Skeleton className="h-5 w-2/3 mb-3" />   {/* title */}
                  <Skeleton className="h-4 w-full mb-2" />  {/* line 1 */}
                  <Skeleton className="h-4 w-5/6 mb-2" />   {/* line 2 */}
                  <Skeleton className="h-4 w-4/6" />        {/* line 3 */}
                </div>
                <Skeleton className="h-3 w-1/2" />          {/* date */}
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-slate-600 space-y-2">
  <Annoyed className="h-10 w-10" /> 
  <span>No notes yet. Click “Add note” to create your first one.</span>
</div>
        ) : (
          <div className="grid gap-4 md:gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] overflow-auto pb-6">
            {notes.map((n) => (
              <div key={n.id} className="relative">
                <NoteCard
                  note={n}
                  onEdit={(note) => { setSelected(note); setEditOpen(true); }}
                  onDelete={(note) => { setSelected(note); setDeleteOpen(true); }}
                />
                <div className="mt-1 text-xs text-slate-500">
                  {formatDate(n.updated_at || n.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateNoteModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
      />
      <EditNoteModal
        open={editOpen}
        onOpenChange={setEditOpen}
        note={selected}
        onSubmit={handleEdit}
      />
      <ConfirmDeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        noteTitle={selected?.title || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
