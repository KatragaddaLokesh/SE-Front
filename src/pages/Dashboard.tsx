

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Briefcase, FileText, CalendarCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

type AttendanceRecord = {
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
};

const formatTime = (dateString: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const Dashboard = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Employee Dashboard | WorkWise HRMS";
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/attendance/employee/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }

      const data = await response.json();
      
      // Find today's attendance record
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayRecord = data.data.find((record: AttendanceRecord) => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
      });

      setTodayAttendance(todayRecord || null);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = () => {
    if (!todayAttendance) return "Not Checked In";
    if (todayAttendance.checkInTime && !todayAttendance.checkOutTime) return "Present";
    if (todayAttendance.checkInTime && todayAttendance.checkOutTime) return "Completed";
    return "Absent";
  };

  const getStatusColor = () => {
    if (!todayAttendance) return "text-gray-500";
    if (todayAttendance.checkInTime && !todayAttendance.checkOutTime) return "text-green-500";
    if (todayAttendance.checkInTime && todayAttendance.checkOutTime) return "text-blue-500";
    return "text-red-500";
  };

  return (
    <Layout requiredRole="employee">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your workplace activities and tools.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor()}`}>
                {isLoading ? "Loading..." : getStatusText()}
              </div>
              <p className="text-xs text-muted-foreground">
                {todayAttendance?.checkInTime 
                  ? `Checked in at ${formatTime(todayAttendance.checkInTime)}`
                  : "Not checked in yet"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 days</div>
              <p className="text-xs text-muted-foreground">
                Annual leave remaining
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
                to="/dashboard/attendance" 
                className="flex items-center p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
              >
                <Clock className="mr-2 h-5 w-5" />
                <span>Mark Attendance</span>
              </Link>
              <Link 
                to="/dashboard/leave-requests" 
                className="flex items-center p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
              >
                <CalendarCheck className="mr-2 h-5 w-5" />
                <span>Request Leave</span>
              </Link>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Annual Leave</p>
                    <p className="text-xs text-muted-foreground">May 10-12, 2025</p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Pending</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Sick Leave</p>
                    <p className="text-xs text-muted-foreground">April 5, 2025</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Approved</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

