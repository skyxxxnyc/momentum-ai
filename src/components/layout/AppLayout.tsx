import React from 'react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
interface AppLayoutProps {
  children: React.ReactNode;
}
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}