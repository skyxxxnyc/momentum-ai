import React, { useEffect } from 'react';
import { useCrmStore } from '@/stores/crm-store';
export function AppInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useCrmStore(s => s.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);
  return <>{children}</>;
}