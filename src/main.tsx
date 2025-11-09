import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
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
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "deals", element: <DealsPage /> },
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
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)