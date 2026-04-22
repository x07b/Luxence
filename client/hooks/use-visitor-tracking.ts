import { useEffect } from "react";

export function useVisitorTracking() {
  useEffect(() => {
    // Track visitor once on page load
    const trackVisitor = async () => {
      try {
        await fetch("/api/analytics/track-visitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        // Silently fail if tracking doesn't work
        console.debug(
          "Visitor tracking failed (this is normal if table doesn't exist)",
        );
      }
    };

    trackVisitor();
  }, []);
}
