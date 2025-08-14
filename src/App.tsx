import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Missions from "./pages/Missions";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import TacticalCenter from "./pages/TacticalCenter";
import AdvancedDashboard from "./pages/AdvancedDashboard";
import CreateMission from "./pages/CreateMission";
 
const queryClient = new QueryClient();
 
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Matrix background effect */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card opacity-90"></div>
            </div>
            
            <Navigation />
            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<AdvancedDashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/missions" element={<Missions />} />
                <Route path="/missions/new" element={<CreateMission />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tactical" element={<TacticalCenter />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
 
export default App;
