import { Tag } from "lucide-react";

import { useTags } from "../../hooks/useTags";
import { useFilterStore } from "../../store/filterStore";
import type { Tag as TagModel } from "../../types/tag";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export const TagFilter = () => {
  const { data: tags, isLoading } = useTags();
  const selectedTags = useFilterStore((state: any) => state.selectedTags) as string[];
  const toggleTag = useFilterStore((state: any) => state.toggleTag) as (tag: string) => void;
  const clearTags = useFilterStore((state: any) => state.clearTags) as () => void;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-semibold text-muted-foreground">Tags</p>
        </div>
        {selectedTags.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={() => clearTags()}>
            Clear
          </Button>
        ) : null}
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      ) : tags && tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: TagModel) => {
            const isSelected = selectedTags.includes(tag.name);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.name)}
                className={`group rounded-full border px-3 py-1 text-xs font-medium transition ${
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
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No tags available yet.</p>
      )}
    </div>
  );
};
