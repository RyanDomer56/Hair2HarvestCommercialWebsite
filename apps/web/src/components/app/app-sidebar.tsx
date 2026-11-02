"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Store,
  Truck,
  Layers,
  Boxes,
  Cpu,
  FlaskConical,
  Sprout,
  FileText,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { shops, pickups, batches, labResults } from "@/lib/data";

export const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/shops", label: "Shops", icon: Store, badge: shops.length },
  {
    href: "/dashboard/pickups",
    label: "Pickups",
    icon: Truck,
    badge: pickups.filter((p) => p.status === "Scheduled").length,
  },
  {
    href: "/dashboard/batches",
    label: "Batches",
    icon: Layers,
    badge: batches.filter((b) => b.stage !== "Approved").length,
  },
  { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/machine", label: "Machine", icon: Cpu, dot: true },
  { href: "/dashboard/lab", label: "Lab results", icon: FlaskConical, badge: labResults.length },
  { href: "/dashboard/experiments", label: "Experiments", icon: Sprout },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
];

function useActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

export function NavItems({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const isActive = useActive();

  return (
    <ul className="space-y-0.5">
      {nav.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex h-10 items-center gap-2.5 rounded-[9px] px-2.5 text-[0.8125rem] font-medium transition-all",
                active
                  ? "border border-[#e6e9d2] bg-white text-[#33361a] shadow-[0_1px_2px_rgba(38,40,15,0.05),0_6px_16px_-12px_rgba(38,40,15,0.4)]"
                  : "border border-transparent text-[#6b6d4c] hover:bg-white/60 hover:text-[#33361a]",
                collapsed && "justify-center px-0",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={16} strokeWidth={1.9} className="shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold tabular-nums",
                    active
                      ? "bg-[#eef4d6] text-[#5d6432]"
                      : "bg-[#e9eed3] text-[#7a7f52] group-hover:bg-white",
                  )}
                >
                  {item.badge}
                </span>
              )}
              {!collapsed && item.dot && (
                <span className="size-1.5 rounded-full bg-[#7ba32b]" aria-hidden />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] transition-[width] duration-300 lg:flex",
        collapsed ? "w-[76px]" : "w-[248px]",
      )}
    >
      <div
        className={cn(
          "flex h-[76px] items-center gap-2.5 px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <Image
          src="/brand/h2h-mark.png"
          alt=""
          width={34}
          height={34}
          className="shrink-0"
          priority
        />
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.9375rem] font-semibold leading-tight tracking-[-0.03em] text-[#3a3d18]">
              Hair2Harvest
            </p>
            <p className="mt-0.5 truncate text-[0.625rem] text-[#83855f]">Admin workspace</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex size-7 items-center justify-center rounded-md text-[#83855f] transition-colors hover:bg-white/70 hover:text-[#3a3d18]",
            collapsed && "absolute right-1 top-1",
          )}
        >
          {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 pb-4" aria-label="Workspace">
        <p
          className={cn(
            "px-2.5 pb-2 pt-3 text-[0.5625rem] font-medium uppercase tracking-[0.16em] text-[#9a9c74]",
            collapsed && "sr-only",
          )}
        >
          Operations
        </p>
        <NavItems collapsed={collapsed} />

        {!collapsed && (
          <>
            <p className="px-2.5 pb-2 pt-6 text-[0.5625rem] font-medium uppercase tracking-[0.16em] text-[#9a9c74]">
              Access
            </p>
            <div className="mx-1 rounded-[10px] border border-[#e6e9d2] bg-white/70 p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-[#7a7f52]" />
                <span className="text-[0.6875rem] font-medium text-[#5d6432]">
                  Four roles, no shop logins
                </span>
              </div>
              <p className="mt-1.5 text-[0.625rem] leading-relaxed text-[#9a9c74]">
                Shops are records, not users. Staff register them on site.
              </p>
            </div>
          </>
        )}
      </nav>

      <div
        className={cn(
          "border-t border-[var(--sidebar-border)] p-2.5",
          collapsed && "flex justify-center",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-[10px] p-2 transition-colors hover:bg-white/70",
            collapsed && "p-1",
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#33361a] text-[0.6875rem] font-semibold text-[#f5fadf]">
            RC
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.75rem] font-medium text-[#33361a]">Ryan C. Domer</p>
              <p className="truncate text-[0.625rem] text-[#9a9c74]">ryandomer566@gmail.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[#26280f]/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Workspace navigation"
        className={cn(
          "absolute inset-y-0 left-0 flex w-[280px] flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] shadow-2xl transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[76px] items-center gap-2.5 px-4">
          <Image src="/brand/h2h-mark.png" alt="" width={34} height={34} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.9375rem] font-semibold tracking-[-0.03em] text-[#3a3d18]">
              Hair2Harvest
            </p>
            <p className="mt-0.5 text-[0.625rem] text-[#83855f]">Admin workspace</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex size-8 items-center justify-center rounded-lg text-[#83855f] hover:bg-white/70"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 pb-4" aria-label="Workspace mobile">
          <p className="px-2.5 pb-2 pt-3 text-[0.5625rem] font-medium uppercase tracking-[0.16em] text-[#9a9c74]">
            Operations
          </p>
          <NavItems onNavigate={onClose} />
        </nav>

        <div className="border-t border-[var(--sidebar-border)] p-3">
          <div className="flex items-center gap-2.5 rounded-[10px] bg-white/70 p-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#33361a] text-[0.6875rem] font-semibold text-[#f5fadf]">
              RC
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.75rem] font-medium text-[#33361a]">Ryan C. Domer</p>
              <p className="truncate text-[0.625rem] text-[#9a9c74]">ryandomer566@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
