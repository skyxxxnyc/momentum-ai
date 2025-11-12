import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode } from 'react'
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
import { AppInitializer } from './components/AppInitializer';
import { ArticleListPage } from './pages/admin/ArticleListPage';
import { ArticleEditorPage } from './pages/admin/ArticleEditorPage';
import { TeamPage } from './pages/TeamPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MyHubPage } from './pages/MyHubPage';
import { SalesCollateralPage } from './pages/SalesCollateralPage';
import { TasksPage } from './pages/TasksPage';
import { GoalsPage } from './pages/GoalsPage';
import { ReportingPage } from './pages/ReportingPage';
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "my-hub", element: <MyHubPage /> },
      { path: "deals", element: <DealsPage /> },
      { path: "leads", element: <LeadsPage /> },
      { path: "contacts", element: <ContactsPage /> },
      { path: "companies", element: <CompaniesPage /> },
      { path: "icps", element: <IcpPage /> },
      { path: "team", element: <TeamPage /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "goals", element: <GoalsPage /> },
      { path: "reporting", element: <ReportingPage /> },
      { path: "sales-collateral", element: <SalesCollateralPage /> },
      { path: "knowledge-hub", element: <KnowledgeHubPage /> },
      { path: "knowledge-hub/:articleId", element: <ArticleDetailPage /> },
      { path: "chat", element: <AiChat /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "admin/articles", element: <ArticleListPage /> },
      { path: "admin/articles/new", element: <ArticleEditorPage /> },
      { path: "admin/articles/edit/:articleId", element: <ArticleEditorPage /> },
    ]
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
    </ErrorBoundary>
  </StrictMode>,
)