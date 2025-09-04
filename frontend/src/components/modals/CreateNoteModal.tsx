import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const TITLE_MAX = 50;
const CONTENT_MAX = 100;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: { title: string; content: string }) => Promise<void> | void;
};

function wordCount(s: string): number {
  return s.trim().length ? s.trim().split(/\s+/).filter(Boolean).length : 0;
}

export default function CreateNoteModal({ open, onOpenChange, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const titleChars = title.length;
  const contentChars = content.length;
  const titleWords = useMemo(() => wordCount(title), [title]);
  const contentWords = useMemo(() => wordCount(content), [content]);

  const titleTooLong = titleChars > TITLE_MAX;
  const contentTooLong = contentChars > CONTENT_MAX;
  const titleEmpty = title.trim().length === 0;

  const canCreate = !loading && !titleTooLong && !contentTooLong && !titleEmpty;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!canCreate) return;
    setLoading(true);
    await onSubmit({ title: title.trim(), content: content.trim() });
    setLoading(false);
    setTitle("");
    setContent("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Title</Label>
              <span
                className={`text-xs ${titleTooLong ? "text-red-600" : "text-slate-500"}`}
                aria-live="polite"
              >
                {titleChars}/{TITLE_MAX} chars · {titleWords} words
              </span>
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={TITLE_MAX}
              placeholder={`Enter title (max ${TITLE_MAX} chars)`}
              className={titleTooLong ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content</Label>
              <span
                className={`text-xs ${contentTooLong ? "text-red-600" : "text-slate-500"}`}
                aria-live="polite"
              >
                {contentChars}/{CONTENT_MAX} chars · {contentWords} words
              </span>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={CONTENT_MAX}
              placeholder={`Enter content (max ${CONTENT_MAX} chars)`}
              className={contentTooLong ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canCreate}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
