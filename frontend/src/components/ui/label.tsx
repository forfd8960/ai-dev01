import { cn } from "../../lib/utils";

interface LabelProps {
  className?: string;
  children?: any;
  htmlFor?: string;
  [key: string]: unknown;
}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label className={cn("text-sm font-medium leading-none", className)} {...props}>
      {children}
    </label>
  );
}
