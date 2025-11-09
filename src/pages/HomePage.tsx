import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AnimatePresence, motion } from 'framer-motion';
export function HomePage() {
  const location = useLocation();
  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}