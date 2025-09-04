import type { Note } from "@/Types/note";
import NoteCard from "@/components/NoteCard";
import { formatDateToLocal } from "@/lib/utils";

type Props = {
  notes: Note[];
  onEdit: (n: Note) => void;
  onDelete: (n: Note) => void;
};

export function NotesGrid({ notes, onEdit, onDelete }: Props) {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] overflow-auto pb-6">
      {notes.map((n) => (
        <div key={n.id} className="relative">
          <NoteCard note={n} onEdit={onEdit} onDelete={onDelete} />
          <div className="mt-1 text-xs text-slate-500">
            {formatDateToLocal(n.updated_at || n.created_at, 3)}
          </div>
        </div>
      ))}
    </div>
  );
}
