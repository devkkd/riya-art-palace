"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en",    name: "English",    flag: "🇬🇧" },
  { code: "hi",    name: "Hindi",      flag: "🇮🇳" },
  { code: "ar",    name: "Arabic",     flag: "🇸🇦" },
  { code: "fr",    name: "French",     flag: "🇫🇷" },
  { code: "de",    name: "German",     flag: "🇩🇪" },
  { code: "es",    name: "Spanish",    flag: "🇪🇸" },
  { code: "zh-CN", name: "Chinese",    flag: "🇨🇳" },
  { code: "ja",    name: "Japanese",   flag: "🇯🇵" },
  { code: "ko",    name: "Korean",     flag: "🇰🇷" },
  { code: "ru",    name: "Russian",    flag: "🇷🇺" },
  { code: "pt",    name: "Portuguese", flag: "🇵🇹" },
  { code: "it",    name: "Italian",    flag: "🇮🇹" },
];

function getCookieLang() {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  return match ? match[1] : "en";
}

export default function GoogleTranslate() {
  const [open, setOpen]       = useState(false);
  const [current, setCurrent] = useState(LANGUAGES[0]);
  const wrapRef               = useRef(null);

  // Sync current lang from cookie on mount
  useEffect(() => {
    const langCode = getCookieLang();
    const found    = LANGUAGES.find(l => l.code === langCode);
    if (found) setCurrent(found);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectLanguage = (lang) => {
    setOpen(false);
    setCurrent(lang);

    if (lang.code === "en") {
      // Remove translation — clear cookie and reload
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      window.location.reload();
      return;
    }

    // Set Google Translate cookie and reload
    document.cookie = `googtrans=/en/${lang.code}; path=/`;
    document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${window.location.hostname}`;
    window.location.reload();
  };

  return (
    <>
      {/* Suppress Google's toolbar */}
      <style>{`
        .goog-te-banner-frame.skiptranslate,
        .goog-te-banner-frame,
        .skiptranslate { display: none !important; visibility: hidden !important; }
        body { top: 0 !important; position: static !important; }
        #goog-gt-tt, .goog-tooltip, .goog-tooltip:hover,
        .goog-text-highlight { display: none !important; box-shadow: none !important; }
        .VIpgJd-ZVi9od-aZ2wEe-wOHMyf { display: none !important; }
        .VIpgJd-ZVi9od-l4eHX-hSRGPd { display: none !important; }
      `}</style>

      {/* Hidden Google Translate init element */}
      <div id="google_translate_element" style={{ display: "none", visibility: "hidden", width: 0, height: 0, overflow: "hidden" }} />

      {/* Load Google Translate script */}
      <GoogleTranslateScript />

      {/* Custom dropdown */}
      <div ref={wrapRef} style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setOpen(p => !p)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            height: 34, padding: "0 8px",
            border: "1.5px solid #D7CEC5", borderRadius: 8,
            background: "#fff", cursor: "pointer",
            fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 700, color: "#1A1A1A",
            whiteSpace: "nowrap", transition: "border-color .15s, background .15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor="#F85700"; e.currentTarget.style.background="#FFF9F6"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="#D7CEC5"; e.currentTarget.style.background="#fff"; }}
        >
          {/* <Globe size={13} style={{ color: "#F85700" }} /> */}
          <span> {current.name}</span>
          <ChevronDown size={11} strokeWidth={2.5} style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "rotate(0)" }} />
        </button>

        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            minWidth: 190, background: "#fff",
            border: "1px solid #D7CEC5", borderRadius: 14,
            boxShadow: "0 12px 32px rgba(0,0,0,.12)", zIndex: 10002, padding: 6,
          }}>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "9px 12px", border: "none", borderRadius: 8,
                  background: current.code === lang.code ? "#FFF3EB" : "transparent",
                  cursor: "pointer", fontFamily: "Manrope, sans-serif",
                  fontSize: 13, fontWeight: current.code === lang.code ? 700 : 500,
                  color: current.code === lang.code ? "#F85700" : "#1A1A1A",
                  textAlign: "left", transition: "background .12s",
                }}
                onMouseEnter={e => { if (current.code !== lang.code) e.currentTarget.style.background="#F7F5F3"; }}
                onMouseLeave={e => { if (current.code !== lang.code) e.currentTarget.style.background="transparent"; }}
              >
                <span style={{ fontSize: 16 }}>{lang.flag}</span>
                <span style={{ flex: 1 }}>{lang.name}</span>
                {current.code === lang.code && <span style={{ fontSize: 11 }}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Load GT script only once
function GoogleTranslateScript() {
  useEffect(() => {
    if (document.getElementById("gt-script-v2")) return;

    window.googleTranslateElementInit2 = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
    };

    const s   = document.createElement("script");
    s.id      = "gt-script-v2";
    s.src     = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2";
    s.async   = true;
    document.head.appendChild(s);
  }, []);

  return null;
}
