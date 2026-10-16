import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { FavoritesProvider } from '@/lib/FavoritesContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import PageLoadingScreen from '@/components/ui/PageLoadingScreen';

// Eager load Home for instant First Contentful Paint
import Home from '@/pages/Home';

// Lazy-load all remaining pages for optimal Lighthouse bundle splitting
const Explore = lazy(() => import('@/pages/Explore'));
const ListingDetail = lazy(() => import('@/pages/ListingDetail'));
const BookingFlow = lazy(() => import('@/pages/BookingFlow'));
const AppointmentBooking = lazy(() => import('@/pages/AppointmentBooking'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const HostDashboard = lazy(() => import('@/pages/HostDashboard'));
const Messages = lazy(() => import('@/pages/Messages'));
const About = lazy(() => import('@/pages/About'));
const Concierge = lazy(() => import('@/pages/Concierge'));
const Press = lazy(() => import('@/pages/Press'));
const Experiences = lazy(() => import('@/pages/Experiences'));
const ExperienceDetail = lazy(() => import('@/pages/ExperienceDetail'));
const Destinations = lazy(() => import('@/pages/Destinations'));
const Deals = lazy(() => import('@/pages/Deals'));
const Journal = lazy(() => import('@/pages/Journal'));
const HelpCenter = lazy(() => import('@/pages/HelpCenter'));
const Cancellation = lazy(() => import('@/pages/Cancellation'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Report = lazy(() => import('@/pages/Report'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const PhotoCredits = lazy(() => import('@/pages/PhotoCredits'));

const AuthenticatedApp: React.FC = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return <PageLoadingScreen message="Haven" submessage="Authenticating session…" />;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Suspense fallback={<PageLoadingScreen message="Haven" submessage="Opening sanctuary…" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/experiences/:id" element={<ExperienceDetail />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/concierge" element={<Concierge />} />
          <Route path="/press" element={<Press />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/cancellation" element={<Cancellation />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/report" element={<Report />} />
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/photo-credits" element={<PhotoCredits />} />
          <Route path="/credits" element={<PhotoCredits />} />
          <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
            <Route path="/booking/:id" element={<BookingFlow />} />
            <Route path="/appointment/:id" element={<AppointmentBooking />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/messages" element={<Messages />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </QueryClientProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

