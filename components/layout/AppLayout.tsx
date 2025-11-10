"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "./CommandPalette";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex bg-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto bg-background p-6 md:p-8 lg:p-10">
          <div className="max-w-[1800px] mx-auto">
          {children}
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

