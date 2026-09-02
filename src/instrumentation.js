// Runs once at server startup — before any route modules are evaluated.
// This ensures DNS is configured before mongoose tries to resolve MongoDB Atlas SRV records.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("dns");
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
    dns.setDefaultResultOrder("ipv4first");
  }
}
