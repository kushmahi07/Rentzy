import { Switch, Route } from "wouter";
import { queryClient } from "@/shared/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/features/auth/login";
import VerifyOtp from "@/features/auth/verify-otp";
import AdminDashboard from "@/features/dashboard/admin-dashboard";
import RoleManagement from "@/features/role-management/role-management";
import PropertyManagement from "@/features/property-management/property-management";
import SecondaryMarketplace from "@/features/secondary-marketplace/secondary-marketplace";
import InvestmentOversight from "@/features/investment-oversight/investment-oversight";
import TokenizationDashboard from "@/features/tokenization/tokenization-dashboard";
import PropertyDetails from "@/features/property-management/property-details";
import NotFound from "@/shared/not-found";
// Added import for BookingManagement
import BookingManagement from "@/features/booking-management/booking-management";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/verify-otp" component={VerifyOtp} />
      <Route path="/dashboard" component={AdminDashboard} />
      <Route path="/role-management" component={RoleManagement} />
      <Route path="/property-management" component={PropertyManagement} />
      <Route path="/secondary-marketplace" component={SecondaryMarketplace} />
      <Route path="/investment-oversight" component={InvestmentOversight} />
      <Route path="/tokenization-dashboard" component={TokenizationDashboard} />
      <Route path="/property-details/:id" component={PropertyDetails} />
      {/* Added route for BookingManagement */}
      <Route path="/booking-management" component={BookingManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;