
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  CalendarCheck, 
  ChartBar,
  CalendarX
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

type Department = {
  _id: string;
  departmentId: string;
  departmentName: string;
  managerId: string;
  createdAt: string;
  employeeCount?: number;
};

type LeaveRequest = {
  _id: string;
  requestId: string;
  employeeId: {
    _id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
  leaveType: string;
  status: string;
};

type Attendance = {
  _id: string;
  attendanceId: string;
  employeeId: {
    _id: string;
    name: string;
  };
  date: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
};

const HRDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "HR Dashboard | WorkWise HRMS";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch departments
      console.log('Fetching departments...');
      const deptResponse = await fetch('http://localhost:5000/api/departments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!deptResponse.ok) {
        console.error('Department fetch failed:', deptResponse.status, deptResponse.statusText);
        if (deptResponse.status === 401) {
          localStorage.removeItem("hrms_token");
          navigate("/login");
          return;
        }
        throw new Error('Failed to fetch departments');
      }

      const deptData = await deptResponse.json();
      console.log('Department data:', deptData);
      
      // Fetch employees
      console.log('Fetching employees...');
      const empResponse = await fetch('http://localhost:5000/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!empResponse.ok) {
        console.error('Employee fetch failed:', empResponse.status, empResponse.statusText);
        throw new Error('Failed to fetch employees');
      }

      const empData = await empResponse.json();
      console.log('Employee data:', empData);

      // Calculate employee count for each department
      console.log('Calculating department counts...');
      const departmentsWithCount = deptData.data.map((dept: Department) => {
        const count = empData.data.filter((emp: any) => {
          const isDeptMatch = emp.department && (
            emp.department === dept._id ||
            emp.department._id === dept._id ||
            emp.departmentId === dept._id
          );
          console.log(`Department ${dept.departmentName} - Employee ${emp.name} - Match: ${isDeptMatch}`);
          return isDeptMatch;
        }).length;
        console.log(`Department ${dept.departmentName} total count: ${count}`);
        return {
          ...dept,
          employeeCount: count
        };
      });

      // Fetch leave requests
      console.log('Fetching leave requests...');
      const leaveResponse = await fetch('http://localhost:5000/api/leave', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!leaveResponse.ok) {
        console.error('Leave request fetch failed:', leaveResponse.status, leaveResponse.statusText);
        throw new Error('Failed to fetch leave requests');
      }

      const leaveData = await leaveResponse.json();
      console.log('Leave request data:', leaveData);
      setLeaveRequests(leaveData.data);

      // Fetch today's attendance
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10);  // YYYY-MM-DD format
      
      console.log('Current date:', today.toLocaleDateString());
      console.log('Fetching attendance for:', formattedDate);
      
      try {
        const attendanceResponse = await fetch(`http://localhost:5000/api/attendance/date/${formattedDate}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!attendanceResponse.ok) {
          console.error('Attendance fetch failed:', attendanceResponse.status, attendanceResponse.statusText);
          // Create default attendance records for all employees
          const defaultAttendance = empData.data.map((emp: any) => ({
            _id: emp._id,
            employeeId: {
              _id: emp._id,
              name: emp.name
            },
            date: formattedDate,
            status: 'not_checked_in',
            checkInTime: null,
            checkOutTime: null
          }));
          console.log('Created default attendance records:', defaultAttendance);
          setTodayAttendance(defaultAttendance);
        } else {
          const attendanceData = await attendanceResponse.json();
          setTodayAttendance(attendanceData.data || []);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setTodayAttendance([]);
      }

      setDepartments(departmentsWithCount);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const getPendingLeaveRequests = () => {
    return leaveRequests.filter(leave => leave.status.toLowerCase() === 'pending').length;
  };

  const getAbsentCount = () => {
    if (!todayAttendance || todayAttendance.length === 0) {
      return { absent: 0, present: 0 };
    }
    
    const present = todayAttendance.filter(record => record.checkInTime).length;
    const absent = todayAttendance.filter(record => record.status?.toLowerCase() === 'absent').length;
    
    return { absent, present };
  };

  return (
    <Layout requiredRole="hr">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {departments.reduce((total, dept) => total + (dept.employeeCount || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {departments.length} departments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveRequests.length}</div>
              <p className="text-xs text-muted-foreground">
                {getPendingLeaveRequests()} pending approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
              <CalendarX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAbsentCount().present}</div>
              <p className="text-xs text-muted-foreground">
                {todayAttendance.length - getAbsentCount().present} not checked in
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
              <CardTitle>Recent Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaveRequests.slice(0, 3).map((leave) => (
                  <div key={leave._id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{leave.employeeId.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      leave.status.toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-800' :
                      leave.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Department Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  departments.map((dept) => (
                    <div key={dept._id} className="grid grid-cols-2 gap-2 border-b pb-2">
                      <div>
                        <p className="font-medium">{dept.departmentName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{dept.employeeCount || 0}</p>
                        <p className="text-xs text-muted-foreground">employees</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HRDashboard;

