"use client";

import { useState } from "react";
import { AppSidebar, MobileSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h2h-app flex min-h-screen">
      <AppSidebar />
      <MobileSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar onMenu={() => setMenuOpen(true)} />
        <div className="flex-1 bg-[#fafbf4] px-4 py-6 sm:px-6 lg:px-7">{children}</div>
      </div>
    </div>
  );
}
