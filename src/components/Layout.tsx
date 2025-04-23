
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: ReactNode;
  requiredRole?: "hr" | "employee";
};

const Layout = ({ children, requiredRole }: LayoutProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect if wrong role
  if (requiredRole && user?.role !== requiredRole) {
    const redirectTo = user?.role === "hr" ? "/hr-dashboard" : "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
};

export default Layout;
