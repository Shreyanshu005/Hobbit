import {
  createHashRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { RootLayout } from './components/RootLayout';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { ReactNode } from 'react';

const OnboardingPage = lazy(() => import('./features/onboarding/OnboardingPage'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const PlanDetailPage = lazy(() => import('./features/techniques/PlanDetailPage'));
const TechniqueDetailPage = lazy(() => import('./features/techniques/TechniqueDetailPage'));
const CompletionPage = lazy(() => import('./features/completion/CompletionPage'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'onboarding',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <OnboardingPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'plan/:hobbyId',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner message="Loading your path..." />}>
              <PlanDetailPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'technique/:hobbyId/:techniqueId',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner message="Loading technique..." />}>
              <TechniqueDetailPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'completion/:hobbyId',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <CompletionPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<div className="h-full flex items-center justify-center min-h-[60vh]"><LoadingSpinner size={200} fullHeight={false} /></div>}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<div className="h-full flex items-center justify-center min-h-[60vh]"><LoadingSpinner size={200} fullHeight={false} /></div>}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'collection/:collectionId',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <OnboardingPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
