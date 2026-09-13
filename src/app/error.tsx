"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * Route-segment error boundary — catches render errors inside the app shell
 * (header/footer stay alive) and offers a retry.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[olymp-ex] Render error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card">
        <AlertTriangle className="size-6 text-primary" aria-hidden />
      </span>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-extrabold">Something went wrong</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          An unexpected error occurred while rendering this page. Your enquiry data is safe —
          try again, or reload the page if the problem persists.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RotateCcw className="size-4" aria-hidden /> Try again
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.hash = "#/";
            window.location.reload();
          }}
          className="inline-flex h-11 items-center rounded-lg border border-border bg-card px-6 text-sm font-semibold transition-colors hover:border-primary/40"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
