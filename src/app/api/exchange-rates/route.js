import { successResponse, errorResponse } from "@/lib/utils/response";

// Cache rates for 1 hour to avoid hitting API on every request
let cached = null;
let cachedAt = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET() {
  try {
    const now = Date.now();

    // Return cached rates if fresh
    if (cached && now - cachedAt < CACHE_TTL) {
      return successResponse(cached);
    }

    const symbols = "USD,EUR,GBP,AED,AUD";
    const res = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=INR&symbols=${symbols}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Frankfurter API error: " + res.status);

    const data = await res.json();

    if (!data?.rates) throw new Error("Invalid rates response");

    const rates = { INR: 1, ...data.rates };
    cached = rates;
    cachedAt = now;

    return successResponse(rates);
  } catch (err) {
    console.error("[exchange-rates]", err);
    // Return fallback rates
    return successResponse({
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      AED: 0.044,
      AUD: 0.019,
    });
  }
}
