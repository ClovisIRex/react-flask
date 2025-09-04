import { Trash2 } from "lucide-react";
import type { Note } from "@/Types/note";
import { cn } from "@/lib/utils";

type Props = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export default function NoteCard({ note, onEdit, onDelete }: Props) {
  return (
    <div
      role="button"
      onClick={() => onEdit(note)}
      className={cn(
        "relative rounded-lg p-4 shadow-md cursor-pointer",
        "bg-yellow-100 border border-yellow-200",
        "hover:shadow-lg transition-shadow",
        "min-h-[140px]"
      )}
    >
      <button
        aria-label="Delete note"
        className="absolute right-2 top-2 rounded p-1 hover:bg-black/5"
        onClick={(e) => { e.stopPropagation(); onDelete(note); }}
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </button>

      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">{note.title}</h3>
      <p className="text-slate-800 whitespace-pre-wrap line-clamp-5">{note.content}</p>
    </div>
  );
}
