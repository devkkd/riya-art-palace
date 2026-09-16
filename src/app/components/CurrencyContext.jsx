"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";

// ─── Supported Currencies ─────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: "INR", symbol: "₹",    flag: "🇮🇳", name: "Indian Rupee",      locale: "en-IN" },
  { code: "USD", symbol: "$",    flag: "🇺🇸", name: "US Dollar",         locale: "en-US" },
  { code: "EUR", symbol: "€",    flag: "🇪🇺", name: "Euro",              locale: "de-DE" },
  { code: "GBP", symbol: "£",    flag: "🇬🇧", name: "British Pound",     locale: "en-GB" },
  { code: "AED", symbol: "د.إ", flag: "🇦🇪", name: "UAE Dirham",         locale: "ar-AE" },
  { code: "AUD", symbol: "A$",   flag: "🇦🇺", name: "Australian Dollar", locale: "en-AU" },
];

// Fallback rates (1 INR = ?) in case API fails
const FALLBACK_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AED: 0.044,
  AUD: 0.019,
};

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState("INR");
  const [rates, setRates]               = useState(FALLBACK_RATES);
  const [ratesLoading, setRatesLoading] = useState(true);

  // Fetch live rates via our backend proxy (avoids CORS, adds caching)
  useEffect(() => {
    fetch("/api/exchange-rates")
      .then(r => r.json())
      .then(data => {
        if (data?.success && data?.data) {
          setRates(data.data);
        }
      })
      .catch(() => {
        // Keep fallback rates silently
      })
      .finally(() => setRatesLoading(false));
  }, []);

  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const rate     = rates[currencyCode] ?? FALLBACK_RATES[currencyCode] ?? 1;

  // Convert from INR to selected currency
  const convert = useCallback(
    (amountINR) => {
      if (!amountINR || isNaN(amountINR)) return 0;
      return Number(amountINR) * rate;
    },
    [rate]
  );

  // Format INR amount → selected currency string
  const format = useCallback(
    (amountINR) => {
      if (amountINR === undefined || amountINR === null) return "";
      const converted = Number(amountINR) * rate;

      try {
        return new Intl.NumberFormat(currency.locale, {
          style:                 "currency",
          currency:              currency.code,
          minimumFractionDigits: currency.code === "INR" ? 0 : 2,
          maximumFractionDigits: currency.code === "INR" ? 0 : 2,
        }).format(converted);
      } catch {
        const decimals = currency.code === "INR" ? 0 : 2;
        return `${currency.symbol}${converted.toFixed(decimals)}`;
      }
    },
    [currency, rate]
  );

  // format with unit suffix e.g. "₹899 / Piece"
  const formatWithUnit = useCallback(
    (amountINR, unit) => {
      const f = format(amountINR);
      return unit ? `${f} / ${unit}` : f;
    },
    [format]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyCode,
        setCurrencyCode,
        rates,
        ratesLoading,
        convert,
        format,
        formatWithUnit,
        formatPrice: format,
        currencies: CURRENCIES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
