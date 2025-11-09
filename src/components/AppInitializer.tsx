import React, { useEffect } from 'react';
import { useCrmStore } from '@/stores/crm-store';
export function AppInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useCrmStore(s => s.initialize);
  const generateNotifications = useCrmStore(s => s.generateNotifications);
  useEffect(() => {
    const init = async () => {
      await initialize();
      // Simulate a background process that generates notifications
      await generateNotifications();
    };
    init();
  }, [initialize, generateNotifications]);
  return <>{children}</>;
}