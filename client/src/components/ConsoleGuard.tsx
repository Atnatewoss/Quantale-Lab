"use client";

import { useEffect } from "react";

export default function ConsoleGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalError = console.error;
    console.error = (...args) => {
      const unifiedString = args
        .map((arg) => (typeof arg === "string" ? arg : String(arg?.message || arg)))
        .join(" ");

      if (
        unifiedString.includes("Encountered a script tag") ||
        unifiedString.includes("extra attributes from the server") ||
        unifiedString.includes("key") ||
        unifiedString.includes("unique")
      ) {
        // Silently swallow dev-only React 19 / Fast Refresh warnings to keep overlay clean
        return;
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
