import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onOpenChange, children, ...props }, ref) => {
    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={() => onOpenChange(false)}
      >
        <div
          className="fixed inset-0 bg-black/50"
          aria-hidden="true"
        />
        <div
          ref={ref}
          className={cn(
            "relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto",
            "bg-background rounded-lg border shadow-lg",
            "m-4"
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);
Dialog.displayName = "Dialog";

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
  onClose?: () => void;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, showClose = true, children, onClose, ...props }, ref) => (
    <div ref={ref} className={cn("relative", className)} {...props}>
      {showClose && onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
      {children}
    </div>
  )
);
DialogContent.displayName = "DialogContent";

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent };

