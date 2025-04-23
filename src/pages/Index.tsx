
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    document.title = "WorkWise HRMS - Login";
  }, []);

  // Redirect to appropriate dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to={user?.role === "hr" ? "/hr-dashboard" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-hrms-lightGray p-4">
      <div className="text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-4xl mx-auto">
          <div className="flex-1 max-w-md">
            <h1 className="text-4xl font-bold text-hrms-purple mb-4">WorkWise HRMS</h1>
            <p className="text-xl mb-8 text-gray-600">
              Complete Human Resource Management System for modern organizations
            </p>
            <div className="space-y-4 text-left bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-2">
                <div className="bg-hrms-purple text-white p-1 rounded-full mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div>
                  <h3 className="font-medium">Employee & HR Portals</h3>
                  <p className="text-sm text-gray-600">Separate dashboards for different roles</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-hrms-purple text-white p-1 rounded-full mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div>
                  <h3 className="font-medium">Complete HR Management</h3>
                  <p className="text-sm text-gray-600">Leave, attendance, recruitment & payroll</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-hrms-purple text-white p-1 rounded-full mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div>
                  <h3 className="font-medium">Secure & Reliable</h3>
                  <p className="text-sm text-gray-600">Role-based access control for all features</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
