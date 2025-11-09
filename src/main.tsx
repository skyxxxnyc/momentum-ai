import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { DashboardPage } from '@/pages/DashboardPage';
import { DealsPage } from '@/pages/DealsPage';
import { ContactsPage } from '@/pages/ContactsPage';
import { CompaniesPage } from '@/pages/CompaniesPage';
import { AiChat } from '@/components/AiChat';
import { SettingsPage } from '@/pages/SettingsPage';
import { KnowledgeHubPage } from '@/pages/KnowledgeHubPage';
import { ArticleDetailPage } from '@/pages/ArticleDetailPage';
import { IcpPage } from '@/pages/IcpPage';
import { LeadsPage } from '@/pages/LeadsPage';
import { useCrmStore } from './stores/crm-store';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "deals", element: <DealsPage /> },
      { path: "leads", element: <LeadsPage /> },
      { path: "contacts", element: <ContactsPage /> },
      { path: "companies", element: <CompaniesPage /> },
      { path: "icps", element: <IcpPage /> },
      { path: "knowledge-hub", element: <KnowledgeHubPage /> },
      { path: "knowledge-hub/:articleId", element: <ArticleDetailPage /> },
      { path: "chat", element: <AiChat /> },
      { path: "settings", element: <SettingsPage /> },
    ]
  },
]);
function AppInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useCrmStore(s => s.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);
  return <>{children}</>;
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
    </ErrorBoundary>
  </StrictMode>,
)