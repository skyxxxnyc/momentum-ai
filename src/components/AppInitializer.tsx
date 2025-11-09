import React, { useEffect } from 'react';
import { useCrmStore } from '@/stores/crm-store';
import { useUserStore } from '@/stores/user-store';
export function AppInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useCrmStore(s => s.initialize);
  const generateNotifications = useCrmStore(s => s.generateNotifications);
  const isAuthenticated = useUserStore(s => s.isAuthenticated);
  useEffect(() => {
    const init = async () => {
      await initialize();
      // Simulate a background process that generates notifications
      await generateNotifications();
    };
    if (isAuthenticated) {
      init();
    }
  }, [initialize, generateNotifications, isAuthenticated]);
  return <>{children}</>;
}