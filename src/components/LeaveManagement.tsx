
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CalendarCheck, CalendarMinus, Filter, Search, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

type LeaveRequest = {
  _id: string;
  id: string;
  requestId: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
    department: string;
    employeeId: string;
    position?: string;
  };
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  approvedOn?: string;
  rejectedOn?: string;
  rejectionReason?: string;
  approvedBy?: string;
  rejectedBy?: string;
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Mock departments
const DEPARTMENTS = ["All", "Engineering", "Design", "Product", "Marketing", "Infrastructure", "Finance", "HR", "Sales"];

const LeaveManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    todayAbsences: 0,
    thisMonth: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("hrms_token");
    if (!token) {
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }
    fetchLeaveRequests();
  }, [navigate]);

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/leave', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("hrms_token");
          navigate("/login");
          return;
        }
        throw new Error(errorData.error || 'Failed to fetch leave requests');
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data || !data.data || !Array.isArray(data.data)) {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format received from server');
      }

      // Transform the data to match our expected format
      const validLeaveRequests = data.data.map((leave: any) => ({
        _id: leave._id,
        id: leave.id,
        requestId: leave.requestId,
        employeeId: {
          _id: leave.employeeId._id,
          name: leave.employeeId.name,
          email: leave.employeeId.email,
          department: leave.employeeId.department,
          position: leave.employeeId.position || 'N/A',
          employeeId: leave.employeeId.employeeId
        },
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        duration: leave.duration,
        reason: leave.reason,
        status: leave.status,
        createdAt: leave.createdAt,
        approvedOn: leave.approvedOn,
        rejectedOn: leave.rejectedOn,
        rejectionReason: leave.rejectionReason,
        approvedBy: leave.approvedBy,
        rejectedBy: leave.rejectedBy
      }));

      console.log('Transformed leave requests:', validLeaveRequests);
      setLeaveRequests(validLeaveRequests);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const pendingCount = validLeaveRequests.filter((leave: LeaveRequest) => 
        leave.status === "pending"
      ).length;

      const todayAbsences = validLeaveRequests.filter((leave: LeaveRequest) => {
        const startDate = new Date(leave.startDate);
        startDate.setHours(0, 0, 0, 0);
        return startDate.getTime() === today.getTime() && leave.status === "approved";
      }).length;
      
      const thisMonth = validLeaveRequests.filter((leave: LeaveRequest) => {
        const leaveDate = new Date(leave.createdAt);
        return leaveDate.getMonth() === today.getMonth() && leaveDate.getFullYear() === today.getFullYear();
      }).length;

      setStats({
        pending: pendingCount,
        todayAbsences,
        thisMonth
      });
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load leave requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedLeave) return;

    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/leave/${selectedLeave._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          approvedBy: user?.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("hrms_token");
          navigate("/login");
          return;
        }
        throw new Error(errorData.error || 'Failed to approve leave request');
      }

      toast.success('Leave request approved successfully!');
      fetchLeaveRequests();
      setSelectedLeave(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve leave request');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedLeave || !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/leave/${selectedLeave._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason,
          rejectedBy: user?.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("hrms_token");
          navigate("/login");
          return;
        }
        throw new Error(errorData.error || 'Failed to reject leave request');
      }

      toast.success('Leave request rejected successfully!');
      fetchLeaveRequests();
      setSelectedLeave(null);
      setRejectionReason("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reject leave request');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Apply filters with null checks
  const filteredLeaveRequests = leaveRequests.filter(leave => {
    if (!leave || !leave.employeeId) return false;

    const matchesSearch = 
      (leave.employeeId.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (leave.employeeId.employeeId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (leave.reason?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === "All" || leave.employeeId.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || leave.status?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Leave Management</h2>
        <p className="text-muted-foreground">
          Review and process employee leave requests.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <span>Pending Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.pending}
            </div>
            <p className="text-sm text-muted-foreground">
              Requests awaiting your review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Today's Absences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.todayAbsences}</div>
            <p className="text-sm text-muted-foreground">
              Employees on leave today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>This Month</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.thisMonth}</div>
            <p className="text-sm text-muted-foreground">
              Leave requests this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle className="flex items-center">
              <CalendarCheck className="mr-2" />
              <span>Leave Requests</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex-1 sm:max-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLeaveRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No leave requests found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="py-3 px-4 text-left font-medium">Employee</th>
                    <th className="py-3 px-4 text-left font-medium">Leave Type</th>
                    <th className="py-3 px-4 text-left font-medium">Duration</th>
                    <th className="py-3 px-4 text-left font-medium">Applied On</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaveRequests.map((leave) => (
                    <tr key={leave._id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{leave.employeeId?.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{leave.employeeId?.department || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{leave.leaveType || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p>{formatDate(leave.startDate)} {leave.startDate !== leave.endDate && `- ${formatDate(leave.endDate)}`}</p>
                          <p className="text-xs text-muted-foreground">{leave.duration} day{leave.duration > 1 ? 's' : ''}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatDate(leave.createdAt)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          leave.status === "approved" 
                            ? "bg-green-100 text-green-800" 
                            : leave.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                        }`}>
                          {(leave.status || 'pending').charAt(0).toUpperCase() + (leave.status || 'pending').slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedLeave(leave)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Leave Request Details</DialogTitle>
                            </DialogHeader>
                            
                            {selectedLeave && (
                              <div className="space-y-6 py-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="text-xl font-bold">{selectedLeave.employeeId.name}</h3>
                                      <p className="text-muted-foreground">{selectedLeave.employeeId.position || 'N/A'} - {selectedLeave.employeeId.department}</p>
                                      <p className="text-xs text-muted-foreground mt-1">Employee ID: {selectedLeave.employeeId.employeeId}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Leave Type</p>
                                      <p className="font-medium">{selectedLeave.leaveType}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Duration</p>
                                      <p>{formatDate(selectedLeave.startDate)} {selectedLeave.startDate !== selectedLeave.endDate && ` - ${formatDate(selectedLeave.endDate)}`}</p>
                                      <p className="text-sm">{selectedLeave.duration} day{selectedLeave.duration > 1 ? 's' : ''}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Reason</p>
                                      <p>{selectedLeave.reason}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        selectedLeave.status === "approved" 
                                          ? "bg-green-100 text-green-800" 
                                          : selectedLeave.status === "rejected"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-orange-100 text-orange-800"
                                      }`}>
                                        {selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                                      </span>
                                    </div>
                                    
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Applied On</p>
                                      <p>{formatDate(selectedLeave.createdAt)}</p>
                                    </div>
                                    
                                    {selectedLeave.status === "approved" && selectedLeave.approvedOn && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Approved On</p>
                                        <p>{formatDate(selectedLeave.approvedOn)}</p>
                                        {selectedLeave.approvedBy && (
                                          <p className="text-xs text-muted-foreground">by {selectedLeave.approvedBy}</p>
                                        )}
                                      </div>
                                    )}
                                    
                                    {selectedLeave.status === "rejected" && selectedLeave.rejectedOn && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Rejected On</p>
                                        <p>{formatDate(selectedLeave.rejectedOn)}</p>
                                        {selectedLeave.rejectedBy && (
                                          <p className="text-xs text-muted-foreground">by {selectedLeave.rejectedBy}</p>
                                        )}
                                      </div>
                                    )}
                                    
                                    {selectedLeave.status === "rejected" && selectedLeave.rejectionReason && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Rejection Reason</p>
                                        <p>{selectedLeave.rejectionReason}</p>
                                      </div>
                                    )}
                                    
                                    {selectedLeave.status === "pending" && (
                                      <div className="pt-4">
                                        <div className="flex gap-3">
                                          <Button 
                                            onClick={handleApprove}
                                            className="flex-1 flex items-center justify-center gap-2"
                                            disabled={isActionLoading}
                                          >
                                            <CalendarCheck className="h-4 w-4" />
                                            <span>{isActionLoading ? "Approving..." : "Approve"}</span>
                                          </Button>
                                          
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button 
                                                variant="outline"
                                                className="flex-1 flex items-center justify-center gap-2"
                                              >
                                                <CalendarMinus className="h-4 w-4" />
                                                <span>Reject</span>
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                              <DialogHeader>
                                                <DialogTitle>Reject Leave Request</DialogTitle>
                                                <DialogDescription>
                                                  Please provide a reason for rejecting this leave request.
                                                </DialogDescription>
                                              </DialogHeader>
                                              <div className="py-4">
                                                <Textarea 
                                                  placeholder="Enter reason for rejection..."
                                                  value={rejectionReason}
                                                  onChange={(e) => setRejectionReason(e.target.value)}
                                                  rows={4}
                                                />
                                              </div>
                                              <DialogFooter>
                                                <DialogClose asChild>
                                                  <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button 
                                                  variant="destructive" 
                                                  onClick={handleReject}
                                                  disabled={isActionLoading}
                                                >
                                                  {isActionLoading ? "Rejecting..." : "Reject Request"}
                                                </Button>
                                              </DialogFooter>
                                            </DialogContent>
                                          </Dialog>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveManagement;


