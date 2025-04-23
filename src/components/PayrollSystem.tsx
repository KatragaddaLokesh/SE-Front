
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { 
  ChartBar, 
  DollarSign, 
  Search, 
  Calendar, 
  FileText, 
  Download, 
  Send,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../context/AuthContext";

type PayrollEntry = {
  _id: string;
  payrollId: string;
  employeeId: {
    _id: string;
    name: string;
    department: string;
    position: string;
  };
  basicSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  paymentStatus: string;
  paymentDate: string;
  createdAt: string;
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const PayrollSystem = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollEntry | null>(null);
  const [processingPayroll, setProcessingPayroll] = useState(false);
  const [progress, setProgress] = useState(0);
  const [payrolls, setPayrolls] = useState<PayrollEntry[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [totalPayroll, setTotalPayroll] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayrolls();
    fetchDepartments();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const token = localStorage.getItem("hrms_token");
      const response = await fetch('http://localhost:5000/api/payroll', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payrolls');
      }

      const data = await response.json();
      setPayrolls(data.data);
      
      // Calculate total payroll
      const total = data.data.reduce((sum: number, payroll: PayrollEntry) => sum + payroll.netSalary, 0);
      setTotalPayroll(total);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      toast.error('Failed to fetch payroll data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("hrms_token");
      const response = await fetch('http://localhost:5000/api/departments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }

      const data = await response.json();
      setDepartments(['All', ...data.data.map((dept: any) => dept.departmentName)]);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleRunPayroll = async () => {
    setProcessingPayroll(true);
    setProgress(0);
    
    try {
      const token = localStorage.getItem("hrms_token");
      
      // Simulate progress while processing
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 500);

      // Generate payroll for each employee
      const response = await fetch('http://localhost:5000/api/payroll/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error('Failed to process payroll');
      }

      setProgress(100);
      toast.success("Payroll processed successfully!");
      fetchPayrolls(); // Refresh payroll data
    } catch (error) {
      console.error('Error processing payroll:', error);
      toast.error('Failed to process payroll');
    } finally {
      setProcessingPayroll(false);
    }
  };

  const handleApprovePayroll = async (payrollId: string) => {
    try {
      const token = localStorage.getItem("hrms_token");
      const response = await fetch(`http://localhost:5000/api/payroll/${payrollId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: 'approved' }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve payroll');
      }

      toast.success("Payroll entry approved!");
      fetchPayrolls(); // Refresh payroll data
    } catch (error) {
      console.error('Error approving payroll:', error);
      toast.error('Failed to approve payroll');
    }
  };

  // Apply filters to payroll entries
  const filteredPayroll = payrolls.filter(entry => {
    const matchesSearch = 
      entry.employeeId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.payrollId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employeeId.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === "All" || entry.employeeId.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || entry.paymentStatus.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payroll System</h2>
        <p className="text-muted-foreground">
          Manage and process employee payroll.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Total Payroll</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalPayroll)}</div>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Next Payroll Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">April 30</div>
            <p className="text-sm text-muted-foreground">
              {processingPayroll ? 
                "Currently processing" : 
                "10 days remaining"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ChartBar className="mr-2 h-4 w-4" />
              <span>Processed Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {`${payrolls.filter(p => p.paymentStatus.toLowerCase() === "processed").length} / ${payrolls.length}`}
            </div>
            <p className="text-sm text-muted-foreground">
              Employees paid this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center">
              <ChartBar className="mr-2" />
              <span>Payroll Management</span>
            </CardTitle>
            <div className="flex gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Reports</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Payroll Reports</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Generate and download payroll reports for the specified period.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">From Date</label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">To Date</label>
                        <Input type="date" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type</label>
                      <Select defaultValue="summary">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Payroll Summary</SelectItem>
                          <SelectItem value="detailed">Detailed Report</SelectItem>
                          <SelectItem value="tax">Tax Report</SelectItem>
                          <SelectItem value="department">Department Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format</label>
                      <Select defaultValue="pdf">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Generate Report</span>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    disabled={processingPayroll}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Run Payroll</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Run April 2025 Payroll</DialogTitle>
                    <DialogDescription>
                      This will process payments for all employees.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    {processingPayroll ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Processing payroll...</p>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          This may take a few moments. Please do not close this window.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center p-3 bg-amber-50 text-amber-800 rounded-md">
                          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                          <p className="text-sm">
                            Running payroll will process payments for all employees and cannot be easily reversed.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Payment Date</label>
                          <Input type="date" defaultValue="2025-04-30" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Payment Notes (Optional)</label>
                          <Input placeholder="e.g., 'April 2025 Salary'" />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={processingPayroll}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button 
                      onClick={handleRunPayroll}
                      disabled={processingPayroll}
                    >
                      Confirm & Process
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="current" className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Current Month</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Payroll History</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="current">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1">
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
                    {departments.map((dept) => (
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
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {filteredPayroll.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No payroll entries found matching your criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="py-3 px-4 text-left font-medium">Employee</th>
                        <th className="py-3 px-4 text-left font-medium">Position</th>
                        <th className="py-3 px-4 text-right font-medium">Base Salary</th>
                        <th className="py-3 px-4 text-right font-medium">Bonus</th>
                        <th className="py-3 px-4 text-right font-medium">Deductions</th>
                        <th className="py-3 px-4 text-right font-medium">Net Salary</th>
                        <th className="py-3 px-4 text-center font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayroll.map((entry) => (
                        <tr key={entry._id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{entry.employeeId.name}</p>
                              <p className="text-xs text-muted-foreground">{entry.payrollId}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p>{entry.employeeId.position}</p>
                              <p className="text-xs text-muted-foreground">{entry.employeeId.department}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">{formatCurrency(entry.basicSalary)}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(entry.bonuses)}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(entry.deductions)}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatCurrency(entry.netSalary)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              entry.paymentStatus === "Processed" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-orange-100 text-orange-800"
                            }`}>
                              {entry.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedPayroll(entry)}
                                >
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Payroll Details</DialogTitle>
                                </DialogHeader>
                                
                                {selectedPayroll && (
                                  <div className="space-y-6 py-4">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <h3 className="text-xl font-bold">{selectedPayroll.employeeId.name}</h3>
                                        <p className="text-muted-foreground">{selectedPayroll.employeeId.position} - {selectedPayroll.employeeId.department}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Employee ID: {selectedPayroll.payrollId}</p>
                                      </div>
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        selectedPayroll.paymentStatus === "Processed" 
                                          ? "bg-green-100 text-green-800" 
                                          : "bg-orange-100 text-orange-800"
                                      }`}>
                                        {selectedPayroll.paymentStatus}
                                      </span>
                                    </div>
                                    
                                    <div className="grid gap-4 border rounded-lg p-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Payment Date</p>
                                          <p className="font-medium">{formatDate(selectedPayroll.paymentDate)}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="pt-2 border-t">
                                        <div className="flex justify-between items-center mb-2">
                                          <p className="text-sm">Base Salary</p>
                                          <p className="font-medium">{formatCurrency(selectedPayroll.basicSalary)}</p>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                          <p className="text-sm">Bonus</p>
                                          <p className="font-medium">{formatCurrency(selectedPayroll.bonuses)}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="pt-2 border-t">
                                        <div className="flex justify-between items-center mb-2">
                                          <p className="text-sm">Tax Deductions</p>
                                          <p className="font-medium text-red-600">-{formatCurrency(selectedPayroll.deductions * 0.7)}</p>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                          <p className="text-sm">Insurance Deductions</p>
                                          <p className="font-medium text-red-600">-{formatCurrency(selectedPayroll.deductions * 0.2)}</p>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                          <p className="text-sm">Other Deductions</p>
                                          <p className="font-medium text-red-600">-{formatCurrency(selectedPayroll.deductions * 0.1)}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="pt-2 border-t">
                                        <div className="flex justify-between items-center">
                                          <p className="font-medium">Net Salary</p>
                                          <p className="text-lg font-bold">{formatCurrency(selectedPayroll.netSalary)}</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {selectedPayroll.paymentStatus === "Pending" && (
                                      <div className="flex justify-end gap-3">
                                        <Button 
                                          variant="outline"
                                          className="flex items-center gap-2"
                                        >
                                          <FileText className="h-4 w-4" />
                                          <span>Edit</span>
                                        </Button>
                                        <Button 
                                          onClick={() => handleApprovePayroll(selectedPayroll._id)}
                                          className="flex items-center gap-2"
                                        >
                                          <Send className="h-4 w-4" />
                                          <span>Process Payment</span>
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                  </DialogClose>
                                  {selectedPayroll?.paymentStatus === "Processed" && (
                                    <Button className="flex items-center gap-2">
                                      <Download className="h-4 w-4" />
                                      <span>Download Slip</span>
                                    </Button>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/50">
                        <td colSpan={5} className="py-3 px-4 text-right font-medium">Total</td>
                        <td className="py-3 px-4 text-right font-bold">{formatCurrency(filteredPayroll.reduce((sum, entry) => sum + entry.netSalary, 0))}</td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="py-3 px-4 text-left font-medium">Month</th>
                      <th className="py-3 px-4 text-center font-medium">Employees</th>
                      <th className="py-3 px-4 text-right font-medium">Total Amount</th>
                      <th className="py-3 px-4 text-center font-medium">Status</th>
                      <th className="py-3 px-4 text-left font-medium">Processed On</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Add payroll history table rows here */}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollSystem;

