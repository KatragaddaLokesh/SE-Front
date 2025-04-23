
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  CalendarCheck, 
  ChartBar,
  CalendarX
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const HRDashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "HR Dashboard | WorkWise HRMS";
  }, []);

  return (
    <Layout requiredRole="hr">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">
                +4 hired this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                3 in final interview stage
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                6 pending approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <CalendarX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                5 approved, 2 unplanned
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link 
                to="/hr-dashboard/employees" 
                className="flex items-center p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
              >
                <Users className="mr-2 h-5 w-5" />
                <span>Manage Employees</span>
              </Link>
              <Link 
                to="/hr-dashboard/recruitment" 
                className="flex items-center p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                <span>Review Applications</span>
              </Link>
              <Link 
                to="/hr-dashboard/leave-management" 
                className="flex items-center p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
              >
                <CalendarCheck className="mr-2 h-5 w-5" />
                <span>Review Leave Requests</span>
              </Link>
              <Link 
                to="/hr-dashboard/payroll" 
                className="flex items-center p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
              >
                <ChartBar className="mr-2 h-5 w-5" />
                <span>Process Payroll</span>
              </Link>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-xs text-muted-foreground">Frontend Developer</p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">New</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Michael Brown</p>
                    <p className="text-xs text-muted-foreground">UX Designer</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Interview</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">Project Manager</p>
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Review</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Department Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 border-b pb-2">
                  <div>
                    <p className="font-medium">Engineering</p>
                    <p className="text-xs text-muted-foreground">42 employees</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">2 open roles</p>
                    <p className="text-xs text-muted-foreground">3 on leave today</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b pb-2">
                  <div>
                    <p className="font-medium">Marketing</p>
                    <p className="text-xs text-muted-foreground">18 employees</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">1 open role</p>
                    <p className="text-xs text-muted-foreground">1 on leave today</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b pb-2">
                  <div>
                    <p className="font-medium">Finance</p>
                    <p className="text-xs text-muted-foreground">12 employees</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">0 open roles</p>
                    <p className="text-xs text-muted-foreground">2 on leave today</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HRDashboard;

