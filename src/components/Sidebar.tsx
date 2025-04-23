
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  FileText,
  LogOut,
  Menu,
  Users,
  Briefcase,
  Clock,
  FileText as FileIcon,
  User,
  Calendar,
  ChartBar,
  FilePlus,
  Bell,
  Search,
} from "lucide-react";

type SidebarLink = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const employeeLinks: SidebarLink[] = [
    { href: "/dashboard", label: "Dashboard", icon: FileText },
    { href: "/dashboard/attendance", label: "Attendance", icon: Clock },
    { href: "/dashboard/leave-requests", label: "Leave Requests", icon: Calendar },
    { href: "/dashboard/job-roles", label: "Apply for Jobs", icon: Briefcase },
    { href: "/dashboard/department-work", label: "Department Work", icon: FileIcon },
  ];

  const hrLinks: SidebarLink[] = [
    { href: "/hr-dashboard", label: "Dashboard", icon: FileText },
    { href: "/hr-dashboard/employees", label: "Employees", icon: Users },
    { href: "/hr-dashboard/recruitment", label: "Recruitment", icon: FilePlus },
    { href: "/hr-dashboard/leave-management", label: "Leave Management", icon: CalendarCheck },
    { href: "/hr-dashboard/payroll", label: "Payroll", icon: ChartBar },
  ];

  const links = user?.role === "hr" ? hrLinks : employeeLinks;

  return (
    <div
      className={cn(
        "bg-sidebar h-screen flex flex-col text-sidebar-foreground transition-all duration-300 border-r border-sidebar-border relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="absolute right-0 top-4 -mr-3 z-10">
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full bg-primary text-primary-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={12} />
        </Button>
      </div>

      <div className="p-4 flex items-center justify-center border-b border-sidebar-border">
        <h1 className={cn("font-bold text-xl", collapsed ? "hidden" : "block")}>
          WorkWise HRMS
        </h1>
        {collapsed && <Bell size={24} />}
      </div>

      {user && (
        <div className="p-4 flex items-center space-x-3 border-b border-sidebar-border">
          <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User size={20} />
          </div>
          {!collapsed && (
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs opacity-70">{user.role === "hr" ? "HR Admin" : "Employee"}</p>
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={cn(
                  "flex items-center space-x-3 py-2 px-3 rounded-md transition-colors",
                  location.pathname === link.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <link.icon size={20} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center space-x-3 text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
            collapsed ? "justify-center" : ""
          )}
          onClick={logout}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
