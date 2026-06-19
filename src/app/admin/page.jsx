"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LayoutDashboard,
  Lock,
  Mail,
  Package,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import logo from "../assets/logo.png";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Invalid email or password. Please try again.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .al-page {
          --al-gap: clamp(12px, 2vh, 24px);
          --al-input-h: clamp(42px, 5vh, 48px);
          height: 100vh;
          height: 100dvh;
          max-height: 100vh;
          max-height: 100dvh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--al-gap);
          background: #EDE8E2;
          font-family: var(--font-poppins, "Poppins", sans-serif);
        }

        .al-shell {
          width: 100%;
          max-width: min(980px, 100%);
          max-height: calc(100dvh - var(--al-gap) * 2);
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          border-radius: clamp(16px, 2vw, 24px);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(45, 41, 38, 0.07);
          border: 1px solid #DDD6CE;
          background: #fff;
        }

        /* ── LEFT PANEL ── */
        .al-brand {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 0;
          padding: clamp(24px, 4vh, 44px) clamp(20px, 3vw, 40px);
          background: #F9F6F2;
          border-right: 1px solid #E8E2DA;
          overflow: hidden;
        }

        .al-brand-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #C4784A 0%, #A8653F 100%);
        }

        .al-brand-pattern {
          position: absolute;
          bottom: -40px;
          right: -40px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          border: 1px solid #E0D8CF;
          pointer-events: none;
        }

        .al-brand-pattern::before {
          content: "";
          position: absolute;
          inset: 28px;
          border-radius: 50%;
          border: 1px solid #E8E2DA;
        }

        .al-brand-pattern::after {
          content: "";
          position: absolute;
          inset: 56px;
          border-radius: 50%;
          border: 1px solid #F0EBE4;
        }

        .al-brand-inner {
          position: relative;
          z-index: 1;
        }

        .al-brand-logo {
          margin-bottom: clamp(16px, 3vh, 36px);
        }

        .al-brand-logo img {
          height: clamp(32px, 4vh, 42px) !important;
          width: auto !important;
        }

        .al-brand-label {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #A8653F;
          margin-bottom: 14px;
        }

        .al-brand-title {
          font-family: var(--font-playfair, "Playfair Display", Georgia, serif);
          font-size: clamp(22px, 2.5vw, 34px);
          font-weight: 700;
          line-height: 1.25;
          color: #2D2926;
          letter-spacing: -0.02em;
        }

        .al-brand-title em {
          font-style: italic;
          color: #8B6F5E;
        }

        .al-brand-desc {
          margin-top: clamp(8px, 1.5vh, 14px);
          max-width: 300px;
          font-size: clamp(12px, 1.4vw, 14px);
          line-height: 1.6;
          color: #7A7268;
        }

        .al-brand-features {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: clamp(8px, 1.2vh, 12px);
          margin-top: clamp(16px, 3vh, 36px);
        }

        .al-brand-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: clamp(10px, 1.5vh, 14px) clamp(12px, 1.5vw, 16px);
          background: #fff;
          border: 1px solid #E8E2DA;
          border-radius: 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .al-brand-feature:hover {
          border-color: #D4C9BC;
          box-shadow: 0 4px 16px rgba(45, 41, 38, 0.04);
        }

        .al-brand-feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(32px, 4vh, 38px);
          height: clamp(32px, 4vh, 38px);
          flex-shrink: 0;
          border-radius: 10px;
          background: #F3EDE6;
          color: #A8653F;
        }

        .al-brand-feature-text strong {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #2D2926;
          margin-bottom: 2px;
        }

        .al-brand-feature-text span {
          font-size: 12px;
          color: #9C948A;
          line-height: 1.4;
        }

        .al-brand-footer {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: clamp(12px, 2vh, 28px);
          margin-top: clamp(12px, 2vh, 28px);
          border-top: 1px solid #E8E2DA;
          font-size: 12px;
          color: #A89F94;
        }

        .al-brand-footer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C4784A;
          flex-shrink: 0;
        }

        /* ── RIGHT PANEL ── */
        .al-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
          overflow: hidden;
          padding: clamp(24px, 4vh, 48px) clamp(20px, 3vw, 44px);
          background: #FFFFFF;
        }

        .al-form-wrap {
          width: 100%;
          max-width: 340px;
        }

        .al-logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: clamp(16px, 2.5vh, 28px);
        }

        .al-logo-wrap img {
          height: clamp(36px, 4.5vh, 44px) !important;
          width: auto !important;
        }

        .al-form-header {
          text-align: center;
          margin-bottom: clamp(20px, 3vh, 32px);
        }

        .al-form-title {
          font-family: var(--font-playfair, "Playfair Display", Georgia, serif);
          font-size: clamp(22px, 2.8vw, 26px);
          font-weight: 700;
          color: #0E0E0E;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }

        .al-form-sub {
          font-size: clamp(12px, 1.4vw, 14px);
          color: #737373;
          line-height: 1.45;
        }

        .al-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: clamp(12px, 2vh, 20px);
          padding: 10px 12px;
          border-radius: 10px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          font-size: 13px;
          font-weight: 500;
          color: #B91C1C;
          line-height: 1.45;
        }

        .al-error svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .al-field {
          margin-bottom: clamp(12px, 1.8vh, 18px);
        }

        .al-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .al-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .al-label-row .al-label {
          margin-bottom: 0;
        }

        .al-forgot {
          font-size: 12px;
          font-weight: 500;
          color: #A8653F;
          text-decoration: none;
          transition: color 0.15s;
        }

        .al-forgot:hover {
          color: #8B5235;
        }

        .al-input-wrap {
          position: relative;
        }

        .al-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #A3A3A3;
          display: flex;
          pointer-events: none;
        }

        .al-input {
          width: 100%;
          height: var(--al-input-h);
          padding: 0 44px 0 42px;
          border: 1px solid #D4CCC4;
          border-radius: 10px;
          background: #FAFAF9;
          font-family: inherit;
          font-size: 14px;
          font-weight: 400;
          color: #1A1A1A;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .al-input:hover {
          border-color: #C3BCB4;
        }

        .al-input:focus {
          border-color: #A8653F;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(168, 101, 63, 0.1);
        }

        .al-input::placeholder {
          color: #B0B0B0;
        }

        .al-eye-btn {
          position: absolute;
          right: 12px;
          top: 20%;
          // transform: translateY(-50%);
          display: flex;
          align-items: center;
          padding: 4px;
          border: none;
          border-radius: 6px;
          background: none;
          color: #A3A3A3;
          cursor: pointer;
          transition: color 0.15s;
        }

        .al-eye-btn:hover {
          color: #A8653F;
        }

        .al-submit-btn {
          width: 100%;
          height: var(--al-input-h);
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 10px;
          background: #2D2926;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
        }

        .al-submit-btn:hover:not(:disabled) {
          background: #1A1816;
          box-shadow: 0 4px 14px rgba(45, 41, 38, 0.18);
        }

        .al-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .al-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: al-spin 0.7s linear infinite;
        }

        @keyframes al-spin {
          to { transform: rotate(360deg); }
        }

        .al-security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: clamp(14px, 2vh, 24px);
          font-size: 11px;
          font-weight: 500;
          color: #A3A3A3;
        }

        .al-footer {
          margin-top: clamp(14px, 2vh, 28px);
          text-align: center;
          font-size: 12px;
          color: #B0B0B0;
        }

        .al-footer a {
          color: #A8653F;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s;
        }

        .al-footer a:hover {
          color: #8B5235;
        }

        /* Short viewport — hide left extras */
        @media (max-height: 740px) {
          .al-brand-features {
            display: none;
          }

          .al-brand-desc {
            display: none;
          }

          .al-brand-logo {
            margin-bottom: 16px;
          }
        }

        @media (max-height: 580px) {
          .al-security-note {
            display: none;
          }

          .al-form-sub {
            display: none;
          }

          .al-logo-wrap {
            margin-bottom: 12px;
          }

          .al-form-header {
            margin-bottom: 14px;
          }

          .al-footer {
            margin-top: 12px;
          }
        }

        /* Tablet & mobile */
        @media (max-width: 900px) {
          .al-shell {
            grid-template-columns: 1fr;
            max-width: min(440px, 100%);
          }

          .al-brand {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .al-page {
            --al-gap: 12px;
          }

          .al-shell {
            border-radius: 16px;
          }

          .al-form-panel {
            padding: clamp(20px, 4vh, 32px) clamp(16px, 4vw, 24px);
          }

          .al-form-wrap {
            max-width: 100%;
          }
        }

        @media (max-width: 360px) {
          .al-forgot {
            font-size: 11px;
          }

          .al-label {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="al-page">
        <div className="al-shell">
          <aside className="al-brand">
            <div className="al-brand-accent" aria-hidden="true" />
            <div className="al-brand-pattern" aria-hidden="true" />

            <div className="al-brand-inner">
              <div className="al-brand-logo">
                <Image
                  src={logo}
                  alt="Riya Art Palace"
                  width={130}
                  height={42}
                  style={{ height: 42, width: "auto", objectFit: "contain" }}
                  priority
                />
              </div>

              <span className="al-brand-label">Admin Portal</span>
              <h1 className="al-brand-title">
                Manage your
                <br />
                <em>heritage brand</em>
              </h1>
              <p className="al-brand-desc">
                One place to handle products, orders, and customer enquiries
                — built for the Riya Art Palace team.
              </p>

              <div className="al-brand-features">
                <div className="al-brand-feature">
                  <div className="al-brand-feature-icon">
                    <Package size={17} strokeWidth={1.75} />
                  </div>
                  <div className="al-brand-feature-text">
                    <strong>Product Catalogue</strong>
                    <span>Add, edit &amp; manage inventory</span>
                  </div>
                </div>
                <div className="al-brand-feature">
                  <div className="al-brand-feature-icon">
                    <ShoppingBag size={17} strokeWidth={1.75} />
                  </div>
                  <div className="al-brand-feature-text">
                    <strong>Orders &amp; Enquiries</strong>
                    <span>Track and respond to customers</span>
                  </div>
                </div>
                <div className="al-brand-feature">
                  <div className="al-brand-feature-icon">
                    <LayoutDashboard size={17} strokeWidth={1.75} />
                  </div>
                  <div className="al-brand-feature-text">
                    <strong>Dashboard Overview</strong>
                    <span>Insights at a glance</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="al-brand-footer">
              <span className="al-brand-footer-dot" aria-hidden="true" />
              <span>Jaipur, Rajasthan · Est. 1995</span>
            </div>
          </aside>

          <main className="al-form-panel">
            <div className="al-form-wrap">
              <div className="al-logo-wrap">
                <Image
                  src={logo}
                  alt="Riya Art Palace"
                  width={140}
                  height={44}
                  style={{ height: 44, width: "auto", objectFit: "contain" }}
                  priority
                />
              </div>

              <div className="al-form-header">
                <h2 className="al-form-title">Sign in</h2>
                <p className="al-form-sub">
                  Enter your credentials to access the admin dashboard
                </p>
              </div>

              {error && (
                <div className="al-error" role="alert">
                  <AlertCircle size={16} strokeWidth={2} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="al-field">
                  <label className="al-label" htmlFor="admin-email">
                    Email address
                  </label>
                  <div className="al-input-wrap">
                    <span className="al-input-icon">
                      <Mail size={16} strokeWidth={1.75} />
                    </span>
                    <input
                      id="admin-email"
                      type="email"
                      className="al-input"
                      placeholder="admin@riyaartpalace.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="al-field">
                  {/* <div className="al-label-row">
                    <label className="al-label" htmlFor="admin-password">
                      Password
                    </label>
                    <a href="#" className="al-forgot">
                      Forgot password?
                    </a>
                  </div> */}
                  <div className="al-input-wrap">
                    <span className="al-input-icon">
                      <Lock size={16} strokeWidth={1.75} />
                    </span>
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      className="al-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="al-eye-btn"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={16} strokeWidth={1.75} />
                      ) : (
                        <Eye size={16} strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="al-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="al-spinner" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight size={16} strokeWidth={2} />
                    </>
                  )}
                </button>
              </form>

              <div className="al-security-note">
                <ShieldCheck size={13} strokeWidth={2} color="#A3A3A3" />
                Authorized personnel only
              </div>

              <p className="al-footer">
                <Link href="/">← Back to website</Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
