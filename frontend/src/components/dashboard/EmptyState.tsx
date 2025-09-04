import { Annoyed } from "lucide-react";

export function EmptyState() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-slate-600 space-y-2">
      <Annoyed className="h-10 w-10" />
      <span>No notes yet. Click "Add note" to create your first one.</span>
    </div>
  );
}
