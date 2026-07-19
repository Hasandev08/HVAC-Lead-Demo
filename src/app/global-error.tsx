"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: catches errors in the root layout itself, which the
 * other error.tsx files cannot — `error.js` wraps pages and nested layouts, but
 * not the layout in its own segment.
 *
 * This replaces the root layout when it fires, so it must ship its own <html>
 * and <body>. It also can't rely on the app's CSS loading, so the styling is
 * inline. Rare, but the alternative is the browser's raw error page in front of
 * a client.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error.digest ?? "", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B2545",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
          color: "#fff",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "420px", textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 12px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 28px" }}>
            The page failed to load. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              background: "#FF6B1A",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "14px 28px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p
              style={{
                marginTop: "28px",
                fontSize: "12px",
                color: "#475569",
                fontFamily: "monospace",
              }}
            >
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
