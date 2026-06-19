"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderTree,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";
import "./admin-panel.css";

const NAV_ITEMS = [
  { href: "/admin/dashboard",               label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin/dashboard/categories",    label: "Categories",    icon: Layers },
  { href: "/admin/dashboard/subcategories", label: "Subcategories", icon: FolderTree },
  { href: "/admin/dashboard/products",      label: "Products",      icon: Package },
  { href: "/admin/dashboard/orders",        label: "Orders",        icon: ShoppingBag },
  { href: "/admin/dashboard/users",         label: "Users",         icon: Users },
  { href: "#", label: "Enquiries", icon: MessageSquare, disabled: true },
];

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.success) {
          setAdmin(json.data.admin);
        } else {
          router.replace("/admin");
        }
      } catch {
        router.replace("/admin");
      } finally {
        setLoading(false);
      }
    }
    fetchAdmin();
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/admin");
    }
  }

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-loading-spinner" />
      </div>
    );
  }

  const initials = admin?.name
    ? admin.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <div className="adm-root">
      <button
        type="button"
        className={`adm-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close menu"
      />

      <div className="adm-layout">
        <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="adm-sidebar-accent" aria-hidden="true" />

          <div className="adm-sidebar-head">
            <div className="adm-sidebar-logo">
              <Image src={logo} alt="Riya Art Palace" width={100} height={36} priority />
              <div className="adm-sidebar-brand">
                Riya Art Palace
                <span>Admin Panel</span>
              </div>
            </div>
          </div>

          <nav className="adm-nav">
            <div className="adm-nav-label">Menu</div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = !item.disabled && pathname === item.href;

              if (item.disabled) {
                return (
                  <span key={item.label} className="adm-nav-link disabled">
                    <Icon size={18} strokeWidth={1.75} />
                    {item.label}
                    <span className="adm-nav-badge">Soon</span>
                  </span>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`adm-nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="adm-sidebar-foot">
            <button
              type="button"
              className="adm-logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut size={18} strokeWidth={1.75} />
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </aside>

        <div className="adm-main">
          <header className="adm-header">
            <div className="adm-header-left">
              <button
                type="button"
                className="adm-menu-btn"
                onClick={() => setSidebarOpen((o) => !o)}
                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <h1 className="adm-header-title">Dashboard</h1>
                <p className="adm-header-sub">Welcome back, {admin?.name || "Admin"}</p>
              </div>
            </div>

            <div className="adm-header-right">
              <div className="adm-user-chip">
                <div className="adm-user-avatar">{initials}</div>
                <div>
                  <div className="adm-user-name">{admin?.name}</div>
                  <div className="adm-user-email">{admin?.email}</div>
                </div>
              </div>
            </div>
          </header>

          <main className="adm-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
