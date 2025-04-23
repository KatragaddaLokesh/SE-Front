
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import HRDashboard from "./pages/HRDashboard";
import NotFound from "./pages/NotFound";

// Employee Components
import AttendanceSystem from "./components/AttendanceSystem";
import LeaveRequests from "./components/LeaveRequests";
import JobRoles from "./components/JobRoles";
import DepartmentWork from "./components/DepartmentWork";

// HR Components
import EmployeeManagement from "./components/EmployeeManagement";
import RecruitmentPanel from "./components/RecruitmentPanel";
import LeaveManagement from "./components/LeaveManagement";
import PayrollSystem from "./components/PayrollSystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Authentication */}
            <Route path="/" element={<Index />} />

            {/* Employee Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/attendance" element={<AttendanceSystem />} />
            <Route path="/dashboard/leave-requests" element={<LeaveRequests />} />
            <Route path="/dashboard/job-roles" element={<JobRoles />} />
            <Route path="/dashboard/department-work" element={<DepartmentWork />} />

            {/* HR Routes */}
            <Route path="/hr-dashboard" element={<HRDashboard />} />
            <Route path="/hr-dashboard/employees" element={<EmployeeManagement />} />
            <Route path="/hr-dashboard/recruitment" element={<RecruitmentPanel />} />
            <Route path="/hr-dashboard/leave-management" element={<LeaveManagement />} />
            <Route path="/hr-dashboard/payroll" element={<PayrollSystem />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
