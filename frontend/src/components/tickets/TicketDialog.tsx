import * as React from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import type { Tag } from "../../types/tag";
import type { Ticket, TicketFormValues, TicketPriority } from "../../types/ticket";

interface TicketDialogProps {
  open: boolean;
  onOpenChange(value: boolean): void;
  initialData?: Ticket | null;
  availableTags: Tag[];
  onSubmit(values: TicketFormValues): Promise<void>;
  isSubmitting?: boolean;
}

const PRIORITY_OPTIONS: Array<{ value: TicketPriority; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const DEFAULT_VALUES: TicketFormValues = {
  title: "",
  description: "",
  priority: "medium",
  tagIds: [],
  newTagNames: [],
};

export const TicketDialog = ({
  open,
  onOpenChange,
  initialData,
  availableTags,
  onSubmit,
  isSubmitting,
}: TicketDialogProps) => {
  const [values, setValues] = React.useState({ ...DEFAULT_VALUES } as TicketFormValues);
  const [newTagsInput, setNewTagsInput] = React.useState("");
  const [error, setError] = React.useState(null as string | null);

  React.useEffect(() => {
    if (open) {
      if (initialData) {
        setValues({
          title: initialData.title,
          description: initialData.description ?? "",
          priority: initialData.priority,
          tagIds: initialData.tags.map((tag) => tag.id),
          newTagNames: [],
        });
        setNewTagsInput("");
      } else {
        setValues({ ...DEFAULT_VALUES } as TicketFormValues);
        setNewTagsInput("");
      }
      setError(null);
    }
  }, [open, initialData]);

  const handleChange = (field: keyof TicketFormValues, value: any) => {
    setValues((prev: TicketFormValues) => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tagId: number) => {
    setValues((prev: TicketFormValues) => {
      const exists = prev.tagIds.includes(tagId);
      return {
        ...prev,
        tagIds: exists ? prev.tagIds.filter((id: number) => id !== tagId) : [...prev.tagIds, tagId],
      };
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const trimmedNewTags = newTagsInput
      .split(",")
      .map((name: string) => name.trim())
      .filter((name: string) => name.length > 0);

    if (!values.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        description: values.description?.trim() ?? "",
        newTagNames: trimmedNewTags,
      });
      onOpenChange(false);
      setValues({ ...DEFAULT_VALUES } as TicketFormValues);
      setNewTagsInput("");
    } catch (submitError: any) {
      setError(submitError?.message ?? "Failed to save ticket");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Ticket" : "Create Ticket"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update ticket information and tags." : "Provide details for the new ticket."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="ticket-title">Title</Label>
            <Input
              id="ticket-title"
              value={values.title}
              onChange={(event: any) => handleChange("title", event.target.value)}
              placeholder="Ticket title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket-description">Description</Label>
            <Textarea
              id="ticket-description"
              value={values.description}
              onChange={(event: any) => handleChange("description", event.target.value)}
              placeholder="Describe the ticket"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex flex-wrap gap-2">
              {PRIORITY_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={values.priority === option.value ? "default" : "outline"}
                  onClick={() => handleChange("priority", option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags defined yet.</p>
              ) : (
                availableTags.map((tag) => {
                  const isSelected = values.tagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/60"
                      }`}
                    >
                      <span>{tag.name}</span>
                      {typeof tag.usage_count === "number" ? (
                        <Badge variant="secondary" className="ml-2 bg-muted px-2 py-0 text-[10px]">
                          {tag.usage_count}
                        </Badge>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
            <p className="text-xs text-muted-foreground">Select existing tags or add new ones below.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-tags">New Tags</Label>
            <Input
              id="new-tags"
              placeholder="Comma separated names (e.g. backend, urgent)"
              value={newTagsInput}
              onChange={(event: any) => setNewTagsInput(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Create Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
