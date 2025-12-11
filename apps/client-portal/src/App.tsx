import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OnboardingBusiness from './pages/onboarding/Business';
import OnboardingRequirements from './pages/onboarding/Requirements';
import OnboardingBudget from './pages/onboarding/Budget';
import OnboardingReview from './pages/onboarding/Review';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Billing from './pages/Billing';
import Settings from './pages/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Onboarding Routes */}
        <Route
          path="/onboarding/business"
          element={
            <ProtectedRoute>
              <OnboardingBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/requirements"
          element={
            <ProtectedRoute>
              <OnboardingRequirements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/budget"
          element={
            <ProtectedRoute>
              <OnboardingBudget />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/review"
          element={
            <ProtectedRoute>
              <OnboardingReview />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
