import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate
} from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { RootLayout } from './components/RootLayout';
import { useHobbyStore } from './stores/useHobbyStore';
import type { ReactNode } from 'react';


const OnboardingPage = lazy(() => import('./features/onboarding/OnboardingPage'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const PlanDetailPage = lazy(() => import('./features/techniques/PlanDetailPage'));
const TechniqueDetailPage = lazy(() => import('./features/techniques/TechniqueDetailPage'));


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const hobbies = useHobbyStore((state) => state.hobbies);
  if (hobbies.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

const router = createBrowserRouter([
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
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-slate-500">Loading...</div>}>
            <OnboardingPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-slate-500">Loading Dashboard...</div>}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'plan/:hobbyId',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-slate-500">Loading Plan...</div>}>
              <PlanDetailPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'technique/:hobbyId/:techniqueId',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-slate-500">Loading Technique...</div>}>
              <TechniqueDetailPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: <div className="flex items-center justify-center min-h-[60vh] text-slate-500">Settings coming soon...</div>,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
