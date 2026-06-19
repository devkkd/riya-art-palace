"use client";

import {
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import AdminShell from "@/app/components/admin/AdminShell";

const STATS = [
  { label: "Total Products", value: "500+", icon: Package },
  { label: "Active Orders", value: "—", icon: ShoppingBag },
  { label: "Enquiries", value: "—", icon: MessageSquare },
  { label: "Export Countries", value: "40+", icon: LayoutDashboard },
];

const QUICK_ACTIONS = [
  { title: "Manage Products", desc: "Add, edit & organize catalogue", icon: Package },
  { title: "View Orders", desc: "Track customer orders", icon: ShoppingBag },
  { title: "Enquiries", desc: "Respond to customer messages", icon: MessageSquare },
];

function DashboardContent() {
  return (
    <>
      <section className="adm-welcome">
        <h2>Admin Dashboard</h2>
        <p>
          You&apos;re signed in securely. Product management, orders, and enquiries
          modules will be available here as they are built out.
        </p>
      </section>

      <section className="adm-stats">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="adm-stat-card">
              <div className="adm-stat-icon">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <div className="adm-stat-val">{stat.value}</div>
              <div className="adm-stat-label">{stat.label}</div>
            </div>
          );
        })}
      </section>

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-head">
            <h3 className="adm-card-title">Quick Actions</h3>
            <span className="adm-card-tag">Coming soon</span>
          </div>
          <div className="adm-quick-list">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.title} className="adm-quick-item disabled">
                  <div className="adm-quick-icon">
                    <Icon size={16} strokeWidth={1.75} />
                  </div>
                  <div className="adm-quick-text">
                    <strong>{action.title}</strong>
                    <span>{action.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h3 className="adm-card-title">Session</h3>
            <ShieldCheck size={18} color="#A8653F" strokeWidth={1.75} />
          </div>
          <div className="adm-session-info">
            <div className="adm-session-row">
              <span>Status</span>
              <span style={{ color: "#16A34A" }}>Authenticated</span>
            </div>
            <div className="adm-session-row">
              <span>Access level</span>
              <span>Administrator</span>
            </div>
            <div className="adm-session-row">
              <span>Token</span>
              <span>HTTP-only cookie</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <DashboardContent />
    </AdminShell>
  );
}
