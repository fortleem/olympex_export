"use client";

/**
 * Root error boundary — fires only when the root layout itself fails, so it
 * must render its own <html>/<body>. Inline styles keep it independent of
 * the (possibly broken) stylesheet pipeline.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#101828",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.75rem" }}>
            Olymp Ex — temporary hiccup
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#5b6472", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
            The application failed to load. This is usually transient — please retry below.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              height: "44px",
              padding: "0 1.5rem",
              borderRadius: "8px",
              border: "none",
              background: "#2f7d32",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <p style={{ fontSize: "0.75rem", color: "#98a2b3", marginTop: "1.5rem" }}>
            {error.digest ? `Reference: ${error.digest}` : ""}
          </p>
        </div>
      </body>
    </html>
  );
}
