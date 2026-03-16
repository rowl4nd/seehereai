import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import GuestChat from "./pages/GuestChat";
import Mirror from "./pages/Mirror";
import Credits from "./pages/Credits";
import Cooldown from "./pages/Cooldown";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import PaymentSuccess from "./pages/PaymentSuccess";
import ResetPassword from "./pages/ResetPassword";
import SessionHistory from "./pages/SessionHistory";
import Contact from "./pages/Contact";
import MentalClarity from "./pages/MentalClarity";
import WorkStress from "./pages/WorkStress";
import SupportAlternative from "./pages/SupportAlternative";
import Blog from "./pages/Blog";
import NHSWaitingList from "./pages/NHSWaitingList";
import AffordableMentalHealth from "./pages/AffordableMentalHealth";
import AIEmotionalSupport from "./pages/AIEmotionalSupport";
import AnxietySupport from "./pages/AnxietySupport";
import TalkingToSomeone from "./pages/TalkingToSomeone";
import FounderStory from "./pages/FounderStory";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/try" element={<GuestChat />} />
            <Route path="/mirror" element={<Mirror />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/cooldown" element={<Cooldown />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/history/:sessionId" element={<SessionHistory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog/mental-clarity" element={<MentalClarity />} />
            <Route path="/blog/work-stress" element={<WorkStress />} />
            <Route path="/blog/support-alternative" element={<SupportAlternative />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/nhs-waiting-list" element={<NHSWaitingList />} />
            <Route path="/blog/affordable-mental-health-support" element={<AffordableMentalHealth />} />
            <Route path="/blog/ai-emotional-support" element={<AIEmotionalSupport />} />
            <Route path="/blog/anxiety-support" element={<AnxietySupport />} />
            <Route path="/blog/talking-to-someone" element={<TalkingToSomeone />} />
            <Route path="/blog/our-story" element={<FounderStory />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
