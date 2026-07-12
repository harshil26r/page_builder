export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { checkAndPublishScheduled } = await import("@/middleware/publisher");

    // Run publisher check every 60 seconds using plain setInterval
    setInterval(async () => {
      try {
        await checkAndPublishScheduled();
      } catch (err) {
        console.error("[Publisher] Interval error:", err);
      }
    }, 60_000);

    // Also run once immediately on startup
    checkAndPublishScheduled().catch((err) =>
      console.error("[Publisher] Startup check error:", err)
    );

    console.log("[Publisher] Background scheduler active (60s interval).");
  }
}
