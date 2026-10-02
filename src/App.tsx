import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { FavoritesProvider } from '@/lib/FavoritesContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/layout/Layout';
// Pages
import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import ListingDetail from '@/pages/ListingDetail';
import BookingFlow from '@/pages/BookingFlow';
import AppointmentBooking from '@/pages/AppointmentBooking';
import Dashboard from '@/pages/Dashboard';
import HostDashboard from '@/pages/HostDashboard';
import Messages from '@/pages/Messages';
import About from '@/pages/About';
import Concierge from '@/pages/Concierge';
import Press from '@/pages/Press';
import HelpCenter from '@/pages/HelpCenter';
import Cancellation from '@/pages/Cancellation';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Report from '@/pages/Report';
import NotFound from '@/pages/NotFound';
// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

const AuthenticatedApp: React.FC = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-secondary border-t-foreground rounded-full animate-spin"></div>
      </div>
    );
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
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
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

