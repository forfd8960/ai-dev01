import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  [key: string]: unknown;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}
