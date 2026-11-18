import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MarketingLayout from './components/layout/MarketingLayout';
import ProtectedRoute, { GuestRoute } from './components/layout/ProtectedRoute';
import { PageLoader } from './components/ui/Spinner';
import Landing from './pages/Landing';
import { Login, Register } from './pages/Auth';
import NotFound from './pages/NotFound';

// Dashboard code (and the chart library) only loads after sign-in, keeping the landing page fast.
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const Overview = lazy(() => import('./pages/dashboard/Overview'));
const Projects = lazy(() => import('./pages/dashboard/Projects'));
const ProjectBoard = lazy(() => import('./pages/dashboard/ProjectBoard'));
const Team = lazy(() => import('./pages/dashboard/Team'));
const Billing = lazy(() => import('./pages/dashboard/Billing'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AppRoutes />
    </Suspense>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectBoard />} />
          <Route path="team" element={<Team />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
