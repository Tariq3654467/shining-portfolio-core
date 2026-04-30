import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import ActiveMembers from "./pages/ActiveMembers";
import PremiumPlans from "./pages/PremiumPlans";
import HappyStories from "./pages/HappyStories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Expectations from "./pages/Expectations";
import AdvancedSearch from "./pages/AdvancedSearch";
import Biodata from "./pages/Biodata";
import BioDataReview from "./pages/BioDataReview";
import Verification from "./pages/Verification";
import Features from "./pages/Features";
import NotFound from "./pages/NotFound";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

const queryClient = new QueryClient();

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" state={{ from: location }} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/active-members" element={<ActiveMembers />} />
              <Route path="/premium-plans" element={<PremiumPlans />} />
              <Route path="/happy-stories" element={<HappyStories />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/expectations" element={<Expectations />} />
              <Route path="/search" element={<AdvancedSearch />} />
              <Route path="/biodata" element={<ProtectedRoute><Biodata /></ProtectedRoute>} />
              <Route path="/biodata-review" element={<ProtectedRoute><BioDataReview /></ProtectedRoute>} />
              <Route path="/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
              <Route path="/features" element={<Features />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

