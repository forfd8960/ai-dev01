import * as React from "react";

import { cn } from "../../lib/utils";

type ToastVariant = "default" | "success" | "destructive";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast(options: ToastOptions): void;
}

interface ToastItem extends ToastOptions {
  id: string;
}

const ToastContext = React.createContext(null as unknown as ToastContextValue);

const VARIANT_STYLES: Record<ToastVariant, string> = {
  default: "border-border bg-card text-foreground",
  success: "border-green-200 bg-green-50 text-green-900",
  destructive: "border-destructive/40 bg-destructive/10 text-destructive",
};

const TOAST_DURATION = 4000;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState([] as ToastItem[]);
  const timeouts = React.useRef({} as Record<string, number>);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current: ToastItem[]) => current.filter((toast: ToastItem) => toast.id !== id));
    const timeoutId = timeouts.current[id];
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      delete timeouts.current[id];
    }
  }, []);

  const toast = React.useCallback(
    ({ title, description, variant = "default", duration }: ToastOptions) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const next: ToastItem = { id, title, description, variant };
      setToasts((current: ToastItem[]) => [...current, next]);
      const timeoutId = window.setTimeout(() => dismiss(id), duration ?? TOAST_DURATION);
      timeouts.current[id] = timeoutId;
    },
    [dismiss]
  );

  React.useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach((timeoutId) => window.clearTimeout(timeoutId as number));
      timeouts.current = {};
    };
  }, []);

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((item: ToastItem) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto rounded-lg border p-4 shadow-md transition-all",
              VARIANT_STYLES[(item.variant ?? "default") as ToastVariant]
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold">{item.title}</p>
                {item.description ? (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground transition hover:text-foreground"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext) as ToastContextValue | null;
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
