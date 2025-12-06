import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay(props: any) {
  const { className, ...rest } = props || {};
  return (
    <DialogPrimitive.Overlay className={cn("fixed inset-0 z-40 bg-black/40 backdrop-blur-sm", className)} {...rest} />
  );
}

export function DialogContent(props: any) {
  const { className, children, ...rest } = props || {};
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-card p-6 shadow-lg focus:outline-none",
          className
        )}
        {...rest}
      >
        {children}
        <DialogPrimitive.Close asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 text-muted-foreground"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader(props: any) {
  const { className, ...rest } = props || {};
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...rest} />;
}

export function DialogTitle(props: any) {
  const { className, ...rest } = props || {};
  return (
    <DialogPrimitive.Title className={cn("text-lg font-semibold leading-none", className)} {...rest} />
  );
}

export function DialogDescription(props: any) {
  const { className, ...rest } = props || {};
  return (
    <DialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...rest} />
  );
}
