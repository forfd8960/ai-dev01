import { cn } from "../../lib/utils";
interface BadgeProps {
  variant?: "default" | "secondary" | "outline";
  className?: string;
  children?: any;
  [key: string]: unknown;
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold";
  const variants: Record<string, string> = {
    default: "border-transparent bg-primary/10 text-primary",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    outline: "border-border text-foreground",
  };
  const variantClass = variants[variant] || variants.default;
  return (
    <span className={cn(base, variantClass, className)} {...props}>
      {children}
    </span>
  );
}
