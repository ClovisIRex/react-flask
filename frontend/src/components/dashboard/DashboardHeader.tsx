import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, StickyNote } from "lucide-react";

type Props = {
  username: string;
  onAdd: () => void;
  onLogout: () => void;
};

function Header({ username, onAdd, onLogout }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center text-slate-700 gap-2">
          <StickyNote className="h-6 w-6" />
          <span className="font-semibold">{username}'s Notes</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onLogout} className="clickable inline-flex items-center gap-2">
            Logout <LogOut className="h-4 w-4" />
          </Button>
          <Button onClick={onAdd} className="clickable inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add note
          </Button>
        </div>
      </div>
    </header>
  );
}

export const DashboardHeader = memo(Header);
