import * as React from "react";

export interface AppLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const AppLayout = ({ header, sidebar, children }: AppLayoutProps) => (
  <div className="min-h-screen bg-background">
    <header className="border-b bg-card/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {header}
      </div>
    </header>
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6 lg:flex-row">
      <aside className="w-full max-w-xs flex-shrink-0 space-y-4 lg:sticky lg:top-6 lg:h-fit">
        {sidebar}
      </aside>
      <section className="flex-1">{children}</section>
    </main>
  </div>
);
