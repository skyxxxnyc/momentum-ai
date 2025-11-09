import React from 'react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { motion } from 'framer-motion';
interface AppLayoutProps {
  children: React.ReactNode;
}
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="flex-1 overflow-y-auto flex flex-col"
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </div>
  );
}