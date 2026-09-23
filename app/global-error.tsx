"use client";

import { useEffect } from "react";

/**
 * Catches failures in the root layout itself (e.g. the cities/rates fetch
 * that Header and DeliveryLine depend on). This replaces the entire <html>,
 * so it can't rely on globals.css or the design system being loaded —
 * inline styles are the safe, defensive choice for a last-resort screen.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#F2F4EF", color: "#16211B", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 420, margin: "96px auto", padding: "0 16px", textAlign: "center" }}>
          <h1 style={{ fontWeight: 800, fontSize: 24 }}>Oja Direct is temporarily unavailable</h1>
          <p style={{ color: "#56615A", marginTop: 8 }}>Please refresh the page in a moment.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              borderRadius: 999,
              background: "#146B3A",
              color: "#FFFFFF",
              padding: "12px 24px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
