
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarCheck, CalendarX, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

type LeaveRequest = {
  _id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
  approvedOn?: string;
  rejectedOn?: string;
  rejectionReason?: string;
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const LeaveRequests = () => {
  const { user } = useAuth();
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLeaveRequests();
    }
  }, [user]);

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/leave/employee/${user?.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch leave requests');
      }

      const data = await response.json();
      setLeaveRequests(data.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load leave requests');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!leaveType || !startDate || !endDate || !reason) {
      console.log('Form validation failed:', { leaveType, startDate, endDate, reason }); // Debug log
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Submitting leave request:', { // Debug log
        leaveType: leaveType,
        startDate,
        endDate,
        reason,
      });

      const response = await fetch('http://localhost:5000/api/leave', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leaveType: leaveType,
          startDate,
          endDate,
          reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit leave request');
      }

      const data = await response.json();
      toast.success(data.message || "Leave request submitted successfully!");
      
      // Reset form
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      
      // Refresh leave requests
      fetchLeaveRequests();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit leave request");
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewLeaveDetails = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Leave Requests</h2>
        <p className="text-muted-foreground">
          Apply for leave and track your leave requests.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2" />
              <span>Apply for Leave</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="leaveType" className="text-sm font-medium">
                    Leave Type
                  </label>
                  <Select 
                    value={leaveType} 
                    onValueChange={(value) => {
                      console.log('Selected value:', value); // Debug log
                      setLeaveType(value);
                    }}
                  >
                    <SelectTrigger id="leaveType">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="vacation">Vacation Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="paternity">Paternity Leave</SelectItem>
                      <SelectItem value="other">Other Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">
                      Start Date
                    </label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">
                      End Date
                    </label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="reason" className="text-sm font-medium">
                    Reason
                  </label>
                  <Textarea
                    id="reason"
                    placeholder="Enter reason for leave"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Leave Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Annual Leave</div>
                  <div className="text-2xl font-bold mt-1">15 days</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Expires Dec 31, 2025
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Sick Leave</div>
                  <div className="text-2xl font-bold mt-1">7 days</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Resets every quarter
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Personal Leave</div>
                  <div className="text-2xl font-bold mt-1">3 days</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Available anytime
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Unpaid Leave</div>
                  <div className="text-2xl font-bold mt-1">Unlimited</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Subject to approval
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="py-2 px-3 text-left font-medium">Type</th>
                  <th className="py-2 px-3 text-left font-medium">Dates</th>
                  <th className="py-2 px-3 text-left font-medium">Reason</th>
                  <th className="py-2 px-3 text-left font-medium">Status</th>
                  <th className="py-2 px-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave) => (
                  <tr key={leave._id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-3">{leave.type}</td>
                    <td className="py-3 px-3">
                      {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                    </td>
                    <td className="py-3 px-3">{leave.reason}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        leave.status === "approved" 
                          ? "bg-green-100 text-green-800" 
                          : leave.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => viewLeaveDetails(leave)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Leave Request Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium">Type</h4>
                              <p className="text-sm">{leave.type}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Dates</h4>
                              <p className="text-sm">
                                {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Reason</h4>
                              <p className="text-sm">{leave.reason}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Status</h4>
                              <p className="text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  leave.status === "approved" 
                                    ? "bg-green-100 text-green-800" 
                                    : leave.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                </span>
                              </p>
                            </div>
                            {leave.approvedOn && (
                              <div>
                                <h4 className="text-sm font-medium">Approved On</h4>
                                <p className="text-sm">{formatDate(leave.approvedOn)}</p>
                              </div>
                            )}
                            {leave.rejectedOn && (
                              <div>
                                <h4 className="text-sm font-medium">Rejected On</h4>
                                <p className="text-sm">{formatDate(leave.rejectedOn)}</p>
                              </div>
                            )}
                            {leave.rejectionReason && (
                              <div>
                                <h4 className="text-sm font-medium">Rejection Reason</h4>
                                <p className="text-sm">{leave.rejectionReason}</p>
                              </div>
                            )}
                          </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveRequests;

